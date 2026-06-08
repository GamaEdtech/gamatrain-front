import type { ExperienceDTO } from '@/types'

export type OnlineStatus = 'Online' | 'ActiveRecently' | 'OnlineToday' | 'ActiveThisWeek' | 'ActiveThisMonth' | 'ActiveLongTimeAgo' | 'NewUser'

export interface ProfileDTO {
  profileView: number
  avatar: string
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
