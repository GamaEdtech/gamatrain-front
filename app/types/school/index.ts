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
  tags: {
    id: number
    name: string
    icon: string
    tagType: string
  }[]
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

export interface AdminSchoolContributionCommentDTO {
  comment: string | null
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
export interface AdminSchoolContributionDTO {
  newValues: AdminSchoolContributionNewDataDTO
  oldValues: AdminSchoolContributionOldDataDTO
  /** Photo sent with the contribution; added to the school on approval. */
  imageUri: string | null
  isDefaultImage: boolean
  /** Comment and ratings sent with the contribution; posted on approval. */
  comment: AdminSchoolContributionCommentDTO | null
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

  /** School type name (Public, Private, ...), when known. */
  schoolType?: string | null
  /** How many parents rated the school. */
  reviewCount?: number
  /** Facility tag ids (see the facets' tags), e.g. Transport Services for a school bus. */
  tagIds?: number[]
}

/** Counts behind the school finder's filters, for the current filters (GET schools/facets). */
export interface SchoolFacetsDTO {
  total: number
  withImage: number
  withRating: number
  withTuition: number
  schoolTypes: { schoolType: string | null, count: number }[]
  tags: { id: number, name: string, icon: string | null, count: number }[]
  regionLevel: 'country' | 'state' | 'city' | null
  regions: { id: number, title: string, count: number }[]
}

/** One web-map tile of the school finder map (GET schools/map/{z}/{x}/{y}). */
export interface SchoolMapTileDTO {
  total: number
  clusters: { lat: number, lng: number, count: number }[]
  schools: SchoolMapPointDTO[]
}

export interface SchoolMapPointDTO {
  id: number
  name: string
  slug: string
  lat: number
  lng: number
  rating: number | null
  reviewCount: number
  hasImage: boolean
  /** The school's photo, when it has one. */
  imageUri?: string | null
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

export type AdminSchoolIssueStatus
  = | 'Confirmed'
    | 'Rejected'
    | 'Deleted'
    | 'Review'

// A user-reported "something's wrong with this school" issue - GET/PATCH admin/schools/issues/contributions/*.
// Unlike image issues, there's no separate get-by-id endpoint: the list response already carries
// everything the review modal needs (including the resolved schoolName).
export interface AdminSchoolIssueDTO {
  id: number
  creationUser: string
  creationDate: string
  schoolId: number
  schoolName: string | null
  status: AdminSchoolIssueStatus
  description: string
}

export interface GetAdminSchoolIssueParams {
  page: number
  pageSize: number
  status: AdminSchoolIssueStatus | ''
}

export interface GetAdminSchoolContributionParams {
  page: number
  pageSize: number
  status: string
  sort: string[]
}

/** A school's facility tag, as the school details endpoint returns it. */
export interface SchoolTagDTO {
  id: number
  name?: string | null
  icon?: string | null
}

/** An education board the school follows, as the school details endpoint returns it. */
export interface SchoolBoardDTO {
  id?: number | null
  code?: number | null
  title?: string | null
  icon?: string | null
}

/** GET /schools/{id} (SchoolResponseViewModel). */
export interface SchoolDetailDTO {
  id: number
  name?: string | null
  localName?: string | null
  slug?: string | null
  schoolType?: { name?: string | null } | null
  countryId?: number | null
  countryTitle?: string | null
  stateId?: number | null
  stateTitle?: string | null
  cityId?: number | null
  cityTitle?: string | null
  address?: string | null
  zipCode?: string | null
  webSite?: string | null
  email?: string | null
  phoneNumber?: string | null
  latitude?: number | null
  longitude?: number | null
  tags?: SchoolTagDTO[] | null
  boards?: SchoolBoardDTO[] | null
  defaultImageUri?: string | null
  tuition?: number | null
  description?: string | null
  countryRank?: number | null
  stateRank?: number | null
  cityRank?: number | null
  rating?: number | null
}

/** GET /schools/{id}/rate (SchoolRateResponseViewModel). */
export interface SchoolRatingDTO {
  averageRate?: number | null
  classesQualityRate?: number | null
  educationRate?: number | null
  itTrainingRate?: number | null
  safetyAndHappinessRate?: number | null
  behaviorRate?: number | null
  tuitionRatioRate?: number | null
  facilitiesRate?: number | null
  artisticActivitiesRate?: number | null
  totalCount: number
}

/** One photo from GET /schools/{id}/images/SimpleImage. */
export interface SchoolImageDTO {
  id?: number
  fileUri?: string | null
  isDefault?: boolean
}
export * from './members'
