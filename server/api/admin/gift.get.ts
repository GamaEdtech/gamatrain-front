export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  try {
    const query = await getQuery(event)

    if (query.secret !== config.ApiSecret) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid secret key',
      })
    }

    const { Gift } = await useMongoDB()
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
