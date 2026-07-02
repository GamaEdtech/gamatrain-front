export interface MultimediaCreateDTO {
  board: string | number
  grade: string | number
  subject: string | number
  topics: (string | number)[]
  title: string
  description: string
  content_type: string | number
  from_page: string | number
  to_page: string | number
  free_available: boolean
  file: string
}

export interface MultimediaCreateResponseDTO {
  id: number
  repeated?: boolean
}
