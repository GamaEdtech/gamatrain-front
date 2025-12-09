/**
 * Gamatrain AI Composable
 *
 * This composable provides integration with either:
 * - Local Ollama (http://localhost:11434) using /api/chat endpoint
 * - VPS Gamatrain AI (https://ai.gamaedtech.com) using /api/generate endpoint
 *
 * Configure via .env:
 * - NUXT_PUBLIC_AI_API_URL: Base URL (e.g., http://localhost:11434 OR https://ai.gamaedtech.com)
 * - NUXT_PUBLIC_AI_MODEL_NAME: Model name to use
 * - NUXT_PUBLIC_AI_MODE: 'local' for Ollama, 'vps' for Gamatrain VPS (default: auto-detect)
 *
 * Usage:
 * ```vue
 * <script setup>
 * const { generate, loading, error } = useGamatrainAI()
 *
 * const response = await generate('What is machine learning?')
 * </script>
 * ```
 */

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Response interface for VPS /api/generate
interface VPSGenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  error?: string
}
export const useGamatrainAI = () => {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Generate a response from the AI
   * Automatically uses the correct endpoint based on aiMode
   */
  const generate = async (
    prompt: string,
    options?: {
      model?: string
      systemPrompt?: string
      temperature?: number
    },
  ) => {
    loading.value = true
    error.value = null

    try {
      const fullPrompt = options?.systemPrompt
        ? `${options.systemPrompt}\n\nUser: ${prompt}`
        : prompt

      const response = await $fetch<VPSGenerateResponse>(`/api/ai-endpoint/api/generate`, {
        method: 'POST',
        body: {
          model: config.public.aiModelName,
          prompt: fullPrompt,
          stream: false,
        },
      })

      if (response.error) {
        throw new Error(response.error)
      }

      return response.response || ''
    }
    catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      error.value = errorMessage || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Chat with conversation history (Local mode only)
   */
  const chat = async (
    messages: Message[],
  ) => {
    loading.value = true
    error.value = null

    try {
      // VPS mode: Convert messages to single prompt
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      const systemMessage = messages.find(m => m.role === 'system')

      const fullPrompt = systemMessage
        ? `${systemMessage.content}\n\nUser: ${lastUserMessage?.content || ''}`
        : lastUserMessage?.content || ''

      const response = await $fetch<VPSGenerateResponse>(`/ai-endpoint/api/generate`, {
        method: 'POST',
        body: {
          model: config.aiModelName,
          prompt: fullPrompt,
          stream: false,
        },
      })

      if (response.error) {
        throw new Error(response.error)
      }

      return response.response || ''
    }
    catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      error.value = errorMessage || 'An error occurred'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    generate,
    chat,
    loading: readonly(loading),
    error: readonly(error),
  }
}
