import type {
  ApiResult,
  CreateTicketDTO,
  CreateTicketReplyDTO,
  GetTicketParams,
  ResponseListDTO,
  TicketDetailDTO,
  TicketListDTO,
  TicketReplyDTO,
  ResponseCreateTicketDTO,
} from '@/types'

const BASE_URL = '/api/v2/tickets'

export const useTicket = () => {
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<TicketListDTO[]>([])
  const replyList = ref<TicketReplyDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)

  const loadingGetData = ref(true)
  const loadingCreateTicket = ref(false)
  const loadingGetItemById = ref(false)
  const loadingGetReplyList = ref(false)
  const loadingCreateReply = ref(false)

  const appendFile = (formData: FormData, file?: File | Blob | null) => {
    if (file) {
      formData.append('File', file)
    }
  }

  const getData = async (params: GetTicketParams) => {
    const { page, pageSize } = params
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<TicketListDTO>>
      >(
        BASE_URL,
        {
          'PagingDto.PageFilter.Size': pageSize,
          'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
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

      return createApiFailure<ResponseListDTO<TicketListDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const createTicket = async (payload: CreateTicketDTO) => {
    loadingCreateTicket.value = true

    try {
      const formData = new FormData()

      formData.append('Captcha', payload.captcha)
      formData.append('FullName', payload.fullName)
      formData.append('Email', payload.email)
      formData.append('Subject', payload.subject)
      formData.append('Body', payload.body)
      appendFile(formData, payload.file)

      const response = await useApiService.post<ApiResult<ResponseCreateTicketDTO>>(
        BASE_URL,
        formData,
      )

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ResponseCreateTicketDTO>(err)
    }
    finally {
      loadingCreateTicket.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<TicketDetailDTO>>(
        `${BASE_URL}/${id}`,
      )

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<TicketDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const getReplyList = async (id: string | number) => {
    loadingGetReplyList.value = true

    try {
      const response = await useApiService.get<ApiResult<TicketReplyDTO[]>>(
        `${BASE_URL}/${id}/replys`,
      )

      if (response.succeeded) {
        replyList.value = response.data ?? []
      }
      else {
        replyList.value = []
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      replyList.value = []

      return createApiFailure<TicketReplyDTO[]>(err)
    }
    finally {
      loadingGetReplyList.value = false
    }
  }

  const createReply = async (id: string | number, payload: CreateTicketReplyDTO) => {
    loadingCreateReply.value = true

    try {
      const formData = new FormData()

      formData.append('Body', payload.body)
      appendFile(formData, payload.file)

      const response = await useApiService.post<ApiResult<boolean>>(
        `${BASE_URL}/${id}/replys`,
        formData,
      )

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err)
    }
    finally {
      loadingCreateReply.value = false
    }
  }

  return {
    data,
    replyList,
    totalCount,
    pageCount,
    loadingGetData,
    loadingCreateTicket,
    loadingGetItemById,
    loadingGetReplyList,
    loadingCreateReply,
    getData,
    createTicket,
    getItemById,
    getReplyList,
    createReply,
  }
}
