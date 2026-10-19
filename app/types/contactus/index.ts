export type AdminTicketStatus = 'Open' | 'Answered' | 'Closed' | 'NotImportant'

export interface AdminContactUsDTO {
  id: number
  sender: string
  email: string
  subject: string
  isReadByAdmin: boolean
  /** The customer replied and admin hasn't read that reply yet. */
  hasNewReply: boolean
  status: AdminTicketStatus | null
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
  /** Written by support (an admin reply), not by the customer. */
  bySupport: boolean
  creationDate: string
  fileUri: string
  receivers: string[]
}

export interface SearchFilterAdminContactUs {
  unread: boolean | null
  status: AdminTicketStatus | null
  search: string
  email: string
  startDate: Date | null
  endDate: Date | null
}

export interface GetAdminContactUsParams extends SearchFilterAdminContactUs {
  page: number
  pageSize: number
}

export interface AdminContactUsComposeMailDTO {
  from: string
  body: string
  subject: string
  users: string[]
  emailAddresses: string[]
}

export interface AdminContactUsCreateTicketDTO {
  from: string
  receiverName: string
  receiverEmail: string
  subject: string
  body: string
}

export interface AdminContactUsReplyDTO {
  from: string
  body: string
}

export interface AdminContactUsAiPromptDTO {
  userComment: string
}

export interface AdminContactUsAiResponseDTO {
  response?: string
}
