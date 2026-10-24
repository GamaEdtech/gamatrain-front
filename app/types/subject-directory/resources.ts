export interface DirectoryResourceItem {
  id: string | number
  title: string
  title_url: string
}

export interface DirectoryResourceGroup {
  type_id: string | number
  title: string
  items: DirectoryResourceItem[]
}

export interface DirectoryResourceContext {
  boardId: string | number
  gradeId: string | number
  subjectId: string | number
  subjectTitle?: string
}
