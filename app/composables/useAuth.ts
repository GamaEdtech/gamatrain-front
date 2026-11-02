import type { LoginInformationDTO, LoginResponseDTO, ApiResult, AppError, RegisterResponseDTO, ForgetPasswordResponseDTO } from '@/types'
import { clearInviteCode, getInviteCode } from '~/utils/inviteCode'

const loadingLogin = ref(false)
const loadingLoginByGoogle = ref(false)
const loadingRegister = ref(false)
const loadingForgetPassword = ref(false)

// The JWT is kept in localStorage only and sent as a Bearer header. Not in a cookie: browsers send cookies with
// every page request, and page HTML is cached by Cloudflare and shared by every visitor, so the server must not
// be able to tell who is signed in.
const TOKEN_KEY = 'token'
// Until 2026-11 the JWT was also kept in this cookie: read once to move it over, then deleted.
const LEGACY_TOKEN_COOKIE = 'authToken'

const readStoredToken = (): string | null => {
  try {
    const legacy = document.cookie.match(new RegExp(`(?:^|;\\s*)${LEGACY_TOKEN_COOKIE}=([^;]*)`))?.[1]
    if (legacy !== undefined) document.cookie = `${LEGACY_TOKEN_COOKIE}=; path=/; max-age=0`

    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) return stored

    const migrated = legacy ? decodeURIComponent(legacy).replace(/^"|"$/g, '') : ''
    if (!migrated) return null
    localStorage.setItem(TOKEN_KEY, migrated)
    return migrated
  }
  catch {
    // Storage blocked (e.g. some private modes): signed out.
    return null
  }
}

// Browser only; the server never has a token (see above).
const token = ref<string | null>(import.meta.client ? readStoredToken() : null)

if (import.meta.client) {
  // Signed in or out in another tab.
  window.addEventListener('storage', (event) => {
    if (event.key === TOKEN_KEY || event.key === null) token.value = localStorage.getItem(TOKEN_KEY)
  })
}

export const useAuth = () => {
  const { $toast } = useNuxtApp()

  const setUserToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
    // Signed in: a teacher's invite code has either just linked this new account or can't apply to an existing one.
    clearInviteCode()
  }

  const getUserToken = () => token.value

  const clearAuth = () => {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
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

  const isAuthenticated = computed(() => !!token.value)
  // The server never has the token, so it renders the signed-out UI, and the first (hydrating) render in the
  // browser must match it. The signed-in parts appear as soon as hydration is done (set by
  // plugins/init-user.client.ts). Use this for what's shown, and isAuthenticated for API calls and click handlers.
  const appHydrated = useState('appHydrated', () => false)
  const isAuthenticatedUi = computed(() => appHydrated.value && isAuthenticated.value)

  return {
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
