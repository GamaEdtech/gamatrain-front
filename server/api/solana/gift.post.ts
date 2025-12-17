import { Types } from 'mongoose'

// Gift SPL tokens to a specified address
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    /* ---------------- Basic validation ---------------- */
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

    /* ---------------- Load services ---------------- */
    const { createLock } = useJupTokenLocker()
    const { Gift } = await useMongoDB()

    /* ---------------- Normalize ID ---------------- */
    const giftId = Types.ObjectId.isValid(body.id)
      ? new Types.ObjectId(body.id)
      : body.id

    /* ---------------- Step 1: move gift to PENDING ---------------- */
    const gift = await Gift.findOneAndUpdate(
      {
        _id: giftId,
        pass: body.pass,
        status: 'new',
        receiver: { $exists: false },
      },
      {
        $set: {
          status: 'pending',
          receiver: body.to,
          pendingAt: new Date(),
        },
      },
      { new: true },
    )

    if (!gift) {
      return {
        success: false,
        message: 'Gift not found, already claimed, or invalid pass',
      }
    }

    /* ---------------- Step 2: create Solana lock ---------------- */
    const amount = 400_000

    let result
    try {
      result = await createLock(body.to, amount * 1e6, 6)
    }
    catch (err) {
      // Solana call failed BEFORE signature
      await Gift.updateOne(
        { _id: giftId },
        { $set: { status: 'failed', error: 'lock_creation_failed' } },
      )

      throw err
    }

    /* ---------------- Step 3: handle confirmation ---------------- */
    if (!result.confirmed) {
      // tx exists but not finalized yet
      // DO NOT ROLLBACK
      await Gift.updateOne(
        { _id: giftId },
        {
          $set: {
            status: 'pending',
            tx: result.signature,
            escrow: result.escrow,
          },
        },
      )

      return {
        success: false,
        message: 'Transaction pending, check later',
        data: {
          tx: result.signature,
        },
      }
    }

    /* ---------------- Step 4: finalize gift ---------------- */
    await Gift.updateOne(
      { _id: giftId },
      {
        $set: {
          status: 'claimed',
          tx: result.signature,
          escrow: result.escrow,
          base: result.base,
          claimedAt: new Date(),
        },
      },
    )

    /* ---------------- Success ---------------- */
    return {
      success: true,
      message: 'Gift successfully claimed',
      data: {
        tx: result.signature,
        escrow: result.escrow,
        base: result.base,
      },
    }
  }
  catch (error: unknown) {
    console.error('Error in gift redeem:', error)

    return {
      success: false,
      message: error?.message || 'An error occurred',
    }
  }
})
