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
