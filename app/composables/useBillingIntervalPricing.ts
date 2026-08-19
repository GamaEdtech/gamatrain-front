import type { BillingInterval } from '@/types'

// Mirrors the backend's BillingInterval.Days (src/Domain/Enumeration/BillingInterval.cs) - used purely to
// normalize a price to a monthly-equivalent rate client-side. subscriptions/plans doesn't send a
// pre-computed monthlyEquivalentPrice/discountPercent (unlike the upgrade-suggestions payload), so the
// "buy a plan" flow derives it here instead.
const BILLING_INTERVAL_DAYS: Record<BillingInterval, number> = {
  Daily: 1,
  Weekly: 7,
  Monthly: 30,
  Quarterly: 90,
  Annual: 365,
}

export const useBillingIntervalPricing = () => {
  const monthlyEquivalentPrice = (price: number, interval: BillingInterval) => {
    return price / (BILLING_INTERVAL_DAYS[interval] / BILLING_INTERVAL_DAYS.Monthly)
  }

  /**
   * % cheaper per month than paying Monthly, e.g. 25 = 25% cheaper per month than the plan's own Monthly
   * price. null when there's nothing to compare against (no Monthly price, or this entry is the Monthly
   * price itself) or the interval is somehow not actually cheaper.
   */
  const discountPercent = (price: number, interval: BillingInterval, monthlyPrice: number | null) => {
    if (monthlyPrice === null || monthlyPrice <= 0 || interval === 'Monthly') {
      return null
    }

    const equivalent = monthlyEquivalentPrice(price, interval)
    const percent = Math.round(((monthlyPrice - equivalent) / monthlyPrice) * 100)

    return percent > 0 ? percent : null
  }

  return { BILLING_INTERVAL_DAYS, monthlyEquivalentPrice, discountPercent }
}
