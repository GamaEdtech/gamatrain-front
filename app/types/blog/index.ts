export interface BlogDTO {
  id: number
  title: string
  slug: string
  summary: string
  likeCount: number
  dislikeCount: number
  imageUri: string
  visibilityType: string
  publishDate: string
}
export interface BlogUserDTO {
  title: string
  slug: string
  summary: string
  body: string
  imageUri: string
  podcastUri: string
  keywords: string
  postId: number
  visibilityType: string
  publishDate: string
  tags: number[]
  localizedValues: LocalizedValueDTO[]
}

export interface LocalizedValueDTO {
  languageId: number
  title: string
  summary: string
  body: string
}

export interface TranslationDTO {
  languageId: number | string
  title: string
  summary: string
  content: string
}

export interface CommentBlogDTO {
  id: number
  creationUser: string
  creationUserAvatar: string
  creationDate: string
  comment: string
  likeCount: number
  dislikeCount: number
}
export interface AddCommentBlogResponseDTO {
  id: number
}
export interface AddCommnetBlogDTO {
  captcha: string
  comment: string
}
export interface GetCommentBlogParams {
  page: number
  pageSize: number
  postId: string
}

export type CommentBlogStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'

export interface GetCommentBlogAdminParams {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  commenterEmail: string
  commenterName: string
  status: CommentBlogStatus
}

export interface CommentBlogAdminSearchFilter {
  startDate: string
  endDate: string
  commenterEmail: string
  commenterName: string
  status: CommentBlogStatus | null
}

export interface CommnetBlogAdminDTO {
  id: number
  creationUser: string
  creationDate: string
  postId: number
  status: CommentBlogStatus
}

export interface CommnetBlogDetailAdminDTO {
  id: number
  postTitle: string
  postId: number
  comment: string
}
