export type SchoolContributionStatus
  = | 'Draft'
    | 'Review'
    | 'Confirmed'
    | 'Rejected'
    | 'Deleted'

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

  hasEmail: boolean
  hasPhone: boolean
  hasWebsite: boolean
  hasLocation: boolean

  lat: number
  long: number

  lastModifyDate: string

  rating: number | null
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

  hasRating?: boolean | null
  hasImage?: boolean | null

  tuitionStart?: number | null
  tuitionEnd?: number | null

  boards?: number[] | null
}

export type AdminSchoolCommentStatus
  = | 'Draft'
    | 'Review'
    | 'Confirmed'
    | 'Rejected'
    | 'Deleted'

export interface AdminSchoolCommentDTO {
  id: number
  creationUser: string
  creationDate: string
  schoolId: number
  status: AdminSchoolCommentStatus
}

export interface AdminSchoolCommentDetailDTO {
  id: number
  schoolName: string
  schoolId: number
  comment: string
  artisticActivitiesRate: number
  behaviorRate: number
  classesQualityRate: number
  educationRate: number
  facilitiesRate: number
  itTrainingRate: number
  safetyAndHappinessRate: number
  tuitionRatioRate: number
  averageRate: number
}

export interface SearchFilterAdminSchoolComment {
  startDate: string
  endDate: string
  commenterEmail: string
  commenterName: string
  status: AdminSchoolCommentStatus | ''
}

export interface GetAdminSchoolCommentParams extends SearchFilterAdminSchoolComment {
  page: number
  pageSize: number
}

export type AdminSchoolImageStatus
  = | 'Draft'
    | 'Review'
    | 'Confirmed'
    | 'Rejected'
    | 'Deleted'
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

export type AdminSchoolImageIssueStatus
  = | 'Confirmed'
    | 'Rejected'
    | 'Deleted'
    | 'Review'

export interface AdminSchoolImageIssueDTO {
  id: number
  schoolId: number
  creationUser: string
  creationDate: string
  description: string
  fileType: string | null
  fileUri: string
  status: AdminSchoolImageIssueStatus
}

export interface AdminSchoolImageIssueDetailDTO {
  id: number
  schoolId: number
  schoolName: string
  fileUri: string
}

export interface GetAdminSchoolImageIssueParams {
  page: number
  pageSize: number
  status: AdminSchoolImageIssueStatus | ''
}

export interface GetAdminSchoolContributionParams {
  page: number
  pageSize: number
  status: string
  sort: string[]
}
