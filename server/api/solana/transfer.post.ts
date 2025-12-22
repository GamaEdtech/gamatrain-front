import { useSplTransfer } from '../../utils/useSplTransfer'
import type { H3Error } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { to, amount } = body || {}

    if (!to || !amount) {
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

    const { transferSplToken } = useSplTransfer()

    const result = await transferSplToken({
      to,
      amount,
    })

    return {
      succeeded: true,
      ...result,
    }
  }
  catch (error: unknown) {
    if (isH3Error(error)) {
      throw error
    }

    console.error('[SOLANA_TRANSFER_ERROR]', error)

    const message
      = error instanceof Error ? error.message : 'Unknown error'

    throw createError({
      statusCode: 500,
      statusMessage: 'Solana transfer failed',
      data: {
        message,
      },
    })
  }
})

function isH3Error(error: unknown): error is H3Error {
  return (
    typeof error === 'object'
    && error !== null
    && 'statusCode' in error
  )
}
