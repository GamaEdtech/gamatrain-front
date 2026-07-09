import type { AdminSchoolImageIssueStatus } from '@/types'

export const SCHOOL_IMAGE_ISSUE_STATUS_FILTER_LIST: {
  id: AdminSchoolImageIssueStatus | ''
  title: string
}[] = [
  { id: '', title: 'All' },
  { id: 'Confirmed', title: 'Confirmed' },
  { id: 'Review', title: 'Pending' },
  { id: 'Rejected', title: 'Rejected' },
  { id: 'Deleted', title: 'Deleted' },
]
