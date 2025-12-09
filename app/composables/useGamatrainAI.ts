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

// Response interface for Ollama /api/chat
interface OllamaChatResponse {
  model: string
  created_at: string
  message?: {
    role: string
    content: string
  }
  done: boolean
  done_reason?: string
  error?: string
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

  // AI API base URL from env (NUXT_PUBLIC_AI_API_URL)
  // For local: http://localhost:11434
  // For VPS: https://ai.gamaedtech.com (without /api/generate path)
  const apiBaseUrl = computed(() => {
    let url = config.public.aiApiUrl || 'http://localhost:11434'
    // Remove trailing /api/generate or /api/chat if present (we'll add the correct one)
    url = url.replace(/\/api\/(generate|chat)\/?$/, '')
    // Remove trailing slash
    url = url.replace(/\/$/, '')
    return url
  })

  // AI Model name from env (NUXT_PUBLIC_AI_MODEL_NAME)
  const modelName = computed(() => config.public.aiModelName || 'gamatrain-qwen')

  // AI Mode from env (NUXT_PUBLIC_AI_MODE) - 'local' or 'vps'
  // Auto-detect if not specified based on URL
  const aiMode = computed(() => {
    const mode = config.public.aiMode
    if (mode) return mode

    // Auto-detect based on URL
    const url = apiBaseUrl.value
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return 'local'
    }
    return 'vps'
  })

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
      const model = options?.model || modelName.value

      if (aiMode.value === 'vps') {
        // VPS mode: Use /api/generate with prompt field
        const fullPrompt = options?.systemPrompt
          ? `${options.systemPrompt}\n\nUser: ${prompt}`
          : prompt

        const response = await $fetch<VPSGenerateResponse>(`${apiBaseUrl.value}/api/generate`, {
          method: 'POST',
          body: {
            model,
            prompt: fullPrompt,
            stream: false,
          },
        })

        if (response.error) {
          throw new Error(response.error)
        }

        return response.response || ''
      }
      else {
        // Local mode: Use /api/chat with messages array
        const messages: Message[] = []

        if (options?.systemPrompt) {
          messages.push({
            role: 'system',
            content: options.systemPrompt,
          })
        }

        messages.push({
          role: 'user',
          content: prompt,
        })

        const response = await $fetch<OllamaChatResponse>(`${apiBaseUrl.value}/api/chat`, {
          method: 'POST',
          body: {
            model,
            messages,
            stream: false,
            options: {
              temperature: options?.temperature || 0.7,
            },
          },
        })

        if (response.error) {
          throw new Error(response.error)
        }

        return response.message?.content || ''
      }
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
    options?: {
      model?: string
      temperature?: number
    },
  ) => {
    loading.value = true
    error.value = null

    try {
      if (aiMode.value === 'vps') {
        // VPS mode: Convert messages to single prompt
        const lastUserMessage = messages.filter(m => m.role === 'user').pop()
        const systemMessage = messages.find(m => m.role === 'system')

        const fullPrompt = systemMessage
          ? `${systemMessage.content}\n\nUser: ${lastUserMessage?.content || ''}`
          : lastUserMessage?.content || ''

        const response = await $fetch<VPSGenerateResponse>(`${apiBaseUrl.value}/api/generate`, {
          method: 'POST',
          body: {
            model: options?.model || modelName.value,
            prompt: fullPrompt,
            stream: false,
          },
        })

        if (response.error) {
          throw new Error(response.error)
        }

        return response.response || ''
      }
      else {
        // Local mode: Use /api/chat
        const response = await $fetch<OllamaChatResponse>(`${apiBaseUrl.value}/api/chat`, {
          method: 'POST',
          body: {
            model: options?.model || modelName.value,
            messages,
            stream: false,
            options: {
              temperature: options?.temperature || 0.7,
            },
          },
        })

        if (response.error) {
          throw new Error(response.error)
        }

        return response.message?.content || ''
      }
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
   * Check if AI service is healthy
   */
  const checkHealth = async () => {
    try {
      if (aiMode.value === 'vps') {
        // VPS: Just try the base URL
        await $fetch(`${apiBaseUrl.value}`, {
          method: 'GET',
        })
      }
      else {
        // Local: Use /api/tags
        await $fetch(`${apiBaseUrl.value}/api/tags`, {
          method: 'GET',
        })
      }
      return true
    }
    catch {
      return false
    }
  }

  return {
    generate,
    chat,
    checkHealth,
    loading: readonly(loading),
    error: readonly(error),
    apiBaseUrl,
    modelName,
    aiMode,
  }
}
