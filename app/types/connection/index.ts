export interface ConnectionStatusDTO {
  ids: number[]
  idType: 'Id' | 'CoreId'
}
export interface ConnectionStatusResponseDTO {
  id: number
  isFollowing: boolean
}
