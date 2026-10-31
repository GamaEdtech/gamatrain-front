import type { BoardDTO, GradeDTO, SubjectDTO } from '~/types/board'

export type DirectorySelectorStage = 'board' | 'grade' | 'subject'

export interface DirectorySelection {
  board: BoardDTO
  grade: GradeDTO
  subject: SubjectDTO
}

// The board, grade and subject ids in the URL query.
export type DirectorySelectorPath = {
  board: string
  grade: string
  subject: string
}

// A resolved URL: the chosen board, grade and subject plus the option lists
// the picker opens with.
export interface DirectorySelectorSnapshot {
  boards: BoardDTO[]
  grades: GradeDTO[]
  subjects: SubjectDTO[]
  board: BoardDTO | null
  grade: GradeDTO | null
  subject: SubjectDTO | null
  error: boolean
}

type DirectoryFile = { exist?: boolean, price?: number | string | null }

export interface DirectoryPaper {
  files?: {
    pdf?: DirectoryFile
    answer?: DirectoryFile
    extra?: (DirectoryFile & { id: string | number, type?: string | number | null, type_title?: string | null })[] | null
  } | null
  id: string | number
  title?: string
  title_url?: string
  test_type_title?: string
  lesson_title?: string
  variant?: string | number | null
  variant_title?: string | null
  exam_id?: string | (string | number)[] | null
  edu_year?: string | number
  edu_month?: string | number
}

export interface DirectoryPaperDownload {
  type: string
  title: string
  shortTitle: string
  icon: string
  style: 'question' | 'answer' | 'extra'
  price: number | null
  extraId?: string
}

// Filters for the directory's paper search. Year and Session are sent as
// edu_year/edu_month; Paper and Variant as test_type/variant.
export interface DirectoryPaperQuery {
  lesson: string | number
  edu_year?: string
  edu_month?: string
  test_type?: string
  variant?: string
}

export interface DirectoryPaperResponse {
  status: number | string
  data: { list: DirectoryPaper[], num?: number | string | null }
}

// The papers loaded so far for the current subject and filters, newest first.
export interface DirectoryPaperList {
  items: DirectoryPaper[]
  page: number
  total: number | null
  hasMore: boolean
  loaded: boolean
  loading: boolean
  error: boolean
}

export interface DirectoryYearGroup {
  id: number
  title: string
  sessions: { id: number, title: string, papers: DirectoryPaper[] }[]
}

export interface DirectoryFilterOption {
  id: string | number
  title: string
  is_paper?: boolean
}

export type DirectoryFilterKey = 'year' | 'series' | 'paper' | 'variant'

// The subject the paper table shows; component props satisfy it directly.
export interface DirectoryPaperContext {
  subjectId: string | number
  gradeId: string | number
  boardId: string | number
}

export interface DirectoryResourceGroup {
  type_id: string | number
  title: string
  items: unknown[]
}
