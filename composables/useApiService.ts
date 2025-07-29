export interface SearchParameters {
  [key: string]: string | number | boolean | null | undefined
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

  const apiFetch = $fetch.create({
    baseURL: config.public.baseURL as string,
    credentials: 'include',
    onResponse({ request: _request, response: _response, options: _options }) {
      // Process the response data
    },
    onResponseError({
      request: _request,
      response: _response,
      options: _options,
    }) {
      // if (response?.status == 401 || response?.status == 403) {
      //   const router = useRouter()
      //   router.push({ query: { auth_form: 'login' } })
      // }
    },
    onRequest({ request: _request, options: _options }) {
      // Set the request headers
    },
    onRequestError({ request: _request, options: _options, error: _error }) {
      // Handle the request errors
    },
    ...opts,
    headers: {
      ...(opts?.headers || {}),
      ...headers,
      Accept: 'application/json',
    },
  })

  return apiFetch<T>(request)
}

export const authHeader = (
  req: string | null = null,
): AuthHeaders | undefined => {
  const auth = useAuth()

  if (!auth.isAuthenticated.value) return

  if (import.meta.client) {
    if (req?.includes('v2')) {
      return { Authorization: `Bearer ${localStorage.getItem('v2_token')}` }
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
  params: SearchParameters,
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
