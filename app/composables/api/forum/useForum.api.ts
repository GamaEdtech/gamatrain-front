import type {
  ApiResult,
  AppError,
  ForumBriefDTO,
  ForumCreateDTO,
  ForumDetailDTO,
  ForumCreateResponseDTO,
  ResponseListDTO,
  GetDataParamsForum,
} from '@/types'

const data = ref<ForumBriefDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const NAME = 'Forum'

export const useForum = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetDataParamsForum) => {
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
        ApiResult<ResponseListDTO<ForumBriefDTO>>
      >('/api/v1/questions', query)

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

  const encodePayload = (item: ForumCreateDTO) => {
    const payload = new URLSearchParams()

    payload.append('section', String(item.board || ''))
    payload.append('base', String(item.grade || ''))
    payload.append('lesson', String(item.subject || ''))
    payload.append('topics', String(item.topics || ''))
    payload.append('title', item.title || '')
    payload.append('question', item.question || '')
    payload.append('file', item.file || '')

    return payload
  }

  const addItem = async (item: ForumCreateDTO) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<
        ApiResult<ForumCreateResponseDTO>
      >(
        '/api/v1/questions',
        encodePayload(item) as unknown as Record<string, never>,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      if (response.data?.id === 0 && response.data.repeated) {
        $toast.info(`The ${NAME} is duplicated.`)
      }
      else if (response.status === 1) {
        $toast.success(`${NAME} submitted successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error('Error submitting multimedia')
      }

      return {
        succeeded: false,
        status: 0,
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
      const response = await useApiService.get<ApiResult<ForumDetailDTO>>(
        `/api/v1/questions/${id}`,
      )

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

  const editItem = async (id: string | number, item: ForumCreateDTO) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<
        ApiResult<ForumCreateResponseDTO>
      >(
        `/api/v1/questions/${id}`,
        encodePayload(item) as unknown as Record<string, never>,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      if (response.data?.id === 0 && response.data.repeated) {
        $toast.info(`The ${NAME} is duplicated.`)
      }
      else if (response.status === 1) {
        $toast.success(`${NAME} updated successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error('Error updating multimedia')
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
        `/api/v1/questions/${id}`,
      )

      if (response.status === 1 || response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error('Error deleting multimedia')
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
