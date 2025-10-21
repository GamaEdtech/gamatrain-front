import { createError } from 'h3'

interface TelegramRequestBody {
  type: 'text' | 'sell' | 'buy'
  text?: string
  price?: number
  key?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.telegramBotToken
  const groupId = config.telegramGroupChatId
  const channelId = config.telegramChannelId
  const expectedSecret = config.telegramApiSecret

  const body = await readBody<TelegramRequestBody>(event)
  if (!body || !body.type) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: missing type' })
  }

  if (expectedSecret && body.key !== expectedSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: invalid secret key' })
  }

  if (!token) throw createError({ statusCode: 500, statusMessage: 'Server misconfigured: missing bot token' })

  const baseUrl = `https://api.telegram.org/bot${token}`

  try {
    const sendTargets: string[] = []
    if (groupId) sendTargets.push(groupId)
    if (channelId) sendTargets.push(channelId)

    if (sendTargets.length === 0) {
      throw createError({ statusCode: 500, statusMessage: 'No Telegram chat/channel ID configured' })
    }

    const results = []

    if (body.type === 'text') {
      const text = body.text?.toString().trim()
      if (!text) throw createError({ statusCode: 400, statusMessage: 'Missing text content' })

      for (const chat_id of sendTargets) {
        const payload = {
          chat_id,
          text,
          parse_mode: 'HTML',
        }
        const response = await $fetch(`${baseUrl}/sendMessage`, { method: 'POST', body: payload })
        results.push(response)
      }

      return { success: true, type: 'text', results }
    }

    if (body.type === 'sell' || body.type === 'buy') {
      const actionText = body.type === 'sell' ? 'sell' : 'buy'
      const priceText = body.price ? `at ${body.price}` : ''
      const detectText = body.type === 'sell' ? 'resistance' : 'support'
      const question = `Friends, I think it's time to ${actionText} ${priceText} because I detected a ${detectText}.\nWhat do you think?`
      const options = ['Buy', 'Sell', 'Do nothing']

      for (const chat_id of sendTargets) {
        const payload = {
          chat_id,
          question,
          options,
        }
        const response = await $fetch(`${baseUrl}/sendPoll`, { method: 'POST', body: payload })
        results.push(response)
      }

      return { success: true, type: 'poll', results }
    }

    throw createError({ statusCode: 400, statusMessage: 'Unknown message type' })
  }
  catch (err: unknown) {
    console.error('Telegram API Error:', err)
    throw createError({ statusCode: 502, statusMessage: 'Telegram API error' })
  }
})
