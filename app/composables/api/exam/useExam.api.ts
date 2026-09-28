import type {
  ApiResult,
  ExamDetaiDTO,
} from '@/types'

const loadingGetItemById = ref(false)
// const NAME = 'Exam'

export const useExam = () => {
  // const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<ExamDetaiDTO>>(
        `/api/v1/exams/${id}`,
      )
      if (response.status == 0) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ExamDetaiDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  return {
    getItemById,
    loadingGetItemById,
  }
}
