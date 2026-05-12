const NETPLAY_SIGNAL_URL = 'https://puzzles-signal.the-puzzles.workers.dev'

class NetPlay {
  constructor({ onMove, onConnected, onDisconnected } = {}) {
    this._onMove         = onMove         || (() => {});
    this._onConnected    = onConnected    || (() => {});
    this._onDisconnected = onDisconnected || (() => {});
    this._pc        = null;
    this._ch        = null;
    this._pollTimer = null;
    this.role       = null; // 'host' | 'guest'
  }

  _createPc() {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:openrelay.metered.ca:80' },
        { urls: 'turn:openrelay.metered.ca:80',  username: 'openrelayproject', credential: 'openrelayproject' },
        { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
        { urls: 'turns:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
      ],
    });
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this._onDisconnected();
      }
    };
    this._pc = pc;
    return pc;
  }

  _attachChannel(ch) {
    this._ch = ch;
    ch.onopen    = () => this._onConnected(this.role);
    ch.onclose   = () => this._onDisconnected();
    ch.onmessage = e => {
      try { this._onMove(JSON.parse(e.data)); } catch {}
    };
  }

  // Resolves once ICE gathering finishes (5 s fallback for restricted networks)
  _waitForGathering(pc) {
    if (pc.iceGatheringState === 'complete') return Promise.resolve();
    return new Promise(resolve => {
      const done = () => resolve();
      const onchange = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', onchange);
          done();
        }
      };
      pc.addEventListener('icegatheringstatechange', onchange);
      setTimeout(done, 4000);
    });
  }

  _encode(desc) {
    return btoa(JSON.stringify({ type: desc.type, sdp: desc.sdp }));
  }

  _decode(str) {
    return JSON.parse(atob(str.trim()));
  }

  // HOST ── posts offer to signaling server, polls for answer. Returns room code.
  async host(signalUrl = NETPLAY_SIGNAL_URL) {
    const offerStr = await this._createOffer();
    const res = await fetch(`${signalUrl}/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer: offerStr }),
    });
    if (!res.ok) throw new Error('Failed to create room');
    const { code } = await res.json();
    this._pollForAnswer(signalUrl, code);
    return code;
  }

  _pollForAnswer(signalUrl, code) {
    const deadline = Date.now() + 2 * 60 * 1000; // 2 minutes
    this._pollTimer = setInterval(async () => {
      if (Date.now() > deadline) {
        clearInterval(this._pollTimer);
        this._pollTimer = null;
        this._onDisconnected();
        return;
      }
      try {
        const res = await fetch(`${signalUrl}/room/${code}/answer`);
        const { answer } = await res.json();
        if (answer) {
          clearInterval(this._pollTimer);
          this._pollTimer = null;
          await this._acceptAnswer(answer);
        }
      } catch {}
    }, 3000);
  }

  // GUEST ── fetches offer by code, posts answer to signaling server.
  async join(code, signalUrl = NETPLAY_SIGNAL_URL) {
    const cleanCode = code.replace(/-/g, '').trim();
    const res = await fetch(`${signalUrl}/room/${cleanCode}`);
    if (!res.ok) throw new Error('Room not found');
    const { offer } = await res.json();
    const answerStr = await this._acceptOffer(offer);
    const postRes = await fetch(`${signalUrl}/room/${cleanCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answerStr }),
    });
    if (!postRes.ok) throw new Error('Failed to submit answer');
  }

  // Public SDP methods for manual copy-paste exchange (advanced mode)
  createOffer()     { return this._createOffer(); }
  acceptAnswer(str) { return this._acceptAnswer(str); }
  acceptOffer(str)  { return this._acceptOffer(str); }

  async _createOffer() {
    this.role = 'host';
    const pc = this._createPc();
    this._attachChannel(pc.createDataChannel('game'));
    await pc.setLocalDescription(await pc.createOffer());
    await this._waitForGathering(pc);
    return this._encode(pc.localDescription);
  }

  async _acceptAnswer(str) {
    await this._pc.setRemoteDescription(this._decode(str));
  }

  async _acceptOffer(str) {
    this.role = 'guest';
    const pc = this._createPc();
    pc.ondatachannel = e => this._attachChannel(e.channel);
    await pc.setRemoteDescription(this._decode(str));
    await pc.setLocalDescription(await pc.createAnswer());
    await this._waitForGathering(pc);
    return this._encode(pc.localDescription);
  }

  send(data) {
    if (this._ch?.readyState === 'open') {
      this._ch.send(JSON.stringify(data));
    }
  }

  close() {
    clearInterval(this._pollTimer);
    this._pollTimer = null;
    this._ch?.close();
    this._pc?.close();
    this._ch = null;
    this._pc = null;
    this.role = null;
  }
}
