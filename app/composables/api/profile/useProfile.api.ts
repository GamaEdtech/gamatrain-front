import type {
  ApiResult,
  AppError,
  ProfileDTO,
  EditProfileDTO,
} from '@/types'

const loadingGetItemById = ref(false)
const loadingEditItem = ref(false)
const NAME = 'Profile'

export const useProfile = () => {
  const { $toast } = useNuxtApp()

  const getItemById = async (id: string) => {
    loadingGetItemById.value = true
    try {
      const response = await useApiService.get<
        ApiResult<ProfileDTO>
      >(`/api/v2/identities/profiles/${id}`)

      return response
    }
    catch (err: unknown) {
      console.log('error', err)
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const editItem = async (item: EditProfileDTO) => {
    loadingEditItem.value = true

    try {
      const formData = new FormData()

      if (item.cityId !== undefined) {
        formData.append(
          'CityId',
          item.cityId ? String(item.cityId) : '',
        )
      }

      if (item.schoolId !== undefined) {
        formData.append(
          'SchoolId',
          item.schoolId ? String(item.schoolId) : '',
        )
      }

      if (item.board !== undefined) {
        formData.append(
          'Board',
          item.board ? String(item.board) : '',
        )
      }

      if (item.grade !== undefined) {
        formData.append(
          'Grade',
          item.grade ? String(item.grade) : '',
        )
      }

      if (item.walletId !== undefined) {
        formData.append(
          'WalletId',
          item.walletId || '',
        )
      }

      if (item.biography !== undefined) {
        formData.append(
          'Biography',
          item.biography || '',
        )
      }

      if (item.currentStatusSentence !== undefined) {
        formData.append(
          'CurrentStatusSentence',
          item.currentStatusSentence || '',
        )
      }

      if (item.skills !== undefined) {
        if (item.skills.length) {
          item.skills.forEach((skill) => {
            formData.append('Skills', skill)
          })
        }
        else {
          formData.append('Skills', '')
        }
      }

      if (item.firstName) {
        formData.append('FirstName', item.firstName)
      }

      if (item.lastName) {
        formData.append('LastName', item.lastName)
      }

      if (item.group) {
        formData.append('Group', String(item.group))
      }

      if (item.handle) {
        formData.append('Handle', item.handle)
      }

      if (item.gender) {
        formData.append('Gender', item.gender)
      }

      if (item.profileVisibility) {
        formData.append(
          'ProfileVisibility',
          item.profileVisibility,
        )
      }

      if (item.avatar) {
        formData.append('Avatar', item.avatar)
      }

      const response = await useApiService.put<
        ApiResult<boolean>
      >(
        '/api/v2/identities/profiles',
        formData,
      )

      if (response.succeeded) {
        $toast.success(`${NAME} edited successfully!`)
      }
      else {
        $toast.error(
          'The operation failed. Please try again later.',
        )
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
      else {
        $toast.error(
          'The operation failed. Please try again later.',
        )
      }

      return {
        succeeded: false,
        message:
        'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingEditItem.value = false
    }
  }

  return {
    getItemById, loadingGetItemById, editItem, loadingEditItem,
  }
}
