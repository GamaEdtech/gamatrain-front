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
