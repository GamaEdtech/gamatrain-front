import type {
  ApiResult,
  AppError,
  ProfileDTO,
  EditProfileDTO,
  DeleteProfileDTO,
} from '@/types'

const loadingGetItemById = ref(false)
const loadingEditItem = ref(false)
const loadingDeleteItem = ref(false)
const loadingCancelDeleteItem = ref(false)
const loadingChangeGroup = ref(false)
const NAME = 'Profile'

export const useProfile = () => {
  const { $toast } = useNuxtApp()
  const auth = useAuth()

  const getItemById = async (id: string) => {
    loadingGetItemById.value = true
    try {
      const response = await useApiService.get<
        ApiResult<ProfileDTO>
      >(`/api/v2/identities/profiles/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${auth.getUserToken()}`,
        },
      })

      return response
    }
    catch (err: unknown) {
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

  const deleteItem = async (item: DeleteProfileDTO) => {
    try {
      loadingDeleteItem.value = true
      const response = await useApiService.remove<
        ApiResult<boolean>
      >(
        '/api/v2/identities/profiles',
        { ...item },
      )
      if (response.succeeded) {
        $toast.success('Permanently delete your account and related data. You’ll have 7 days to cancel this request before your account is permanently deleted.')
      }
      else {
        if (response.errors && response.errors.length > 0) {
          $toast.error(response.errors[0].message || '')
        }
        else {
          $toast.error('The operation failed. Please try again later.')
        }
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
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  const cancelDeleteItem = async (item: DeleteProfileDTO) => {
    try {
      loadingCancelDeleteItem.value = true
      const response = await useApiService.patch<
        ApiResult<boolean>
      >(
        '/api/v2/identities/profiles/recover',
        { ...item },
      )
      if (response.succeeded) {
        $toast.success('Canceling profile deletion was successful.')
      }
      else {
        if (response.errors && response.errors.length > 0) {
          $toast.error(response.errors[0].message || '')
        }
        else {
          $toast.error('The operation failed. Please try again later.')
        }
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
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingCancelDeleteItem.value = false
    }
  }

  const changeGroup = async (group: number) => {
    try {
      loadingChangeGroup.value = true
      const response = await useApiService.post<
        ApiResult<boolean>
      >(
        '/api/v1/users/group',
        { group },
      )
      if (response?.status === 1) {
        $toast.success('Update group was successful.')
      }
      else {
        if (response.errors && response.errors.length > 0) {
          $toast.error(response.errors[0].message || '')
        }
        else {
          $toast.error('The operation failed. Please try again later.')
        }
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        status: 0,
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingChangeGroup.value = false
    }
  }

  return {
    getItemById, loadingGetItemById, editItem, loadingEditItem, deleteItem, loadingDeleteItem, cancelDeleteItem, loadingCancelDeleteItem, changeGroup, loadingChangeGroup,
  }
}
