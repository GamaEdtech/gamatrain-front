import { getVercelOidcToken } from '@vercel/oidc'

export default defineEventHandler(async () => {
  const token = await getVercelOidcToken()

  if (!token) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied: not running inside Vercel environment',
    })
  }

  return { token }
})
