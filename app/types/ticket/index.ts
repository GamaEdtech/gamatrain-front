export interface TicketListDTO {
  id: number
  sender: string
  email: string
  subject: string
  isReadByAdmin: boolean
  creationDate: string
  receivers: string[]
}

export interface TicketDetailDTO {
  id: number
  fullName: string
  email: string
  subject: string
  body: string
  creationUser: string
  creationDate: string
  fileUri: string
  receivers: string[]
}

export interface TicketReplyDTO {
  id: number
  body: string
  /** Empty on support replies: customers see "Support team", not the staff member's name. */
  creationUser: string | null
  bySupport: boolean
  creationDate: string
  fileUri: string
  receivers: string[]
}

export interface GetTicketParams {
  page: number
  pageSize: number
}

export interface CreateTicketDTO {
  captcha: string
  fullName: string
  email?: string
  subject: string
  body: string
  file?: File | Blob | null
}

export interface ResponseCreateTicketDTO {
  id: number
}

export interface CreateTicketReplyDTO {
  body: string
  file?: File | Blob | null
}
