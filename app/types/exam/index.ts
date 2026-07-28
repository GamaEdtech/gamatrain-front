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
