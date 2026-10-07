import type { CommissionPayoutStatus } from '@/types'

/** Chip color per payout status, shared by the user's payout history and the admin payout list. */
export const getPayoutStatusColor = (status: CommissionPayoutStatus) => {
  switch (status) {
    case 'Pending':
      return 'warning'
    case 'Approved':
      return 'info'
    case 'Paid':
      return 'success'
    case 'Rejected':
      return 'error'
    default:
      return 'grey500'
  }
}
