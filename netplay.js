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

  _timedFetch(url, opts, ms = 8000) {
    const ac = new AbortController()
    setTimeout(() => ac.abort(), ms)
    return fetch(url, { ...opts, signal: ac.signal })
  }

  async _fetchIceConfig() {
    try {
      const res = await this._timedFetch(`${NETPLAY_SIGNAL_URL}/ice-config`)
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
      setTimeout(done, 2000);
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
    const res = await this._timedFetch(`${signalUrl}/room`, {
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
        const res = await this._timedFetch(`${signalUrl}/room/${code}/answer`);
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
    const res = await this._timedFetch(`${signalUrl}/room/${cleanCode}`);
    if (!res.ok) throw new Error('Room not found');
    const { offer } = await res.json();
    const answerStr = await this._acceptOffer(offer);
    const postRes = await this._timedFetch(`${signalUrl}/room/${cleanCode}`, {
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
// RTCPeerConnection lives here (window context). SharedWorker is used only to
// relay state and moves to other tabs on the same device.
// The tab that initiates the connection is the "owner"; other tabs are observers.
function createNetplay({ gameId, onMove, onReset, onSync } = {}) {
  const { reactive } = Vue

  let netPlay = null  // NetPlay instance — only set in the owner tab

  const ctrl = reactive({
    netStatus: 'idle',
    netRole:   null,
    roomCode:  '',
    offerText: '',
    netInput:  '',
    copied:    false,
    swapped:   false,
  })

  // SharedWorker lets multiple tabs of the same game on one device share a
  // connection — it's not required for the core peer-to-peer link itself
  // (that's plain RTCPeerConnection + the remote signaling server). Several
  // browsers never implemented it at all: Safari (desktop and all
  // iOS/iPadOS), and — critically — every Chromium-based browser on Android
  // (Chrome, Brave, Samsung Internet, etc; only Firefox Android has it).
  // Calling `new SharedWorker(...)` unconditionally used to throw there and
  // crash the whole game's Vue setup(), blanking the entire page. Instead,
  // fall back to single-tab mode: multi-tab sync is unavailable, but hosting
  // and joining a real cross-device game works exactly the same.
  const hasWorker = typeof SharedWorker !== 'undefined'
  const port = hasWorker ? new SharedWorker('netplay-worker.js').port : null
  if (port) port.start()

  let synced = false

  if (port) {
    port.onmessage = ({ data }) => {
      switch (data.type) {
        case 'status':
          if (!netPlay) {  // observer tabs follow worker state
            ctrl.netStatus = data.netStatus
            ctrl.netRole   = data.role      ?? null
            ctrl.roomCode  = data.roomCode  ?? ''
            ctrl.offerText = data.offerText ?? ''
            ctrl.swapped   = data.swapped   ?? false
          }
          if (!synced) { synced = true; onSync?.() }
          break
        case 'move':
          onMove?.(data.data)
          break
        case 'connected':
          if (!netPlay) {
            ctrl.netStatus = 'connected'; ctrl.netRole = data.role; ctrl.swapped = false
            onReset?.()
          }
          break
        case 'disconnected':
          if (!netPlay) {
            ctrl.netStatus = 'idle'; ctrl.netRole = null; ctrl.roomCode = ''; ctrl.swapped = false
          }
          break
        // Worker asks owner tab to forward a move from another tab via RTC
        case 'sendToOpponent':
          netPlay?.send({ gameId: data.gameId, ...data.data })
          break
        // Worker asks owner to swap and notify opponent
        case 'doSwapRoles':
          if (netPlay) {
            ctrl.swapped = !ctrl.swapped
            netPlay.send({ type: 'swapRoles' })
            report()
            port.postMessage({ type: 'broadcastNewgame' })
          }
          break
        // Worker asks owner to tear down
        case 'doClose':
          _teardown()
          break
      }
    }

    if (gameId) port.postMessage({ type: 'subscribe', gameId })
    port.postMessage({ type: 'getStatus' })
  } else {
    // Defer like the worker path does (which calls onSync async via
    // port.onmessage) — calling it synchronously here would run before the
    // caller's `const netCtrl = createNetplay(...)` assignment completes,
    // and callers' onSync handlers commonly reference netCtrl by that name.
    synced = true
    queueMicrotask(() => onSync?.())
  }

  function report(event) {
    if (!port) return
    port.postMessage({
      type: 'reportStatus', event,
      netStatus: ctrl.netStatus, role: ctrl.netRole,
      roomCode:  ctrl.roomCode,  offerText: ctrl.offerText, swapped: ctrl.swapped,
    })
  }

  function _teardown() {
    netPlay?.close(); netPlay = null
    ctrl.netStatus = 'idle'; ctrl.netRole = null; ctrl.roomCode = ''
    ctrl.offerText = ''; ctrl.swapped = false
  }

  function _makeNetPlay() {
    return new NetPlay({
      onMove(msg) {
        if (msg.type === 'swapRoles') {
          ctrl.swapped = !ctrl.swapped; report()
          if (port) port.postMessage({ type: 'broadcastNewgame' }); return
        }
        const { gameId: gid, ...payload } = msg
        if (!gid) return
        if (gid === gameId) onMove?.(payload)  // local game tab
        if (port) port.postMessage({ type: 'incoming', gameId: gid, data: payload })  // other tabs
      },
      onConnected(role) {
        ctrl.netStatus = 'connected'; ctrl.netRole = role; ctrl.swapped = false
        report('connected'); onReset?.()
      },
      onDisconnected() { _teardown(); report('disconnected') },
    })
  }

  ctrl.startHost = async function () {
    if (ctrl.netStatus !== 'idle') return
    ctrl.netStatus = 'hosting'; ctrl.netRole = 'host'; report()
    netPlay = _makeNetPlay()
    try {
      ctrl.roomCode = await netPlay.host(); report()
    } catch {
      _teardown(); report(); alert('Could not create room — try again.')
    }
  }

  ctrl.startJoin = function () { ctrl.netInput = ''; ctrl.netStatus = 'joining' }

  ctrl.connectRoom = async function () {
    const code = ctrl.netInput.trim()
    ctrl.netStatus = 'connecting'; ctrl.netRole = 'guest'; report()
    netPlay = _makeNetPlay()
    try {
      await netPlay.join(code)
    } catch (e) {
      _teardown(); report()
      alert(e.message === 'Room not found' ? 'Room not found — check the code.' : 'Connection failed — try again.')
    }
  }

  ctrl.startHostAdv = async function () {
    if (ctrl.netStatus !== 'idle') return
    ctrl.netRole = 'host'; netPlay = _makeNetPlay()
    try {
      ctrl.offerText = await netPlay.createOffer()
      ctrl.netStatus = 'adv-offer-ready'; report()
    } catch { _teardown(); report(); alert('Failed to create offer.') }
  }

  ctrl.startJoinAdv = function () { ctrl.netInput = ''; ctrl.netStatus = 'adv-joining' }

  ctrl.connectOfferAdv = async function () {
    ctrl.netRole = 'guest'; netPlay = _makeNetPlay()
    try {
      ctrl.offerText = await netPlay.acceptOffer(ctrl.netInput.trim())
      ctrl.netStatus = 'adv-answer-ready'; ctrl.netInput = ''; report()
    } catch { _teardown(); report(); alert('Invalid offer — check and try again.') }
  }

  ctrl.connectAnswerAdv = async function () {
    try { await netPlay.acceptAnswer(ctrl.netInput.trim()); ctrl.netInput = '' }
    catch { alert('Invalid answer — check and try again.') }
  }

  ctrl.send = function (data) {
    if (netPlay) {
      netPlay.send({ gameId, ...data })     // owner: send directly via RTC
    } else if (port && ctrl.netStatus === 'connected') {
      port.postMessage({ type: 'send', gameId, data })  // observer: relay via worker
    }
  }

  ctrl.swapRoles = function () {
    if (port) { port.postMessage({ type: 'swapRoles' }); return }
    if (netPlay) { ctrl.swapped = !ctrl.swapped; netPlay.send({ type: 'swapRoles' }) }
  }

  ctrl.close = function () {
    if (netPlay) { _teardown(); report('disconnected') }
    else if (port) { port.postMessage({ type: 'close' }) }
  }

  ctrl.isMyTurn = function (turn) {
    if (ctrl.netStatus !== 'connected') return false
    if (ctrl.netRole === 'host')  return turn === (ctrl.swapped ? 2 : 1)
    if (ctrl.netRole === 'guest') return turn === (ctrl.swapped ? 1 : 2)
    return false
  }

  ctrl.copyCode = function () {
    navigator.clipboard.writeText(ctrl.roomCode).then(() => { ctrl.copied = true; setTimeout(() => ctrl.copied = false, 1500) })
  }
  ctrl.copyAdv = function () {
    navigator.clipboard.writeText(ctrl.offerText).then(() => { ctrl.copied = true; setTimeout(() => ctrl.copied = false, 1500) })
  }

  return ctrl
}

// ── NetPanel component ────────────────────────────────────────────
// Inject '_netplay' from parent setup() to get the ctrl object.
window.NetPanel = {
  setup() { return { c: Vue.inject('_netplay') } },
  template: `
    <div class="net-panel">
      <template v-if="c.netStatus === 'connected'">
        <div class="net-label">Connected — you are
          <strong>{{ c.netRole === 'host' ? (c.swapped ? 'Player 2' : 'Player 1') : (c.swapped ? 'Player 1' : 'Player 2') }}</strong>
        </div>
        <div class="net-row">
          <button class="net-btn" @click="c.swapRoles()">⇄ Swap Roles</button>
          <button class="net-btn secondary" @click="c.close()">Disconnect</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === 'idle'">
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
      <template v-else-if="c.netStatus === 'adv-offer-ready'">
        <p class="net-label">Share this offer with your opponent:</p>
        <textarea class="net-code" readonly :value="c.offerText"></textarea>
        <button class="net-btn" @click="c.copyAdv()">{{ c.copied ? 'Copied!' : 'Copy' }}</button>
        <p class="net-label">Paste their answer:</p>
        <textarea class="net-code" :value="c.netInput" @input="c.netInput=$event.target.value" placeholder="Paste answer…"></textarea>
        <div class="net-row">
          <button class="net-btn" @click="c.connectAnswerAdv()" :disabled="!c.netInput.trim()">Connect</button>
          <button class="net-btn secondary" @click="c.close()">Cancel</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === 'adv-joining'">
        <p class="net-label">Paste the host's offer:</p>
        <textarea class="net-code" :value="c.netInput" @input="c.netInput=$event.target.value" placeholder="Paste offer…"></textarea>
        <div class="net-row">
          <button class="net-btn" @click="c.connectOfferAdv()" :disabled="!c.netInput.trim()">Generate Answer</button>
          <button class="net-btn secondary" @click="c.close()">Cancel</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === 'adv-answer-ready'">
        <p class="net-label">Send this answer to your host:</p>
        <textarea class="net-code" readonly :value="c.offerText"></textarea>
        <button class="net-btn" @click="c.copyAdv()">{{ c.copied ? 'Copied!' : 'Copy' }}</button>
        <p class="net-label">Waiting for host to connect…</p>
        <button class="net-btn secondary" @click="c.close()">Cancel</button>
      </template>
      <template v-else-if="c.netStatus === 'hosting'">
        <template v-if="c.roomCode">
          <p class="net-label">Share this code with your opponent:</p>
          <div class="net-code-display">{{ c.roomCode }}</div>
          <div class="net-row">
            <button class="net-btn" @click="c.copyCode()">{{ c.copied ? 'Copied!' : 'Copy Code' }}</button>
            <button class="net-btn secondary" @click="c.close()">Cancel</button>
          </div>
          <p class="net-label">Waiting for opponent to join…</p>
        </template>
        <div v-else class="net-row">
          <p class="net-label" style="flex:1">Creating room…</p>
          <button class="net-btn secondary" style="flex:0;white-space:nowrap" @click="c.close()">Cancel</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === 'joining'">
        <p class="net-label">Enter the host's room code:</p>
        <input class="net-code-input" :value="c.netInput" @input="c.netInput=$event.target.value" placeholder="ocean-maple-river" spellcheck="false" />
        <div class="net-row">
          <button class="net-btn" @click="c.connectRoom()" :disabled="!c.netInput.trim()">Connect</button>
          <button class="net-btn secondary" @click="c.close()">Cancel</button>
        </div>
      </template>
      <template v-else-if="c.netStatus === 'connecting'">
        <p class="net-label">Connecting…</p>
        <button class="net-btn secondary" @click="c.close()">Cancel</button>
      </template>
    </div>
  `
}
