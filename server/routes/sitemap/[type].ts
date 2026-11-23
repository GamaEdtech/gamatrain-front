const SITEMAP_MAP: Record<string, string> = {
  paper: '/data/sitemaps/sitemap-tests.xml',
  multimedia: '/data/sitemaps/sitemap-learnfiles.xml',
  qa: '/data/sitemaps/sitemap-questions.xml',
  exam: '/data/sitemaps/sitemap-azmoons.xml',
  tutorial: '/data/sitemaps/sitemap-dars.xml',
}

const OWN_TYPES = new Set(['paper', 'exam', 'tutorial'])

// A sitemap index of the backend's files for one type, taken from its main index; null when it has none.
const ownSitemapIndex = async (baseUrl: string, type: string) => {
  try {
    const index = await $fetch<string>(`${baseUrl}/sitemap/sitemap.xml`, { responseType: 'text' })
    const entries = index.match(/<sitemap>[\s\S]*?<\/sitemap>/g)?.filter(entry => entry.includes(`/sitemap/sitemap-${type}`)) ?? []
    return entries.length
      ? `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</sitemapindex>`
      : null
  }
  catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const { type } = event.context.params as { type: string }

  if (!type) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Sitemap not found',
    })
  }

  const config = useRuntimeConfig()

  // Papers, exams and tutorials: the backend's own generated files (sitemap-paper0.xml, ...), listed from its index, which
  // include what is made there since the move off gama-api. Until they exist (the daily job hasn't run yet) gama-api's file.
  if (OWN_TYPES.has(type)) {
    const own = await ownSitemapIndex(String(config.public.BaseUrl2), type)
    if (own) {
      event.node.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      event.node.res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return own
    }
  }

  const sitemapUrl
    = SITEMAP_MAP[type]
      ? config.public.BaseUrl1 + SITEMAP_MAP[type]
      : `${config.public.BaseUrl2}/sitemap/${type}.xml`

  try {
    const xml = await $fetch<string>(sitemapUrl, {
      responseType: 'text',
    })

    event.node.res.setHeader(
      'Content-Type',
      'application/xml; charset=utf-8',
    )

    event.node.res.setHeader(
      'Cache-Control',
      'public, max-age=3600, s-maxage=3600',
    )

    return xml
  }
  catch (err: unknown) {
    console.error(`[SITEMAP] Failed to fetch ${type}`, err)

    const error = err as { status: number }
    if (error?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Sitemap not found',
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch sitemap service',
    })
  }
})
