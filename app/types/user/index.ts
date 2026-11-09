import type { ExperienceDTO, ProfileVisibility, Gender } from '@/types'

export type Role = 'Admin' | 'Teacher' | 'Student' | 'Advisor' | 'Finance'
export type SystemClaims = 'AutoConfirmSchoolContribution' | 'AutoConfirmSchoolImage' | 'AutoConfirmSchoolComment' | 'AutoConfirmPost' | 'AutoConfirmRemoveSchoolImage' | 'AutoConfirmPostComment'

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
  roles?: Role[] | null
}
export interface AdminTokenDTO {
  token: string
  expirationTime: string
}
/** One node of the grantable-endpoint tree: area -> controller -> endpoint (only endpoints carry a value). */
export interface AdminPermissionNode {
  text: string | null
  value?: string | null
  hasPermission?: boolean
  items?: AdminPermissionNode[] | null
}
export interface AdminPermissionDTO {
  roles: Role[]
  systemClaims: SystemClaims[]
  permissions: AdminPermissionNode[]
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
  role?: Role | null
}

export interface SearchFilterUser {
  firstName: string
  lastName: string
  email: string
  referralId: string
  /** '' means every role. */
  role: Role | ''
}

export enum UserGroup {
  Student = 6,
  Teacher = 5,
}

export interface User {
  userName: string
  firstName: string
  lastName: string
  email?: string | null
  countryId: number
  cityId: number
  stateId: number
  schoolId: number
  referralId: string
  gender: Gender
  board: number
  grade: number
  group: number
  coreId: number
  avatarUri: string
  walletId: string
  profileUpdated: boolean
  roles: Role[]
  profileVisibility: ProfileVisibility
  biography: string
  skills: string[]
  currentStatusSentence: string
  userRateLevel: string
  experiences: ExperienceDTO[]
  handle: string
  orphanDate: string | null
}
