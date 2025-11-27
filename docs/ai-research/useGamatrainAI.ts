/**
 * Gamatrain AI Composable
 *
 * This composable provides easy integration with the LLM API server
 * for the Nuxt.js frontend.
 *
 * Usage:
 * ```vue
 * <script setup>
 * const { askQuestion, loading, error } = useGamatrainAI();
 *
 * const response = await askQuestion('What is machine learning?');
 * </script>
 * ```
 */

export const useGamatrainAI = () => {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // AI API base URL (configure in nuxt.config or .env)
  const apiBaseUrl = config.public.aiApiUrl || 'http://localhost:8000'

  /**
   * Ask a question to the AI with optional context
   */
  const askQuestion = async (
    question: string,
    options?: {
      context?: string
      level?: 'beginner' | 'intermediate' | 'advanced'
      maxTokens?: number
      temperature?: number
    },
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        success: boolean
        answer: string
        question: string
        error?: string
      }>(`${apiBaseUrl}/v1/gamatrain/ask`, {
        method: 'POST',
        body: {
          question,
          context: options?.context || '',
          level: options?.level || 'intermediate',
        },
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to get response')
      }

      return response.answer
    }
    catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err)) || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Send a chat message with conversation history
   */
  const chat = async (
    messages: Array<{
      role: 'system' | 'user' | 'assistant'
      content: string
    }>,
    options?: {
      temperature?: number
      maxTokens?: number
    },
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        id: string
        choices: Array<{
          message: {
            role: string
            content: string
          }
        }>
      }>(`${apiBaseUrl}/v1/chat/completions`, {
        method: 'POST',
        body: {
          messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 500,
        },
      })

      return response.choices[0].message.content
    }
    catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err)) || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Generate a simple completion
   */
  const complete = async (
    prompt: string,
    options?: {
      temperature?: number
      maxTokens?: number
    },
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        choices: Array<{
          text: string
        }>
      }>(`${apiBaseUrl}/v1/completions`, {
        method: 'POST',
        body: {
          prompt,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 500,
        },
      })

      return response.choices[0].text
    }
    catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err)) || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Check if AI service is healthy
   */
  const checkHealth = async () => {
    try {
      const response = await $fetch<{
        status: string
        model_loaded: boolean
      }>(`${apiBaseUrl}/health`)

      return response.status === 'healthy' && response.model_loaded
    }
    catch {
      return false
    }
  }

  return {
    askQuestion,
    chat,
    complete,
    checkHealth,
    loading: readonly(loading),
    error: readonly(error),
  }
}
