import type { LoginInformationDTO, LoginResponseDTO, ApiResult, AppError, RegisterResponseDTO, ForgetPasswordResponseDTO } from '@/types'

const loadingLogin = ref(false)
const loadingLoginByGoogle = ref(false)
const loadingRegister = ref(false)
const loadingForgetPassword = ref(false)

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
    useApiService.get('/api/v2/legacy-auth/logout',
    ).catch((error) => {
      console.warn('Logout API call failed:', error)
    })

    clearAuth()

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
        errors: [],
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

  const register = async (data: LoginInformationDTO) => {
    try {
      loadingRegister.value = true
      const response = await useApiService.post<
        ApiResult<RegisterResponseDTO>
      >(
        '/api/v2/legacy-auth/register',
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
      loadingRegister.value = false
    }
  }

  const forgetPassword = async (data: LoginInformationDTO) => {
    try {
      loadingForgetPassword.value = true
      const response = await useApiService.post<
        ApiResult<ForgetPasswordResponseDTO>
      >(
        '/api/v2/legacy-auth/recovery',
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
      loadingForgetPassword.value = false
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
    forgetPassword,
    getUserToken,
    loginByGoogle,
    loadingLoginByGoogle,
    loadingForgetPassword,
    loadingRegister,
  }
}
