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
  postConfirmationEmailTemplate: string
  postCommentConfirmationEmailTemplate: string
  ticketConfirmationEmailTemplate: string
  registrationEmailTemplate: string
  initializeDeletingAccountEmailTemplate: string
  startDeletingAccountEmailTemplate: string
  finishedDeletingAccountEmailTemplate: string
  adminTransactionCreationEmailTemplate: string
  subscriptionCancelledEmailTemplate: string
  subscriptionResumedEmailTemplate: string
  subscriptionSwitchedEmailTemplate: string
  // Exam export price = question count x the format's multiplier (backend ExamExportPricing).
  // Optional: omitted/empty keeps the stored value; never set means the defaults 1 / 2 / 2.5.
  examExportPdfMultiplier?: number
  examExportWordMultiplier?: number
  examExportPowerPointMultiplier?: number
  contentOwnerCommissionPercent?: number
  contentOwnerCommissionPayoutThresholdUsd?: number
  commissionPayoutRequestedEmailTemplate?: string
  commissionPayoutPaidEmailTemplate?: string
  twoFactorSetupEmailTemplate?: string
  // Checkout recovery email: percent off the first payment (1-90, default 20) and days its offer link stays valid
  // (1-30, default 7). The email's own wording is a nudge template (NudgeType CheckoutAbandoned), not a setting.
  checkoutRecoveryDiscountPercent?: number
  checkoutRecoveryOfferDays?: number
  // Teacher invite program: the percent of invited users' subscription payments a teacher earns (0-100, default 15),
  // locked per teacher when they join, so a change only affects teachers who join later; how many days an emailed
  // offer's percent stays lockable (0 = never expires, default 30); and the offer email ([PERCENT] and [JOIN_LINK] required).
  referralCommissionPercent?: number
  referralOfferValidDays?: number
  referralOfferEmailSubject?: string
  referralOfferEmailTemplate?: string
}
