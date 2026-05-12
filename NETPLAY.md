# NetPlay — WebRTC Network Mode

## How it works

### Handshake (one-time setup)

1. **Host creates an offer** — the browser generates an SDP blob describing its network addresses and supported protocols, waits for ICE candidate gathering (up to 5 s), then encodes everything as a base64 string.
2. **STUN server** — both sides contact `stun.l.google.com` to discover their public IP/port behind their home router (NAT traversal). This address is included in the ICE candidates.
3. **Manual signaling** — the user copies the base64 string and sends it to the other player (WhatsApp, iMessage, etc.). The other player pastes it into the game. Any transport works — it's just text.
4. **Guest creates an answer** — the guest's browser reads the host's addresses, generates its own SDP answer, also base64-encoded, and sends it back manually.
5. **ICE negotiation** — both browsers try all candidate pairs and pick the one that connects (usually the STUN-reflected public addresses for two different home networks).
6. **Data channel opens** — `RTCDataChannel` fires `onopen`, the game becomes `connected`, and from that point moves are sent directly peer-to-peer.

### In-game

All game events are plain JSON over the data channel:

| Message | Sender | Payload |
|---|---|---|
| Move | Local player | `{ type: 'move', ... }` |
| New game | Either player | `{ type: 'newgame' }` |

No server is involved after the handshake.

---

## Security

| Concern | Reality |
|---|---|
| Data in transit | Encrypted with DTLS (mandatory in all browsers, cannot be disabled) |
| Opponent's access | Only receives what you explicitly `send()` — no access to files, device, or browser |
| STUN server | Google sees your public IP during handshake; does not see game data |
| Offer/answer strings | Contain ICE candidates — see IP exposure below |
| Injection risk | Game only acts on known message types; unknown messages are ignored |

**Safe for playing with friends and family.** Only share the offer code with someone you trust.

### IP exposure in offer/answer strings

The base64 offer and answer are just plaintext. Decoding them reveals ICE candidates:

```
a=candidate:1 1 udp 2122260223 192.168.1.42 54321 typ host
a=candidate:2 1 udp 1686052607 203.0.113.55 54321 typ srflx raddr 192.168.1.42
```

- `typ host` — your private LAN IP (harmless outside your network; NAT blocks inbound)
- `typ srflx` — your public IP as seen by the STUN server

**What this means in practice:**

| Who sees what | Current behaviour |
|---|---|
| Your peer | Sees your public + private IP before connecting |
| Signaling channel (WhatsApp, email, etc.) | Also sees your peer's public IP — a third party learns both sides' IPs |
| Individual devices behind your router | Not reachable; NAT blocks all unsolicited inbound traffic |

The **combined exposure** is the real concern: by sending the offer through a chat app or email, you hand that provider both players' public IPs in one message — something neither player explicitly chose to share with that service.

For casual play among friends this is acceptable (both IPs are already visible to every website each person visits). For public or anonymous matchmaking it is not.

### What can fail

- **Symmetric NAT** (corporate/school networks) — STUN doesn't work; would require a TURN relay server
- **Firewall blocking UDP** — same issue
- Both are rare on home networks

### Roadmap: hiding IPs with TURN-only mode

The fix is to force WebRTC to use only relay (TURN) candidates. With `iceTransportPolicy: 'relay'`, the generated offer contains only TURN server addresses — neither player's real IP appears in the blob, and the signaling channel learns nothing about either peer.

**Steps to implement:**

1. **Add a TURN server** — options:
   - [Open Relay](https://www.metered.ca/tools/openrelay/) (free, no account needed for low traffic)
   - [Cloudflare Calls TURN](https://developers.cloudflare.com/calls/turn/) (free tier, needs CF account)
   - Self-hosted `coturn`

2. **Update `netplay.js`** — add TURN credentials to the `RTCPeerConnection` config and set `iceTransportPolicy: 'relay'`:
   ```js
   const pc = new RTCPeerConnection({
     iceTransportPolicy: 'relay',          // only emit relay candidates
     iceServers: [
       { urls: 'stun:stun.l.google.com:19302' },
       {
         urls:       'turn:<host>:3478',
         username:   '<user>',
         credential: '<pass>',
       },
     ],
   });
   ```

3. **Verify** — decode a generated offer; it should contain only `typ relay` candidates, no real IPs.

**Trade-off:** all game traffic routes through the TURN server (adds ~10–30 ms latency, costs bandwidth). Acceptable for turn-based games; negligible in practice.

---

## netplay.js API

```js
const net = new NetPlay({
  onMove(data)      { /* apply opponent's move */ },
  onConnected(role) { /* role: 'host' | 'guest' */ },
  onDisconnected()  { /* show reconnect UI */ },
});

// Host flow
const offer  = await net.createOffer();       // show to user, send to guest
await net.acceptAnswer(answerStr);            // paste from guest → connected

// Guest flow
const answer = await net.acceptOffer(offerStr); // paste from host → show to user
// → connected automatically when host calls acceptAnswer

// Both sides
net.send({ type: 'move', ... });
net.close();
```

## Adding network mode to a new game

1. Add `<script src="netplay.js"></script>` in `<head>`
2. Copy the `.net-panel` CSS block from `xo.html` or `fourinrow.html`
3. Copy the net panel HTML template (Host Game / Join Game / offer / answer steps)
4. Add refs: `netStatus`, `netRole`, `offerText`, `netInput`, `copied`
5. Add an `isMyTurn` computed that gates on `netRole` and the current player
6. Copy `initNet`, `startHost`, `startJoin`, `connectOffer`, `connectAnswer`, `copyCode` verbatim
7. In `makeMove(col, remote = false)`: add `net.send({ type: 'move', col })` for local moves; skip AI when `mode === 'net'`
8. In `newGame()`: call `net.send({ type: 'newgame' })` after resetting board
9. In `setMode()`: call `net.close()` and reset `netStatus`/`netRole` before switching
10. Add a Network button to the mode bar and expose new refs/functions in `return`
