import type {
  ApiResult,
  AppError,
  MultimediaBriefDTO,
  MultimediaCreateDTO,
  MultimediaEditDTO,
  MultimediaDetailDTO,
  MultimediaCreateResponseDTO,
  ResponseListDTO,
  GetDataParamsMultimedia,
} from '@/types'

const data = ref<MultimediaBriefDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const NAME = 'Multimedia'

export const useMultimedia = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetDataParamsMultimedia) => {
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
        ApiResult<ResponseListDTO<MultimediaBriefDTO>>
      >('/api/v1/files', query)

      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.num
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

  const encodePayload = (item: MultimediaCreateDTO | MultimediaEditDTO) => {
    const payload = new URLSearchParams()

    if (item.board) {
      payload.append('section', String(item.board || ''))
    }
    if (item.grade) {
      payload.append('base', String(item.grade || ''))
    }
    if (item.subject) {
      payload.append('lesson', String(item.subject || ''))
    }
    if (item.title) {
      payload.append('title', String(item.title || ''))
    }
    if (item.description) {
      payload.append('description', String(item.description || ''))
    }
    if (item.content_type) {
      payload.append('content_type', String(item.content_type || ''))
    }
    // if (item.from_page) {
    //   payload.append('from_page', String(item.from_page || ''))
    // }
    // if (item.to_page) {
    //   payload.append('to_page', String(item.to_page || ''))
    // }
    if (item.free_available) {
      payload.append('free_available', item.free_available ? '1' : '0')
    }
    if (item.file) {
      payload.append('file', String(item.file || ''))
    }

    if (item.topics && item.topics.length > 0) {
      item.topics.forEach((topic) => {
        payload.append('topics[]', String(topic))
      })
    }

    return payload
  }

  const addItem = async (item: MultimediaCreateDTO) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<
        ApiResult<MultimediaCreateResponseDTO>
      >(
        '/api/v1/files',
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
      const response = await useApiService.get<ApiResult<MultimediaDetailDTO>>(
        `/api/v1/files/${id}`,
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

  const editItem = async (id: string | number, item: MultimediaEditDTO) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<
        ApiResult<MultimediaCreateResponseDTO>
      >(
        `/api/v1/files/${id}`,
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
        `/api/v1/files/${id}`,
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
