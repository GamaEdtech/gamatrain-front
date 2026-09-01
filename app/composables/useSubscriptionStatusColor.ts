import type { UserSubscriptionStatus } from '@/types'

export function useSubscriptionStatusColor(status: UserSubscriptionStatus) {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Expired':
      return 'grey400'
    case 'Cancelled':
      return 'error'
    default:
      return 'warning'
  }
}
