import type {
  ApiResult,
  AppError,
  BlogUserDTO,
  BlogUserBreifDTO,
  BlogCreateDTO,
  BlogEditDTO,
  GetBlogUserParams,
  ResponseListDTO,
} from '@/types'

const data = ref<BlogUserBreifDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingValidateSlug = ref(false)
const loadingSaveSlug = ref(false)
const loadingCreateBlog = ref(false)
const loadingGetBlog = ref(false)
const loadingEditBlog = ref(false)

export const useBlog = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetBlogUserParams) => {
    const { page, pageSize } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'Status': 'Confirmed',
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<BlogUserBreifDTO>>
      >('/api/v2/blogs/contributions', query)
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
      >('/api/v2/blogs/slugs/validate', query)
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
      >('/api/v2/blogs/slugs/generate', query)
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

  const createBlug = async (blog: BlogCreateDTO) => {
    loadingCreateBlog.value = true
    try {
      const formData = new FormData()
      formData.append('Title', blog.title)
      formData.append('Body', blog.body)
      formData.append('Summary', blog.summary || '')
      formData.append('VisibilityType', blog.visibilityType)

      let publishDate = new Date().toISOString()
      if (blog.publishDate === 'Schedule') {
      // Send the selected scheduled date, preserving the selected date without timezone issues
        const selectedDate = new Date(blog.scheduledDate!)
        // Set time to noon to avoid timezone conversion issues
        selectedDate.setHours(12, 0, 0, 0)
        publishDate = selectedDate.toISOString()
      }
      formData.append('PublishDate', publishDate)
      formData.append('Slug', blog.slug)
      formData.append('Draft', blog.draft)

      blog.tags.forEach((tagId) => {
        formData.append('Tags[]', tagId.toString())
      })

      if (blog.keywords && blog.keywords.length > 0) {
        formData.append('Keywords', blog.keywords.join(','))
      }
      formData.append('Image', blog.image)
      if (blog.podcast) {
        formData.append('Podcast', blog.podcast)
      }

      blog.localizedValues?.forEach((item, index) => {
        formData.append(`LocalizedValues[${index}].languageId`, item.languageId.toString())
        formData.append(`LocalizedValues[${index}].title`, item.title)
        formData.append(`LocalizedValues[${index}].summary`, item.summary)
        formData.append(`LocalizedValues[${index}].body`, item.body)
      })

      const response = await useApiService.post<
        ApiResult<string>
      >('/api/v2/blogs/contributions', formData)
      if (response.succeeded) {
        $toast.success('Blog created successfully!')
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
      loadingCreateBlog.value = false
    }
  }

  const editBlug = async (blog: BlogEditDTO, id: string) => {
    loadingEditBlog.value = true
    try {
      const formData = new FormData()
      formData.append('Title', blog.title)
      formData.append('Body', blog.body)
      formData.append('Summary', blog.summary || '')
      formData.append('VisibilityType', blog.visibilityType)

      let publishDate = new Date().toISOString()
      if (blog.publishDate === 'Schedule') {
      // Send the selected scheduled date, preserving the selected date without timezone issues
        const selectedDate = new Date(blog.scheduledDate!)
        // Set time to noon to avoid timezone conversion issues
        selectedDate.setHours(12, 0, 0, 0)
        publishDate = selectedDate.toISOString()
      }
      formData.append('PublishDate', publishDate)
      formData.append('Slug', blog.slug)
      formData.append('Draft', blog.draft)

      blog.tags.forEach((tagId) => {
        formData.append('Tags[]', tagId.toString())
      })

      if (blog.keywords && blog.keywords.length > 0) {
        formData.append('Keywords', blog.keywords.join(','))
      }
      formData.append('Image', blog.image)

      if (blog.removePodcast) {
        formData.append('RemovePodcast', 'true')
        formData.append('Podcast', '')
      }

      if (blog.podcast) {
        formData.append('Podcast', blog.podcast)
      }

      if (blog.localizedValues?.length && blog.localizedValues?.length > 0) {
        blog.localizedValues.forEach((item, index) => {
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
      >(`/api/v2/blogs/contributions/${id}`, formData)
      if (response.succeeded) {
        $toast.success('Blog Edited successfully!')
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
      loadingEditBlog.value = false
    }
  }

  const getBlog = async (id: string) => {
    loadingGetBlog.value = true
    try {
      const response = await useApiService.get<
        ApiResult<BlogUserDTO>
      >(`/api/v2/blogs/contributions/${id}`)
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
      loadingGetBlog.value = false
    }
  }

  return { loadingGetData, data, getData, totalCount, pageCount, validateSlug, loadingValidateSlug, saveSlug, loadingSaveSlug, createBlug, loadingCreateBlog, getBlog, loadingGetBlog, editBlug, loadingEditBlog }
}
