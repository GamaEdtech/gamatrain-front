const SITEMAP_MAP: Record<string, string> = {
  paper: '/data/sitemaps/sitemap-tests.xml',
  multimedia: '/data/sitemaps/sitemap-learnfiles.xml',
  qa: '/data/sitemaps/sitemap-questions.xml',
  exam: '/data/sitemaps/sitemap-azmoons.xml',
  tutorial: '/data/sitemaps/sitemap-dars.xml',
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
