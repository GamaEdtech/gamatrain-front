import type { AdminTicketStatus } from '@/types'

export interface AdminTicketStatusOption {
  value: AdminTicketStatus
  title: string
  color: string
}

// Where a support conversation stands, separate from read/unread. Open and Answered follow the replies
// (backend); Closed and Not important are set by an admin from the list.
export const ADMIN_TICKET_STATUSES: AdminTicketStatusOption[] = [
  { value: 'Open', title: 'Open', color: 'warning' },
  { value: 'Answered', title: 'Answered', color: 'info' },
  { value: 'Closed', title: 'Closed', color: 'success' },
  { value: 'NotImportant', title: 'Not important', color: 'grey500' },
]

export const getAdminTicketStatusOption = (status: AdminTicketStatus | null | undefined) =>
  ADMIN_TICKET_STATUSES.find(option => option.value === status) ?? ADMIN_TICKET_STATUSES[0]!
