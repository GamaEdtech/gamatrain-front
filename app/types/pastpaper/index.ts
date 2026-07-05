export interface FileInfo {
  exist: boolean
  size: string | number
  ext: string | false
  price: number
  type_title?: string
  id?: string
  type?: string | number
}

export interface FilesDTO {
  word: FileInfo
  pdf: FileInfo
  answer: FileInfo
  extra?: FileInfo[]
}

export interface PastPaperDTO {
  id: string
  title: string
  title_url: string
  thumb_pic: string
  lesson_pic: string | null
  description: string
  views: number
  ref_score: number
  edu_year: string
  section: string
  base: string
  lesson: string
  exams: {
    id: string
    status: string
  }[]
  files: FilesDTO
  lesson_title: string
  base_title: string
  section_title: string
  is_paper: boolean
  avatar: string
  first_name: string
  last_name: string
  test_type: string
  test_type_title?: string
  up_date: string
  edu_month_title: string
}

export interface ContentItemDTO {
  id: string
  title: string
  title_url: string
  thumb_pic?: string
  avatar: string
  edu_month: string
  first_name: string
  last_name: string
  q_file_pages?: string
  referee_score: string
  smart: boolean
  test_type: string
  type_title?: string
}

export interface RelatedContentDTO {
  exams: ContentItemDTO[]
  files: ContentItemDTO[]
  questions: ContentItemDTO[]
  tests: ContentItemDTO[]
  tutorials: ContentItemDTO[]
}

export interface PDFResponseDTO {
  url?: string
  name?: string
}

export interface PastPaperExtraFileCreateDTO {
  type: number
  file: string
}

export interface PastPaperCreateDTO {
  board: string | number
  grade: string | number
  subject: string | number
  classification: string | number
  topics: number[] | string[]
  answer_type: string | number
  level: string | number
  holding_level: string | number
  title: string
  description: string
  file_pdf: string
  file_word: string
  file_answer: string
  edu_year: string | number
  edu_month: string | number
  file_extra?: PastPaperExtraFileCreateDTO[]
  state: string
  area: string
  school: string
}

export interface PastPaperCreatePayloadDTO {
  section: string | number
  base: string | number
  lesson: string | number
  test_type: string | number
  topics: number[] | string[]
  answer_type: string | number
  level: string | number
  holding_level: string | number
  title: string
  description: string
  file_pdf: string
  file_word: string
  file_answer: string
  edu_year: string | number
  edu_month: string | number
  file_extra: PastPaperExtraFileCreateDTO[]
  state: string
  area: string
  school: string
}

export interface PastPaperCreateResponseDTO {
  id: number
  repeated?: boolean
}

export interface PastPaperDetailTopicDTO {
  id: string
  title: string
}
export interface PastPaperDetailDTO {
  check_bit: string
  id: string
  teacher_id: string
  user_: string
  section: string
  base: string
  course: string
  lesson: string
  topic: string
  level: string
  test_type: string
  answer_type: string
  holding_level: string
  state: string | null
  area: string | null
  school: string | null
  edu_year: string
  edu_month: string
  edu_session: string | null
  variant: string | null
  title: string
  description: string
  q_file_pages: string
  a_file_pages: string
  exam_id: string | null
  status: string
  msg: string | null
  thumb_pic: string
  downloads: string
  views: string
  free_aggrement: string
  subdate: string
  up_date: string
  price_multiplier: string
  ref_score: string
  username: string
  first_name: string
  last_name: string
  sex: string
  avatar: string
  bookmark: boolean
  ownerIdentity: string
  section_title: string
  base_title: string
  lesson_title: string
  lesson_pic: string
  topics: PastPaperDetailTopicDTO[]
  test_type_title: string
  is_paper: boolean
  answer_type_title: string
  edu_month_title: string
  title_url: string
  subdate_jalali: string
  update_jalali: string
  uid: string
  admin: boolean
  referee: boolean
  refereeAccess: boolean
  teacher: boolean
  files: FilesDTO
  singleSell: boolean
}

export interface PastPaperBriefDTO {
  id: string
  title: string
  ref_score: string
  downloads: string
  status: string
  msg: string
  subdate: string
  subdate_jalali: string
}
export interface GetPastPaperParams {
  page: number
  pageSize: number
  section?: string | number
  base?: string | number
  lesson?: string | number
}
