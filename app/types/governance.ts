import type { PublicKey } from '@solana/web3.js'
import type { BN } from '@coral-xyz/anchor'

export interface StakeAccount {
  owner: PublicKey
  stakedAmount: number
  lastStakeTime: number
  pendingUnstake: number
  unstakeRequestedAt: number
  pendingRewards: number
}

export interface Stats {
  treasuryBalance: number
  totalStaked: number
  totalProposals: number
  activeVoters: number
  proposalsPassed: number
  totalRewards: number
  totalClaimedRewards: number
}

/**
 * Proposal status types
 */
export type ProposalStatus = 'Passed' | 'Rejected' | 'Expired' | 'Active'

/**
 * Proposal category types
 */
export type ProposalCategory = 'general' | 'development' | 'marketing' | 'community' | 'finance'

/**
 * Vote type
 */
export type VoteType = 'agree' | 'disagree'

/**
 * Proposal account data from blockchain
 */
export interface ProposalAccount {
  owner: PublicKey
  title: string
  brief: string
  cate: string
  reference: string
  amount: BN
  agreeVotes: BN
  disagreeVotes: BN
  createdAt: BN
  expiresAt: BN
}

/**
 * Proposal with public key
 */
export interface Proposal {
  publicKey: PublicKey
  account: ProposalAccount
}

/**
 * Proposal form data for creation
 */
export interface ProposalFormData {
  title: string
  brief: string
  cate: ProposalCategory | string
  reference: string
  amount: number
}

/**
 * Vote record data from blockchain
 */
export interface VoteRecord {
  proposalId: PublicKey
  voter: PublicKey
  hasVoted: boolean
  vote: VoteType
  votePower: BN
}

/**
 * Vote record response
 */
export interface VoteRecordResponse {
  hasVoted: boolean
  voteRecord: VoteRecord | null
}

/**
 * User state account
 */
export interface UserState {
  owner: PublicKey
  proposalCount: number
}

/**
 * Wallet connection state
 */
export interface WalletState {
  connected: boolean
  publicKey: PublicKey | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  program: any | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: any | null
}

/**
 * Transaction result
 */
export interface TransactionResult {
  signature: string
  [key: string]: unknown
}

/**
 * Proposal creation result
 */
export interface ProposalCreationResult extends TransactionResult {
  proposalPublicKey: PublicKey
}

/**
 * Vote submission result
 */
export interface VoteSubmissionResult extends TransactionResult {
  votePower: number
  vote: VoteType
}
