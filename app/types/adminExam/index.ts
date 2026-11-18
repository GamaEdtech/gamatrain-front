/** gama-api's exam statuses: only 1, 5 and 7 are public. */
export const EXAM_STATUSES: Record<number, string> = {
  0: 'Waiting',
  1: 'Published',
  2: 'Rejected',
  3: 'Needs changes',
  5: 'Cloned',
  6: 'Draft',
  7: 'Published by teacher',
}

/** A question's status: only confirmed questions are public. */
export const QUESTION_STATUSES: Record<number, string> = {
  0: 'Waiting',
  1: 'Confirmed',
  2: 'Rejected',
}

/** gama-api's question type codes. */
export const QUESTION_TYPES: { title: string, value: number }[] = [
  { title: 'Four choice', value: 1 },
  { title: 'Two choice', value: 4 },
  { title: 'True / false', value: 8 },
  { title: 'Descriptive', value: 2 },
  { title: 'Fill in the blank', value: 16 },
  { title: 'Short answer', value: 32 },
]

export interface AdminExamQuestionItemDTO {
  id: number
  code: string | null
  excerpt: string | null
  type: string | null
  trueAnswer: number | null
  status: number
  subjectId: number | null
  subjectTitle: string | null
  topicTitle: string | null
  ownerUserId: number | null
  ownerName: string | null
  usedPublish: number
  creationDate: string
  lastModifyDate: string | null
}

export interface AdminExamItemDTO {
  id: number
  code: string | null
  title: string
  status: number
  type: number
  isDeleted: boolean
  boardId: number | null
  boardTitle: string | null
  gradeId: number | null
  gradeTitle: string | null
  subjectId: number | null
  subjectTitle: string | null
  examTypeId: number | null
  examTypeTitle: string | null
  questionCount: number
  durationMinutes: number | null
  ownerUserId: number | null
  ownerName: string | null
  participantCount: number
  viewCount: number
  creationDate: string
  lastModifyDate: string | null
}

export interface AdminExamDetailDTO extends AdminExamItemDTO {
  coreTopicIds: string | null
  level: number | null
  scoreType: number | null
  eduYear: number | null
  eduMonth: number | null
  startDate: string | null
  endDate: string | null
  questions: AdminExamQuestionItemDTO[]
}

export interface AdminExamEditDTO {
  title: string
  boardId: number | null
  gradeId: number | null
  subjectId: number | null
  coreTopicIds: string | null
  examTypeId: number | null
  level: number | null
  durationMinutes: number | null
  scoreType: number | null
  eduYear: number | null
  eduMonth: number | null
  startDate: string | null
  endDate: string | null
}

export interface AdminExamQuestionDetailDTO extends AdminExamQuestionItemDTO {
  boardId: number | null
  gradeId: number | null
  coreTopicIds: string | null
  level: number | null
  typeCode: number | null
  question: string | null
  answerA: string | null
  answerB: string | null
  answerC: string | null
  answerD: string | null
  answerFull: string | null
  questionImage: string | null
  answerAImage: string | null
  answerBImage: string | null
  answerCImage: string | null
  answerDImage: string | null
  answerFullImage: string | null
  resource: string | null
}

export interface AdminExamQuestionEditDTO {
  boardId: number | null
  gradeId: number | null
  subjectId: number | null
  coreTopicIds: string | null
  level: number | null
  type: number
  question: string
  answerA: string | null
  answerB: string | null
  answerC: string | null
  answerD: string | null
  answerFull: string | null
  trueAnswer: number | null
  resource: string | null
  status: number | null
}

export type AdminListQuery = Record<string, string | number | boolean | null | undefined>

/** One exam attempt in the admin participation list (admin/exam-participations). */
export interface AdminExamParticipationDTO {
  id: number
  examId: number
  examTitle: string | null
  /** Null for an attempt copied from gama-api whose user isn't linked yet. */
  userId: number | null
  coreUserId: number
  userName: string | null
  email: string | null
  /** 0 started, 1 finished. */
  status: number
  resultScore: string | null
  submitSeconds: number | null
  startDate: string
}

export interface AdminExamParticipationListDTO {
  total: number
  finished: number
  participants: number
  items: AdminExamParticipationDTO[]
}
