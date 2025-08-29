import { createHmac, randomBytes } from 'node:crypto'

export default defineEventHandler((event) => {
  const tokenName = 'x-internal-token'
  const url = getRequestURL(event)

  if (!url.pathname.startsWith('/api/')) {
    const existing = getCookie(event, tokenName)
    if (!existing) {
      const config = useRuntimeConfig()
      const secret = String(config.coinGameSecretKey || 'dev-internal-secret')
      const nonce = randomBytes(16).toString('hex') + Date.now().toString(36)
      const signature = createHmac('sha256', secret)
        .update(nonce)
        .digest('hex')
      const cookieValue = `${nonce}.${signature}`
      setCookie(event, tokenName, cookieValue, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 5,
      })
    }
  }

  if (!url.pathname.startsWith('/api/coins')) return

  const token = getCookie(event, tokenName)
  if (!token) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const [nonce, sig] = String(token).split('.')
  const secret = String(useRuntimeConfig().coinGameSecretKey || '')
  if (!nonce || !sig || !secret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const expected = createHmac('sha256', secret).update(nonce).digest('hex')
  if (expected !== sig) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const headers = getHeaders(event)
  const origin = headers.origin || ''
  const referer = headers.referer || ''
  const publicBase = String(useRuntimeConfig().public.baseURL || '')
  const proto
    = headers['x-forwarded-proto']
      || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  const host = headers.host ? `${proto}://${headers.host}` : ''
  const allowedHost = publicBase || host

  const hasRef = Boolean(origin || referer)
  const originOk = origin ? origin.startsWith(allowedHost) : false
  const refererOk = referer ? referer.startsWith(allowedHost) : false
  if (!hasRef || !(originOk || refererOk)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
})
