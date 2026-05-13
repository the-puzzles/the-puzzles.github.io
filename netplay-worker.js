// Pure state relay — RTCPeerConnection is [Exposed=Window] and cannot live in a worker.
// The page that initiates the connection is the "owner"; all other tabs on the same
// device communicate through this worker.

const allPorts = new Set()
const subs     = new Map()  // gameId → Set<port>
let ownerPort  = null

let netStatus = 'idle', role = null, roomCode = '', offerText = '', swapped = false

function broadcast(msg) { for (const p of allPorts) p.postMessage(msg) }

function syncStatus() {
  broadcast({ type: 'status', netStatus, role, roomCode, offerText, swapped })
}

function doReset() {
  netStatus = 'idle'; role = null; roomCode = ''; offerText = ''; swapped = false
  ownerPort = null
  syncStatus()
  broadcast({ type: 'disconnected' })
}

self.onconnect = ({ ports: [port] }) => {
  allPorts.add(port)
  port.postMessage({ type: 'status', netStatus, role, roomCode, offerText, swapped })

  port.onmessage = ({ data }) => {
    switch (data.type) {
      case 'getStatus':
        port.postMessage({ type: 'status', netStatus, role, roomCode, offerText, swapped })
        break

      case 'subscribe':
        if (!subs.has(data.gameId)) subs.set(data.gameId, new Set())
        subs.get(data.gameId).add(port)
        break

      case 'unsubscribe':
        subs.get(data.gameId)?.delete(port)
        break

      // Owner page reports its current state after any change
      case 'reportStatus':
        ownerPort = port
        if (data.netStatus !== undefined) netStatus  = data.netStatus
        if (data.role      !== undefined) role       = data.role
        if (data.roomCode  !== undefined) roomCode   = data.roomCode
        if (data.offerText !== undefined) offerText  = data.offerText
        if (data.swapped   !== undefined) swapped    = data.swapped
        syncStatus()
        if (data.event === 'connected')    broadcast({ type: 'connected', role })
        if (data.event === 'disconnected') doReset()
        break

      // Owner relays a move it received via RTC → route to subscribed game tabs
      case 'incoming': {
        const set = subs.get(data.gameId)
        if (set) for (const p of set) {
          if (p !== ownerPort) p.postMessage({ type: 'move', gameId: data.gameId, data: data.data })
        }
        break
      }

      // Broadcast a newgame to every subscribed game tab (triggered by swapRoles)
      case 'broadcastNewgame':
        for (const [gid, ports] of subs) for (const p of ports)
          p.postMessage({ type: 'move', gameId: gid, data: { type: 'newgame' } })
        break

      // Non-owner game tab wants to send a move → relay to the owner
      case 'send':
        if (ownerPort && ownerPort !== port)
          ownerPort.postMessage({ type: 'sendToOpponent', gameId: data.gameId, data: data.data })
        break

      // Any tab requests a swap → tell owner to send it to the opponent
      case 'swapRoles':
        swapped = !swapped; syncStatus()
        if (ownerPort) ownerPort.postMessage({ type: 'doSwapRoles' })
        break

      // Any tab requests disconnect
      case 'close':
        if (ownerPort && ownerPort !== port) ownerPort.postMessage({ type: 'doClose' })
        doReset()
        break
    }
  }
}
