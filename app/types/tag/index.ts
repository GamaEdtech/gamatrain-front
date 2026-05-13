export type TagTypeDTO = 'School' | 'Post' | 'Feature'
export interface TagDTO {
  id: number
  name: string
  icon: string
  tagType: TagTypeDTO
}
