import type { PaperFileDTO, PaperPendingEditDTO } from '@/types/pastpaper'

/** A paper in the admin list (the backend's copy, in gama-api's shape). */
export interface AdminPastPaperDTO {
  id: string
  title: string
  status: string
  ref_score: string
  downloads: string
  subdate: string
  section_title?: string
  base_title?: string
  lesson_title?: string
  test_type_title?: string
  /** The owner's user id here (null: no account here). */
  user_: number | null
  owner_name: string | null
  edu_year?: string
  edu_month?: string
  /** The owner's edit of this published paper waits for review. */
  pending_edit?: boolean
}

/** One paper for the admin review (GET admin/pastpapers/{id}): gama-api's paper detail plus the review's fields. */
export interface AdminPastPaperDetailDTO {
  id: string
  title: string
  status: string
  /** HTML-escaped text. */
  description?: string
  section_title?: string
  base_title?: string
  course_title?: string
  lesson_title?: string
  test_type_title?: string
  edu_year?: string
  edu_month?: string
  edu_month_title?: string
  edu_session?: string
  variant?: string
  ref_score?: string
  subdate?: string
  up_date?: string | null
  q_file_pages?: string
  a_file_pages?: string
  ownerUserId?: number | null
  /** The last review's notes ("- " lines). */
  reviewNote?: string | null
  files?: PaperFileDTO[]
  /** The owner's edit of the published paper waiting for review. */
  pending_edit?: PaperPendingEditDTO | null
}

export interface GetAdminPastPaperParams {
  page: number
  pageSize: number
  status?: number | null
  /** Only papers whose owner's edit waits for review. */
  pendingEdit?: boolean
  title?: string
  uid?: string | number | null
  /** Exact filters, as the backend names them: board, grade, subject, paper type, year, month, variant. */
  section?: string | number | null
  base?: string | number | null
  lesson?: string | number | null
  test_type?: string | number | null
  edu_year?: string | number | null
  edu_month?: string | number | null
  variant?: string | number | null
  id?: string | number | null
  code?: string | null
  /** 1 a paper, 0 not one. */
  is_paper?: number | null
  refScore?: number | null
  /** idasc or iddesc; newest first when unset. */
  order?: string | null
}

export interface ReviewPastPaperDTO {
  /** 0 waiting, 1 confirmed, 2 rejected, 3 needs changes, 4 deactivated. */
  status: number
  notes: string[]
}

/** An item of a lookup list (board, grade, subject, topic, classification...). */
export interface AdminTypeItemDTO {
  id: number
  kind: number
  title: string
  listOrder: number
  parent: string | null
  parent2: string | null
  metadata: string | null
  isSeason: boolean | null
  isPaper: boolean | null
  isDeleted: boolean
}

export interface AdminTypeItemListDTO {
  items: AdminTypeItemDTO[]
  total: number
}

export interface SaveAdminTypeItemDTO {
  kind: number
  title: string
  listOrder: number
  parent?: string
  parent2?: string
  metadata?: string
}

export interface GetAdminTypeItemParams {
  kind: number
  page: number
  pageSize: number
  parent?: string
  title?: string
  includeDeleted?: boolean
}
