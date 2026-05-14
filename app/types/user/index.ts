export interface AdminUserDTO {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  enabled: boolean
  registrationDate: string
  referralId: string
}
export interface AdminTokenDTO {
  token: string
  expirationTime: string
}
export interface AdminPermissionDTO {
  roles: string[]
  systemClaims: string[]
  permissions: {
    value: string
    text: string
    items: string[]
    hasPermission: boolean
  }[]
}
export interface AddUserDTO {
  username: string
  password: string
  confirmPassword: string
  email: string
  firstName: string
  lastName: string
}
export interface EditUserDTO {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}
export interface GetUsersParams {
  page: number
  pageSize: number
  hasReferral?: boolean | null
  firstName: string
  lastName: string
  email: string
  referralId: string
}

export interface SearchFilterUser {
  firstName: string
  lastName: string
  email: string
  referralId: string
}
