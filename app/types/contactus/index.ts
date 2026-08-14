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

export interface GetAdminContactUsParams {
  page: number
  pageSize: number
  status: string
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
