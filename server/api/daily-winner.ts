import { defineEventHandler, getQuery } from 'h3'
import mongoose from 'mongoose'

const config = useRuntimeConfig()
if (mongoose.connection.readyState === 0) {
  mongoose.connect(config.connectionStringMongoDB as string)
}

const winnerSchema = new mongoose.Schema({
  date: { type: String, unique: true },
  wallet: String,
  createdAt: { type: Date, default: Date.now },
})

const Winner = mongoose.models.Winner || mongoose.model('Winner', winnerSchema)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const action = query.action || 'get'

  try {
    if (action === 'save') {
      const today = new Date().toISOString().split('T')[0]

      const existing = await Winner.findOne({ date: today })
      if (existing) {
        return {
          success: true,
          message: 'Data for today has already been saved.',
          data: existing,
        }
      }

      const response = await $fetch('/api/get-traders')
      if (!response || !response.randomWallet) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Failed to fetch winner data from /api/get-traders',
        })
      }

      const newRecord = await Winner.create({
        date: today,
        wallet: response.randomWallet,
      })

      return {
        success: true,
        message: 'Winner data has been saved successfully.',
        data: newRecord,
      }
    }

    if (action === 'get') {
      let date = query.date as string
      if (!date) {
        date = new Date().toISOString().split('T')[0]
      }

      const winner = await Winner.findOne({ date })
      if (!winner) {
        return {
          success: false,
          message: `No winner data found for ${date}.`,
          data: null,
        }
      }

      return {
        success: true,
        message: `Winner data retrieved for ${date}.`,
        data: winner,
      }
    }

    return {
      success: false,
      message: 'Invalid action. Please use "save" or "get".',
    }
  }
  catch (error: unknown) {
    console.error('❌ Error in /api/daily:', error)
    return sendError(event, error as Error)
  }
})
