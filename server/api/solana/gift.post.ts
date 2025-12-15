// import { Types } from 'mongoose'

// Gift SPL tokens to a specified address
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // /* ---------------- Basic validation ---------------- */
    if (
      !body
      || typeof body.to !== 'string'
      || typeof body.id !== 'string'
      || typeof body.pass !== 'string'
    ) {
      return {
        success: false,
        message: 'Invalid request body',
      }
    }

    const amount = 100

    const { createLock } = await import('../../utils/token-locker')
    const result = await createLock(body.to, amount * 1e6, 6)

    return {
      success: true,
      tx: result.tx,
      escrow: result.escrow,
      base: result.base,
    }

    // /* ---------------- Load services ---------------- */
    // const { transferSplToken } = useSplTransfer()
    // const { Gift } = await useMongoDB()

    // /* ---------------- Normalize ID ---------------- */
    // const giftId = Types.ObjectId.isValid(body.id)
    //   ? new Types.ObjectId(body.id)
    //   : body.id

    // /* ---------------- Atomic gift claim ---------------- */
    // const gift = await Gift.findOneAndUpdate(
    //   {
    //     _id: giftId,
    //     pass: body.pass,
    //     status: false,
    //     receiver: { $exists: false }, // only if not claimed
    //   },
    //   {
    //     $set: {
    //       status: true,
    //       receiver: body.to, // created if missing
    //     },
    //   },
    //   { new: true },
    // )

    // if (!gift) {
    //   return {
    //     success: false,
    //     message: 'Gift not found, already claimed, or wallet already used',
    //   }
    // }

    // /* ---------------- Transfer SPL token ---------------- */
    // const amount = 500000
    // const result = await transferSplToken({
    //   to: body.to,
    //   amount: amount * 1e6,
    // })

    // if (!result || result.err) {
    //   // rollback gift claim if transfer failed
    //   await Gift.updateOne(
    //     { _id: giftId },
    //     {
    //       $set: { status: false },
    //       $unset: { receiver: '' },
    //     },
    //   )

    //   return {
    //     success: false,
    //     message: 'Token transfer failed',
    //   }
    // }

    // /* ---------------- Success ---------------- */
    // return {
    //   success: true,
    //   message: 'Gift successfully claimed',
    //   data: {
    //     signature: result.signature,
    //     confirmationStatus: result.confirmationStatus,
    //   },
    // }
  }
  catch (error: unknown) {
    console.error('Error in gift redeem:', error)
    return {
      success: false,
      message: error?.message || 'An error occurred',
    }
  }
})
