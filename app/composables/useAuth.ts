import type { LoginInformationDTO, LoginResponseDTO, ApiResult, AppError } from '@/types'

const loadingLogin = ref(false)
const loadingLoginByGoogle = ref(false)

export const useAuth = () => {
  const { $toast } = useNuxtApp()
  const cookieToken = useCookie<string | null>('authToken', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  const setUserToken = (newToken: string) => {
    cookieToken.value = newToken
    localStorage.setItem('token', newToken)
  }

  const getUserToken = () => {
    return cookieToken?.value
  }

  const clearAuth = () => {
    cookieToken.value = null
    localStorage.removeItem('token')
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
      localStorage.clear()
      sessionStorage.clear()
    }
    // Navigate to home page
    await navigateTo('/')
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
  const login = async (data: LoginInformationDTO) => {
    try {
      loadingLogin.value = true
      const response = await useApiService.post<
        ApiResult<LoginResponseDTO>
      >(
        '/api/v2/legacy-auth/login',
        { ...data },
      )
      if (!response.succeeded) {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: null,
      }
    }
    finally {
      loadingLogin.value = false
    }
  }

  const loginByGoogle = async (idToken: string) => {
    try {
      loadingLoginByGoogle.value = true
      const response = await useApiService.post<
        ApiResult<LoginResponseDTO>
      >(
        '/api/v2/legacy-auth/google',
        { idToken },
      )
      if (!response.succeeded) {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: null,
      }
    }
    finally {
      loadingLoginByGoogle.value = false
    }
  }

  const isAuthenticated = computed(() => !!cookieToken.value)

  return {
    cookieToken,
    setUserToken,
    clearAuth,
    logout,
    login,
    loadingLogin,
    register,
    isAuthenticated,
    forgotPassword,
    getUserToken,
    loginByGoogle,
    loadingLoginByGoogle,
  }
}
