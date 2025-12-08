/**
 * Governance Constants
 * Centralized constants for governance features
 */

/**
 * Token decimals (6 decimals for SPL tokens)
 */
export const TOKEN_DECIMALS = 6

/**
 * Token decimal multiplier (10^6)
 */
export const TOKEN_DECIMAL_MULTIPLIER = 1_000_000

/**
 * Cooldown period for unstaking (in seconds)
 * Currently set to 1 hour for testing
 */
export const UNSTAKE_COOLDOWN_SECONDS = 60 * 60 // 1 hour

/**
 * Cooldown period for unstaking (in milliseconds)
 */
export const UNSTAKE_COOLDOWN_MS = UNSTAKE_COOLDOWN_SECONDS * 1000

/**
 * Token-2022 Program ID
 */
export const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'

/**
 * Proposal categories
 */
export const PROPOSAL_CATEGORIES = [
  { title: 'General', value: 'general' },
  { title: 'Development', value: 'development' },
  { title: 'Marketing', value: 'marketing' },
  { title: 'Community', value: 'community' },
  { title: 'Finance', value: 'finance' },
] as const

/**
 * Proposal status colors
 */
export const PROPOSAL_STATUS_COLORS = {
  Passed: 'success',
  Rejected: 'error',
  Expired: 'warning',
  Active: 'primary',
} as const

/**
 * PDA Seeds
 */
export const PDA_SEEDS = {
  STAKE_ACCOUNT: 'stake_account',
  VAULT_AUTHORITY: 'vault-authority',
  USER_STATE: 'user_state',
  VOTE_RECORD: 'vote-record',
  PROPOSAL: 'proposal',
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  WALLET_NOT_READY: 'Wallet or program not ready',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INSUFFICIENT_STAKED: 'Insufficient staked tokens',
  NO_STAKE_POWER: 'You must stake tokens to participate in governance',
  COOLDOWN_ACTIVE: 'Cooldown period is still active',
  NOTHING_TO_CLAIM: 'Nothing to claim',
  PROPOSAL_EXPIRED: 'This proposal has expired',
  ALREADY_VOTED: 'You have already voted on this proposal',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  STAKE_REQUIRED: 'You must stake $GET tokens to create proposals',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  TOKENS_STAKED: 'Tokens staked successfully!',
  UNSTAKE_INITIATED: 'Unstake initiated! Tokens will be available to claim after cooldown period.',
  TOKENS_CLAIMED: 'Tokens claimed successfully!',
  PROPOSAL_CREATED: 'Proposal created successfully!',
  PROPOSAL_DELETED: 'Proposal deleted successfully!',
  VOTE_SUBMITTED: 'Vote submitted successfully!',
  REQUEST_SUBMITTED: 'Request submitted successfully!',
} as const

/**
 * Validation limits
 */
export const VALIDATION_LIMITS = {
  PROPOSAL_TITLE_MAX: 100,
  PROPOSAL_DESCRIPTION_MAX: 500,
  MIN_STAKE_AMOUNT: 0,
  MAX_URL_LENGTH: 255,
} as const

/**
 * Time formats
 */
export const TIME_FORMATS = {
  FULL_DATE: 'YYYY-MM-DD HH:mm:ss',
  SHORT_DATE: 'MMM DD, YYYY',
  TIME_ONLY: 'HH:mm:ss',
} as const

/**
 * Pagination
 */
export const PAGINATION = {
  LATEST_PROPOSALS_LIMIT: 10,
  PROPOSALS_PER_PAGE: 20,
} as const
