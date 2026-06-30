import type { ApiResult,
  AppError, UploadFileDTO } from '@/types'

const loadingUploadFile = ref(false)

export const useUpload = () => {
  const { $toast } = useNuxtApp()

  const uploadFile = async (file: File) => {
    loadingUploadFile.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await useApiService.post<ApiResult<UploadFileDTO[]>>(
        '/api/v1/upload',
        formData,
      )
      if (response.status != 1) {
        $toast.error('Upload failed. Please try again.')
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
        message: 'Upload failed. Please try again.',
        data: [],
      }
    }
    finally {
      loadingUploadFile.value = false
    }
  }

  return {
    uploadFile,
  }
}
