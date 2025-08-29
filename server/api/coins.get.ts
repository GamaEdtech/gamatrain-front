export default defineEventHandler(async (event) => {
  const headers = getHeaders(event)
  const origin = headers.origin || ''
  const referer = headers.referer || ''
  const config = useRuntimeConfig()
  const publicBase = String(config.public.baseURL || '')
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

  const data = await $fetch('/api/v2/game/coins', {
    headers: {
      'x-secret-key': config.coinGameSecretKey,
    },
  })
  return data
})
