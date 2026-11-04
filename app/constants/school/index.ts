import type { AdminSchoolImageStatus, AdminSchoolCommentStatus, AdminSchoolImageIssueStatus, AdminSchoolIssueStatus } from '@/types'

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

export const SCHOOL_ISSUE_STATUS_FILTER_LIST: {
  id: AdminSchoolIssueStatus | ''
  title: string
}[] = [
  { id: '', title: 'All' },
  { id: 'Confirmed', title: 'Confirmed' },
  { id: 'Review', title: 'Pending' },
  { id: 'Rejected', title: 'Rejected' },
  { id: 'Deleted', title: 'Deleted' },
]

/**
 * Where a country's national exam results are published, keyed by country id. Shown on that country's
 * school pages: in results season most visitors arrive searching for their school's results.
 */
export const SCHOOL_EXAM_RESULTS_BY_COUNTRY: Record<number, {
  board: string
  exams: string
  url: string
}> = {
  // Tanzania: NECTA's public results portal.
  125077: { board: 'NECTA', exams: 'Standard 4 (SFNA), Standard 7 (PSLE), Form 4 (CSEE) and Form 6 (ACSEE)', url: 'https://matokeo.necta.go.tz/' },
}
