/** A tutorial's status in the backend: only Confirmed tutorials are on the website. */
export type TutorialStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'NeedsChanges' | 'Deactivated'

export interface AdminTutorialTopicDTO {
  id: number
  title: string | null
}

/** A tutorial in the admin list (the backend's copy). The type ids are gama-api's (search/types). */
export interface AdminTutorialDTO {
  id: number
  title: string
  status: TutorialStatus
  boardId: number | null
  boardTitle: string | null
  gradeId: number | null
  gradeTitle: string | null
  courseId: number | null
  subjectId: number | null
  subjectTitle: string | null
  topics: AdminTutorialTopicDTO[]
  keywords: string[]
  ownerUserId: number | null
  ownerName: string | null
  viewCount: number
  creationDate: string
  lastModifyDate: string | null
}

/** One tutorial for the edit form: its HTML (images on the backend's storage) and description. */
export interface AdminTutorialDetailDTO extends AdminTutorialDTO {
  content: string | null
  description: string | null
}

export interface AdminTutorialEditDTO {
  title: string
  content: string
  description?: string | null
  boardId: number | null
  gradeId?: number | null
  courseId?: number | null
  subjectId: number | null
  topicIds: number[]
  keywords?: string[] | null
  status?: TutorialStatus | null
}

export interface GetAdminTutorialParams {
  page: number
  pageSize: number
  status?: TutorialStatus | null
  boardId?: number | null
  gradeId?: number | null
  subjectId?: number | null
  title?: string
}

export interface AdminTutorialKeywordsDTO {
  keywords: string[]
  clusters: string[]
}

/** A gama-api type item from search/types (board, grade, subject or topic). */
export interface TypeItemDTO {
  id: string
  title: string
  season?: boolean
}

export type TopicMatchStatus = 'Pending' | 'Approved' | 'Rejected'

export interface TopicPathItemDTO {
  id: number
  title: string | null
}

export interface TopicPathDTO {
  board: TopicPathItemDTO | null
  grade: TopicPathItemDTO | null
  subject: TopicPathItemDTO | null
  topic: TopicPathItemDTO | null
  /** The topic's first published tutorial (GAMA side only). */
  tutorial: TopicPathItemDTO | null
}

/** A suggested match between a GAMA topic and another board's topic. */
export interface TopicMatchDTO {
  id: number
  confidence: number
  reasoning: string | null
  aiModel: string | null
  status: TopicMatchStatus
  reviewedBy: string | null
  creationDate: string
  gama: TopicPathDTO
  external: TopicPathDTO
}

export interface GetTopicMatchParams {
  page: number
  pageSize: number
  topicId?: number | null
  /** A subject on either side. */
  subjectId?: number | null
  status?: TopicMatchStatus | null
}

export interface TopicMatchSuggestDTO {
  added: number
  items: TopicMatchDTO[]
  errors: string[]
}
