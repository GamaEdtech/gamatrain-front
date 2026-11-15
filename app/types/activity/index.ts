/** `GET /api/v2/admin/activities/posts`: one post's reads and listens in the window (different users each). */
export interface PostActivityDTO {
  postId: number
  title: string | null
  readers: number
  listeners: number
  fullListens: number
}

export type UserActivityKind = 'PostRead' | 'PodcastPlay' | 'PodcastListen'

/** `GET /api/v2/admin/activities/users/{userId}`: one read or listen of one user. */
export interface UserActivityItemDTO {
  day: string
  type: UserActivityKind
  postId: number
  title: string | null
}
