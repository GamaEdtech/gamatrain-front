import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.req.url!.replace('/api/ai-endpoint', '') // remove prefix
  const config = useRuntimeConfig()
  const body = await readBody(event)

  console.log('Proxying to:', `${config.aiApiUrl}${path}`)

  return await $fetch(`${config.aiApiUrl}${path}`, {
    method: event.req.method,
    body: ['POST', 'PUT', 'PATCH'].includes(event.req.method || '') ? body : undefined,
    headers: {
      ...event.req.headers,
      host: new URL(config.aiApiUrl).host, // only hostname
    },
  })
})
