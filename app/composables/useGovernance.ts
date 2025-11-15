import { ref } from 'vue'
import type { PublicKey } from '@solana/web3.js'

let anchor: typeof import('@coral-xyz/anchor')

// Load dynamically only on client
if (import.meta.client) {
  const mod = await import('@coral-xyz/anchor')
  anchor = mod
}
else {
  // optional: fallback to CJS build for SSR if needed
  const mod = await import('@coral-xyz/anchor/dist/cjs')
  anchor = mod
}

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
  if (typeof window !== 'undefined' && !(window as unknown).Buffer) {
    const { Buffer } = await import('buffer');
    (window as unknown).Buffer = Buffer
  }
  return typeof window !== 'undefined'
    ? (window as unknown).Buffer
    : (globalThis as unknown).Buffer
}

/**
 * Enhanced governance composable with proper error handling and vote power calculation
 */
export const useGovernance = () => {
  const workspace = useWorkspace()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Calculate vote power based on user's staked tokens (v2.0)
   * Uses workspace internally - no need to pass program/publicKey
   * @returns Vote power as a number (based on staked amount)
   */
  const calculateVotePower = async (): Promise<number> => {
    const program = workspace.program?.value
    const userPublicKey = workspace.publicKey?.value

    if (!program || !userPublicKey) return 0
    try {
      // Get user's stake account
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), userPublicKey.toBuffer()],
        program.programId,
      )

      try {
        // @ts-expect-error: stakeAccount type may not be inferred
        const stakeAccount = await program.account['stakeAccount'].fetch(
          stakeAccountPda,
        )

        // Vote power is based on staked amount only
        // Convert from smallest unit to UI amount (divide by 10^6 for 6 decimals)
        const stakedAmountRaw = stakeAccount.stakedAmount?.toNumber() || 0
        return stakedAmountRaw / 1_000_000
      }
      catch {
        // Stake account doesn't exist, no vote power
        return 0
      }
    }
    catch (error) {
      console.warn('Failed to calculate vote power:', error)
      return 0
    }
  }

  /**
   * Get user's stake account information
   * Uses workspace internally - no need to pass program/publicKey
   * @returns Stake account data or null
   */
  const getStakeAccount = async () => {
    const program = workspace.program?.value
    const userPublicKey = workspace.publicKey?.value

    if (!program || !userPublicKey) return null
    try {
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), userPublicKey.toBuffer()],
        program.programId,
      )

      // @ts-expect-error: stakeAccount type may not be inferred
      const stakeAccount = await program.account['stakeAccount'].fetch(
        stakeAccountPda,
      )

      // Convert from smallest unit to UI amount (divide by 10^6 for 6 decimals)
      const stakedAmountRaw = stakeAccount.stakedAmount?.toNumber() || 0
      const pendingUnstakeRaw = stakeAccount.pendingUnstake?.toNumber() || 0

      return {
        owner: stakeAccount.owner,
        stakedAmount: stakedAmountRaw / 1_000_000,
        lastStakeTime: stakeAccount.lastStakeTime?.toNumber() || 0,
        pendingUnstake: pendingUnstakeRaw / 1_000_000,
        unstakeRequestedAt: stakeAccount.unstakeRequestedAt?.toNumber() || 0,
      }
    }
    catch {
      // Stake account doesn't exist
      return null
    }
  }

  /**
   * Check if cooldown period has passed (1 hour for testing)
   * @param unstakeRequestedAt - Timestamp when unstake was requested
   * @returns Whether cooldown has passed
   */
  const isCooldownComplete = (unstakeRequestedAt: number): boolean => {
    if (unstakeRequestedAt === 0) return false
    const now = Math.floor(Date.now() / 1000)
    const cooldownPeriod = 60 * 60 // 1 hour in seconds
    return now >= unstakeRequestedAt + cooldownPeriod
  }

  /**
   * Get remaining cooldown time in human-readable format
   * @param unstakeRequestedAt - Timestamp when unstake was requested
   * @returns Remaining time string
   */
  const getRemainingCooldown = (unstakeRequestedAt: number): string => {
    if (unstakeRequestedAt === 0) return 'No cooldown'
    const now = Math.floor(Date.now() / 1000)
    const cooldownPeriod = 60 * 60 // 1 hour in seconds
    const cooldownEnd = unstakeRequestedAt + cooldownPeriod
    const remaining = cooldownEnd - now

    if (remaining <= 0) return 'Cooldown complete'

    const hours = Math.floor(remaining / (60 * 60))
    const minutes = Math.floor((remaining % (60 * 60)) / 60)
    const seconds = remaining % 60

    if (hours > 0) return `${hours}h ${minutes}m remaining`
    if (minutes > 0) return `${minutes}m ${seconds}s remaining`
    return `${seconds}s remaining`
  }

  /**
   * Check if user has already voted on a proposal
   * Uses workspace internally - no need to pass program/voterPublicKey
   * @param proposalPublicKey - Proposal public key
   * @returns Whether user has voted and vote record data
   */
  const checkVoteRecord = async (
    proposalPublicKey: PublicKey,
  ): Promise<{ hasVoted: boolean, voteRecord: VoteRecordData | null }> => {
    const program = workspace.program?.value
    const voterPublicKey = workspace.publicKey?.value

    if (!program || !voterPublicKey) {
      return { hasVoted: false, voteRecord: null }
    }
    try {
      const [voteRecordPDA] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('vote-record'),
          proposalPublicKey.toBuffer(),
          voterPublicKey.toBuffer(),
        ],
        program.programId,
      )

      // @ts-expect-error: voteRecord account type may not be typed in IDL
      const voteRecord = await program.account['voteRecord'].fetch(
        voteRecordPDA,
      )
      return {
        hasVoted: voteRecord.hasVoted,
        voteRecord: voteRecord as VoteRecordData,
      }
    }
    catch {
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
  const handleGovernanceError = (error: unknown): string => {
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
        case 6007:
          return 'Insufficient staked tokens. Please stake more tokens to perform this action.'
        case 6008:
          return 'You must stake tokens to participate in governance. Please stake some $GET tokens first.'
        case 6010:
          return 'Cooldown period is still active. Please wait before claiming your unstaked tokens.'
        case 6011:
          return 'Nothing to claim. No pending unstake found.'
        default:
          return `Governance error: ${
            error.message || 'Unknown error occurred'
          }`
      }
    }
    return error.message || 'An unexpected error occurred'
  }

  // auto-ensure Buffer on composable usage
  if (typeof window !== 'undefined') ensureBuffer().catch(console.error)

  return {
    workspace,
    isLoading,
    error,
    calculateVotePower,
    getStakeAccount,
    isCooldownComplete,
    getRemainingCooldown,
    checkVoteRecord,
    isProposalExpired,
    handleGovernanceError,
  }
}

/**
 * Get program ID from IDL
 */
export async function getProgramId(): Promise<string> {
  // Dynamic import for IDL
  const idl = await import('~/idl/gamaedtech_program.json')
  return idl.default?.address || idl.address
}

/**
 * Get token mint address from runtime config
 */
export function getTokenMint(): string {
  const config = useRuntimeConfig()
  const tokenMint = config.public.solanaTokenMint as string
  return tokenMint
}

/**
 * Get vault authority PDA address
 */
export async function getVaultAddress(): Promise<string> {
  if (!import.meta.client) {
    throw new Error('getVaultAddress can only be called on client side')
  }

  const { PublicKey } = await import('@solana/web3.js')
  const programIdStr = await getProgramId()
  const programId = new PublicKey(programIdStr)

  const [vaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault-authority')],
    programId,
  )

  return vaultAuthority.toBase58()
}

/**
 * Get Token-2022 program ID
 */
export function getTokenProgramId(): string {
  return 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
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
      const proposals = await (program.account as unknown).proposal.all()
      return proposals.map((proposal: unknown) => ({
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
      const proposals = await (program.account as unknown).proposal.all()

      const mapped = proposals.map((proposal: unknown) => ({
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

      mapped.sort((a: unknown, b: unknown) => {
        const aCreated = a.account.createdAt.toNumber
          ? a.account.createdAt.toNumber()
          : Number(a.account.createdAt)
        const bCreated = b.account.createdAt.toNumber
          ? b.account.createdAt.toNumber()
          : Number(b.account.createdAt)
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

      // Fetch user_state (if exists) to get proposal_count
      let proposalCount = 0
      try {
        const userStateAccount = await program.account.userState.fetch(
          userStatePda,
        )
        proposalCount = userStateAccount.proposalCount
      }
      catch {
        // If account doesn't exist, first proposal -> count = 0
        proposalCount = 0
      }

      // Derive proposal PDA
      const [proposalPda] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('proposal'),
          user.toBuffer(),
          new BN(proposalCount).toArrayLike(Buffer, 'le', 8),
        ],
        program.programId,
      )
      // Derive stackAccount PDA
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), user.toBuffer()],
        program.programId,
      )

      const { title, brief, cate, reference, amount } = formData
      const tx = await program.methods
        .createProposal(
          title.trim(),
          brief.trim(),
          cate || 'general',
          reference || '',
          new BN(amount || 0),
        )
        .accounts({
          userState: userStatePda,
          proposal: proposalPda,
          user: user,
          stakeAccount: stakeAccountPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: true })

      const latestBlockhash
        = await program.provider.connection.getLatestBlockhash()
      await program.provider.connection.confirmTransaction({
        signature: tx,
        ...latestBlockhash,
      })

      return {
        signature: tx,
        proposalPublicKey: proposalPda,
      }
    }
    catch (error: unknown) {
      console.error('Error creating proposal:', error)
      const { handleGovernanceError } = useGovernance()
      const errorObj
        = error && typeof error === 'object' && 'code' in error
          ? (error as { code?: number, message?: string })
          : {
              message:
                error instanceof Error ? error.message : 'Unknown action',
            }
      const msg = handleGovernanceError(errorObj) || 'Unknown action'
      throw new Error(msg)
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
      const { checkVoteRecord, calculateVotePower, isProposalExpired }
        = useGovernance()

      // Check if proposal exists and is not expired
      // @ts-expect-error: proposal account type may not be inferred
      const proposal = await program.account['proposal'].fetch(
        proposalPublicKey,
      )
      if (isProposalExpired(proposal as ProposalData)) {
        throw { code: 6002, message: 'Proposal has expired' }
      }

      // Check if user has already voted
      const { hasVoted } = await checkVoteRecord(
        program,
        proposalPublicKey,
        voter,
      )
      if (hasVoted) {
        throw { code: 6001, message: 'User has already voted' }
      }

      // Calculate vote power based on staked tokens (v2.0)
      const finalVotePower
        = votePower || (await calculateVotePower(program, voter))

      if (finalVotePower === 0) {
        const error = {
          code: 6008, // NoStakePower error
        }
        const { handleGovernanceError } = useGovernance()
        throw new Error(handleGovernanceError(error))
      }
      else {
        const [voteRecordPDA] = web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from('vote-record'),
            proposalPublicKey.toBuffer(),
            voter.toBuffer(),
          ],
          program.programId,
        )

        // Get stake account PDA
        const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from('stake_account'), voter.toBuffer()],
          program.programId,
        )

        const tx = await program.methods
          .vote(agree)
          .accounts({
            proposal: proposalPublicKey,
            voter: voter,
            voteRecord: voteRecordPDA,
            stakeAccount: stakeAccountPda,
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
    catch (error: unknown) {
      console.error('Error voting on proposal:', error)
      const { handleGovernanceError } = useGovernance()
      const errorObj
        = error && typeof error === 'object' && 'code' in error
          ? (error as { code?: number, message?: string })
          : {
              message: error instanceof Error ? error.message : 'Unknown error',
            }
      throw new Error(handleGovernanceError(errorObj))
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
      const proposal = await program.account['proposal'].fetch(
        proposalPublicKey,
      )
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
    catch (error: unknown) {
      console.error('Error deleting proposal:', error)
      const { handleGovernanceError } = useGovernance()
      const errorObj
        = error && typeof error === 'object' && 'code' in error
          ? (error as { code?: number, message?: string })
          : {
              message: error instanceof Error ? error.message : 'Unknown error',
            }
      throw new Error(handleGovernanceError(errorObj))
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

  /**
   * Stake tokens for governance participation (v2.0)
   * @param program - The initialized Anchor Program instance.
   * @param user - The PublicKey of the user staking tokens.
   * @param amount - Amount of tokens to stake.
   * @param userTokenAccount - User's token account.
   * @param vaultTokenAccount - Vault token account.
   * @param mint - Token mint address.
   */
  async stake(
    program: Program,
    user: PublicKey,
    amount: number,
    userTokenAccount: PublicKey,
    vaultTokenAccount: PublicKey,
    mint: PublicKey,
  ) {
    await ensureBuffer()
    try {
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), user.toBuffer()],
        program.programId,
      )

      // Use Token-2022 program
      const TOKEN_2022_PROGRAM_ID = new web3.PublicKey(
        'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      )

      // Convert UI amount to smallest unit (multiply by 10^6 for 6 decimals)
      const amountInSmallestUnit = Math.floor(amount * 1_000_000)

      console.log('🔍 Staking details:', {
        amount,
        amountInSmallestUnit,
        user: user.toBase58(),
        userTokenAccount: userTokenAccount.toBase58(),
        vaultTokenAccount: vaultTokenAccount.toBase58(),
        mint: mint.toBase58(),
        stakeAccount: stakeAccountPda.toBase58(),
      })

      const tx = await program.methods
        .stack(new BN(amountInSmallestUnit))
        .accounts({
          user: user,
          userTokenAccount: userTokenAccount,
          vaultTokenAccount: vaultTokenAccount,
          mint: mint,
          stakeAccount: stakeAccountPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: false, commitment: 'confirmed' })

      const latestBlockhash
        = await program.provider.connection.getLatestBlockhash()
      await program.provider.connection.confirmTransaction({
        signature: tx,
        ...latestBlockhash,
      })

      return { signature: tx }
    }
    catch (error: unknown) {
      console.error('Error staking tokens:', error)
      const { handleGovernanceError } = useGovernance()
      const errorObj
        = error && typeof error === 'object' && 'code' in error
          ? (error as { code?: number, message?: string })
          : {
              message: error instanceof Error ? error.message : 'Unknown error',
            }
      throw new Error(handleGovernanceError(errorObj))
    }
  },

  /**
   * Unstake tokens (initiates 3-day cooldown) (v2.0)
   * @param program - The initialized Anchor Program instance.
   * @param user - The PublicKey of the user unstaking tokens.
   * @param amount - Amount of tokens to unstake.
   */
  async unstake(program: Program, user: PublicKey, amount: number) {
    await ensureBuffer()
    try {
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), user.toBuffer()],
        program.programId,
      )

      // Convert UI amount to smallest unit (multiply by 10^6 for 6 decimals)
      const amountInSmallestUnit = Math.floor(amount * 1_000_000)

      const tx = await program.methods
        .unstack(new BN(amountInSmallestUnit))
        .accounts({
          stakeAccount: stakeAccountPda,
          user: user,
        })
        .rpc({ skipPreflight: true })

      const latestBlockhash
        = await program.provider.connection.getLatestBlockhash()
      await program.provider.connection.confirmTransaction({
        signature: tx,
        ...latestBlockhash,
      })

      return { signature: tx }
    }
    catch (error: unknown) {
      console.error('Error unstaking tokens:', error)
      const { handleGovernanceError } = useGovernance()
      const errorObj
        = error && typeof error === 'object' && 'code' in error
          ? (error as { code?: number, message?: string })
          : {
              message: error instanceof Error ? error.message : 'Unknown error',
            }
      throw new Error(handleGovernanceError(errorObj))
    }
  },

  /**
   * Claim unstaked tokens after cooldown period (v2.0)
   * @param program - The initialized Anchor Program instance.
   * @param user - The PublicKey of the user claiming tokens.
   * @param userTokenAccount - User's token account.
   * @param vaultTokenAccount - Vault token account.
   * @param mint - Token mint address.
   */
  async claimUnstake(
    program: Program,
    user: PublicKey,
    userTokenAccount: PublicKey,
    vaultTokenAccount: PublicKey,
    mint: PublicKey,
  ) {
    await ensureBuffer()
    try {
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), user.toBuffer()],
        program.programId,
      )

      const [vaultAuthority] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('vault-authority')],
        program.programId,
      )

      // Use Token-2022 program
      const TOKEN_2022_PROGRAM_ID = new web3.PublicKey(
        'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      )

      const tx = await program.methods
        .calimUnstack()
        .accounts({
          user: user,
          userTokenAccount: userTokenAccount,
          vaultTokenAccount: vaultTokenAccount,
          vaultAuthority: vaultAuthority,
          mint: mint,
          stakeAccount: stakeAccountPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ skipPreflight: true })

      const latestBlockhash
        = await program.provider.connection.getLatestBlockhash()
      await program.provider.connection.confirmTransaction({
        signature: tx,
        ...latestBlockhash,
      })

      return { signature: tx }
    }
    catch (error: unknown) {
      console.error('Error claiming unstaked tokens:', error)
      const { handleGovernanceError } = useGovernance()
      const errorObj
        = error && typeof error === 'object' && 'code' in error
          ? (error as { code?: number, message?: string })
          : {
              message: error instanceof Error ? error.message : 'Unknown error',
            }
      throw new Error(handleGovernanceError(errorObj))
    }
  },
}
