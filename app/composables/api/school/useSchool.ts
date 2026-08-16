import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  SchoolListDTO,
  GetSchoolsParams,
} from '@/types'

const data = ref<SchoolListDTO[]>([])
const loadingGetData = ref(false)
const loadingMore = ref(false)
const totalCount = ref(0)
const pageCount = ref(0)
const hasMoreItems = computed(() => data.value.length < totalCount.value)

interface GetSchoolsOptions {
  append?: boolean
}

export const useSchool = () => {
  const { $toast } = useNuxtApp()

  const getData = async (
    params: GetSchoolsParams,
    options: GetSchoolsOptions = {},
  ) => {
    const { append = false } = options
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
      hasRating,
      hasImage,
      tuitionStart,
      tuitionEnd,
      boards,
    } = params

    if (append)
      loadingMore.value = true
    else
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

      if (hasRating !== undefined && hasRating !== null) {
        query.HasRating = hasRating
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
        { public: true },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        data.value = append
          ? [...data.value, ...newItems]
          : newItems

        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(
          totalCount.value / pageSize,
        )
      }
      else if (!append) {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
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

      if (!append) {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
      }

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      if (append)
        loadingMore.value = false
      else
        loadingGetData.value = false
    }
  }

  const resetData = () => {
    data.value = []
    totalCount.value = 0
    pageCount.value = 0
  }

  return {
    loadingGetData,
    loadingMore,
    data,
    totalCount,
    pageCount,
    hasMoreItems,
    getData,
    resetData,
  }
}
