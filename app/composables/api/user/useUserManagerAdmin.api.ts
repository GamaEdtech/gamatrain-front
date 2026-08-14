import type {
  ApiResult,
  ResponseListDTO,
  AdminUserDTO,
  AdminTokenDTO,
  AdminPermissionDTO,
  AddUserDTO,
  EditUserDTO,
  GetUsersParams,
  Role,
  SystemClaims,
} from '@/types'

const data = ref<AdminUserDTO[]>()
const loadingGetData = ref(true)
const totalCount = ref(0)
const pageCount = ref(0)
const loadingDeleteItem = ref(false)
const loadingToggleStatus = ref(false)
const loadingAddItem = ref(false)
const loadingGetItemById = ref(false)
const loadingEditItem = ref(false)
const loadingEditPassword = ref(false)
const loadingGetToken = ref(false)
const tokenInfo = ref({
  token: '',
  expirationTime: '',
})
const loadingDeleteToken = ref(false)
const loadingGenerateToken = ref(false)
const loadingGetPermission = ref(false)
const loadingEditPermission = ref(false)
const permission = ref<AdminPermissionDTO>({
  roles: [],
  systemClaims: [],
  permissions: [],
})

export const useUserManagerAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetUsersParams) => {
    const { page, pageSize, hasReferral, firstName, lastName, email, referralId } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'HasReferral': hasReferral ?? null,
        'FirstName': firstName,
        'LastName': lastName,
        'Email': email,
        'ReferralId': referralId,
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminUserDTO>>
      >('/api/v2/admin/identities', query)
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
    }
    catch (err: unknown) {
      data.value = []
      totalCount.value = 0
      pageCount.value = 0
      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<AdminUserDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string) => {
    loadingGetItemById.value = true
    try {
      const response = await useApiService.get<
        ApiResult<AdminUserDTO>
      >(`/api/v2/admin/identities/${id}`)

      if (response.succeeded && response.data) {
        return response
      }

      handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminUserDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const deleteItem = async (id: string) => {
    try {
      loadingDeleteItem.value = true
      const response = await useApiService.remove<
        ApiResult<boolean>
      >(
        `/api/v2/admin/identities/${id}`,
      )
      if (response.succeeded) {
        $toast.success('User deleted successfully!')
      }
      else {
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      loadingToggleStatus.value = true
      const response = await useApiService.patch<
        ApiResult<boolean>
      >(
        `/api/v2/admin/identities/${id}/toggle`,
        {},
      )
      if (response.succeeded) {
        $toast.success('User status change successfully!')
      }
      else {
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingToggleStatus.value = false
    }
  }

  const addItem = async (user: AddUserDTO) => {
    try {
      loadingAddItem.value = true
      const params = {
        Username: user.username,
        Password: user.password,
        ConfirmPassword: user.confirmPassword,
        Email: user.email,
        PhoneNumber: '1234566',
        FirstName: user.firstName,
        LastName: user.lastName,
        AllowedIpAddressesList: [],
      }
      const response = await useApiService.post<
        ApiResult<boolean>
      >(
        '/api/v2/admin/identities',
        undefined,
        {
          params,
        },
      )
      if (response.succeeded) {
        $toast.success('User Added successfully!')
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const editItem = async (user: EditUserDTO, id: string) => {
    try {
      loadingEditItem.value = true
      const params = {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: null,
        allowedIpAddressesList: [],
      }
      const response = await useApiService.put<
        ApiResult<boolean>
      >(
        `/api/v2/admin/identities/${id}`,
        params,
      )
      if (response.succeeded) {
        $toast.success('User Edited successfully!')
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingEditItem.value = false
    }
  }

  const editPassword = async (password: string, confirmPassword: string, id: string) => {
    try {
      loadingEditPassword.value = true
      const params = {
        newPassword: password,
        confirmNewPassword: confirmPassword,
      }
      const response = await useApiService.put<
        ApiResult<boolean>
      >(
        `/api/v2/admin/identities/${id}/reset-password`,
        params,
      )
      if (response.succeeded) {
        $toast.success('User Password Edited successfully!')
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingEditPassword.value = false
    }
  }

  const getToken = async (id: string) => {
    loadingGetToken.value = true
    try {
      const response = await useApiService.get<
        ApiResult<AdminTokenDTO>
      >(`/api/v2/admin/identities/${id}/token`)

      if (response.succeeded && response.data) {
        tokenInfo.value.token = response.data.token
      }
      else {
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminTokenDTO>(err)
    }
    finally {
      loadingGetToken.value = false
    }
  }

  const deleteToken = async (id: string) => {
    try {
      loadingDeleteToken.value = true
      const response = await useApiService.remove<
        ApiResult<boolean>
      >(
        `/api/v2/admin/identities/${id}/token`,
      )
      if (response.succeeded) {
        $toast.success('User Token deleted successfully!')
        tokenInfo.value = {
          token: '',
          expirationTime: '',
        }
      }
      else {
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingDeleteToken.value = false
    }
  }

  const generateToken = async (id: string) => {
    loadingGenerateToken.value = true
    try {
      const response = await useApiService.post<
        ApiResult<AdminTokenDTO>
      >(`/api/v2/admin/identities/${id}/token`)

      if (response.succeeded && response.data) {
        tokenInfo.value = response.data
      }
      else {
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminTokenDTO>(err)
    }
    finally {
      loadingGenerateToken.value = false
    }
  }

  const getPermission = async (id: string) => {
    loadingGetPermission.value = true
    try {
      const response = await useApiService.get<
        ApiResult<AdminPermissionDTO>
      >(`/api/v2/admin/identities/${id}/permissions`)

      if (response.succeeded && response.data) {
        permission.value = response.data
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminPermissionDTO>(err)
    }
    finally {
      loadingGetPermission.value = false
    }
  }

  const editPermission = async (roles: Role[], systemClaims: SystemClaims[], id: string) => {
    try {
      loadingEditPermission.value = true
      const params = {
        roles,
        systemClaims,
      }
      const response = await useApiService.put<
        ApiResult<boolean>
      >(
        `/api/v2/admin/identities/${id}/permissions`,
        params,
      )
      if (response.succeeded) {
        $toast.success('User Role Edited successfully!')
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingEditPermission.value = false
    }
  }

  return { loadingGetData, data, getData, totalCount, pageCount, deleteItem, loadingDeleteItem, toggleStatus, loadingToggleStatus, addItem, loadingAddItem, getItemById, loadingGetItemById, editItem, loadingEditItem, editPassword, loadingEditPassword,
    loadingGetToken, loadingDeleteToken, loadingGenerateToken, getToken, deleteToken, generateToken, tokenInfo, loadingGetPermission, permission, getPermission, editPermission, loadingEditPermission,
  }
}
