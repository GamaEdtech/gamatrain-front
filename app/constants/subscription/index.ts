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
