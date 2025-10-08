export interface ApiResult<T> {
  data: T | null
  status: number
  error?: unknown
}
