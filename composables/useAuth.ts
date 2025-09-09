import { useCookie, navigateTo } from 'nuxt/app'
import { computed } from 'vue'

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
      // Call the logout API endpoint
      await $fetch('/api/v1/identities/logout', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieToken.value}`,
        },
      })
    }
    catch (error) {
      console.warn('Logout API call failed:', error)
      // Continue with logout even if API call fails
    }

    // Clear authentication token
    clearAuth()

    // Clear user data from store
    const { cleanUser } = useUser()
    cleanUser()

    // Clear all local storage data
    if (import.meta.client) {
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
