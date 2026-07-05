import type {
  AdminContactUsAiPromptDTO,
  AdminContactUsAiResponseDTO,
  AdminContactUsComposeMailDTO,
  AdminContactUsCreateTicketDTO,
  AdminContactUsDTO,
  AdminContactUsDetailDTO,
  AdminContactUsReplyDTO,
  AdminReplyTicketListDTO,
  ApiResult,
  AppError,
  GetAdminContactUsParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminContactUsDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const emailAddresses = ref<string[]>([])
const replyList = ref<AdminReplyTicketListDTO[]>([])

const loadingGetData = ref(true)
const loadingDeleteItem = ref(false)
const loadingSendEmail = ref(false)
const loadingCreateTicket = ref(false)
const loadingGetEmailAddresses = ref(false)
const loadingGetItemById = ref(false)
const loadingReplyTicket = ref(false)
const loadingGetReplyList = ref(false)
const loadingGenerateAiResponse = ref(false)

export const useContactUsAdmin = () => {
  const { $toast } = useNuxtApp()

  const handleError = (err: unknown, fallbackMessage = '') => {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || fallbackMessage)
    }
    else if (fallbackMessage) {
      $toast.error(fallbackMessage)
    }
  }

  const getData = async (params: GetAdminContactUsParams) => {
    loadingGetData.value = true

    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': params.pageSize,
        'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      }

      if (params.status !== 'All') {
        query['PagingDto.SearchFilter.phrase'] = params.status === 'Read'
        query['PagingDto.SearchFilter.column'] = 'isReadByAdmin'
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminContactUsDTO>>
      >('/api/v2/admin/tickets', query)

      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
      }
    }
    catch (err: unknown) {
      handleError(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const deleteItem = async (id: string | number) => {
    loadingDeleteItem.value = true

    try {
      const response = await useApiService.remove<ApiResult<boolean>>(
        `/api/v2/admin/tickets/${id}`,
      )

      if (response.succeeded) {
        $toast.success('Message deleted successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

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

  const sendEmail = async (payload: AdminContactUsComposeMailDTO) => {
    loadingSendEmail.value = true

    try {
      const response = await useApiService.post<ApiResult<unknown>>(
        '/api/v2/admin/emails',
        payload as unknown as Record<string, string>,
      )

      if (response.succeeded) {
        $toast.success('Message Send Successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingSendEmail.value = false
    }
  }

  const createTicket = async (payload: AdminContactUsCreateTicketDTO) => {
    loadingCreateTicket.value = true

    try {
      const formData = new FormData()

      formData.append('From', payload.from)
      formData.append('ReceiverName', payload.receiverName)
      formData.append('ReceiverEmail', payload.receiverEmail)
      formData.append('Subject', payload.subject)
      formData.append('Body', payload.body)

      const response = await useApiService.post<ApiResult<unknown>>(
        '/api/v2/admin/tickets',
        formData,
      )

      if (response.succeeded) {
        $toast.success('Ticket Create Successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingCreateTicket.value = false
    }
  }

  const getEmailAddresses = async () => {
    loadingGetEmailAddresses.value = true

    try {
      const response = await useApiService.get<ApiResult<string[]>>(
        '/api/v2/admin/emails/addresses',
      )

      if (response.succeeded) {
        emailAddresses.value = response.data ?? []
      }
      else {
        $toast.error('The operation get data failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: [],
      }
    }
    finally {
      loadingGetEmailAddresses.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminContactUsDetailDTO>>(
        `/api/v2/admin/tickets/${id}`,
      )

      if (!response.succeeded || !response.data) {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

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

  const replyTicket = async (id: string | number, payload: AdminContactUsReplyDTO) => {
    loadingReplyTicket.value = true

    try {
      const formData = new FormData()

      formData.append('From', payload.from)
      formData.append('Body', payload.body)

      const response = await useApiService.post<ApiResult<unknown>>(
        `/api/v2/admin/tickets/${id}/replys`,
        formData,
      )

      if (response.succeeded) {
        $toast.success('Reply Message Send Successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingReplyTicket.value = false
    }
  }

  const getReplyList = async (id: string | number) => {
    loadingGetReplyList.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminReplyTicketListDTO[]>>(
        `/api/v2/admin/tickets/${id}/replys`,
      )

      if (response.succeeded) {
        replyList.value = response.data ?? []
      }
      else {
        $toast.error('The operation get data failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: [],
      }
    }
    finally {
      loadingGetReplyList.value = false
    }
  }

  const generateAiResponse = async (payload: AdminContactUsAiPromptDTO) => {
    loadingGenerateAiResponse.value = true

    try {
      const response = await useApiService.post<AdminContactUsAiResponseDTO>(
        '/api/chatgpt',
        payload as unknown as Record<string, string>,
      )

      if (!response.response) {
        $toast.error('The operation failed. Please try again later.')
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      $toast.error(
        error.response?.data?.message
        || error.message
        || 'The operation failed. Please try again later.',
      )

      return {
        response: '',
      }
    }
    finally {
      loadingGenerateAiResponse.value = false
    }
  }

  return {
    loadingGetData,
    data,
    getData,
    totalCount,
    pageCount,
    deleteItem,
    loadingDeleteItem,
    sendEmail,
    loadingSendEmail,
    createTicket,
    loadingCreateTicket,
    getEmailAddresses,
    loadingGetEmailAddresses,
    emailAddresses,
    getItemById,
    loadingGetItemById,
    replyTicket,
    loadingReplyTicket,
    getReplyList,
    loadingGetReplyList,
    replyList,
    generateAiResponse,
    loadingGenerateAiResponse,
  }
}
