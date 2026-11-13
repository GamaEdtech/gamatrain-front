/** `GET /api/v2/weekly-reports/settings`: the user's own weekly report setting. */
export interface WeeklyReportSettingsDTO {
  /** False once they turned it off (here or with the email's link). */
  subscribed: boolean
  /** Whether their current plan includes the weekly report; without it nothing is sent either way. */
  includedInPlan: boolean
  email: string | null
  /** Reports go only to a confirmed address. */
  emailConfirmed: boolean
  lastSentDate: string | null
}

/** `GET /api/v2/admin/weekly-reports/preview`: one user's email for a week, exactly as the job would send it. */
export interface WeeklyReportPreviewDTO {
  hasActivity: boolean
  wouldSend: boolean
  notSentReason: string | null
  kind: 'Report' | 'Reminder' | 'Skipped' | null
  subject: string | null
  /** The email's full HTML document. */
  html: string | null
}
