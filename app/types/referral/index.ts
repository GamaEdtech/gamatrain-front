/** The signed-in user's place in the teacher invite program (GET /api/v2/referral). */
export interface ReferralStatusDTO {
  isTeacher: boolean
  joined: boolean
  /** The percent locked at join, for life. */
  percent: number | null
  /** The percent joining now would lock: the offer's while it is open, otherwise the current rate. */
  joinPercent: number
  offerPercent: number | null
  offerExpirationDate: string | null
  /** True while the emailed offer's percent can still be locked. */
  offerOpen: boolean
  joinedDate: string | null
  /** Put on any page URL as ?invite=CODE. */
  referralCode: string | null
  invitedCount: number
  subscribedCount: number
  earnedUsd: number
}

export interface InvitedUserDTO {
  /** A short name only ("Sara K."). */
  displayName: string
  joinedDate: string | null
  subscribed: boolean
  paymentsCount: number
  earnedUsd: number
}

export interface GetInvitedUsersParams {
  page: number
  pageSize: number
}
