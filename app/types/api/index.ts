export interface ApiErrorItem {
  message: string
  code?: string
  reference?: string
  info?: string
  value?: string
}

export interface ApiResult<T> {
  data: T | null
  status: number
  error?: unknown
  succeeded: boolean
  errors?: ApiErrorItem[]
}
export interface ApiErrorResult {
  status?: number
  data?: {
    error?: string
    status?: number
    message?: string
  }
}

export interface AppError {
  response?: ApiErrorResult
  data?: unknown
  message?: string
  status?: number
  statusCode?: number
  statusMessage?: string
}

export type StatusErrorCodeApp = 500 | 404 | 403 | 401 | 'disconnect'

export interface NormalizedApiError {
  message: string
  status: number | 'disconnect'
  errors: ApiErrorItem[]
  raw: unknown
}

export interface ResponseListDTO<T> {
  list: T[]
  totalRecordsCount: number
  num: number
}
