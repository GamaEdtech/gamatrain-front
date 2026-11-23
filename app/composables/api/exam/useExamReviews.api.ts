import type { ApiResult, ExamReviewDTO, ExamReviewsDTO } from '@/types'

/** An exam's reviews (rating and comments): reading them, and the signed-in participant's own one. */
export const useExamReviews = () => {
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
  const saving = ref(false)

  /** The public summary and comments; `asGuest` leaves the token out (server rendering, cacheable). */
  const getReviews = async (examId: string | number, page = 1, asGuest = false) => {
    try {
      const response = await useApiService.get<ApiResult<ExamReviewsDTO>>(
        `/api/v2/exams/${examId}/reviews`,
        { page, pageSize: 10 },
        asGuest ? { public: true, credentials: 'omit' } : undefined,
      )
      return response.succeeded ? response.data : null
    }
    catch {
      return null
    }
  }

  const saveReview = async (examId: string | number, rating: number, comment: string) => {
    saving.value = true
    try {
      const response = await useApiService.post<ApiResult<ExamReviewDTO>>(`/api/v2/exams/${examId}/reviews`, { rating, comment })
      if (response.succeeded) return response.data
      handleApiResponseError(response)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    finally {
      saving.value = false
    }
    return null
  }

  const deleteReview = async (examId: string | number) => {
    saving.value = true
    try {
      const response = await useApiService.remove<ApiResult<boolean>>(`/api/v2/exams/${examId}/reviews`)
      if (response.succeeded) return true
      handleApiResponseError(response)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    finally {
      saving.value = false
    }
    return false
  }

  return { getReviews, saveReview, deleteReview, saving }
}
