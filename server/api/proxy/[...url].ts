export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const url = event.context.params?.url || ''

  let targetBase = ''

  if (url.includes('api/v2')) {
    targetBase = config.public.apiV2BaseUrl
  }
  else if (url.includes('api/v1')) {
    targetBase = config.public.apiV1BaseUrl
  }

  const targetUrl = `${targetBase}/${url.replace(/^api\/v[12]\//, '')}`

  const query = getQuery(event)

  const headers = getHeaders(event) as HeadersInit

  try {
    const response = await $fetch(targetUrl, {
      headers,
      query,
    })

    setResponseHeaders(event, {
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=3600',
    })

    return response
  }
  catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number
        _data?: unknown
      }
      message?: string
    }

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.message,
      data: err.response?._data,
    })
  }
})
