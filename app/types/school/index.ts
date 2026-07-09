export type SchoolContributionStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'

export interface AdminSchoolContributionBriefDTO {
  id: number
  status: SchoolContributionStatus
  comment: string
  creationUser: string
  creationDate: string
  identifierId: number
}
export interface AdminSchoolContributionNewDataDTO {
  name: string
  localName: string
  schoolType: string
  stateId: number
  zipCode: string
  address: string
  latitude: number
  longitude: number
  webSite: string
  localAddress: string
  cityId: number
  countryId: number
  email: string
  faxNumber: string
  phoneNumber: string
  quarter: string
  tags: number[]
  boards: number[]
  tuition: number
  description: string
}

export interface AdminSchoolContributionOldDataDTO {
  id: number
  name: string
  localName: string
  schoolType: string
  stateId: number
  stateTitle: string
  zipCode: string
  address: string
  localAddress: string
  webSite: string
  email: string
  latitude: number
  longitude: number
  cityId: number
  cityTitle: string
  countryId: number
  countryTitle: string
  faxNumber: string
  phoneNumber: string
  quarter: string
  slug: string
  osmId: number
  tags: {
    id: number
    name: string
    icon: string
    tagType: string
  }[]
  boards: {
    id: number
    code: number
    title: string
    icon: string

  }[]
  defaultImageUri: string
  tuition: number
  description: string
  viewCount: number
}

export interface AdminSchoolContributionDTO {
  newValues: AdminSchoolContributionNewDataDTO
  oldValues: AdminSchoolContributionOldDataDTO
}
export interface SchoolListDTO {
  id: number
  name: string
  slug: string

  cityTitle: string
  stateTitle: string
  countryTitle: string

  defaultImageUri: string

  distance: number
  score: number

  hasEmail: boolean
  hasPhone: boolean
  hasWebsite: boolean
  hasLocation: boolean

  lat: number
  long: number

  lastModifyDate: string

  reviewScore: number
  countryRank: number
  stateRank: number
  cityRank: number
}

export interface GetSchoolsParams {
  page: number
  pageSize: number

  countryId?: number | null
  stateId?: number | null
  cityId?: number | null

  latitude?: number | null
  longitude?: number | null
  radius?: number | null

  name?: string | null

  hasScore?: boolean | null
  hasImage?: boolean | null

  tuitionStart?: number | null
  tuitionEnd?: number | null

  boards?: number[] | null
}

export type AdminSchoolImageStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'
export type AdminSchoolImageFileType = 'SimpleImage' | string

export interface AdminSchoolImageDTO {
  id: number
  creationUser: string
  creationDate: string
  schoolId: number
  status: AdminSchoolImageStatus
  fileUri: string
  fileType: AdminSchoolImageFileType
  isDefault: boolean
}

export interface AdminSchoolImageDetailDTO {
  id: number
  schoolName: string
  schoolId: number
  fileUri: string
  fileType: AdminSchoolImageFileType
  isDefault: boolean
  tagId: number
  tagName: string
}

export interface GetAdminSchoolImageParams {
  page: number
  pageSize: number
  status: AdminSchoolImageStatus | ''
}
