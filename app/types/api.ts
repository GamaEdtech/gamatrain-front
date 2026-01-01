export interface ApiResult<T> {
  data: T | null
  status: number
  error?: unknown
  succeeded: boolean
}
export interface ApiErrorResult {
  status?: number
  data?: {
    error?: string
    status?: number
    message?: string
  }
}

export interface AppError {
  response?: ApiErrorResult
  message?: string
  status?: number
}

export interface ResponseListDTO<T> {
  list: T[]
  totalRecordsCount: number
}

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

export interface AdminTransactionDTO {
  id: number
  userId: number
  points: number
  description: string
  creationDate: string
  currentBalance: number
  isDebit: boolean
}

export type CurrencyPayment = 'SOL' | 'USDC' | 'GET' | 'USDT'
export type StatusPayment = 'Pending' | 'Paid' | 'Failed'

export interface AdminPaymentDTO {
  id: number
  userId: number
  firstName?: string
  lastName?: string
  amount: number
  currency: CurrencyPayment
  status: StatusPayment
  creationDate: string
  verifyDate?: string
  sourceWallet?: string
  comment?: string
  transactionId?: string
}

export interface SearchTypesStatsDTO {
  types_stats: TypesStatsDTO
}

export interface TypesStatsDTO {
  albums: string
  azmoon: string
  courses: string
  dars: string
  exams: string
  files: string
  learnfiles: string
  papers: string
  question: string
  questions: string
  schools: string
  teachers: string
  tutor: string
  tutorials: string
  last_update: boolean
  test: boolean
}
