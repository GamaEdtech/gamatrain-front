/**
 * A past paper file's role: the question paper (a PDF, required), its Word copy, the mark scheme, or any other file
 * (its kind in `type_id`).
 */
export type PaperFileRole = 'question' | 'word' | 'answer' | 'extra'

/** One of a paper's files, by its own id: downloads, file links and edits name it by `id`. In role order. */
export interface PaperFileDTO {
  id: number
  role: PaperFileRole
  ext: string | null
  size: string
  pages: number | null
  /** An extra file's length (e.g. an audio file's duration). */
  length: number | null
  /** An extra file's type (Insert, Listening audio, ...). */
  type_id: number | null
  type_title: string | null
  price: number
}

/** A file change in an edit waiting for review: `id` is the published file's, or negative for a new file of the edit. */
export interface PaperPendingFileDTO {
  id: number
  role: PaperFileRole
  change: 'added' | 'replaced' | 'changed' | 'removed'
  type_id: number | null
  ext: string | null
  size: string | null
  pages: number | null
}

/** The owner's edit of a published paper waiting for review, or a rejected one's notes. */
export interface PaperPendingEditDTO {
  waiting: boolean
  date: string | null
  description: string | null
  files: PaperPendingFileDTO[]
  reviewNotes: string[]
}

/**
 * One change in an add or edit's `files`: `{role, upload, type_id}` adds a file (for question/word/answer it replaces the
 * paper's file of that role), `{id, upload}` replaces one, `{id, type_id}` changes an extra file's type, `{id, remove}`
 * removes one. `upload` is the key the upload answered.
 */
export interface PaperFileChangeDTO {
  id?: number
  role?: PaperFileRole
  upload?: string
  type_id?: number
  remove?: boolean
}

export interface PastPaperDTO {
  id: string
  title: string
  title_url: string
  thumb_pic: string
  lesson_pic: string | null
  description: string
  views: number
  /** How many times the paper's files were downloaded (the API sends a numeric string). */
  downloads?: string | number
  ref_score: number
  q_file_pages?: string
  /** The uploader's handle, e.g. "@name". */
  ownerIdentity?: string
  edu_year: string
  edu_month: string
  section: string
  base: string
  lesson: string
  /** Empty for most papers. */
  topic?: string
  exams: {
    id: string
    status: string
  }[]
  files: PaperFileDTO[]
  lesson_title: string
  base_title: string
  section_title: string
  is_paper: boolean
  avatar: string
  first_name: string
  last_name: string
  test_type: string
  test_type_title?: string
  answer_type: string
  up_date: string
  edu_month_title: string
  variant: string | null
  variant_title: string | null
  owner: boolean
  user_: string
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
export interface FileRelatedContentDTO {
  id: string
  title: string
  type: string
  file_duration: string
  file_pages: string
  views: string
  subdate: string
  first_name: string
  last_name: string
  avatar: string
  poster: string
  title_url: string
  url: string
  legacy_url: string
  type_title: string
  type_title_fa: string
  subdate_jalali: string
}
export interface ExamRelatedContentDTO {
  id: string
  title: string
  code: string
  tests_num: string
  thumb_pic: string
  first_name: string
  last_name: string
  avatar: string
  title_url: string
  url: string
  legacy_url: string
}

export interface RelatedContentDTO {
  exams: ExamRelatedContentDTO[]
  files: FileRelatedContentDTO[]
  questions: ContentItemDTO[]
  tests: ContentItemDTO[]
  tutorials: ContentItemDTO[]
}

export interface PDFResponseDTO {
  url?: string
  name?: string
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
  edu_year: string | number
  edu_month: string | number
  variant?: string | number
  files?: PaperFileChangeDTO[]
  state: string
  area: string
  school: string
}

export interface PastPaperEditDTO {
  board?: string | number
  grade?: string | number
  subject?: string | number
  classification?: string | number
  topics?: number[] | string[]
  answer_type?: string | number
  level?: string | number
  holding_level?: string | number
  title?: string
  description?: string
  edu_year?: string | number
  edu_month?: string | number
  variant?: string | number
  files?: PaperFileChangeDTO[]
  state?: string
  area?: string
  school?: string
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
  edu_year: string | number
  edu_month: string | number
  variant?: string | number
  files: PaperFileChangeDTO[]
  state: string
  area: string
  school: string
}

export interface PastPaperCreateResponseDTO {
  id: number
  repeated?: boolean
}

export interface PastPaperEditResponseDTO {
  id: number
  status: number
  editMode: 'full' | 'limited'
  /** Fields a limited edit (the paper is past review) did not save. */
  ignoredFields?: string[]
  /** Says what the edit left out, or that the paper is reviewed again. */
  message?: string
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
  owner: boolean
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
  files: PaperFileDTO[]
  /** The owner's edit waiting for review (the edit form and the admin review). */
  pending_edit?: PaperPendingEditDTO | null
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
