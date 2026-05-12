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
| Offer/answer strings | Contain your public IP — same exposure as hosting any website or sending email |
| Injection risk | Game only acts on known message types; unknown messages are ignored |

**Safe for playing with friends and family.** Only share the offer code with someone you trust.

### What can fail

- **Symmetric NAT** (corporate/school networks) — STUN doesn't work; would require a TURN relay server
- **Firewall blocking UDP** — same issue
- Both are rare on home networks

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
