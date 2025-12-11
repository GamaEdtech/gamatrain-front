import mongoose from 'mongoose'

const config = useRuntimeConfig()

if (mongoose.connection.readyState === 0) {
  mongoose.connect(config.connectionStringMongoDB)
}

const giftSchema = new mongoose.Schema({
  pass: String,
  status: Boolean,
})

const Gift = mongoose.models.Gifts || mongoose.model('Gifts', giftSchema)

export default defineEventHandler(async (event) => {
  try {
    const query = await getQuery(event)

    if (query.secret !== config.ApiSecret) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid secret key',
      })
    }

    const gifts = await Gift.find({})

    return {
      success: true,
      data: gifts,
    }
  }
  catch (error) {
    return {
      success: false,
      message: 'An error occurred',
      error: error.message,
    }
  }
})
