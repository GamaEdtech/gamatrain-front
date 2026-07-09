import type { AdminSchoolImageStatus } from '@/types'

export const SCHOOL_IMAGE_STATUS_FILTER_LIST: {
  id: AdminSchoolImageStatus | ''
  title: string
}[] = [
  { id: '', title: 'All' },
  { id: 'Confirmed', title: 'Confirmed' },
  { id: 'Review', title: 'Pending' },
  { id: 'Rejected', title: 'Rejected' },
  { id: 'Deleted', title: 'Deleted' },
]
