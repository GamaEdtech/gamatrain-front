export interface SearchParameters {
  [key: string]: string | number | boolean | null | undefined | string[] | number[]
}

type UseFetchOptions = {
  key?: string
  method?: string
  query?: SearchParameters
  params?: SearchParameters
  body?: RequestInit['body'] | Record<string, unknown>
  headers?: Record<string, string> | [key: string, value: string][] | Headers
  baseURL?: string
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  pick?: string[]
}

interface AuthHeaders {
  Authorization?: string
}

interface _ApiError {
  status: number
  message: string
  data?: unknown
}

export const useApiService = <T = unknown>(
  request: string,
  opts?: UseFetchOptions,
): Promise<T> => {
  const config = useRuntimeConfig()
  const headers = authHeader(request)

  let baseURL = ''
  let cleanRequest = request

  if (request.includes('/api/v2/')) {
    baseURL = config.public.apiV2BaseUrl as string
    cleanRequest = request.replace(/^\/api\/v2\//, '/')
  }
  else if (request.includes('/api/v1/')) {
    baseURL = config.public.apiV1BaseUrl as string
    cleanRequest = request.replace(/^\/api\/v1\//, '/')
  }

  const fetchOpts = {
    credentials: 'include',
    onResponse({ request: _request, response: _response, options: _options }) {
      // Process the response data
    },
    onResponseError({
      request: _request,
      response: _response,
      options: _options,
    }) {
      if (_response?.status == 401 || _response?.status == 403) {
        const router = useRouter()
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

  return apiFetch<T>(cleanRequest)
}

export const authHeader = (
  req: string | null = null,
): AuthHeaders | undefined => {
  const auth = useAuth()

  if (!auth.isAuthenticated.value) return

  if (import.meta.client) {
    if (req?.includes('v2')) {
      return { Authorization: `Bearer ${auth.getUserTokenV2()}` }
    }
    else {
      return { Authorization: `Bearer ${auth.getUserToken()}` }
    }
  }
}

export const get = <T = unknown>(
  request: string,
  params?: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return useApiService<T>(request, { ...opts, method: 'GET', params: params })
}

export const post = <T = unknown>(
  request: string,
  params?: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return useApiService<T>(request, { ...opts, method: 'POST', body: params })
}

export const put = <T = unknown>(
  request: string,
  params: SearchParameters | FormData,
  opts?: UseFetchOptions,
): Promise<T> => {
  return useApiService<T>(request, { ...opts, method: 'PUT', body: params })
}

export const patch = <T = unknown>(
  request: string,
  params: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return useApiService<T>(request, { ...opts, method: 'PATCH', body: params })
}

export const remove = <T = unknown>(
  request: string,
  params?: SearchParameters,
  opts?: UseFetchOptions,
): Promise<T> => {
  return useApiService<T>(request, { ...opts, method: 'DELETE' })
}

export default { get, post, put, remove, authHeader, patch }
