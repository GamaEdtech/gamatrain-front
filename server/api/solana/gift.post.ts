export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Request Body:', body)

    // Process the request body here
    // Example: const { recipient, amount } = body;

    return {
      success: true,
      message: 'Request processed successfully',
      data: {
        // Add any response data here
      },
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
