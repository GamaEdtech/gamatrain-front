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
}

export interface GetAdminPastPaperParams {
  page: number
  pageSize: number
  status?: number | null
  title?: string
  uid?: string | number | null
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
