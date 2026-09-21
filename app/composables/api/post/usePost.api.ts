import type {
  ApiResult,
  AppError,
  PostUserDTO,
  PostUserBreifDTO,
  PostCreateDTO,
  PostEditDTO,
  GetPostUserParams,
  ResponseListDTO,
} from '@/types'

const data = ref<PostUserBreifDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingValidateSlug = ref(false)
const loadingSaveSlug = ref(false)
const loadingCreatePost = ref(false)
const loadingGetPost = ref(false)
const loadingEditPost = ref(false)

export const usePost = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetPostUserParams) => {
    const { page, pageSize, status } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        // Status is optional on the backend - omitting it (null, dropped from the query string) returns
        // every status, which is the desired default so users see all their posts, not just
        // Confirmed ones.
        'Status': status ?? null,
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<PostUserBreifDTO>>
      >('/api/v2/posts/mine', query)
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

  const validateSlug = async (slug: string) => {
    loadingValidateSlug.value = true
    try {
      const query = {
        slug,
      }
      const response = await useApiService.get<
        ApiResult<boolean>
      >('/api/v2/posts/slugs/validate', query)
      if (response.data) {
        $toast.success('The selected slug is ready, you can save it.')
        return true
      }
      else {
        $toast.error('Slug already exists.')
        return false
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return false
    }
    finally {
      loadingValidateSlug.value = false
    }
  }

  const saveSlug = async (slug: string) => {
    loadingSaveSlug.value = true
    try {
      const query = {
        title: slug,
      }
      const response = await useApiService.get<
        ApiResult<string>
      >('/api/v2/posts/slugs/generate', query)
      if (response.succeeded) {
        $toast.success('Slug saved successfully!')
        return response
      }
      else {
        $toast.error('The operation failed. Please try again later.')
        return response
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        data: '',
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingSaveSlug.value = false
    }
  }

  const createPost = async (post: PostCreateDTO) => {
    loadingCreatePost.value = true
    try {
      const formData = new FormData()
      formData.append('Title', post.title)
      formData.append('Body', post.body)
      formData.append('Summary', post.summary || '')
      formData.append('VisibilityType', post.visibilityType)

      let publishDate = new Date().toISOString()
      if (post.publishDate === 'Schedule') {
      // Send the selected scheduled date, preserving the selected date without timezone issues
        const selectedDate = new Date(post.scheduledDate!)
        // Set time to noon to avoid timezone conversion issues
        selectedDate.setHours(12, 0, 0, 0)
        publishDate = selectedDate.toISOString()
      }
      formData.append('PublishDate', publishDate)
      formData.append('Slug', post.slug)
      formData.append('Draft', post.draft)

      post.tags.forEach((tagId) => {
        formData.append('Tags[]', tagId.toString())
      })

      if (post.keywords && post.keywords.length > 0) {
        formData.append('Keywords', post.keywords.join(','))
      }
      formData.append('Image', post.image)
      if (post.podcast) {
        formData.append('Podcast', post.podcast)
      }

      post.localizedValues?.forEach((item, index) => {
        formData.append(`LocalizedValues[${index}].languageId`, item.languageId.toString())
        formData.append(`LocalizedValues[${index}].title`, item.title)
        formData.append(`LocalizedValues[${index}].summary`, item.summary)
        formData.append(`LocalizedValues[${index}].body`, item.body)
      })

      const response = await useApiService.post<
        ApiResult<string>
      >('/api/v2/posts', formData)
      if (response.succeeded) {
        $toast.success('Post created successfully!')
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
        data: '',
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingCreatePost.value = false
    }
  }

  const editPost = async (post: PostEditDTO, id: string, admin = false) => {
    loadingEditPost.value = true
    try {
      const formData = new FormData()
      formData.append('Title', post.title)
      formData.append('Body', post.body)
      formData.append('Summary', post.summary || '')
      formData.append('VisibilityType', post.visibilityType)

      let publishDate = new Date().toISOString()
      if (post.publishDate === 'Schedule') {
      // Send the selected scheduled date, preserving the selected date without timezone issues
        const selectedDate = new Date(post.scheduledDate!)
        // Set time to noon to avoid timezone conversion issues
        selectedDate.setHours(12, 0, 0, 0)
        publishDate = selectedDate.toISOString()
      }
      // An edit that leaves "Immediately" selected must not move an already-published post's date to now. The API
      // keeps the stored date when PublishDate is omitted (and returns dates as MM/dd/yyyy, which it cannot parse
      // back from a form), so in that case the field is simply not sent.
      if (!(post.keepPublishDate && post.publishDate !== 'Schedule')) {
        formData.append('PublishDate', publishDate)
      }
      formData.append('Slug', post.slug)
      formData.append('Draft', post.draft)

      post.tags.forEach((tagId) => {
        formData.append('Tags[]', tagId.toString())
      })

      if (post.keywords && post.keywords.length > 0) {
        formData.append('Keywords', post.keywords.join(','))
      }
      formData.append('Image', post.image)

      if (post.removePodcast) {
        formData.append('RemovePodcast', 'true')
        formData.append('Podcast', '')
      }

      if (post.podcast) {
        formData.append('Podcast', post.podcast)
      }

      if (post.localizedValues?.length && post.localizedValues?.length > 0) {
        post.localizedValues.forEach((item, index) => {
          formData.append(`LocalizedValues[${index}].languageId`, item.languageId.toString())
          formData.append(`LocalizedValues[${index}].title`, item.title)
          formData.append(`LocalizedValues[${index}].summary`, item.summary)
          formData.append(`LocalizedValues[${index}].body`, item.body)
        })
      }
      else {
        formData.append('LocalizedValues', '[]')
      }

      const response = await useApiService.put<
        ApiResult<string>
      >(`/api/v2/${admin ? 'admin/' : ''}posts/${id}`, formData)
      if (response.succeeded) {
        $toast.success('Post Edited successfully!')
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
        data: '',
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingEditPost.value = false
    }
  }

  const getPost = async (id: string, admin = false) => {
    loadingGetPost.value = true
    try {
      const response = await useApiService.get<
        ApiResult<PostUserDTO>
      >(admin ? `/api/v2/admin/posts/${id}` : `/api/v2/posts/mine/${id}`)
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        data: undefined,
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingGetPost.value = false
    }
  }

  return { loadingGetData, data, getData, totalCount, pageCount, validateSlug, loadingValidateSlug, saveSlug, loadingSaveSlug, createPost, loadingCreatePost, getPost, loadingGetPost, editPost, loadingEditPost }
}
