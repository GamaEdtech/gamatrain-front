import type {
  ApiResult,
  AppError,
  GetLocationParams,
  LocationItemDTO,
  ResponseListDTO,
} from '@/types'

const countries = ref<LocationItemDTO[]>([])
const states = ref<LocationItemDTO[]>([])
const cities = ref<LocationItemDTO[]>([])
const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingMoreCountries = ref(false)
const loadingMoreStates = ref(false)
const loadingMoreCities = ref(false)
const countriesTotalCount = ref(0)
const statesTotalCount = ref(0)
const citiesTotalCount = ref(0)
const countriesPageCount = ref(0)
const statesPageCount = ref(0)
const citiesPageCount = ref(0)
const countriesHasMoreItems = computed(() => countries.value.length < countriesTotalCount.value)
const statesHasMoreItems = computed(() => states.value.length < statesTotalCount.value)
const citiesHasMoreItems = computed(() => cities.value.length < citiesTotalCount.value)

interface GetLocationOptions {
  append?: boolean
}

const DEFAULT_PAGE_SIZE = 10000

export const useLocation = () => {
  const { $toast } = useNuxtApp()

  const getCountries = async (
    params: GetLocationParams = {},
    options: GetLocationOptions = {},
  ) => {
    const { append = false } = options
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE

    try {
      if (append)
        loadingMoreCountries.value = true
      else
        loadingCountries.value = true

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        '/api/v2/locations/countries',
        {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        countries.value = append
          ? [...countries.value, ...newItems]
          : newItems

        countriesTotalCount.value = response.data.totalRecordsCount
        countriesPageCount.value = Math.ceil(countriesTotalCount.value / pageSize)
      }
      else if (!append) {
        countries.value = []
        countriesTotalCount.value = 0
        countriesPageCount.value = 0
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      if (!append) {
        countries.value = []
        countriesTotalCount.value = 0
        countriesPageCount.value = 0
      }

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      if (append)
        loadingMoreCountries.value = false
      else
        loadingCountries.value = false
    }
  }

  const resetCountries = () => {
    countries.value = []
    countriesTotalCount.value = 0
    countriesPageCount.value = 0
  }

  const getStates = async (
    countryId: number | string,
    params: GetLocationParams = {},
    options: GetLocationOptions = {},
  ) => {
    const { append = false } = options
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE

    try {
      if (append)
        loadingMoreStates.value = true
      else
        loadingStates.value = true

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        `/api/v2/locations/states/${countryId}`,
        {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        states.value = append
          ? [...states.value, ...newItems]
          : newItems

        statesTotalCount.value = response.data.totalRecordsCount
        statesPageCount.value = Math.ceil(statesTotalCount.value / pageSize)
      }
      else if (!append) {
        states.value = []
        statesTotalCount.value = 0
        statesPageCount.value = 0
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      if (!append) {
        states.value = []
        statesTotalCount.value = 0
        statesPageCount.value = 0
      }

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      if (append)
        loadingMoreStates.value = false
      else
        loadingStates.value = false
    }
  }

  const resetStates = () => {
    states.value = []
    statesTotalCount.value = 0
    statesPageCount.value = 0
  }

  const getCities = async (
    stateId: number | string,
    params: GetLocationParams = {},
    options: GetLocationOptions = {},
  ) => {
    const { append = false } = options
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE

    try {
      if (append)
        loadingMoreCities.value = true
      else
        loadingCities.value = true

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        `/api/v2/locations/cities/${stateId}`,
        {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        cities.value = append
          ? [...cities.value, ...newItems]
          : newItems

        citiesTotalCount.value = response.data.totalRecordsCount
        citiesPageCount.value = Math.ceil(citiesTotalCount.value / pageSize)
      }
      else if (!append) {
        cities.value = []
        citiesTotalCount.value = 0
        citiesPageCount.value = 0
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      if (!append) {
        cities.value = []
        citiesTotalCount.value = 0
        citiesPageCount.value = 0
      }

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      if (append)
        loadingMoreCities.value = false
      else
        loadingCities.value = false
    }
  }

  const resetCities = () => {
    cities.value = []
    citiesTotalCount.value = 0
    citiesPageCount.value = 0
  }

  return {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    loadingMoreCountries,
    loadingMoreStates,
    loadingMoreCities,
    countriesTotalCount,
    statesTotalCount,
    citiesTotalCount,
    countriesPageCount,
    statesPageCount,
    citiesPageCount,
    countriesHasMoreItems,
    statesHasMoreItems,
    citiesHasMoreItems,
    getCountries,
    getStates,
    getCities,
    resetCountries,
    resetStates,
    resetCities,
  }
}
