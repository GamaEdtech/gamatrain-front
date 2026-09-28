import type {
  AdminSchoolImageDTO,
  AdminSchoolImageDetailDTO,
  ApiResult,
  GetAdminSchoolImageParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSchoolImageDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingGetItemById = ref(false)
const loadingConfirm = ref(false)
const loadingReject = ref(false)
const loadingDeleteItem = ref(false)

const NAME = 'Image'

export const useSchoolImageAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetAdminSchoolImageParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSchoolImageDTO>>
      >(
        '/api/v2/admin/schools/images/contributions',
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'Status': params.status,
        },
      )

      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
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

      return createApiFailure<ResponseListDTO<AdminSchoolImageDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminSchoolImageDetailDTO>>(
        `/api/v2/admin/schools/images/contributions/${id}`,
      )

      if (response.succeeded && response.data) {
        return response
      }

      handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminSchoolImageDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const confirm = async (id: string | number) => {
    loadingConfirm.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/images/contributions/${id}/confirm`,
        {},
      )

      if (response.succeeded) {
        $toast.success(`${NAME} approved successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingConfirm.value = false
    }
  }

  const reject = async (id: string | number, comment: string) => {
    loadingReject.value = true

    try {
      const response = await useApiService.patch<ApiResult<boolean>>(
        `/api/v2/admin/schools/images/contributions/${id}/reject`,
        { comment },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} rejected successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingReject.value = false
    }
  }

  const deleteItem = async (schoolId: string | number, id: string | number) => {
    loadingDeleteItem.value = true

    try {
      const response = await useApiService.remove<ApiResult<boolean>>(
        `/api/v2/admin/schools/${schoolId}/images/${id}`,
      )

      if (response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
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
    getItemById,
    loadingGetItemById,
    confirm,
    loadingConfirm,
    reject,
    loadingReject,
    deleteItem,
    loadingDeleteItem,
  }
}
