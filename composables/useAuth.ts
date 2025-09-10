import { useCookie, navigateTo } from 'nuxt/app'
import { computed } from 'vue'
import useApiService from '~/composables/useApiService'
import { useUser } from '~/composables/useUser'

export const useAuth = () => {
  const cookieToken = useCookie<string | null>('authToken', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  const setUserToken = (newToken: string) => {
    cookieToken.value = newToken
  }

  const getUserToken = () => {
    return cookieToken?.value
  }

  const clearAuth = () => {
    cookieToken.value = null
  }

  const logout = async () => {
    try {
      // Call old backend logout
      await useApiService.get('/api/v1/users/logout', {
        headers: `Bearer ${cookieToken.value}`,
      })
    }
    catch (error) {
      console.warn('Old backend logout API call failed:', error)
    }
    try {
      // Call new backend logout
      await useApiService.get('/api/v2/identities/logout', {
        headers: `Bearer ${cookieToken.value}`,
      })
    }
    catch (error) {
      console.warn('New backend logout API call failed:', error)
    }
    clearAuth()

    // Clear user data from store
    const { cleanUser } = useUser()
    cleanUser()

    // Clear all local storage data
    if (import.meta.client) {
      localStorage.removeItem('v2_token') // Remove v2 token specifically
      localStorage.clear()
      sessionStorage.clear()
    }
    // Navigate to home page
    await navigateTo('/')
  }

  const login = async (credentials: { identity: string, pass: string }) => {
    const response: { token?: string, message?: string, success?: boolean }
      = await $fetch('/api/v1/users/login', {
        method: 'POST',
        body: {
          ...credentials,
          type: 'request',
        },
      })
    return response
  }

  const register = async (formData: { identity: string, pass: string }) => {
    await $fetch('/api/v1/users/register', {
      method: 'POST',
      body: {
        ...formData,
        type: 'register',
      },
    })
  }

  const forgotPassword = async (passForm: { identity: string }) => {
    const response: { message?: string, success?: boolean } = await $fetch(
      '/api/v1/users/recovery',
      {
        method: 'POST',
        body: {
          ...passForm,
          type: 'request',
        },
      },
    )
    return response
  }

  const isAuthenticated = computed(() => !!cookieToken.value)

  return {
    cookieToken,
    setUserToken,
    clearAuth,
    logout,
    login,
    register,
    isAuthenticated,
    forgotPassword,
    getUserToken,
  }
}
