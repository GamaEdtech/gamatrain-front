export interface ExamDetaiDTO {
  id: string
  clone_id: string
  user_: string
  referee: boolean
  user_type: string
  section: string
  base: string
  course: string
  lesson: string
  topics: TopicExamDetaiDTO[]
  type: string
  azmoon_type: string
  holding_level: string
  state: string
  area: string
  school: string
  level: string
  title: string
  tests: string[]
  tests_num: string
  tests_combination: string
  start_date: string
  end_date: string
  azmoon_time: string
  code: string
  edu_year: string
  edu_month: string
  file_original: string
  page_break_points: string
  participants_num: string
  status: string
  msg: string
  review: string
  metadata: MetadataExamDetaiDTO
  views: string
  downloads: string
  check_bit: string
  subdate: string
  up_date: string
  user_id: string
  username: string
  first_name: string
  last_name: string
  sex: string
  avatar: string
  bookmark: boolean
  section_title: string
  base_title: string
  course_title: string
  lesson_title: string
  lesson_pic: string
  participable: boolean
  isEnhanced: boolean
  azmoon_type_title: string
  title_url: string
  negative_point: boolean
  edu_month_title: string
  thumb_pic_url: string
  paperID: string
  app: string
  descAnswerColumns: number
  subdate_jalali: string
  subdate_jalali_mobile: string
  update_jalali: string
  update_jalali_mobile: string
  uid: string
  examUserData: ExamUserDataExamDetaiDTO
  owner: boolean
  admin: boolean
  teacher: boolean
  referee_access: boolean
  original: boolean
  pdf: boolean
  fileSize: string
  price: PriceExamDetaiDTO
  clonedItem: boolean
  freetime: boolean
  started: boolean
  finished: boolean
  isAfterPartyTime: boolean
  participateTime: boolean
}

export interface ExamResultDTO {
  id: string
  exam_id: string
  exam_code: string
  exam_title: string
  base: string
  base_title: string
  lesson: string
  lesson_title: string
  result_score: string
  status: string
  subdate: string
  subdate_jalali: string
}

export interface GetDataParamsExamResult {
  page: number
  pageSize: number
  section?: string | number
  base?: string | number
  lesson?: string | number
}

export interface ExamResultUserDTO {
  id: string
  first_name: string
  last_name: string
  avatar: string
  sex: string
  group_id: number
  area: string | null
  school: string | null
  state: string | null
}

export interface ExamResultProAccessDTO {
  status: number
  http_code: number
  data: {
    limit: boolean
    usage: boolean
    remained: number
  }
}

export interface ExamResultActiveResultDTO {
  status: number
}

export interface ExamResultExamDTO {
  id: string
  code: string
  user_: string
  base: string
  lesson: string
  topics: string
  type: string
  file_pdf: boolean
  title: string
  tests: string
  tests_num: string
  end_date: string | null
  azmoon_time: string
  score_type: string
  status: string
}

export interface ExamResultPriceDTO {
  price: number
  paid: boolean
}

export interface ExamResultUserDataDTO {
  id: string
  user_: string
  azmoon: string
  azmoon_code: string
  submit_time: string
  result_score: string
  status: string
  state: string
  area: string
  school: string
  transfer: string
  subdate: string
  submit_time_seconds: string
  subdate_jalali: string
}

export interface ExamResultRankItemDTO {
  total: string
  user: number
}

export interface ExamResultRankDTO {
  total?: ExamResultRankItemDTO
  state?: ExamResultRankItemDTO
  area?: ExamResultRankItemDTO
}

export interface ExamResultTotalStatsDTO {
  num: number
  true: number
  false: number
  noAnswer: number
  percent: number
}

export interface ExamResultLessonStatsDTO {
  title: string
  num: number
  true: number
  false: number
  noanswer: number
  percent: number
}

export interface ExamResultAnswerStatsDTO {
  total: ExamResultTotalStatsDTO
  lessons: Record<string, ExamResultLessonStatsDTO>
}

export interface ExamResultQuestionDTO {
  id: string
  code: string
  user_: string
  question: string
  lesson: string
  topics: string
  type: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  q_file: string | null
  a_file: string | null
  b_file: string | null
  c_file: string | null
  d_file: string | null
  direction: 'ltr' | 'rtl' | string
  answer_full: string
  answer_full_file: string | null
  answer_view_type: string
  true_answer: string
  hasVideo: boolean
  owner: boolean
  title: string
  lesson_title: string
  topics_title: string
  testImgAnswers: boolean
  user_answer: string
}

export interface ExamResultDetailDTO {
  user: ExamResultUserDTO
  proAccess: ExamResultProAccessDTO
  admin: boolean
  resultOwner: boolean
  examOwner: boolean
  activeResult: ExamResultActiveResultDTO
  exam: ExamResultExamDTO
  isEnhanced: boolean
  price: ExamResultPriceDTO
  userData: ExamResultUserDataDTO
  invalidSeconds: number
  rank: ExamResultRankDTO
  answerStats: ExamResultAnswerStatsDTO
  result: ExamResultQuestionDTO[]
  insightService: boolean
}

export interface ExamResultDownloadDTO {
  url: string
  name: string
}

export interface TopicExamDetaiDTO {
  id: string
  order: string
  title: string
  season: boolean
  pages: PagesExamDetaiDTO
}

export interface PagesExamDetaiDTO {
  from: string
  to: string
}

export interface MetadataExamDetaiDTO {
  paperID: string
  app: string
  descAnswerColumns: number
}

export interface ExamUserDataExamDetaiDTO {
  id: string
  status: string | number
}

export interface PriceExamDetaiDTO {
  participation: ParticipationExamDetaiDTO
  pdf: PdfExamDetaiDTO
}

export interface ParticipationExamDetaiDTO {
  price: number
  paid: boolean
}

export interface PdfExamDetaiDTO {
  price: number
  paid: boolean
}
