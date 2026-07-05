export interface ApiResult<T> {
  data: T | null
  status: number
  error?: unknown
  succeeded: boolean
  errors: [
    {
      message: string
      code: string
      reference: string
      info: string
      value: string
    },
  ]
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
  message?: string
  status?: number
}

export type StatusErrorCodeApp = 500 | 404 | 403 | 401 | 'disconnect'

export interface ResponseListDTO<T> {
  list: T[]
  totalRecordsCount: number
  num: number
}
