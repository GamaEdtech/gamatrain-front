export interface MultimediaCreateDTO {
  board: string | number
  grade: string | number
  subject: string | number
  topics: (string | number)[]
  title: string
  description: string
  content_type: string | number
  from_page: string | number
  to_page: string | number
  free_available: boolean
  file: string
}

export interface MultimediaCreateResponseDTO {
  id: number
  repeated?: boolean
}

export interface MultimediaFileInfoDTO {
  exist: boolean
  size: string | number
  ext: string
  pages?: number
  price?: number
  price_unit?: string
  paid?: boolean
  paid_in_course?: boolean
  in_course?: unknown
  has_credit?: boolean
  credit?: string
}

export interface MultimediaCollectionChapterDTO {
  id: string
  title: string
  season: boolean
}

export interface MultimediaCollectionDTO {
  id: string
  title: string
  season: boolean
  chapters?: MultimediaCollectionChapterDTO[]
}

export interface MultimediaDetailDTO {
  id: string
  user_: string
  teacher_id: string
  section: string
  course: string
  base: string
  lesson: string
  topic: string
  content_type: string
  from_page: string
  to_page: string
  title: string
  description: string
  type: string
  file_pages: number
  free_aggrement: string
  status: string
  msg: string
  ref_score: string
  score: string
  price_multiplier: number
  downloads: string
  views: string
  subdate: string
  up_date: string
  username: string
  first_name: string
  last_name: string
  avatar: string
  bookmark: boolean
  ownerIdentity: string
  section_title: string
  base_title: string
  lesson_title: string
  lesson_pic: string
  content_type_title: string
  title_url: string
  type_title: string
  type_title_fa: string
  subdate_jalali: string
  update_jalali: string
  uid: string
  owner: boolean
  admin: boolean
  referee: boolean
  refereeAccess: boolean
  teacher: boolean
  hasMembership: boolean
  files: MultimediaFileInfoDTO
  collectionList: MultimediaCollectionDTO[]
}
