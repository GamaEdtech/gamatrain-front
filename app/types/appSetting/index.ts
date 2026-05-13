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
  removeSchoolImageContributionConfirmationEmailTemplate: string
  schoolContributionConfirmationEmailTemplate: string
  schoolContributionRejectionEmailTemplate: string
  schoolIssuesContributionConfirmationEmailTemplate: string
  postContributionConfirmationEmailTemplate: string
  ticketConfirmationEmailTemplate: string
  registrationEmailTemplate: string
}
