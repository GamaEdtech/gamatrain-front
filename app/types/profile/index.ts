import type { ExperienceDTO, UserSubscriptionDTO } from '@/types'

export type OnlineStatus = 'Online' | 'ActiveRecently' | 'OnlineToday' | 'ActiveThisWeek' | 'ActiveThisMonth' | 'ActiveLongTimeAgo' | 'NewUser'

export interface ProfileDTO {
  profileView: number
  avatarUri: string
  registrationDate: string
  onlineStatus: OnlineStatus
  biography: string
  skills: string[]
  currentStatusSentence: string
  experiences: ExperienceDTO[]
  firstName: string
  lastName: string
  userRateLevel: string
}

export type Gender = 'Male' | 'Female' | 'Other'
export type ProfileVisibility = 'Private' | 'Public' | 'ConnectionsOnly'

export interface EditProfileDTO {
  countryId?: number
  stateId?: number
  cityId?: number
  schoolId?: number
  firstName?: string
  lastName?: string
  board?: number
  grade?: number
  group?: number
  walletId?: string
  biography?: string
  skills?: string[]
  currentStatusSentence?: string
  handle?: string
  gender?: Gender
  profileVisibility?: ProfileVisibility
  avatar?: File
}

export interface DeleteProfileDTO {
  username: string
  password: string
}

export interface ChangePasswordDTO {
  oldpass: string
  newpass: string
  repeat_newpass: string
}

export interface EditUsernameDTO {
  username: string
}

export interface DashboardProfileCompletionDTO {
  total: number
  num: number
  notComplete: string[]
}
export interface DashboardUnreadMessagesDTO {
  total: number
}

export interface DashboardStatsDTO {
  test: DashboardTestDTO
  file: DashboardFileDTO
  question: DashboardQuestionDTO
}

export interface DashboardTestDTO {
  total: number
}

export interface DashboardFileDTO {
  total: number
}

export interface DashboardQuestionDTO {
  total: number
}

export interface DashboardExamSuggestionsDTO {
  total: number
  participated: number
  lessons: DashboardLessonDTO[]
}

export interface DashboardLessonDTO {
  id: string
  title: string
  participated: number
  total: number
}

export interface UserDashboardDTO {
  coreId: number
  handle: string
  firstName: string
  lastName: string
  avatarUri: string
  phoneNumber: string
  gender: string
  roles: string[]
  points: number
  enabled: boolean
  cityId: number
  cityTitle: string
  schoolId: number
  schoolTitle: string
  board: number
  grade: number
  subscription: UserSubscriptionDTO
  scoreCheckInfo: string
}
export interface GetDashboardDataDTO {
  legacyDataAvailable: boolean
  user: UserDashboardDTO
  profileCompletion: DashboardProfileCompletionDTO
  unreadMessages: DashboardUnreadMessagesDTO
  stats: DashboardStatsDTO
  examSuggestions: DashboardExamSuggestionsDTO
}
