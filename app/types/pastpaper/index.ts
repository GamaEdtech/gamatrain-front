export interface FileInfo {
  exist: boolean
  size: string | number
  ext: string | false
  price: number
  type_title?: string
  id?: string
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
  topics: number[]
  answer_type: number
  level: number
  holding_level: number
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
  topics: number[]
  answer_type: number
  level: number
  holding_level: number
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
