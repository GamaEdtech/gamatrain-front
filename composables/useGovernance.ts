/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as anchor from '@coral-xyz/anchor'
import { ref } from 'vue'
import type { PublicKey } from '@solana/web3.js'

// Type alias (keep it only for typing)
type Program<T extends anchor.Idl = anchor.Idl> = anchor.Program<T>

// Runtime values (don’t destructure Program here)
const { web3, BN } = anchor
// --- Types ---
interface CreateProposalForm {
  title: string
  brief: string
  cate: string
  reference: string
  amount: number
}

interface GovernanceError {
  code: number
  name: string
  message: string
}

interface VoteRecordData {
  proposalId: PublicKey
  voter: PublicKey
  hasVoted: boolean
  vote: string
  votePower: anchor.BN
}

interface ProposalData {
  owner: PublicKey
  title: string
  brief: string
  cate: string
  reference: string
  amount: anchor.BN
  agreeVotes: anchor.BN
  disagreeVotes: anchor.BN
  createdAt: anchor.BN
  expiresAt: anchor.BN
}

export const ensureBuffer = async () => {
  if (typeof window !== 'undefined' && !(window as any).Buffer) {
    const { Buffer } = await import('buffer');
    (window as any).Buffer = Buffer
  }
  return typeof window !== 'undefined' ? (window as any).Buffer : (globalThis as any).Buffer
}

/**
 * Enhanced governance composable with proper error handling and vote power calculation
 */
export const useGovernance = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  /**
   * Calculate vote power based on user's GET token balance
   * @param userPublicKey - The user's wallet public key
   * @param connection - Solana connection instance
   * @returns Vote power as a number
   */
  const calculateVotePower = async (userPublicKey: PublicKey, connection: any): Promise<number> => {
    try {
      // Get user's GET token balance
      const { fetchTokenBalance } = await import('~/composables/useSolanaClient')
      const getTokenMint = 'GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv' // GET token mint

      const balance = await fetchTokenBalance({
        owner: userPublicKey.toBase58(),
        mint: getTokenMint,
        commitment: 'confirmed',
      })

      // Return balance as vote power (or minimum 1)
      return balance.uiAmount || 1
    }
    catch (error) {
      console.warn('Failed to calculate vote power, using default:', error)
      return 1 // Default vote power
    }
  }

  /**
   * Check if user has already voted on a proposal
   * @param program - Anchor program instance
   * @param proposalPublicKey - Proposal public key
   * @param voterPublicKey - Voter public key
   * @returns Whether user has voted and vote record data
   */
  const checkVoteRecord = async (
    program: Program,
    proposalPublicKey: PublicKey,
    voterPublicKey: PublicKey,
  ): Promise<{ hasVoted: boolean, voteRecord: VoteRecordData | null }> => {
    try {
      const [voteRecordPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('vote-record'), proposalPublicKey.toBuffer(), voterPublicKey.toBuffer()],
        program.programId,
      )

      // @ts-expect-error: voteRecord account type may not be typed in IDL
      const voteRecord = await program.account['voteRecord'].fetch(voteRecordPDA)
      return {
        hasVoted: voteRecord.hasVoted,
        voteRecord: voteRecord as VoteRecordData,
      }
    }
    catch (error) {
      // Vote record doesn't exist, user hasn't voted
      return { hasVoted: false, voteRecord: null }
    }
  }

  /**
   * Check if proposal has expired
   * @param proposal - Proposal data
   * @returns Whether proposal has expired
   */
  const isProposalExpired = (proposal: ProposalData): boolean => {
    const now = Math.floor(Date.now() / 1000)
    return proposal.expiresAt.toNumber() < now
  }

  /**
   * Handle governance errors with user-friendly messages
   * @param error - The error object
   * @returns User-friendly error message
   */
  const handleGovernanceError = (error: any): string => {
    if (error.code) {
      switch (error.code) {
        case 6000:
          return 'You are not authorized to perform this action.'
        case 6001:
          return 'You have already voted on this proposal.'
        case 6002:
          return 'This proposal has expired and can no longer be voted on.'
        case 6003:
          return 'Holders of $GET tokens can participate in voting—grab some $GET to have your say!'
        default:
          return `Governance error: ${error.message || 'Unknown error occurred'}`
      }
    }
    return error.message || 'An unexpected error occurred'
  }

  // auto-ensure Buffer on composable usage
  if (typeof window !== 'undefined') ensureBuffer().catch(console.error)

  return {
    isLoading,
    error,
    calculateVotePower,
    checkVoteRecord,
    isProposalExpired,
    handleGovernanceError,
  }
}

/**
 * Enhanced stateless governance functions with better error handling
 */
export const governance = {
  /**
   * Fetches all proposal accounts from the blockchain.
   * @param program - The initialized Anchor Program instance.
   */
  async fetchProposals(program: Program) {
    await ensureBuffer()
    try {
      const proposals = await (program.account as any).proposal.all()
      return proposals.map((proposal: any) => ({
        ...proposal,
        account: {
          ...proposal.account,
          // Ensure proper data types
          agreeVotes: proposal.account.agreeVotes || new BN(0),
          disagreeVotes: proposal.account.disagreeVotes || new BN(0),
          amount: proposal.account.amount || new BN(0),
          createdAt: proposal.account.createdAt || new BN(0),
          expiresAt: proposal.account.expiresAt || new BN(0),
        },
      }))
    }
    catch (error) {
      console.error('Error fetching proposals:', error)
      throw new Error('Failed to fetch proposals from blockchain')
    }
  },

  /**
 * Fetches the latest 10 proposals sorted by creation date (descending).
 * @param program - The initialized Anchor Program instance.
 */
  async fetchLatestProposals(program: Program) {
    await ensureBuffer()
    try {
      const proposals = await (program.account as any).proposal.all()

      const mapped = proposals.map((proposal: any) => ({
        ...proposal,
        account: {
          ...proposal.account,
          // Ensure proper data types
          agreeVotes: proposal.account.agreeVotes || new BN(0),
          disagreeVotes: proposal.account.disagreeVotes || new BN(0),
          amount: proposal.account.amount || new BN(0),
          createdAt: proposal.account.createdAt || new BN(0),
          expiresAt: proposal.account.expiresAt || new BN(0),
        },
      }))

      mapped.sort((a: any, b: any) => {
        const aCreated = a.account.createdAt.toNumber ? a.account.createdAt.toNumber() : Number(a.account.createdAt)
        const bCreated = b.account.createdAt.toNumber ? b.account.createdAt.toNumber() : Number(b.account.createdAt)
        return bCreated - aCreated
      })

      return mapped.slice(0, 10)
    }
    catch (error) {
      console.error('Error fetching latest proposals:', error)
      throw new Error('Failed to fetch proposals from blockchain')
    }
  },

  /**
   * Creates a new proposal with enhanced validation.
   * @param program - The initialized Anchor Program instance.
   * @param user - The PublicKey of the proposal creator.
   * @param formData - The data for the new proposal.
   */
  async createProposal(
    program: Program,
    user: PublicKey,
    formData: CreateProposalForm,
  ) {
    await ensureBuffer()
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        throw new Error('Proposal title is required')
      }
      if (!formData.brief?.trim()) {
        throw new Error('Proposal description is required')
      }

      // Fetch user_state PDA first
      const [userStatePda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('user_state'), user.toBuffer()],
        program.programId,
      )

      // 2️⃣ Fetch user_state (if exists) to get proposal_count
      let proposalCount = 0
      try {
        const userStateAccount = await program.account.userState.fetch(userStatePda)
        proposalCount = userStateAccount.proposalCount
      }
      catch (err) {
        // If account doesn't exist, first proposal -> count = 0
        proposalCount = 0
      }

      // Derive proposal PDA
      const [proposalPda] = await web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('proposal'),
          user.toBuffer(),
          new BN(proposalCount).toArrayLike(Buffer, 'le', 8),
        ],
        program.programId,
      )

      const tx = await program.methods
        .createProposal(
          formData.title.trim(),
          formData.brief.trim(),
          formData.cate || 'general',
          formData.reference || '',
          new BN(formData.amount || 0),
        )
        .accounts({
          proposal: proposalPda,
          userState: userStatePda,
          user: user,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: true })

      const latestBlockhash = await program.provider.connection.getLatestBlockhash()
      await program.provider.connection.confirmTransaction({
        signature: tx,
        ...latestBlockhash,
      })

      return {
        signature: tx,
        proposalPublicKey: proposalPda,
      }
    }
    catch (error: any) {
      console.error('Error creating proposal:', error)
      const { handleGovernanceError } = useGovernance()
      throw new Error(handleGovernanceError(error))
    }
  },

  /**
   * Submits a vote on a proposal with enhanced validation.
   * @param program - The initialized Anchor Program instance.
   * @param voter - The PublicKey of the voter.
   * @param proposalPublicKey - The PublicKey of the proposal being voted on.
   * @param agree - Boolean vote (true for 'Yes', false for 'No').
   * @param votePower - Optional vote power (will be calculated if not provided).
   */
  async vote(
    program: Program,
    voter: PublicKey,
    proposalPublicKey: PublicKey,
    agree: boolean,
    votePower?: number,
  ) {
    await ensureBuffer()
    try {
      const { checkVoteRecord, calculateVotePower, isProposalExpired } = useGovernance()

      // Check if proposal exists and is not expired
      // @ts-expect-error: proposal account type may not be inferred
      const proposal = await program.account['proposal'].fetch(proposalPublicKey)
      if (isProposalExpired(proposal as ProposalData)) {
        throw { code: 6002, message: 'Proposal has expired' }
      }

      // Check if user has already voted
      const { hasVoted } = await checkVoteRecord(program, proposalPublicKey, voter)
      if (hasVoted) {
        throw { code: 6001, message: 'User has already voted' }
      }

      // Calculate vote power if not provided
      const finalVotePower = votePower || await calculateVotePower(voter, program.provider.connection)

      if (finalVotePower === 1) {
        const error = {
          code: 6003,
        }
        const { handleGovernanceError } = useGovernance()
        throw new Error(handleGovernanceError(error))
      }
      else {
        const [voteRecordPDA] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from('vote-record'), proposalPublicKey.toBuffer(), voter.toBuffer()],
          program.programId,
        )

        const tx = await program.methods
          .vote(agree, new BN(finalVotePower))
          .accounts({
            proposal: proposalPublicKey,
            voter: voter,
            voteRecord: voteRecordPDA,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc({ skipPreflight: true })

        return {
          signature: tx,
          votePower: finalVotePower,
          vote: agree ? 'agree' : 'disagree',
        }
      }
    }
    catch (error: any) {
      console.error('Error voting on proposal:', error)
      const { handleGovernanceError } = useGovernance()
      throw new Error(handleGovernanceError(error))
    }
  },

  /**
   * Deletes a proposal with ownership validation.
   * @param program - The initialized Anchor Program instance.
   * @param user - The PublicKey of the user attempting to delete (must be the owner).
   * @param proposalPublicKey - The PublicKey of the proposal to delete.
   */
  async deleteProposal(
    program: Program,
    user: PublicKey,
    proposalPublicKey: PublicKey,
  ) {
    await ensureBuffer()
    try {
      // Check if user owns the proposal
      // @ts-expect-error: proposal account type may not be inferred
      const proposal = await program.account['proposal'].fetch(proposalPublicKey)
      if (!proposal.owner.equals(user)) {
        throw { code: 6000, message: 'Only proposal owner can delete' }
      }

      const tx = await program.methods
        .deleteProposal()
        .accounts({
          proposal: proposalPublicKey,
          user: user,
        })
        .rpc({ skipPreflight: true })

      return { signature: tx }
    }
    catch (error: any) {
      console.error('Error deleting proposal:', error)
      const { handleGovernanceError } = useGovernance()
      throw new Error(handleGovernanceError(error))
    }
  },

  /**
   * Get vote record for a specific user and proposal
   * @param program - The initialized Anchor Program instance.
   * @param proposalPublicKey - The PublicKey of the proposal.
   * @param voterPublicKey - The PublicKey of the voter.
   */
  async getVoteRecord(
    program: Program,
    proposalPublicKey: PublicKey,
    voterPublicKey: PublicKey,
  ) {
    await ensureBuffer()
    try {
      const { checkVoteRecord } = useGovernance()
      return await checkVoteRecord(program, proposalPublicKey, voterPublicKey)
    }
    catch (error) {
      console.error('Error fetching vote record:', error)
      return { hasVoted: false, voteRecord: null }
    }
  },
}
