import { useSplTransfer } from '../../utils/useSplTransfer'

export interface ApiResult<T> {
  data: T | null
  status: number
  error?: unknown
  succeeded: boolean
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { to, amount, token } = body || {}

  if (!to || !amount || !token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid params',
    })
  }

  if (typeof amount !== 'number' || amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Amount must be a positive number',
    })
  }

  console.log(amount)

  const MIN_WITHDRAWAL_AMOUNT = 100000000000 // 100,000 $GET
  if (amount < MIN_WITHDRAWAL_AMOUNT) {
    throw createError({
      statusCode: 400,
      statusMessage: 'The minimum withdrawal amount is 100,000 $GET.',
    })
  }

  const userBalance = await getUserBalance(token)
  if (userBalance == undefined || userBalance == 0 || amount > userBalance) {
    throw createError({
      statusCode: 400,
      statusMessage: 'The requested amount exceeds your balance.',
    })
  }

  const responseConsume = await consumeCoins(amount, token)

  if (!responseConsume) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Balance deduction failed.',
    })
  }

  const { transferSplToken } = useSplTransfer()

  const result = await transferSplToken({
    to,
    amount,
  })

  if (!result.signature) {
    throw createError({
      statusCode: 502,
      statusMessage: 'On-chain transfer failed',
    })
  }

  return {
    succeeded: true,
    ...result,
  }
})

async function getUserBalance(token: string): Promise<number> {
  const config = useRuntimeConfig()
  const API_V2_BASE_URL = config.public.apiV2BaseUrl
  const response = await $fetch<ApiResult<number>>(
    `${API_V2_BASE_URL}/transactions/balance`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.succeeded || response.data == null) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch user balance',
    })
  }

  return response.data
}

async function consumeCoins(points: number, token: string): Promise<boolean> {
  const config = useRuntimeConfig()
  const API_V2_BASE_URL = config.public.apiV2BaseUrl
  const response = await $fetch<ApiResult<number>>(
    `${API_V2_BASE_URL}/games/spends`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        points,
      },
    },
  )

  if (!response.succeeded) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to consume coins',
    })
  }

  return true
}
