import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  ExperienceDTO,
  AddExperienceDTO,
  GetDataParamsExperience,
} from '@/types'

const data = ref<ExperienceDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingDeleteItem = ref(false)
const loadingAddItem = ref(false)
const loadingGetItemById = ref(false)
const loadingEditItem = ref(false)
const NAME = 'Experience'

export const useExperiences = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetDataParamsExperience) => {
    const { page, pageSize } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<ExperienceDTO>>
      >('/api/v2/experiences', query)
      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string) => {
    loadingGetItemById.value = true
    try {
      const response = await useApiService.get<
        ApiResult<ExperienceDTO>
      >(`/api/v2/experiences/${id}`)

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const deleteItem = async (id: string) => {
    try {
      loadingDeleteItem.value = true
      const response = await useApiService.remove<
        ApiResult<boolean>
      >(
        `/api/v2/experiences/${id}`,
      )
      if (response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  const addItem = async (item: AddExperienceDTO) => {
    try {
      loadingAddItem.value = true
      const response = await useApiService.post<
        ApiResult<boolean>
      >(
        '/api/v2/experiences',
        { ...item },
      )
      if (response.succeeded) {
        $toast.success(`${NAME} Added successfully!`)
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
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const editItem = async (item: AddExperienceDTO, id: string) => {
    try {
      loadingEditItem.value = true
      const response = await useApiService.put<
        ApiResult<boolean>
      >(
        `/api/v2/experiences/${id}`,
        { ...item },
      )
      if (response.succeeded) {
        $toast.success(`${NAME} Edited successfully!`)
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
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingEditItem.value = false
    }
  }

  return { loadingGetData, data, getData, totalCount, pageCount,
    getItemById, loadingGetItemById, deleteItem, loadingDeleteItem, addItem, loadingAddItem, editItem, loadingEditItem,
  }
}
