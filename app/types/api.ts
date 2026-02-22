export interface ApiResult<T> {
  data: T | null
  status: number
  error?: unknown
  succeeded: boolean
  errors: [
    {
      message: string
      code: string
      reference: string
      info: string
      value: string
    },
  ]
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

export type StatusErrorCodeApp = 500 | 404 | 403 | 401 | 'disconnect'

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

export interface ProAccess {
  status: number
  http_code: number
  data: {
    limit: boolean
    remained: number
    usage: boolean
  }
}

export interface TutorialDTO {
  base: string
  content: string
  course: string
  id: string
  lesson: string
  proAccess: ProAccess
  section: string
  status: string
  title: string
  title_url: string
  topic: string
  up_date: string
  update_jalali: string
  views: string
}

export interface ChapterDTO {
  id: string
  season: boolean
  title: string
  tutorials: {
    id: string
    title: string
  }[]
}

export interface UnitLessonDTO {
  id: string
  season: boolean
  title: string
  tutorialsNum: number
  chapters: ChapterDTO[]
}

export interface LessonTreeDTO {
  id: string
  title: string
  list: UnitLessonDTO[]
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

export type SchoolContributionStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'

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
  boardCodes: number[]
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

export interface AdminContactUsDTO {
  id: number
  sender: string
  email: string
  subject: string
  isReadByAdmin: boolean
  creationDate: string
}

export interface AdminContactUsDetailDTO {
  id: number
  fullName: string
  email: string
  subject: string
  body: string
  creationUser: string
  creationDate: string
  fileUri: string
}
export interface AdminReplyTicketListDTO {
  id: number
  body: string
  creationUser: string
  creationDate: string
  fileUri: string
  receivers: string[]
}

export interface QuestionDTO {
  id: string

  question: string
  q_file: string | null
  direction: 'ltr' | 'rtl'
  type: string

  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string

  a_file: string | null
  b_file: string | null
  c_file: string | null
  d_file: string | null

  true_answer: '1' | '2' | '3' | '4'

  answer_full: string
  answer_full_file: string | null
  answer_view_type: string
  answers_stat: string | null
  testImgAnswers: boolean

  base: string
  base_title: string

  lesson: string
  lesson_title: string

  section: string
  section_title: string

  topic: string
  topic_title: string

  course: string
  level: string
  resource: string

  user_: string
  owner: boolean
  avatar: string
  first_name: string
  last_name: string

  code: string
  title: string
  tutorial_id: string

  subdate: string
  subdate_jalali: string
  up_date: string | null
}

export interface TestTimeDTO {
  points: number
  isCorrect: boolean
}
export interface NextQuestionDTO {
  code: string
}

export interface TransactionStatisticDTO {
  name: string
  debitValue: number
  creditValue: number
}
export interface TransactionDTO {
  id: number
  points: number
  description: string
  currentBalance: number
  creationDate: string
  isDebit: boolean
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
  score: number

  hasEmail: boolean
  hasPhone: boolean
  hasWebsite: boolean
  hasLocation: boolean

  lat: number
  long: number

  lastModifyDate: string
}

export interface AdminAppSettingsDTO {
  gridPageSize?: number
  defaultTimeZoneId: string
  schoolContributionPoints?: number
  schoolImageContributionPoints?: number
  schoolCommentContributionPoints?: number
  postContributionPoints?: number
  schoolIssuesContributionPoints?: number
  removeSchoolImageContributionPoints?: number
  easterEggBronzePoints?: number
  easterEggSilverPoints?: number
  easterEggGoldPoints?: number
  testTimeCorrectSubmissionPoints?: number
  testTimeIncorrectSubmissionPoints?: number
  examCorrectTestSubmissionPoints?: number
  examIncorrectTestSubmissionPoints?: number
  schoolCommentContributionConfirmationEmailTemplate: string
  schoolImageContributionConfirmationEmailTemplate: string
  removeSchoolImageContributionConfirmationEmailTemplate: string
  schoolContributionConfirmationEmailTemplate: string
  schoolIssuesContributionConfirmationEmailTemplate: string
  postContributionConfirmationEmailTemplate: string
  ticketConfirmationEmailTemplate: string
}
