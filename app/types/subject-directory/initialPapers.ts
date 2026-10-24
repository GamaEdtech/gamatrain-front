import type { DirectoryPaper } from './paperFiles'

export interface DirectoryInitialPaperContext {
  subjectId: string | number
  gradeId: string | number
}

export interface DirectoryPaperQuery {
  lesson: string | number
  edu_year: number
  edu_month: number
  test_type?: string
  variant?: string
}

export interface DirectoryPaperResponse {
  status: number | string
  data: { list: DirectoryPaper[], num?: number | string | null }
}

export interface DirectoryInitialPapersOptions {
  subjectId: string | number
  years: readonly { id: number }[]
  sessions: readonly { id: number }[]
  fetchPapers: (params: DirectoryPaperQuery & {
    is_paper: boolean
    directory: boolean
    page: number
    perpage: number
  }, signal?: AbortSignal) => Promise<DirectoryPaperResponse>
}

export interface DirectoryInitialPapers {
  selected: { year: number, month: number } | null
  sessions: {
    query: DirectoryPaperQuery
    availability: string
    papers: {
      items: DirectoryPaper[]
      page: number
      total: number | null
      loaded: boolean
      hasMore: boolean
      loading: boolean
      error: boolean
    }
  }[]
}
