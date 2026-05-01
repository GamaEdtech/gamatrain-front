import type {
  ApiResult,
  AppError,
  // ResponseListDTO,
} from '~/types/api'

const loadingValidateSlug = ref(false)
const loadingSaveSlug = ref(false)

export const useBlog = () => {
  const { $toast } = useNuxtApp()

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

  return { validateSlug, loadingValidateSlug, saveSlug, loadingSaveSlug }
}
