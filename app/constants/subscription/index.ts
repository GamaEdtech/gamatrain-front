import type { BillingInterval } from '@/types'

export const BILLING_INTERVALS = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Annual',
] as const

export const BILLING_INTERVAL_DAYS: Record<BillingInterval, number> = {
  Daily: 1,
  Weekly: 7,
  Monthly: 30,
  Quarterly: 90,
  Annual: 365,
}

export const BILLING_INTERVAL_SUFFIX: Record<BillingInterval, string> = {
  Daily: 'per day',
  Weekly: 'per week',
  Monthly: 'per month',
  Quarterly: 'every 3 months',
  Annual: 'per year',
}

export const BILLING_INTERVAL_PERIOD_LABEL: Record<BillingInterval, string> = {
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month',
  Quarterly: 'quarter',
  Annual: 'year',
}

// Matches Localizer.Value["SwitchNotAllowedWhileCancellationPending"] in
// Gama-back's SubscriptionService.cs - the backend only ever sets this on
// ApiErrorItem.message (never .code), so match against message for now.
// FRAGILE: IStringLocalizer returns the raw key as a fallback only because no
// translation resource exists for this key yet - the moment one is added
// (any locale), this equality check silently stops matching. ApiErrorItem
// already has an optional `code` field for exactly this case; ask backend to
// populate it on this error and switch this match to error.code once it does.
export const SWITCH_NOT_ALLOWED_WHILE_CANCELLATION_PENDING_ERROR = 'SwitchNotAllowedWhileCancellationPending'
