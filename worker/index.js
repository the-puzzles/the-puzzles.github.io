const ALLOWED_ORIGIN = 'https://the-puzzles.github.io'
const ROOM_TTL = 180  // 3 minutes

const WORDS = 'able acid aged arch aunt axis back bale ball band bark base bath beam bear beat bell best bird bite blue boat bold bone book born bowl burn byte cage cake calm camp card care cash cast cave cent chip clay coat code coil cold cone cool cord core corn cost crab crop crow cube curl damp dark dart dawn deal dean deep deer desk dice diet dirt disk dove draw drop drum duck dusk dust earn edge face fact fair fall fame farm fast felt fill film fire fish fist flag flat flex flip flow foam fold folk fond font food ford fork form fort four free frog fuel full fund game gate gear glad glow glue gold golf gone good gown grab grit gulf gust half hall hand hard hare harm harp hash haze heal heap heat heel helm help herd hero hint hire hole home hood hook hope horn hose host hunt idle iris jade jest join jolt jump keen keep kick kind king knob lack lake lamp land lark lash last lava lawn leaf lean left lend lens lion list load lock loft long loop loss lure lush mail main male malt mane mark mart mask mass mast maze meal mean meat melt mesh mild milk mill mine mint mist mode mole moon moor moss mule navy neat nest nice node norm note only open oval pace pack page palm path peak pear peel peer pine pipe plan play plum poem poll pond pool port pose post pour pull pump pure push rack rain ramp read real reed reef rely rent rest rice ring rise road roam roar rock role roof root rope rose ruby ruin rule rust sage sail salt sand save seal seed seek sell shed ship shoe shot silk sing sink site skip snap snow soak soar sock soil sole song sort soul span spin spot spur star stem step stew suit surf swan tall tank task team tide tilt time toad toll tomb tone tool town tree trim trio true tube twig type vale veil vine void volt wade wake wall ward warm wave well wild will wind wing wire wolf wood wren yarn zinc zone'.split(' ')

function randomWord() {
  const arr = new Uint16Array(1)
  crypto.getRandomValues(arr)
  return WORDS[arr[0] % WORDS.length]
}

function randomCode() {
  return [randomWord(), randomWord(), randomWord()].join('-')
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

    const { method } = request
    const path = new URL(request.url).pathname

    // GET /ice-config — returns TURN credentials (secrets never exposed in source)
    if (method === 'GET' && path === '/ice-config') {
      return json({
        iceServers: [
          { urls: ['stun:stun.cloudflare.com:3478', 'stun:stun.cloudflare.com:53'] },
          {
            urls: [
              'turn:turn.cloudflare.com:3478?transport=udp',
              'turn:turn.cloudflare.com:3478?transport=tcp',
              'turns:turn.cloudflare.com:5349?transport=tcp',
              'turn:turn.cloudflare.com:53?transport=udp',
              'turn:turn.cloudflare.com:80?transport=tcp',
              'turns:turn.cloudflare.com:443?transport=tcp',
            ],
            username:   env.TURN_USERNAME,
            credential: env.TURN_CREDENTIAL,
          },
        ],
      }, 200, origin)
    }

    // POST /room — host creates room with offer
    if (method === 'POST' && path === '/room') {
      const { offer } = await request.json()
      if (!offer) return json({ error: 'Missing offer' }, 400, origin)
      const code = randomCode()
      await env.ROOMS.put(`offer:${code}`, offer, { expirationTtl: ROOM_TTL })
      return json({ code }, 200, origin)
    }

    const roomMatch   = path.match(/^\/room\/([a-z]+-[a-z]+-[a-z]+)$/)
    const answerMatch = path.match(/^\/room\/([a-z]+-[a-z]+-[a-z]+)\/answer$/)

    // GET /room/:code — guest fetches offer
    if (method === 'GET' && roomMatch) {
      const offer = await env.ROOMS.get(`offer:${roomMatch[1]}`)
      if (!offer) return json({ error: 'Room not found' }, 404, origin)
      return json({ offer }, 200, origin)
    }

    // POST /room/:code — guest submits answer
    if (method === 'POST' && roomMatch) {
      const { answer } = await request.json()
      if (!answer) return json({ error: 'Missing answer' }, 400, origin)
      await env.ROOMS.put(`answer:${roomMatch[1]}`, answer, { expirationTtl: ROOM_TTL })
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
