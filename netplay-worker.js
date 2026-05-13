const SIGNAL_URL   = 'https://puzzles-signal.the-puzzles.workers.dev'
const POLL_INTERVAL = 3000
const POLL_DEADLINE = 2 * 60 * 1000

// ── Connection state ──────────────────────────────────────────────
let pc = null, channel = null, role = null, pollTimer = null
let netStatus = 'idle', roomCode = '', offerText = '', swapped = false

// ── Port registry ─────────────────────────────────────────────────
const allPorts = new Set()
const subs = new Map() // gameId → Set<port>

function broadcast(msg) { for (const p of allPorts) p.postMessage(msg) }

function syncStatus() {
  broadcast({ type: 'status', netStatus, role, roomCode, offerText, swapped })
}

// ── Teardown ──────────────────────────────────────────────────────
function reset() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  try { channel?.close() } catch {}
  try { pc?.close()      } catch {}
  pc = null; channel = null; role = null
  netStatus = 'idle'; roomCode = ''; offerText = ''; swapped = false
  syncStatus()
  broadcast({ type: 'disconnected' })
}

// ── WebRTC helpers ────────────────────────────────────────────────
async function getIceServers() {
  try {
    const r = await fetch(`${SIGNAL_URL}/ice-config`)
    if (r.ok) return (await r.json()).iceServers
  } catch {}
  return [{ urls: 'stun:stun.l.google.com:19302' }]
}

async function newPc() {
  pc = new RTCPeerConnection({ iceServers: await getIceServers() })
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') reset()
  }
  return pc
}

function wireChannel(ch) {
  channel = ch
  ch.onopen = () => {
    netStatus = 'connected'
    syncStatus()
    broadcast({ type: 'connected', role })
  }
  ch.onclose = () => reset()
  ch.onmessage = ({ data }) => {
    try {
      const msg = JSON.parse(data)
      if (msg.type === 'swapRoles') {
        swapped = !swapped
        syncStatus()
        for (const [gid, ports] of subs) for (const p of ports) p.postMessage({ type: 'move', gameId: gid, data: { type: 'newgame' } })
        return
      }
      const { gameId, ...payload } = msg
      if (!gameId) return
      const set = subs.get(gameId)
      if (set) for (const p of set) p.postMessage({ type: 'move', gameId, data: payload })
    } catch {}
  }
}

function encode(d) { return btoa(JSON.stringify({ type: d.type, sdp: d.sdp })) }
function decode(s) { return JSON.parse(atob(s.trim())) }

function waitIce(p) {
  if (p.iceGatheringState === 'complete') return Promise.resolve()
  return new Promise(resolve => {
    const h = () => { if (p.iceGatheringState === 'complete') { p.removeEventListener('icegatheringstatechange', h); resolve() } }
    p.addEventListener('icegatheringstatechange', h)
    setTimeout(resolve, 4000)
  })
}

// ── Signaling actions ─────────────────────────────────────────────
async function startHost() {
  if (netStatus !== 'idle') return
  role = 'host'; netStatus = 'hosting'
  const p = await newPc()
  wireChannel(p.createDataChannel('game'))
  await p.setLocalDescription(await p.createOffer())
  await waitIce(p)
  offerText = encode(p.localDescription)
  try {
    const r = await fetch(`${SIGNAL_URL}/room`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer: offerText }),
    })
    if (!r.ok) throw new Error()
    roomCode = (await r.json()).code
    syncStatus()
    const deadline = Date.now() + POLL_DEADLINE
    pollTimer = setInterval(async () => {
      if (Date.now() > deadline) { reset(); return }
      try {
        const ar = await fetch(`${SIGNAL_URL}/room/${roomCode}/answer`)
        const { answer } = await ar.json()
        if (answer) { clearInterval(pollTimer); pollTimer = null; await p.setRemoteDescription(decode(answer)) }
      } catch {}
    }, POLL_INTERVAL)
  } catch {
    reset()
    broadcast({ type: 'error', message: 'Could not create room — try again.' })
  }
}

async function joinRoom(code) {
  if (netStatus !== 'joining') return
  netStatus = 'connecting'; syncStatus(); role = 'guest'
  try {
    const p = await newPc()
    p.ondatachannel = e => wireChannel(e.channel)
    const r = await fetch(`${SIGNAL_URL}/room/${code.trim()}`)
    if (!r.ok) throw new Error('notfound')
    const { offer } = await r.json()
    await p.setRemoteDescription(decode(offer))
    await p.setLocalDescription(await p.createAnswer())
    await waitIce(p)
    const pr = await fetch(`${SIGNAL_URL}/room/${code.trim()}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: encode(p.localDescription) }),
    })
    if (!pr.ok) throw new Error()
  } catch (e) {
    reset()
    broadcast({ type: 'error', message: e.message === 'notfound' ? 'Room not found — check the code.' : 'Connection failed — try again.' })
  }
}

// ── Advanced (manual SDP) ─────────────────────────────────────────
async function startHostAdv() {
  if (netStatus !== 'idle') return
  role = 'host'
  const p = await newPc()
  wireChannel(p.createDataChannel('game'))
  await p.setLocalDescription(await p.createOffer())
  await waitIce(p)
  offerText = encode(p.localDescription)
  netStatus = 'adv-offer-ready'; syncStatus()
}

async function connectOfferAdv(offerInput) {
  role = 'guest'
  const p = await newPc()
  p.ondatachannel = e => wireChannel(e.channel)
  await p.setRemoteDescription(decode(offerInput))
  await p.setLocalDescription(await p.createAnswer())
  await waitIce(p)
  offerText = encode(p.localDescription)
  netStatus = 'adv-answer-ready'; syncStatus()
}

async function connectAnswerAdv(answerInput) {
  try { await pc.setRemoteDescription(decode(answerInput)) } catch {}
}

// ── Port handling ─────────────────────────────────────────────────
self.onconnect = ({ ports: [port] }) => {
  allPorts.add(port)
  port.postMessage({ type: 'status', netStatus, role, roomCode, offerText, swapped })

  port.onmessage = async ({ data }) => {
    switch (data.type) {
      case 'getStatus':
        port.postMessage({ type: 'status', netStatus, role, roomCode, offerText, swapped }); break
      case 'subscribe':
        if (!subs.has(data.gameId)) subs.set(data.gameId, new Set())
        subs.get(data.gameId).add(port); break
      case 'unsubscribe':
        subs.get(data.gameId)?.delete(port); break
      case 'startHost':        await startHost(); break
      case 'startJoin':        netStatus = 'joining'; syncStatus(); break
      case 'connectRoom':      await joinRoom(data.code); break
      case 'send':
        if (channel?.readyState === 'open')
          channel.send(JSON.stringify({ gameId: data.gameId, ...data.data })); break
      case 'swapRoles':
        swapped = !swapped; syncStatus()
        if (channel?.readyState === 'open') channel.send(JSON.stringify({ type: 'swapRoles' }))
        for (const [gid, ports] of subs) for (const p of ports) p.postMessage({ type: 'move', gameId: gid, data: { type: 'newgame' } })
        break
      case 'close':            reset(); break
      case 'startHostAdv':     await startHostAdv(); break
      case 'startJoinAdv':     netStatus = 'adv-joining'; syncStatus(); break
      case 'connectOfferAdv':  await connectOfferAdv(data.offerInput); break
      case 'connectAnswerAdv': await connectAnswerAdv(data.answerInput); break
    }
  }
}
