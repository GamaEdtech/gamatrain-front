import { parseURL } from 'ufo'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const { req, res } = event.node
  const url = req.url
  const { pathname } = parseURL(url)

  // List of content types for sitemap
  const contentTypes = [
    'paper',
    'qa',
    'multimedia',
    'exam',
    'tutorial',
    'blog',
    'school',
  ]

  // Handle sitemap routes
  if (url.startsWith('/sitemap')) {
    const contentIdentity = pathname.split('/')[2] // e.g., "paper" from "/sitemap/paper"

    if (!contentIdentity) {
      // Handle /sitemap and /sitemap.xml
      res.setHeader('Content-Type', 'application/xml')
      const staticLinks = [
        'https://gamatrain.com/',
        'https://gamatrain.com/about-us',
        'https://gamatrain.com/services',
        'https://gamatrain.com/faq',
        'https://gamatrain.com/search?type=test',
        'https://gamatrain.com/search?type=learnfiles',
        'https://gamatrain.com/search?type=question',
        'https://gamatrain.com/search?type=azmoon',
        'https://gamatrain.com/search?type=dars',
        'https://gamatrain.com/blog',
        'https://gamatrain.com/school',
      ]
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
      for (const link of staticLinks) {
        xml += `\n  <url>\n    <loc>${link}</loc>\n  </url>`
      }
      xml += '\n</urlset>'
      res.end(xml)
      return
    }

    // Handle content type sitemaps
    const contentType = contentIdentity.split('-')[0]
    if (contentTypes.includes(contentType)) {
      res.setHeader('Content-Type', 'application/xml')

      if (contentIdentity.endsWith('-index')) {
        // Generate sitemap index
        const xmlData = await generateSitemapIndex(contentType)
        res.end(xmlData)
        return
      }

      // Handle paginated sitemaps
      const pageNum = parseInt(contentIdentity.split('-')[1], 10)
      if (!isNaN(pageNum)) {
        let xmlData = await fetchPaginatedData(contentType, pageNum)
        xmlData = convertDataToXML(xmlData, contentType)
        res.end(xmlData)
        return
      }
    }
  }
})

// Generate the sitemap index for the given content type
async function generateSitemapIndex(contentType) {
  const totalPages = await getTotalPages(contentType)
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  for (let page = 1; page <= totalPages; page++) {
    const sitemapUrl = `https://gamatrain.com/sitemap/${contentType}-${page}`
    indexXml += `<sitemap>
        <loc>${sitemapUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`
  }

  indexXml += '\n</sitemapindex>'
  return indexXml
}
// Fetch the total number of pages for a content type
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
      apiUrl = `${baseUrl}blogs/search?page=1&perpage=${itemsPerPage}`
      break
    case 'school':
      apiUrl = `https://api.gamaedtech.com/api/v1/schools?PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true`
      break
    default:
      return 0
  }

  const response = await $fetch(apiUrl)
  // const totalItems = parseInt(response.data.num, 10);
  const totalItems
    = contentType == 'school'
      ? parseInt(response.data.totalRecordsCount)
      : parseInt(response.data.num, 10)
  return Math.ceil(totalItems / itemsPerPage)
}

// Fetch paginated data for a content type
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
      apiUrl = `${oldBaseUrl}blogs/search`
      break
    case 'school':
      apiUrl = `${baseUrl}schools`
      break
    default:
      return []
  }

  let finalUrl = `${apiUrl}&page=${page}&perpage=${itemsPerPage}&ineedmore=1`
  if (contentType == 'blog') {
    finalUrl = `${apiUrl}?page=${page}&perpage=${itemsPerPage}&ineedmore=1`
  }
  let pageNum = page > 0 ? page - 1 : 0
  if (contentType == 'school')
    finalUrl = `${apiUrl}?PagingDto.PageFilter.Size=${itemsPerPage}&PagingDto.PageFilter.Skip=${
      pageNum * itemsPerPage
    }&PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true`

  const response = await $fetch(finalUrl)
  return response.data.list || []
}

// Convert data to XML format for sitemaps
function convertDataToXML(data, contentType) {
  let title = ''
  let modifyDate = ''
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  data.forEach((item) => {
    title = item.title_url
    modifyDate = item.up_date
    if (contentType === 'blog') {
      title = item.title
        .trim()
        .replace(/ (?!$)/g, '-')
        .replace(/\//g, '-')
        .toLowerCase()
    }
    else if (contentType === 'school') {
      title = item.slug
      modifyDate = item.lastModifyDate
    }

    xml += `<url>
            <loc>https://gamatrain.com/${contentType}/${item.id}/${title}</loc>
            <lastmod>${formatDate(modifyDate)}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>`
  })

  xml += '\n</urlset>'
  return xml
}

// Format date to ISO 8601
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
