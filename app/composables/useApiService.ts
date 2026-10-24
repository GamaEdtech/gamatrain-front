import type {
  FetchOptions,
} from 'ofetch'

export interface SearchParameters {
  [key: string]: string | number | boolean | null | undefined | (string | number | null | undefined)[]
}

type UseFetchOptions = {
  key?: string
  method?: string
  query?: SearchParameters
  params?: SearchParameters | FormData
  body?: RequestInit['body'] | Record<string, unknown>
  headers?: Record<string, string> | [key: string, value: string][] | Headers
  baseURL?: string
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  pick?: string[]
  proxy?: boolean
  public?: boolean
  signal?: AbortSignal
}

interface AuthHeaders {
  Authorization?: string
}

const apiRequest = <T = unknown>(
  request: string,
  opts?: UseFetchOptions,
): Promise<T> => {
  const config = useRuntimeConfig()
  // Resolve while the Nuxt context is active; it is gone inside async fetch hooks.
  const router = useRouter()
  const auth = useAuth()
  const { cleanUser } = useUser()
  const headers = authHeader(opts?.public)

  let baseURL = ''
  let cleanRequest = request
  let isGamaApi = false

  // if (opts?.proxy) {
  //   baseURL = ''
  //   cleanRequest = `/api/proxy${request}`
  // }
  // else {
  if (request.includes('/api/v2/')) {
    baseURL = config.public.apiV2BaseUrl as string
    cleanRequest = request.replace(/^\/api\/v2\//, '/')
  }
  else if (request.includes('/api/v1/')) {
    baseURL = config.public.apiV1BaseUrl as string
    cleanRequest = request.replace(/^\/api\/v1\//, '/')
    isGamaApi = true
  }
  // }

  const fetchOpts: FetchOptions = {
    // gama-api (v1) trusts its own gama_sessions cookie over the Bearer token: once that cookie's session is
    // logged out, every call answered "login first" even with a fresh token, and signing in again couldn't
    // fix it. The Bearer token is how it's authenticated, so never send it cookies.
    credentials: isGamaApi ? 'omit' : 'include',
    onResponse({ request: _request, response: _response, options: _options }) {
      // Process the response data
    },
    onResponseError({
      request: _request,
      response: _response,
      options: _options,
    }) {
      const status = _response?.status
      // gama-api answers a session it has ended (before the token's own expiry) with 403 accessDenied
      // "You have to login first", not 401. Keeping that dead token left the user looking signed in
      // while every click just reopened the login dialog, so drop it and let them sign in afresh.
      const body = _response?._data as { error?: string, message?: string } | undefined
      const sessionEnded = status == 401
        || (status == 403 && body?.error === 'accessDenied' && /login/i.test(body.message ?? ''))
      if (sessionEnded && auth.isAuthenticated.value) {
        auth.clearAuth()
        cleanUser()
      }

      if (status == 401 || status == 403) {
        router.push({ query: { auth_form: 'login' } })
      }
    },
    onRequest({ request: _request, options: _options }) {},
    onRequestError({ request: _request, options: _options, error: _error }) {},
    ...opts,
    headers: {
      ...headers,
      ...(opts?.headers || {}),
      Accept: 'application/json',
    },
  }
  if (baseURL && baseURL !== '') {
    fetchOpts.baseURL = baseURL
  }

  const apiFetch = $fetch.create(fetchOpts)

  return apiFetch<T>(cleanRequest) as Promise<T>
}

const authHeader = (
  publicApi: boolean | null = false,
): AuthHeaders | undefined => {
  const auth = useAuth()

  if (!auth.isAuthenticated.value || publicApi) return

  if (import.meta.client) {
    return { Authorization: `Bearer ${auth.getUserToken()}` }
  }
}

const get = <T = unknown>(
  request: string,
  params?: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return apiRequest<T>(request, { ...opts, method: 'GET', params: params })
}

const post = <T = unknown>(
  request: string,
  params?: SearchParameters | FormData | Record<string, unknown>,
  opts?: UseFetchOptions,
): Promise<T> => {
  return apiRequest<T>(request, { ...opts, method: 'POST', body: params })
}

const put = <T = unknown>(
  request: string,
  params: SearchParameters | FormData | Record<string, unknown>,
  opts?: UseFetchOptions,
): Promise<T> => {
  return apiRequest<T>(request, { ...opts, method: 'PUT', body: params })
}

const patch = <T = unknown>(
  request: string,
  params: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return apiRequest<T>(request, { ...opts, method: 'PATCH', body: params })
}

const remove = <T = unknown>(
  request: string,
  params?: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return apiRequest<T>(request, { ...opts, method: 'DELETE', body: params })
}

export const useApiService = {
  get,
  post,
  put,
  patch,
  remove,
}
