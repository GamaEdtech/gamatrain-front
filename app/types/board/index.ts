export interface BoardDTO {
  id: number
  code: number
  title: string
  icon: string
}
export interface GradeDTO {
  id: string
  list_order: string
  master_: string
  parent: string
  title: string
}
export interface SubjectDTO {
  bit_delete: string
  book_link: string | null
  id: string
  list_order: string
  master_: string
  metadata: string
  parent: string
  parent2: string
  test_link: string | null
  title: string
}
export interface ClassificationDTO {
  id: string
  is_paper: boolean
  list_order: string
  master_: string
  parent: string
  title: string
}

export interface TopicDTO {
  id: string
  list_order: string
  master_: string
  parent: string
  season: boolean
  title: string
}
export interface ExtraTypeFilePastPaperCreateDTO {
  id: string
  list_order: string
  master_: string
  parent: string
  title: string
}
