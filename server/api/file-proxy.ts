// server/api/proxy.ts
import { defineEventHandler, getQuery } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    event.node.res.statusCode = 400
    event.node.res.end('Missing url param')
    return
  }

  try {
    const response = await $fetch.raw(url, { responseType: 'arrayBuffer' })

    const buffer = Buffer.from(response._data)

    // Forward content-type if exists, fallback to octet-stream
    const contentType
      = response.headers.get('content-type') || 'application/octet-stream'

    event.node.res.setHeader('Content-Type', contentType)
    event.node.res.setHeader('Content-Length', buffer.length)
    event.node.res.setHeader('Access-Control-Allow-Origin', '*')

    event.node.res.end(buffer)
  }
  catch (err) {
    console.error('Proxy error:', err)
    event.node.res.statusCode = 500
    event.node.res.end('Failed to fetch file')
  }
})
