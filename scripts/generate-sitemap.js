import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// ------------------ SCRIPT ------------------

async function generate() {
  const contentTypes = [
    'blog',
    'school',
  ]

  const publicPath = join(process.cwd(), 'public/sitemap')
  await mkdir(publicPath, { recursive: true })

  // Default sitemap
  const defaultXml = generateDefaultSitemap()
  await writeFile(join(publicPath, `sitemap.xml`), defaultXml, 'utf8')

  // Sitemaps for each content type
  for (const type of contentTypes) {
    const indexXml = await generateSitemapIndex(type)
    await writeFile(join(publicPath, `${type}-index.xml`), indexXml, 'utf8')

    const totalPages = await getTotalPages(type)
    for (let page = 1; page <= totalPages; page++) {
      const data = await fetchPaginatedData(type, page)
      const xml = convertDataToXML(data, type)
      await writeFile(join(publicPath, `${type}-${page}.xml`), xml, 'utf8')
    }
  }

  console.log('✅ Sitemaps generated successfully.')
}

generate().catch((err) => {
  console.error('❌ Failed to generate sitemap:', err)
  process.exit(1)
})

// ------------------ HELPERS ------------------

async function generateSitemapIndex(contentType) {
  const totalPages = await getTotalPages(contentType)
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  for (let page = 1; page <= totalPages; page++) {
    const sitemapUrl = `https://gamatrain.com/sitemap/${contentType}-${page}.xml`
    indexXml += `<sitemap>
        <loc>${sitemapUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`
  }

  indexXml += '\n</sitemapindex>'
  return indexXml
}

async function getTotalPages(contentType) {
  const itemsPerPage = 1000
  const baseUrl = 'https://core.gamatrain.com/api/v1/'
  let apiUrl

  switch (contentType) {
    case 'paper':
      apiUrl = `${baseUrl}search?type=test&page=1&perpage=${itemsPerPage}`
      break
    case 'qa':
      apiUrl = `${baseUrl}search?type=question&page=1&perpage=${itemsPerPage}`
      break
    case 'multimedia':
      apiUrl = `${baseUrl}search?type=learnfiles&page=1&perpage=${itemsPerPage}`
      break
    case 'exam':
      apiUrl = `${baseUrl}search?type=azmoon&page=1&perpage=${itemsPerPage}`
      break
    case 'tutorial':
      apiUrl = `${baseUrl}search?type=dars&page=1&perpage=${itemsPerPage}`
      break
    case 'blog':
      apiUrl = `https://api.gamaedtech.com/api/v1/blogs/posts?PagingDto.PageFilter.ReturnTotalRecordsCount=true`
      break
    case 'school':
      apiUrl = `https://api.gamaedtech.com/api/v1/schools?PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true`
      break
    default:
      return 0
  }

  const response = await fetch(apiUrl)
  const json = await response.json()

  const totalItems
    = (contentType === 'school' || contentType === 'blog')
      ? parseInt(json.data.totalRecordsCount)
      : parseInt(json.data.num)

  return Math.ceil(totalItems / itemsPerPage)
}

async function fetchPaginatedData(contentType, page) {
  const itemsPerPage = 1000
  const oldBaseUrl = 'https://core.gamatrain.com/api/v1/'
  const baseUrl = 'https://api.gamaedtech.com/api/v1/'
  let apiUrl

  switch (contentType) {
    case 'paper':
      apiUrl = `${oldBaseUrl}search?type=test`
      break
    case 'qa':
      apiUrl = `${oldBaseUrl}search?type=question`
      break
    case 'multimedia':
      apiUrl = `${oldBaseUrl}search?type=learnfiles`
      break
    case 'exam':
      apiUrl = `${oldBaseUrl}search?type=azmoon`
      break
    case 'tutorial':
      apiUrl = `${oldBaseUrl}search?type=dars`
      break
    case 'blog':
      apiUrl = `${baseUrl}blogs/posts`
      break
    case 'school':
      apiUrl = `${baseUrl}schools`
      break
    default:
      return []
  }

  let finalUrl = `${apiUrl}&page=${page}&perpage=${itemsPerPage}&ineedmore=1`

  const pageNum = page > 0 ? page - 1 : 0
  if (contentType === 'blog')
    finalUrl = `${apiUrl}?PagingDto.PageFilter.Size=${itemsPerPage}&PagingDto.PageFilter.Skip=${pageNum * itemsPerPage}&PagingDto.PageFilter.ReturnTotalRecordsCount=true`

  if (contentType === 'school')
    finalUrl = `${apiUrl}?PagingDto.PageFilter.Size=${itemsPerPage}&PagingDto.PageFilter.Skip=${pageNum * itemsPerPage}&PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true`

  const response = await fetch(finalUrl)
  const json = await response.json()
  return json.data.list || []
}

// ------------------ CONVERTER ------------------

function convertDataToXML(data, contentType) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  data.forEach((item) => {
    let title = item.title_url
    let modifyDate = item.up_date

    if (contentType === 'school' || contentType === 'blog') {
      title = item.slug
      modifyDate = item.lastModifyDate
    }

    xml += `<url>
      <loc>https://gamatrain.com/${contentType}/${item.id}/${title}</loc>
      <lastmod>${formatDate(modifyDate ?? new Date().toISOString())}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
  })

  xml += '\n</urlset>'
  return xml
}

function generateDefaultSitemap() {
  const simpleUrls = [
    'https://gamatrain.com',
    'https://gamatrain.com/about-us',
    'https://gamatrain.com/services',
    'https://gamatrain.com/faq',
    'https://gamatrain.com/search?type=paper',
    'https://gamatrain.com/search?type=multimedia',
    'https://gamatrain.com/search?type=forum',
    'https://gamatrain.com/search?type=quizhub',
    'https://gamatrain.com/search?type=tutorial',
    'https://gamatrain.com/blog',
    'https://gamatrain.com/school',
  ]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  simpleUrls.forEach((url) => {
    xml += `<url>
      <loc>${url}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>`
  })

  xml += '\n</urlset>'
  return xml
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
