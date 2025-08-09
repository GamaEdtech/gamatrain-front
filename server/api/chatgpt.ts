// server/api/chatgpt.ts
import { defineEventHandler, getHeader, readBody, createError } from 'h3'

const ALLOWED_ORIGINS = [process.env.BASE_URL, process.env.BASE_URL_V2]

export default defineEventHandler(async (event) => {
  const origin = getHeader(event, 'origin')

  if (!ALLOWED_ORIGINS.includes(origin || '')) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const body = await readBody(event)
  const { userComment } = body || {}

  if (!userComment) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Comment is required',
    })
  }

  try {
    const response = await $fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: {
          model: 'gpt-4o',
          messages: [{ role: 'user', content: userComment }],
          max_tokens: 220,
        },
      },
    )

    return { response: response.choices[0].message.content }
  }
  catch (error: unknown) {
    const apiError = error as { data?: unknown, message?: string }
    console.error('ChatGPT API error:', apiError?.data || apiError?.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch AI response',
    })
  }
})
