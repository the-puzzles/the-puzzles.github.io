const NETPLAY_SIGNAL_URL = 'https://puzzles-signal.the-puzzles.workers.dev'

// ── Inject shared CSS ─────────────────────────────────────────────
;(function () {
  const s = document.createElement('style')
  s.textContent = `
.net-panel {
  width: min(var(--net-panel-width, 380px), 96vw);
  background: #161b22; border: 1px solid #30363d;
  border-radius: 12px; padding: 16px; margin-bottom: 16px;
  display: flex; flex-direction: column; gap: 10px;
}
.net-label { font-size: 0.8rem; color: #8b949e; }
.net-code-display {
  background: #0d1117; border: 1px solid #30363d; color: #c9d1d9;
  border-radius: 8px; padding: 12px; font-size: 1rem; font-family: monospace;
  letter-spacing: 0.08em; text-align: center;
}
.net-code-input {
  width: 100%; background: #0d1117; border: 1px solid #30363d; color: #c9d1d9;
  border-radius: 8px; padding: 8px 12px; font-size: 0.9rem; font-family: monospace;
  outline: none; box-sizing: border-box;
}
.net-code-input:focus { border-color: #6e7681; }
.net-code {
  width: 100%; background: #0d1117; border: 1px solid #30363d;
  color: #c9d1d9; border-radius: 8px; padding: 8px;
  font-size: 0.7rem; font-family: monospace; resize: none; height: 76px;
  word-break: break-all; box-sizing: border-box;
}
.net-divider { border: none; border-top: 1px solid #21262d; margin: 2px 0; }
.net-row { display: flex; gap: 8px; }
.net-btn {
  flex: 1;
  background: var(--net-btn-bg, #161b22);
  border: 1px solid var(--net-btn-border, #30363d);
  color: var(--net-btn-color, #c9d1d9);
  border-radius: 8px; padding: 9px 16px; font-size: 0.82rem; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: opacity 0.15s;
}
.net-btn:hover:not(:disabled) { opacity: 0.85; }
.net-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.net-btn.secondary { background: #161b22; border-color: #30363d; color: #8b949e; }
.net-btn.secondary:hover { color: #c9d1d9; border-color: #6e7681; }
`
  document.head.appendChild(s)
})()

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

  async _fetchIceConfig() {
    try {
      const res = await fetch(`${NETPLAY_SIGNAL_URL}/ice-config`)
      if (res.ok) return (await res.json()).iceServers
    } catch {}
    return [{ urls: 'stun:stun.l.google.com:19302' }]
  }

  async _createPc() {
    const iceServers = await this._fetchIceConfig()
    const pc = new RTCPeerConnection({ iceServers });
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
    const deadline = Date.now() + 2 * 60 * 1000;
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

  async join(code, signalUrl = NETPLAY_SIGNAL_URL) {
    const cleanCode = code.trim();
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

  createOffer()     { return this._createOffer(); }
  acceptAnswer(str) { return this._acceptAnswer(str); }
  acceptOffer(str)  { return this._acceptOffer(str); }

  async _createOffer() {
    this.role = 'host';
    const pc = await this._createPc();
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
    const pc = await this._createPc();
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

// ── createNetplay composable ──────────────────────────────────────
// gameId  — this game’s identifier for routing moves
// onMove  — called when opponent sends a move
// onReset — called when a fresh connection is established
// onSync  — called once after initial status sync with the worker
function createNetplay({ gameId, onMove, onReset, onSync } = {}) {
  const { reactive } = Vue

  const ctrl = reactive({
    netStatus: ‘idle’,
    netRole:   null,
    roomCode:  ‘’,
    offerText: ‘’,
    netInput:  ‘’,
    copied:    false,
    swapped:   false,
  })

  const worker = new SharedWorker(‘netplay-worker.js’)
  const port = worker.port
  port.start()

  let synced = false

  port.onmessage = ({ data }) => {
    switch (data.type) {
      case ‘status’:
        ctrl.netStatus = data.netStatus
        ctrl.netRole   = data.role   ?? null
        ctrl.roomCode  = data.roomCode  ?? ‘’
        ctrl.offerText = data.offerText ?? ‘’
        ctrl.swapped   = data.swapped   ?? false
        if (!synced) { synced = true; onSync?.() }
        break
      case ‘move’:
        onMove?.(data.data)
        break
      case ‘connected’:
        ctrl.netStatus = ‘connected’
        ctrl.netRole   = data.role
        ctrl.swapped   = false
        onReset?.()
        break
      case ‘disconnected’:
        ctrl.netStatus = ‘idle’
        ctrl.netRole   = null
        ctrl.swapped   = false
        break
      case ‘error’:
        alert(data.message)
        break
    }
  }

  if (gameId) port.postMessage({ type: ‘subscribe’, gameId })
  port.postMessage({ type: ‘getStatus’ })

  ctrl.isMyTurn = function (turn) {
    if (ctrl.netStatus !== ‘connected’) return false
    if (ctrl.netRole === ‘host’)  return turn === (ctrl.swapped ? 2 : 1)
    if (ctrl.netRole === ‘guest’) return turn === (ctrl.swapped ? 1 : 2)
    return false
  }

  ctrl.send = function (data) {
    if (gameId) port.postMessage({ type: ‘send’, gameId, data })
  }

  // Disconnect completely (kills WebRTC for all tabs)
  ctrl.close = function () { port.postMessage({ type: ‘close’ }) }

  ctrl.startHost     = function ()  { port.postMessage({ type: ‘startHost’ }) }
  ctrl.startJoin     = function ()  { ctrl.netInput = ‘’; port.postMessage({ type: ‘startJoin’ }) }
  ctrl.connectRoom   = function ()  { port.postMessage({ type: ‘connectRoom’, code: ctrl.netInput.trim() }) }
  ctrl.swapRoles     = function ()  { port.postMessage({ type: ‘swapRoles’ }) }
  ctrl.startHostAdv  = function ()  { port.postMessage({ type: ‘startHostAdv’ }) }
  ctrl.startJoinAdv  = function ()  { ctrl.netInput = ‘’; port.postMessage({ type: ‘startJoinAdv’ }) }
  ctrl.connectOfferAdv  = function () { port.postMessage({ type: ‘connectOfferAdv’,  offerInput:  ctrl.netInput.trim() }); ctrl.netInput = ‘’ }
  ctrl.connectAnswerAdv = function () { port.postMessage({ type: ‘connectAnswerAdv’, answerInput: ctrl.netInput.trim() }); ctrl.netInput = ‘’ }

  ctrl.copyCode = function () {
    navigator.clipboard.writeText(ctrl.roomCode).then(() => { ctrl.copied = true; setTimeout(() => { ctrl.copied = false }, 1500) })
  }
  ctrl.copyAdv = function () {
    navigator.clipboard.writeText(ctrl.offerText).then(() => { ctrl.copied = true; setTimeout(() => { ctrl.copied = false }, 1500) })
  }

  return ctrl
}

// ── NetPanel component ────────────────────────────────────────────
// Inject ‘_netplay’ from parent setup() to get the ctrl object.
window.NetPanel = {
  setup() { return { c: Vue.inject(‘_netplay’) } },
  template: `
    <div class="net-panel">
      <template v-if="c.netStatus === ‘connected’">
        <div class="net-label">Connected — you are
          <strong>{{ c.netRole === ‘host’ ? (c.swapped ? ‘Player 2’ : ‘Player 1’) : (c.swapped ? ‘Player 1’ : ‘Player 2’) }}</strong>
        </div>
        <div class="net-row">
          <button class="net-btn" @click="c.swapRoles()">⇄ Swap Roles</button>
          <button class="net-btn secondary" @click="c.close()">Disconnect</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === ‘idle’">
        <div class="net-row">
          <button class="net-btn" @click="c.startHost()">Host Game</button>
          <button class="net-btn secondary" @click="c.startJoin()">Join Game</button>
        </div>
        <hr class="net-divider">
        <p class="net-label">Advanced — manual SDP:</p>
        <div class="net-row">
          <button class="net-btn secondary" @click="c.startHostAdv()">Host (SDP)</button>
          <button class="net-btn secondary" @click="c.startJoinAdv()">Join (SDP)</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === ‘adv-offer-ready’">
        <p class="net-label">Share this offer with your opponent:</p>
        <textarea class="net-code" readonly :value="c.offerText"></textarea>
        <button class="net-btn" @click="c.copyAdv()">{{ c.copied ? ‘Copied!’ : ‘Copy’ }}</button>
        <p class="net-label">Paste their answer:</p>
        <textarea class="net-code" :value="c.netInput" @input="c.netInput=$event.target.value" placeholder="Paste answer…"></textarea>
        <button class="net-btn" @click="c.connectAnswerAdv()" :disabled="!c.netInput.trim()">Connect</button>
      </template>
      <template v-else-if="c.netStatus === ‘adv-joining’">
        <p class="net-label">Paste the host’s offer:</p>
        <textarea class="net-code" :value="c.netInput" @input="c.netInput=$event.target.value" placeholder="Paste offer…"></textarea>
        <button class="net-btn" @click="c.connectOfferAdv()" :disabled="!c.netInput.trim()">Generate Answer</button>
      </template>
      <template v-else-if="c.netStatus === ‘adv-answer-ready’">
        <p class="net-label">Send this answer to your host:</p>
        <textarea class="net-code" readonly :value="c.offerText"></textarea>
        <button class="net-btn" @click="c.copyAdv()">{{ c.copied ? ‘Copied!’ : ‘Copy’ }}</button>
        <p class="net-label">Waiting for host to connect…</p>
      </template>
      <template v-else-if="c.netStatus === ‘hosting’">
        <p class="net-label">Share this code with your opponent:</p>
        <div class="net-code-display">{{ c.roomCode }}</div>
        <button class="net-btn" @click="c.copyCode()">{{ c.copied ? ‘Copied!’ : ‘Copy Code’ }}</button>
        <p class="net-label">Waiting for opponent to join…</p>
      </template>
      <template v-else-if="c.netStatus === ‘joining’">
        <p class="net-label">Enter the host’s room code:</p>
        <input class="net-code-input" :value="c.netInput" @input="c.netInput=$event.target.value" placeholder="ocean-maple-river" spellcheck="false" />
        <button class="net-btn" @click="c.connectRoom()" :disabled="!c.netInput.trim()">Connect</button>
      </template>
      <template v-else-if="c.netStatus === ‘connecting’">
        <p class="net-label">Connecting…</p>
      </template>
    </div>
  `
}
