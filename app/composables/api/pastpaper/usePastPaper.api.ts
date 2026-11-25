import type {
  ApiResult,
  AppError,
  PastPaperCreateDTO,
  PastPaperEditDTO,
  PastPaperCreatePayloadDTO,
  PastPaperCreateResponseDTO,
  PastPaperEditResponseDTO,
  UploadFileDTO,
  PastPaperDetailDTO,
  PastPaperBriefDTO,
  ResponseListDTO,
  GetPastPaperParams,
} from '@/types'

const data = ref<PastPaperBriefDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const loadingFileLink = ref(false)
const NAME = 'Past Paper'
const BASE = '/api/v2/PastPapers/mine'

/**
 * The backend answers 200 with `succeeded`/`errors` (it forwards to gama-api, or answers itself once papers are
 * switched); the pages read gama-api's `status: 1` and its message, so give them that shape.
 */
const asLegacy = <T>(response: ApiResult<T>): ApiResult<T> & { message?: string } => ({
  ...response,
  status: response.succeeded ? 1 : 0,
  message: response.errors?.[0]?.message,
})

/**
 * A teacher's own papers. With `admin`, one paper's read, edit, delete and uploads go to the admin endpoints instead (any
 * paper, any status), so the same edit form serves admin / past papers.
 */
export const usePastPaper = (options: { admin?: boolean } = {}) => {
  const paperBase = options.admin ? '/api/v2/admin/pastpapers' : BASE
  const { $toast } = useNuxtApp()

  const getData = async (params: GetPastPaperParams) => {
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

      const response = asLegacy(await useApiService.get<
        ApiResult<ResponseListDTO<PastPaperBriefDTO>>
      >(BASE, query))

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

  const addItem = async (item: PastPaperCreateDTO) => {
    loadingAddItem.value = true
    const params: PastPaperCreatePayloadDTO = {
      section: item.board,
      base: item.grade,
      lesson: item.subject,
      test_type: item.classification,
      topics: Array.isArray(item.topics) ? item.topics.map(Number) : [],
      answer_type: item.answer_type,
      level: item.level,
      holding_level: item.holding_level,
      title: item.title,
      description: item.description,
      edu_year: item.edu_year,
      edu_month: item.edu_month,
      ...(item.variant ? { variant: item.variant } : {}),
      files: item.files ?? [],
      state: item.state,
      area: item.area,
      school: item.school,
    }

    try {
      const response = asLegacy(await useApiService.post<
        ApiResult<PastPaperCreateResponseDTO>
      >(
        BASE,
        params as unknown as Record<string, never>,
      ))

      if (response.data?.id === 0 && response.data.repeated) {
        $toast.info(`This ${NAME} is repetitive.`)
      }
      else if (response.status === 1) {
        $toast.success(`${NAME} Added successfully!`)
      }
      else {
        $toast.error(response.message || `The operation failed. Please try again later.`)
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error(`The operation failed. Please try again later.`)
      }

      return {
        succeeded: false,
        status: 0,
        errors: [
          {
            message: 'The operation failed. Please try again later.',
            code: '',
            reference: '',
            info: '',
            value: '',
          },
        ],
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
      const response = asLegacy(await useApiService.get<
        ApiResult<PastPaperDetailDTO>
      >(`${paperBase}/${id}`))
      if (!response.succeeded && response.message) {
        $toast.error(response.message)
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
        status: 0,
        data: null,
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const encodeEditPayload = (item: PastPaperEditDTO) => {
    const params: Partial<PastPaperCreatePayloadDTO> = {}

    if (item.board !== undefined) params.section = item.board
    if (item.grade !== undefined) params.base = item.grade
    if (item.subject !== undefined) params.lesson = item.subject
    if (item.classification !== undefined) params.test_type = item.classification
    if (item.topics !== undefined) params.topics = Array.isArray(item.topics) ? item.topics.map(Number) : []
    if (item.answer_type !== undefined) params.answer_type = item.answer_type
    if (item.level !== undefined) params.level = item.level
    if (item.holding_level !== undefined) params.holding_level = item.holding_level
    if (item.title !== undefined) params.title = item.title
    if (item.description !== undefined) params.description = item.description
    if (item.edu_year !== undefined) params.edu_year = item.edu_year
    if (item.edu_month !== undefined) params.edu_month = item.edu_month
    if (item.variant !== undefined) params.variant = item.variant
    if (item.files !== undefined && item.files.length > 0) params.files = item.files
    if (item.state !== undefined) params.state = item.state
    if (item.area !== undefined) params.area = item.area
    if (item.school !== undefined) params.school = item.school

    return params
  }

  const editItem = async (id: string | number, item: PastPaperEditDTO) => {
    loadingEditItem.value = true
    const params = encodeEditPayload(item)

    try {
      const response = asLegacy(await useApiService.put<
        ApiResult<PastPaperEditResponseDTO>
      >(
        `${paperBase}/${id}`,
        params as unknown as Record<string, never>,
      ))

      if (response.status === 1) {
        // A limited edit (the paper is past review) or one that sends it back to review says so.
        $toast.success(response.data?.message || `${NAME} Edited successfully!`)
      }
      else {
        $toast.error(response.message || `The operation failed. Please try again later.`)
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error(`The operation failed. Please try again later.`)
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
      const response = asLegacy(await useApiService.remove<ApiResult<boolean>>(
        `${paperBase}/${id}`,
      ))

      if (response.status === 1) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        $toast.error(response.message || `The operation failed. Please try again later.`)
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      else {
        $toast.error(`The operation failed. Please try again later.`)
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

  /**
   * Uploads one of the paper's files; the add or edit then names it by the returned key. `kind` 'pdf' marks the
   * question PDF, whose first page becomes the paper's picture.
   */
  const uploadItemFile = async (file: File, kind?: 'pdf') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = asLegacy(await useApiService.post<ApiResult<UploadFileDTO[]>>(
        `${paperBase}/uploads${kind ? `?kind=${kind}` : ''}`,
        formData,
      ))
      if (response.status != 1) {
        $toast.error(response.message || 'Upload failed. Please try again.')
      }

      return response
    }
    catch {
      $toast.error('Upload failed. Please try again.')
      return { succeeded: false, status: 0, data: [] as UploadFileDTO[] }
    }
  }

  /**
   * A short signed link to one of the paper's stored files, to open what was uploaded: the teacher's own paper, or with
   * `admin` any paper (the review link). Any status, nothing charged. `fileId` is the file's id in the paper's `files`;
   * with `pending`, the file of the edit waiting for review (a new file of it has a negative id).
   */
  const getFileLink = async (id: string | number, fileId: number, pending = false) => {
    loadingFileLink.value = true
    try {
      const response = await useApiService.get<ApiResult<{ url: string }>>(
        `${paperBase}/${id}/files/${fileId}`,
        pending ? { pending: true } : undefined,
      )
      if (response.succeeded && response.data?.url) return response.data.url
      $toast.error(response.errors?.[0]?.message === 'fileNotExist' ? 'This file is not available.' : 'The file could not be opened.')
    }
    catch {
      $toast.error('The file could not be opened.')
    }
    finally {
      loadingFileLink.value = false
    }
    return null
  }

  return {
    getFileLink,
    loadingFileLink,
    uploadItemFile,
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
