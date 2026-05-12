const ALLOWED_ORIGIN = 'https://the-puzzles.github.io'
const ROOM_TTL   = 300  // 5 minutes
const RATE_TTL   = 60   // 1 minute window
const RATE_LIMIT = 300  // max requests per IP per minute

function randomCode() {
  const buf = new Uint8Array(8)
  crypto.getRandomValues(buf)
  return Array.from(buf, b => b.toString(16).padStart(2, '0')).join('')
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
    },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? ''

    if (request.method === 'OPTIONS') {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 })
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (origin !== ALLOWED_ORIGIN) return new Response('Forbidden', { status: 403 })

    // Rate limiting — fixed per-minute bucket so counter resets cleanly each minute
    const ip      = request.headers.get('CF-Connecting-IP') ?? 'unknown'
    const bucket  = Math.floor(Date.now() / 60000)
    const rateKey = `rl:${ip}:${bucket}`
    const rateRaw = await env.ROOMS.get(rateKey)
    const rateCount = rateRaw ? parseInt(rateRaw, 10) : 0
    if (rateCount >= RATE_LIMIT) return json({ error: 'Too many requests' }, 429, origin)
    await env.ROOMS.put(rateKey, String(rateCount + 1), { expirationTtl: RATE_TTL })

    const { method } = request
    const path = new URL(request.url).pathname

    // POST /room — host creates room with offer
    if (method === 'POST' && path === '/room') {
      const { offer } = await request.json()
      if (!offer) return json({ error: 'Missing offer' }, 400, origin)
      const code = randomCode()
      await env.ROOMS.put(`offer:${code}`, offer, { expirationTtl: ROOM_TTL })
      return json({ code }, 200, origin)
    }

    const roomMatch   = path.match(/^\/room\/([a-f0-9]{16})$/)
    const answerMatch = path.match(/^\/room\/([a-f0-9]{16})\/answer$/)

    // GET /room/:code — guest fetches offer
    if (method === 'GET' && roomMatch) {
      const offer = await env.ROOMS.get(`offer:${roomMatch[1]}`)
      if (!offer) return json({ error: 'Room not found' }, 404, origin)
      return json({ offer }, 200, origin)
    }

    // POST /room/:code — guest submits answer
    if (method === 'POST' && roomMatch) {
      const code = roomMatch[1]
      if (!await env.ROOMS.get(`offer:${code}`)) return json({ error: 'Room not found' }, 404, origin)
      const { answer } = await request.json()
      if (!answer) return json({ error: 'Missing answer' }, 400, origin)
      await env.ROOMS.put(`answer:${code}`, answer, { expirationTtl: ROOM_TTL })
      return json({ ok: true }, 200, origin)
    }

    // GET /room/:code/answer — host polls for answer
    if (method === 'GET' && answerMatch) {
      const answer = await env.ROOMS.get(`answer:${answerMatch[1]}`)
      return json({ answer: answer ?? null }, 200, origin)
    }

    return json({ error: 'Not found' }, 404, origin)
  },
}
