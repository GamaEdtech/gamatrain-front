import type { Ref } from 'vue'
import type { ApiResult, AppError, AuthTokenDTO, LoginResponseDTO } from '@/types'
import { clearInviteCode, getInviteCode } from '~/utils/inviteCode'

const loadingLogin = ref(false)
const loadingLoginByGoogle = ref(false)
const loadingRegister = ref(false)
const loadingForgetPassword = ref(false)
const loadingCode = ref(false)

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
  const { normalizeApiResponseError, normalizeApiCatchError } = useApiErrorHandler()

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

  // A token of this backend is "{userId}|{token}"; a token from the old backend (Google sign-in, older sessions) is a JWT.
  const isBackendToken = (value: string | null) => !!value && value.split('|').length === 2

  const logout = async () => {
    const request = isBackendToken(token.value)
      ? useApiService.post('/api/v2/identities/tokens/revoke')
      : useApiService.get('/api/v2/legacy-auth/logout')
    request.catch((error) => {
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

  // Calls one of the sign-in endpoints. Never throws: a failure answers succeeded=false with the backend's own message
  // (e.g. "This email already has an account"), which the dialogs show as it is.
  const authCall = async <T>(loading: Ref<boolean>, request: () => Promise<ApiResult<T>>): Promise<ApiResult<T> & { message?: string }> => {
    loading.value = true
    try {
      const response = await request()
      return response.succeeded ? response : { ...response, message: normalizeApiResponseError(response).message }
    }
    catch (err: unknown) {
      return { succeeded: false, data: null, errors: [], message: normalizeApiCatchError(err).message } as unknown as ApiResult<T> & { message?: string }
    }
    finally {
      loading.value = false
    }
  }

  const post = <T>(url: string, body: Record<string, unknown>) => useApiService.post<ApiResult<T>>(url, body)

  // Sign in with an email and password (this backend; it checks a password it doesn't hold yet with the old backend once).
  const login = (data: { email: string, password: string }) =>
    authCall(loadingLogin, () => post<AuthTokenDTO>('/api/v2/identities/tokens', { username: data.email.trim(), password: data.password }))

  // Sign-up: 1. email a code, 2. check it, 3. code + password (answers a token: the person is signed in).
  const sendRegisterCode = (email: string) =>
    authCall(loadingCode, () => post<string>('/api/v2/identities/register/code', { email: email.trim() }))
  const verifyRegisterCode = (email: string, code: string) =>
    authCall(loadingCode, () => post<null>('/api/v2/identities/register/code/verify', { email: email.trim(), code }))
  const register = (data: { email: string, code: string, password: string }) =>
    authCall(loadingRegister, () => post<AuthTokenDTO>('/api/v2/identities/register', {
      email: data.email.trim(),
      code: data.code,
      password: data.password,
      confirmPassword: data.password,
      // A teacher's invite code; the backend uses it because this request creates the account.
      referralCode: getInviteCode() ?? undefined,
    }))

  // Forgotten password: the same three steps.
  const sendResetCode = (email: string) =>
    authCall(loadingCode, () => post<string>('/api/v2/identities/password/reset-code', { email: email.trim() }))
  const verifyResetCode = (email: string, code: string) =>
    authCall(loadingCode, () => post<null>('/api/v2/identities/password/reset-code/verify', { email: email.trim(), code }))
  const resetPassword = (data: { email: string, code: string, password: string }) =>
    authCall(loadingForgetPassword, () => post<AuthTokenDTO>('/api/v2/identities/password/reset', {
      email: data.email.trim(),
      code: data.code,
      password: data.password,
      confirmPassword: data.password,
    }))

  // Google stays on the old backend's sign-in for now: this backend checks Google tokens against another Google client.
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

  // Keeps a new token and loads the user's profile; false when the profile couldn't be loaded (the token is kept).
  const completeSignIn = async (newToken: string) => {
    setUserToken(newToken)
    const { getProfile, setUser } = useUser()
    const profile = await getProfile(newToken)
    if (profile.data?.data) {
      setUser(profile.data.data)
      return true
    }
    return false
  }

  const isAuthenticated = computed(() => !!token.value)
  // The server never has the token, so it renders the signed-out UI, and the first (hydrating) render in the
  // browser must match it. The signed-in parts appear as soon as hydration is done (set by
  // plugins/init-user.client.ts). Use this for what's shown, and isAuthenticated for API calls and click handlers.
  const appHydrated = useState('appHydrated', () => false)
  const isAuthenticatedUi = computed(() => appHydrated.value && isAuthenticated.value)

  return {
    setUserToken,
    completeSignIn,
    clearAuth,
    logout,
    login,
    loadingLogin,
    register,
    sendRegisterCode,
    verifyRegisterCode,
    sendResetCode,
    verifyResetCode,
    resetPassword,
    loadingCode,
    isAuthenticated,
    isAuthenticatedUi,
    getUserToken,
    loginByGoogle,
    loadingLoginByGoogle,
    loadingForgetPassword,
    loadingRegister,
  }
}
