import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.req.url!.replace('/api/ai-endpoint', '') // remove prefix
  const config = useRuntimeConfig()
  const body = await readBody(event)

  console.log('Proxying to:', `${config.aiApiUrl}${path}`)

  return await $fetch(`${config.aiApiUrl}${path}`, {
    method: event.req.method,
    body: ['POST', 'PUT', 'PATCH'].includes(event.req.method || '') ? body : undefined,
    // Only what the AI service needs. Passing the browser's headers on also sent its cookies, which then
    // included the visitor's login token.
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
    },
  })
})
