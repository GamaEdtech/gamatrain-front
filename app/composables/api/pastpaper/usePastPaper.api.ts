import type {
  ApiResult,
  AppError,
  PastPaperCreateDTO,
  PastPaperEditDTO,
  PastPaperCreatePayloadDTO,
  PastPaperCreateResponseDTO,
  PastPaperDetailDTO,
  PastPaperBriefDTO,
  ResponseListDTO,
  GetPastPaperParams,
} from '@/types'

const data = ref<PastPaperBriefDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const NAME = 'Past Paper'

export const usePastPaper = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetPastPaperParams) => {
    const { page, pageSize, section, base, lesson } = params
    loadingGetData.value = true

    try {
      const query = {
        perpage: pageSize,
        page,
        section: section || '',
        base: base || '',
        lesson: lesson || '',
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<PastPaperBriefDTO>>
      >('/api/v1/tests', query)

      if (response.data) {
        data.value = response.data.list
        totalCount.value = Number(response.data.num)
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      data.value = []
      totalCount.value = 0
      pageCount.value = 0
    }
    finally {
      loadingGetData.value = false
    }
  }

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

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<
        ApiResult<PastPaperDetailDTO>
      >(`/api/v1/tests/${id}`)

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const encodeEditPayload = (item: PastPaperEditDTO) => {
    const params: Partial<PastPaperCreatePayloadDTO> = {}

    if (item.board !== undefined) params.section = item.board
    if (item.grade !== undefined) params.base = item.grade
    if (item.subject !== undefined) params.lesson = item.subject
    if (item.classification !== undefined) params.test_type = item.classification
    if (item.topics !== undefined) params.topics = Array.isArray(item.topics) ? item.topics.map(Number) : []
    if (item.answer_type !== undefined) params.answer_type = item.answer_type
    if (item.level !== undefined) params.level = item.level
    if (item.holding_level !== undefined) params.holding_level = item.holding_level
    if (item.title !== undefined) params.title = item.title
    if (item.description !== undefined) params.description = item.description
    if (item.file_pdf !== undefined) params.file_pdf = item.file_pdf
    if (item.file_word !== undefined) params.file_word = item.file_word
    if (item.file_answer !== undefined) params.file_answer = item.file_answer
    if (item.edu_year !== undefined) params.edu_year = item.edu_year
    if (item.edu_month !== undefined) params.edu_month = item.edu_month
    if (item.file_extra !== undefined) params.file_extra = item.file_extra
    if (item.state !== undefined) params.state = item.state
    if (item.area !== undefined) params.area = item.area
    if (item.school !== undefined) params.school = item.school

    return params
  }

  const editItem = async (id: string | number, item: PastPaperEditDTO) => {
    loadingEditItem.value = true
    const params = encodeEditPayload(item)

    try {
      const response = await useApiService.put<
        ApiResult<PastPaperCreateResponseDTO>
      >(
        `/api/v1/tests/${id}`,
        params as unknown as Record<string, never>,
      )

      if (response.data?.id === 0 && response.data.repeated) {
        $toast.info(`This ${NAME} is repetitive.`)
      }
      else if (response.status === 1) {
        $toast.success(`${NAME} Edited successfully!`)
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
        data: null,
      }
    }
    finally {
      loadingEditItem.value = false
    }
  }

  const deleteItem = async (id: string | number) => {
    loadingDeleteItem.value = true

    try {
      const response = await useApiService.remove<ApiResult<boolean>>(
        `/api/v1/tests/${id}`,
      )

      if (response.status === 1 || response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
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
        data: false,
      }
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  return {
    loadingGetData,
    data,
    getData,
    totalCount,
    pageCount,
    addItem,
    loadingAddItem,
    editItem,
    loadingEditItem,
    getItemById,
    loadingGetItemById,
    deleteItem,
    loadingDeleteItem,
  }
}
