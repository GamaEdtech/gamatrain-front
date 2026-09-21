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
  id: number
  title: string
  slug: string
  summary: string
  body: string
  imageUri: string
  podcastUri: string
  keywords: string
  visibilityType: string
  publishDate: string
  tags: number[]
  status: BlogUserBreifDTOStatus
  rejectionComment: string | null
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
  creationUserAvatarUri: string
  creationDate: string
  comment: string
  likeCount: number
  dislikeCount: number
  likedByCurrentUser: boolean
  dislikedByCurrentUser: boolean
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
  status?: CommentBlogStatus
}

export interface CommentBlogAdminSearchFilter {
  startDate: string
  endDate: string
  commenterEmail: string
  commenterName: string
  status?: CommentBlogStatus
}

export interface CommnetBlogAdminDTO {
  id: number
  creationUser: string
  creationDate: string
  postId: number
  postTitle: string
  comment: string
  rejectionComment: string | null
  status: CommentBlogStatus
}

export interface CommnetBlogDetailAdminDTO {
  id: number
  postTitle: string
  postId: number
  comment: string
}

export type BlogUserBreifDTOStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'
export interface BlogUserBreifDTO {
  id: number
  rejectionComment: string | null
  status: BlogUserBreifDTOStatus
  creationUser: string
  creationDate: string
  title: string
}

export interface BlogCreateDTO {
  title: string
  slug: string
  summary: string
  body: string
  image: string
  podcast?: string
  visibilityType: string
  publishDate: string
  scheduledDate?: string
  keywords?: string[]
  tags: number[]
  draft: string
  localizedValues?: {
    languageId: number
    title: string
    summary: string
    body: string
  }[]
}

export interface BlogEditDTO {
  title: string
  slug: string
  summary: string
  body: string
  image: string
  podcast?: string
  removePodcast: boolean
  visibilityType: string
  publishDate: string
  scheduledDate?: string
  keywords?: string[]
  tags: number[]
  draft: string
  localizedValues?: {
    languageId: number
    title: string
    summary: string
    body: string
  }[]
}
export interface GetBlogUserParams {
  page: number
  pageSize: number
  startDate?: string
  endDate?: string
  email?: string
  username?: string
  status?: BlogUserBreifDTOStatus
}

export type AdminBlogContributionStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'

export interface AdminBlogContributionDTO {
  id: number
  rejectionComment: string | null
  status: AdminBlogContributionStatus
  creationUser: string
  creationDate: string
  title: string
}

export interface AdminBlogContributionLocalizedValueDTO {
  languageId: number
  title: string
  summary: string
  body: string
}

export interface AdminBlogContributionDetailDTO {
  id: number
  title: string
  slug: string
  summary: string
  body: string
  imageUri: string | null
  podcastUri: string | null
  keywords: string | null
  visibilityType: string
  publishDate: string
  tags: number[]
  status: AdminBlogContributionStatus
  rejectionComment: string | null
  localizedValues: AdminBlogContributionLocalizedValueDTO[]
}

export interface GetAdminBlogContributionParams {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  email: string
  username: string
  status: AdminBlogContributionStatus | ''
}

export interface SearchFilterAdminBlogContribution {
  startDate: string
  endDate: string
  email: string
  username: string
  status: AdminBlogContributionStatus | ''
}
