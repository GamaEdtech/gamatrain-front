const SITEMAP_MAP: Record<string, string> = {
  paper: 'https://core.gamatrain.com/data/sitemaps/sitemap-tests.xml',
  multimedia: 'https://core.gamatrain.com/data/sitemaps/sitemap-learnfiles.xml',
  qa: 'https://core.gamatrain.com/data/sitemaps/sitemap-questions.xml',
  exam: 'https://core.gamatrain.com/data/sitemaps/sitemap-azmoons.xml',
  tutorial: 'https://core.gamatrain.com/data/sitemaps/sitemap-dars.xml',
}

export default defineEventHandler(async (event) => {
  const { type } = event.context.params as { type: string }

  if (!type) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Sitemap not found',
    })
  }

  const sitemapUrl
    = SITEMAP_MAP[type]
      ?? `https://sandbox.gamaedtech.com/sitemap/${type}.xml`

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
      'public, max-age=50000, s-maxage=50000',
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
