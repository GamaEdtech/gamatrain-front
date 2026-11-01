import type { LoginInformationDTO, LoginResponseDTO, ApiResult, AppError, RegisterResponseDTO, ForgetPasswordResponseDTO } from '@/types'
import { clearInviteCode, getInviteCode } from '~/utils/inviteCode'

const loadingLogin = ref(false)
const loadingLoginByGoogle = ref(false)
const loadingRegister = ref(false)
const loadingForgetPassword = ref(false)

export const useAuth = () => {
  const { $toast } = useNuxtApp()
  const cookieToken = useCookie<string | null>('authToken', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    // Never over plain http (browsers treat localhost as secure), and not on cross-site POSTs (CSRF).
    secure: true,
    sameSite: 'lax',
  })

  const setUserToken = (newToken: string) => {
    cookieToken.value = newToken
    localStorage.setItem('token', newToken)
    // Signed in: a teacher's invite code has either just linked this new account or can't apply to an existing one.
    clearInviteCode()
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
    // Only leave pages that require login; public pages (papers, blog, ...) stay put
    const route = useRouter().currentRoute.value
    const requiresAuth = route.matched.some((record) => {
      const middleware = record.meta.middleware
      return Array.isArray(middleware) ? middleware.includes('auth') : middleware === 'auth'
    })
    if (requiresAuth || /^\/(user|admin)(\/|$)/.test(route.path))
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
        // A teacher's invite code; the backend uses it only if this sign-in creates the account.
        { idToken, referralCode: getInviteCode() ?? undefined },
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
        // A teacher's invite code, kept by the backend for the sign-in that creates the account.
        { ...data, referralCode: getInviteCode() ?? undefined },
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
  // Page HTML is cached by Cloudflare and shared by every visitor, so what the server renders must not depend on
  // who is signed in. The server and the first (hydrating) render show the signed-out UI; the signed-in parts
  // appear as soon as the app runs in the browser (set by plugins/init-user.client.ts). Use this for what's shown,
  // and isAuthenticated for API calls and click handlers.
  const appHydrated = useState('appHydrated', () => false)
  const isAuthenticatedUi = computed(() => appHydrated.value && isAuthenticated.value)

  return {
    cookieToken,
    setUserToken,
    clearAuth,
    logout,
    login,
    loadingLogin,
    register,
    isAuthenticated,
    isAuthenticatedUi,
    forgetPassword,
    getUserToken,
    loginByGoogle,
    loadingLoginByGoogle,
    loadingForgetPassword,
    loadingRegister,
  }
}
