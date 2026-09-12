import type {
  ApiResult,
  ExamResultDTO,
  GetDataParamsExamResult,
  ResponseListDTO,
  ExamResultDetailDTO,
} from '@/types'

export const useExamResult = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<ExamResultDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingGetData = ref(true)
  const loadingGetItemById = ref(false)

  const getData = async (params: GetDataParamsExamResult) => {
    const { page, pageSize, section, base, lesson } = params
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<ExamResultDTO>>
      >('/api/v1/exams/results', {
        perpage: pageSize,
        page,
        section: section || '',
        base: base || '',
        lesson: lesson || '',
      })

      if (response.data && response.status == 1) {
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
      const response = await useApiService.get<ApiResult<ExamResultDetailDTO>>(
        `/api/v1/exams/result/${id}`,
      )

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ExamResultDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
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
  }
}
