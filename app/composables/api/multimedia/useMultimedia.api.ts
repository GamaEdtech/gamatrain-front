import type {
  ApiResult,
  AppError,
  MultimediaCreateDTO,
  MultimediaDetailDTO,
  MultimediaCreateResponseDTO,
} from '@/types'

const loadingAddItem = ref(false)
const loadingEditItem = ref(false)
const loadingGetItemById = ref(false)
const NAME = 'Multimedia'

export const useMultimedia = () => {
  const { $toast } = useNuxtApp()

  const encodePayload = (item: MultimediaCreateDTO) => {
    const payload = new URLSearchParams()

    payload.append('section', String(item.board || ''))
    payload.append('base', String(item.grade || ''))
    payload.append('lesson', String(item.subject || ''))
    payload.append('title', item.title || '')
    payload.append('description', item.description || '')
    payload.append('content_type', String(item.content_type || ''))
    payload.append('from_page', String(item.from_page || ''))
    payload.append('to_page', String(item.to_page || ''))
    payload.append('free_available', item.free_available ? '1' : '0')
    payload.append('file', item.file || '')

    item.topics.forEach((topic) => {
      payload.append('topics[]', String(topic))
    })

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

  const editItem = async (id: string | number, item: MultimediaCreateDTO) => {
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

  return {
    addItem,
    loadingAddItem,
    editItem,
    loadingEditItem,
    getItemById,
    loadingGetItemById,
  }
}
