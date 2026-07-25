import type {
  FetchOptions,
} from 'ofetch'

export interface SearchParameters {
  [key: string]: string | number | boolean | null | undefined | string[] | number[]
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
}

interface AuthHeaders {
  Authorization?: string
}

const apiRequest = <T = unknown>(
  request: string,
  opts?: UseFetchOptions,
): Promise<T> => {
  const config = useRuntimeConfig()
  const headers = authHeader(opts?.public)

  let baseURL = ''
  let cleanRequest = request

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
  }
  // }

  const fetchOpts: FetchOptions = {
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
  params?: SearchParameters | FormData,
  opts?: UseFetchOptions,
): Promise<T> => {
  return apiRequest<T>(request, { ...opts, method: 'POST', body: params })
}

const put = <T = unknown>(
  request: string,
  params: SearchParameters | FormData,
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
