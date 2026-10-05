import type { ApiResult, AppError } from '@/types'

export type BookmarkContentType = 'papers' | 'exams' | 'multimedia'

export const useBookmark = () => {
  const { $toast } = useNuxtApp()
  const loading = ref(false)

  const addBookmark = async (type: BookmarkContentType, id: string | number) => {
    loading.value = true

    try {
      const response = await useApiService.post<ApiResult<null>>(
        `/api/v1/bookmarks/${type}/${id}`,
        {},
      )

      if (!response.succeeded) {
        $toast.error(response.errors?.[0]?.message || 'The operation failed. Please try again later.')
        return false
      }

      return true
    }
    catch (err: unknown) {
      const error = err as AppError
      $toast.error(error.response?.data?.message || 'The operation failed. Please try again later.')
      return false
    }
    finally {
      loading.value = false
    }
  }

  return {
    addBookmark,
    loading,
  }
}
