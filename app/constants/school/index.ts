import type { AdminSchoolImageStatus, AdminSchoolCommentStatus, AdminSchoolImageIssueStatus } from '@/types'

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

export const SCHOOL_COMMENT_STATUS_FILTER_LIST: {
  id: AdminSchoolCommentStatus | ''
  title: string
}[] = [
  { id: '', title: 'All' },
  { id: 'Draft', title: 'Draft' },
  { id: 'Review', title: 'Pending' },
  { id: 'Confirmed', title: 'Confirmed' },
  { id: 'Rejected', title: 'Rejected' },
  { id: 'Deleted', title: 'Deleted' },
]

export const SCHOOL_COMMENT_RATE_LIST = [
  { title: 'Classes quality', key: 'classesQualityRate' },
  { title: 'Education', key: 'educationRate' },
  { title: 'IT training', key: 'itTrainingRate' },
  { title: 'Safe and happy', key: 'safetyAndHappinessRate' },
  { title: 'Behavior', key: 'behaviorRate' },
  { title: 'Tuition ratio', key: 'tuitionRatioRate' },
  { title: 'Facilities', key: 'facilitiesRate' },
  { title: 'Artistic activities', key: 'artisticActivitiesRate' },
  { title: 'Average', key: 'averageRate' },
] as const

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
