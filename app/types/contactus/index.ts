export interface AdminContactUsDTO {
  id: number
  sender: string
  email: string
  subject: string
  isReadByAdmin: boolean
  creationDate: string
}

export interface AdminContactUsDetailDTO {
  id: number
  fullName: string
  email: string
  subject: string
  body: string
  creationUser: string
  creationDate: string
  fileUri: string
}
export interface AdminReplyTicketListDTO {
  id: number
  body: string
  creationUser: string
  creationDate: string
  fileUri: string
  receivers: string[]
}
