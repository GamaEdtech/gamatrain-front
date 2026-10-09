import type { BoardDTO, GradeDTO, SubjectDTO } from '~/types/board'

export type DirectorySelectorStage = 'board' | 'grade' | 'subject'

export interface DirectorySelectorOption {
  id: string
  title: string
}

export interface DirectorySelectorColumn {
  stage: DirectorySelectorStage
  title: string
  items: DirectorySelectorOption[]
  selectedId: string
}

export interface DirectorySelection {
  board: BoardDTO
  grade: GradeDTO
  subject: SubjectDTO
}

export interface DirectorySubjectSearchResult {
  id: string
  title: string
  path: string
  selection: DirectorySelection
}

export interface DirectorySubjectSearchState {
  query: string
  loading: boolean
  error: string
}

export interface DirectorySelectorPath {
  board: string
  grade: string
  subject: string
}

export interface DirectorySelectorSnapshot {
  boards: BoardDTO[]
  grades: GradeDTO[]
  subjects: SubjectDTO[]
  board: BoardDTO | null
  grade: GradeDTO | null
  subject: SubjectDTO | null
  errorStage: DirectorySelectorStage | null
}

export interface DirectorySelectorState extends DirectorySelectorSnapshot {
  open: boolean
  stage: DirectorySelectorStage
  loading: DirectorySelectorStage | null
  committing: boolean
  commitError: string
  selection: DirectorySelection | null
}
