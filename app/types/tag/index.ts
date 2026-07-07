export type TagTypeDTO = 'School' | 'Post' | 'Feature'
export interface TagDTO {
  id: number
  name: string
  icon: string
  tagType: TagTypeDTO
}

export interface AdminTagDTO {
  id: number
  name: string
  icon: string
  tagType: TagTypeDTO
}

export interface AddAdminTagDTO {
  name: string
  icon: string
  tagType: TagTypeDTO | ''
}

export interface GetAdminTagParams {
  page: number
  pageSize: number
  tagType: TagTypeDTO | ''
}
