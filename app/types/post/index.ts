export interface PostDTO {
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
export interface PostUserDTO {
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
  status: PostUserBreifDTOStatus
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

export interface CommentPostDTO {
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

export interface AddCommentPostResponseDTO {
  id: number
}
export interface AddCommnetPostDTO {
  captcha: string
  comment: string
}
export interface GetCommentPostParams {
  page: number
  pageSize: number
  postId: string
}

export type CommentPostStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'

export interface GetCommentPostAdminParams {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  commenterEmail: string
  commenterName: string
  status?: CommentPostStatus
}

export interface CommentPostAdminSearchFilter {
  startDate: string
  endDate: string
  commenterEmail: string
  commenterName: string
  status?: CommentPostStatus
}

export interface CommnetPostAdminDTO {
  id: number
  creationUser: string
  creationDate: string
  postId: number
  postTitle: string
  comment: string
  rejectionComment: string | null
  status: CommentPostStatus
}

export interface CommnetPostDetailAdminDTO {
  id: number
  postTitle: string
  postId: number
  comment: string
}

export type PostUserBreifDTOStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'
export interface PostUserBreifDTO {
  id: number
  rejectionComment: string | null
  status: PostUserBreifDTOStatus
  creationUser: string
  creationDate: string
  title: string
}

export interface PostCreateDTO {
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

export interface PostEditDTO {
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
export interface GetPostUserParams {
  page: number
  pageSize: number
  startDate?: string
  endDate?: string
  email?: string
  username?: string
  status?: PostUserBreifDTOStatus
}

export type AdminPostStatus = 'Draft' | 'Review' | 'Confirmed' | 'Rejected' | 'Deleted'

export interface AdminPostDTO {
  id: number
  rejectionComment: string | null
  status: AdminPostStatus
  creationUser: string
  creationDate: string
  title: string
}

export interface AdminPostLocalizedValueDTO {
  languageId: number
  title: string
  summary: string
  body: string
}

export interface AdminPostDetailDTO {
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
  status: AdminPostStatus
  rejectionComment: string | null
  localizedValues: AdminPostLocalizedValueDTO[]
}

export interface GetAdminPostParams {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  email: string
  username: string
  status: AdminPostStatus | ''
}

export interface SearchFilterAdminPost {
  startDate: string
  endDate: string
  email: string
  username: string
  status: AdminPostStatus | ''
}
