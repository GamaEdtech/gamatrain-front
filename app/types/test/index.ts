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
