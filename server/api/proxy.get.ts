import { getVercelOidcToken } from '@vercel/oidc'

export default defineEventHandler(async () => {
  // Generate token server-side
  const token = await getVercelOidcToken()

  // Call your backend API with the token
  const res = await fetch('https://your-backend.com/secure-api', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // Return only the backend response to the client
  return Response.json(await res.json())
})
