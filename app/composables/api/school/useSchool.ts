import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  SchoolListDTO,
  GetSchoolsParams,
} from '@/types'

const data = ref<SchoolListDTO[]>([])
const loadingGetData = ref(false)
const totalCount = ref(0)
const pageCount = ref(0)

export const useSchool = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetSchoolsParams) => {
    const {
      page,
      pageSize,
      countryId,
      stateId,
      cityId,
      latitude,
      longitude,
      radius,
      name,
      hasScore,
      hasImage,
      tuitionStart,
      tuitionEnd,
      boards,
    } = params

    loadingGetData.value = true

    try {
      const query: Record<
        string,
  string | number | boolean | number[]
      > = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      }

      if (countryId !== undefined && countryId !== null) {
        query.CountryId = countryId
      }

      if (stateId !== undefined && stateId !== null) {
        query.StateId = stateId
      }

      if (cityId !== undefined && cityId !== null) {
        query.CityId = cityId
      }

      if (latitude !== undefined && latitude !== null) {
        query['Location.Latitude'] = latitude
      }

      if (longitude !== undefined && longitude !== null) {
        query['Location.Longitude'] = longitude
      }

      if (radius !== undefined && radius !== null) {
        query['Location.Radius'] = radius
      }

      if (name) {
        query.Name = name
      }

      if (hasScore !== undefined && hasScore !== null) {
        query.HasScore = hasScore
      }

      if (hasImage !== undefined && hasImage !== null) {
        query.HasImage = hasImage
      }

      if (tuitionStart !== undefined && tuitionStart !== null) {
        query['Tuition.Start'] = tuitionStart
      }

      if (tuitionEnd !== undefined && tuitionEnd !== null) {
        query['Tuition.End'] = tuitionEnd
      }

      if (boards?.length) {
        query.Boards = boards
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<SchoolListDTO>>
      >(
        '/api/v2/schools',
        query,
      )

      if (response.data && response.data.list && response.data.list.length > 0) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(
          totalCount.value / pageSize,
        )
      }
      else {
        data.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(
          error.response.data?.message || '',
        )
      }

      data.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  const resetData = () => {
    data.value = []
  }

  return {
    loadingGetData,
    data,
    totalCount,
    pageCount,
    getData,
    resetData,
  }
}
