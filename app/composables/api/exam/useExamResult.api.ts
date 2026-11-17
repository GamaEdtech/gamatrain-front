import type {
  ApiResult,
  ExamResultDTO,
  GetDataParamsExamResult,
  ResponseListDTO,
  ExamResultResponseDTO,
  ExamAnalyzeDetailResponseDTO,
} from '@/types'

export const useExamResult = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<ExamResultDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingGetData = ref(true)
  const loadingGetItemById = ref(false)
  const loadingGetAnalyzeResultExam = ref(false)

  const getData = async (params: GetDataParamsExamResult) => {
    const { page, pageSize, section, base, lesson } = params
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<ExamResultDTO>>
      >('/api/v2/exams/results', {
        perpage: pageSize,
        page,
        section: section || '',
        base: base || '',
        lesson: lesson || '',
      })

      if (response.data && response.succeeded) {
        data.value = response.data.list
        totalCount.value = Number(response.data.num)
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      data.value = []
      totalCount.value = 0
      pageCount.value = 0
      return createApiFailure<ResponseListDTO<ExamResultDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<ExamResultResponseDTO>>(
        `/api/v2/exams/${id}/result`,
      )
      if (response.data == null || !response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ExamResultResponseDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const getAnalyzeResultExam = async (id: string | number) => {
    loadingGetAnalyzeResultExam.value = true

    try {
      const response = await useApiService.post<ApiResult<ExamAnalyzeDetailResponseDTO>>(
        `/api/v2/exams/${id}/analysis`,
      )
      if (response.data == null || !response.succeeded) {
        // A refused charge is answered with the payment modal, not an error toast.
        const isPaymentRefusal = !!response.data?.upgradeSuggestions?.length
          || response.errors?.[0]?.message === 'InsufficientBalance'
        handleApiResponseError(response, undefined, !isPaymentRefusal)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ExamAnalyzeDetailResponseDTO>(err)
    }
    finally {
      loadingGetAnalyzeResultExam.value = false
    }
  }

  return {
    loadingGetData,
    data,
    getData,
    totalCount,
    pageCount,
    getItemById,
    loadingGetItemById,
    getAnalyzeResultExam,
    loadingGetAnalyzeResultExam,
  }
}
