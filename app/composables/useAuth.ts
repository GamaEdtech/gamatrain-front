export const useAuth = () => {
  const cookieToken = useCookie<string | null>('authToken', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  // -------------------------
  // Token v2
  // -------------------------
  const cookieTokenV2 = useCookie<string | null>('tokenV2', {
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
    cookieTokenV2.value = null
  }

  // -------------------------
  // Token v2 helpers
  // -------------------------
  const setUserTokenV2 = (newToken: string) => {
    cookieTokenV2.value = newToken
  }

  const getUserTokenV2 = () => {
    return cookieTokenV2?.value
  }

  const clearTokenV2 = () => {
    cookieTokenV2.value = null
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
      = await useApiService.post('/api/v1/users/login', {
        ...credentials,
        type: 'request',
      })
    return response
  }

  const register = async (formData: { identity: string, pass: string }) => {
    await useApiService.post('/api/v1/users/register', {
      ...formData,
      type: 'register',
    })
  }

  const forgotPassword = async (passForm: { identity: string }) => {
    const response = await useApiService.post('/api/v1/users/recovery', {
      ...passForm,
      type: 'request',
    })
    return response
  }

  const isAuthenticated = computed(() => !!cookieTokenV2.value && !!cookieTokenV2.value)

  return {
    cookieToken,
    setUserToken,
    setUserTokenV2,
    clearAuth,
    clearTokenV2,
    logout,
    login,
    register,
    isAuthenticated,
    forgotPassword,
    getUserToken,
    getUserTokenV2,
  }
}
