const SITEMAP_MAP: Record<string, string> = {
  paper: 'https://core.gamatrain.com/data/sitemaps/sitemap-tests.xml',
  multimedia: 'https://core.gamatrain.com/data/sitemaps/sitemap-learnfiles.xml',
  qa: 'https://core.gamatrain.com/data/sitemaps/sitemap-questions.xml',
  exam: 'https://core.gamatrain.com/data/sitemaps/sitemap-azmoons.xml',
  tutorial: 'https://core.gamatrain.com/data/sitemaps/sitemap-dars.xml',
}

export default defineEventHandler(async (event) => {
  const { type } = event.context.params as { type: string }

  if (!type || !(type in SITEMAP_MAP)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Sitemap not found',
    })
  }

  try {
    const xml = await $fetch<string>(SITEMAP_MAP[type]!, {
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
  catch (error) {
    console.error(`[SITEMAP] Failed to fetch ${type}`, error)

    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch sitemap from core service',
    })
  }
})
