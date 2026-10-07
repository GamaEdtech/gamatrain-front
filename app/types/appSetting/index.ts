export interface AdminAppSettingsDTO {
  gridPageSize?: number
  defaultTimeZoneId: string
  schoolContributionPoints?: number
  schoolImageContributionPoints?: number
  schoolCommentContributionPoints?: number
  postContributionPoints?: number
  schoolIssuesContributionPoints?: number
  removeSchoolImageContributionPoints?: number
  easterEggBronzePoints?: number
  easterEggSilverPoints?: number
  easterEggGoldPoints?: number
  testTimeCorrectSubmissionPoints?: number
  testTimeIncorrectSubmissionPoints?: number
  examCorrectTestSubmissionPoints?: number
  examIncorrectTestSubmissionPoints?: number
  schoolCommentContributionConfirmationEmailTemplate: string
  schoolImageContributionConfirmationEmailTemplate: string
  schoolImageContributionRejectionEmailTemplate: string
  removeSchoolImageContributionConfirmationEmailTemplate: string
  schoolContributionConfirmationEmailTemplate: string
  schoolContributionRejectionEmailTemplate: string
  schoolIssuesContributionConfirmationEmailTemplate: string
  postContributionConfirmationEmailTemplate: string
  ticketConfirmationEmailTemplate: string
  registrationEmailTemplate: string
  initializeDeletingAccountEmailTemplate: string
  startDeletingAccountEmailTemplate: string
  finishedDeletingAccountEmailTemplate: string
  adminTransactionCreationEmailTemplate: string
  subscriptionCancelledEmailTemplate: string
  subscriptionResumedEmailTemplate: string
  // Exam export price = question count x the format's multiplier (backend ExamExportPricing).
  // Optional: omitted/empty keeps the stored value; never set means the defaults 1 / 2 / 2.5.
  examExportPdfMultiplier?: number
  examExportWordMultiplier?: number
  examExportPowerPointMultiplier?: number
  contentOwnerCommissionPayoutThresholdUsd?: number
  commissionPayoutRequestedEmailTemplate?: string
  commissionPayoutPaidEmailTemplate?: string
}
