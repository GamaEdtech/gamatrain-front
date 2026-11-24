// Sale campaigns (Black Friday, Christmas, New Year, any event) - gamatrain-back api/v1/campaigns (GamaEdtech/gamatrain-back#1104).

export type CampaignTheme = 'Generic' | 'BlackFriday' | 'Christmas' | 'NewYear'

type Named<T extends string> = T | { name: T }

/** GET campaigns/current: the live campaign, or the next one starting within a week (isLive false). Never prices. */
export interface CampaignDTO {
  id: number
  title: string
  headline: string | null
  theme: Named<CampaignTheme>
  discountPercent: number
  /** The current run's start and end (a yearly campaign's this-year dates). The site switches on and off at these. */
  startsAt: string
  endsAt: string
  isLive: boolean
}

export interface AdminCampaignDTO {
  id: number
  title: string
  headline: string | null
  theme: Named<CampaignTheme>
  discountPercent: number
  /** The dates as entered (a yearly campaign's first run). */
  startsAt: string
  endsAt: string
  repeatsYearly: boolean
  isEnabled: boolean
  /** The run that is live now or comes next; null when a one-off campaign is over. */
  currentStartsAt: string | null
  currentEndsAt: string | null
  isLive: boolean
  paidPaymentCount: number
  creationDate: string
  lastModifyDate: string | null
}

export interface ManageCampaignPayload {
  title: string
  headline: string | null
  theme: CampaignTheme
  discountPercent: number
  startsAt: string
  endsAt: string
  repeatsYearly: boolean
  /** Needed only when editing the percent, dates or repeat of an enabled campaign. */
  twoFactorCode?: string
}
