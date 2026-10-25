import type { AttentionKey } from '@/types'

/** How each "needs attention" queue is shown, and the admin page that handles it. */
export const ATTENTION_QUEUES: Record<AttentionKey, { label: string, icon: string, link: string }> = {
  ContactUs: { label: 'Unread messages', icon: 'md:mark_email_unread_outlined', link: '/admin/contact-us' },
  SchoolImages: { label: 'School images', icon: 'md:image_outlined', link: '/admin/schools/images' },
  SchoolContributions: { label: 'School edits', icon: 'md:account_balance_outlined', link: '/admin/schools/contributions' },
  SchoolIssues: { label: 'School issues', icon: 'md:bug_report_outlined', link: '/admin/schools/issues' },
  SchoolImageRemovals: { label: 'Image removals', icon: 'md:reset_image_outlined', link: '/admin/schools/image-issues' },
  SchoolComments: { label: 'School reviews', icon: 'md:rate_review_outlined', link: '/admin/schools/comments' },
  Posts: { label: 'Posts', icon: 'md:post_outlined', link: '/admin/posts' },
  PostComments: { label: 'Post comments', icon: 'md:comment_outlined', link: '/admin/posts/comments' },
  Payouts: { label: 'Payout requests', icon: 'md:account_balance_wallet_outlined', link: '/admin/commission/payouts' },
}

/** An item waiting longer than this is shown as overdue. */
export const ATTENTION_OVERDUE_DAYS = 7

export const PAYMENT_KIND_LABELS: Record<string, string> = {
  NewSubscription: 'New subscriptions',
  Renewal: 'Renewals',
  PlanSwitch: 'Plan switches',
  PointsTopUp: 'Points top-ups',
}
