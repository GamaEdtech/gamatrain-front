import mongoose from 'mongoose'

let isConnected = false

export const useMongoDB = async () => {
  if (!isConnected) {
    const config = useRuntimeConfig()
    await mongoose.connect(config.connectionStringMongoDB)
    isConnected = true
  }

  /* ---------------- Schemas ---------------- */

  const giftSchema = new mongoose.Schema({
    pass: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'pending', 'claimed', 'failed'],
      default: 'new',
      index: true,
    },
    receiver: {
      type: String,
      unique: true,
      sparse: true },
  })

  /* ---------------- Models ---------------- */

  const Gift
    = mongoose.models.Gifts || mongoose.model('Gifts', giftSchema)

  return {
    Gift,
  }
}
