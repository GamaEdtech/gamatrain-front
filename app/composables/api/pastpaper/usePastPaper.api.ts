import type {
  ApiResult,
  AppError,
  PastPaperCreateDTO,
  PastPaperCreatePayloadDTO,
  PastPaperCreateResponseDTO,
} from '@/types'

const loadingAddItem = ref(false)
const NAME = 'Past Paper'

export const usePastPaper = () => {
  const { $toast } = useNuxtApp()

  const addItem = async (item: PastPaperCreateDTO) => {
    loadingAddItem.value = true
    const params: PastPaperCreatePayloadDTO = {
      section: item.board,
      base: item.grade,
      lesson: item.subject,
      test_type: item.classification,
      topics: Array.isArray(item.topics) ? item.topics.map(Number) : [],
      answer_type: item.answer_type,
      level: item.level,
      holding_level: item.holding_level,
      title: item.title,
      description: item.description,
      file_pdf: item.file_pdf,
      file_word: item.file_word,
      file_answer: item.file_answer,
      edu_year: item.edu_year,
      edu_month: item.edu_month,
      file_extra: item.file_extra ?? [],
      state: item.state,
      area: item.area,
      school: item.school,
    }

    try {
      const response = await useApiService.post<
        ApiResult<PastPaperCreateResponseDTO>
      >(
        '/api/v1/tests',
        params as unknown as Record<string, never>,
      )

      if (response.data?.id === 0 && response.data.repeated) {
        $toast.info(`This ${NAME} is repetitive.`)
      }
      else if (response.status === 1) {
        $toast.success(`${NAME} Added successfully!`)
      }
      else {
        $toast.error(`The operation failed. Please try again later.`)
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error(`The operation failed. Please try again later.`)
      }

      return {
        succeeded: false,
        status: 0,
        errors: [
          {
            message: 'The operation failed. Please try again later.',
            code: '',
            reference: '',
            info: '',
            value: '',
          },
        ],
        data: null,
      }
    }
    finally {
      loadingAddItem.value = false
    }
  }

  return {
    addItem,
    loadingAddItem,
  }
}
