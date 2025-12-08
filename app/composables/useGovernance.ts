import type { PublicKey } from '@solana/web3.js'
import type { BN } from '@coral-xyz/anchor'

let anchorLib: typeof import('@coral-xyz/anchor') | undefined
let web3: typeof import('@solana/web3.js') | undefined
let BNClass: typeof import('@coral-xyz/anchor').BN | undefined

export async function loadAnchor() {
  if (!anchorLib) {
    anchorLib = await import('@coral-xyz/anchor')
    web3 = anchorLib.web3
    BNClass = anchorLib.BN
  }
  return { anchorLib, web3, BNClass }
}

// --- Types ---
export interface CreateProposalForm {
  title: string
  brief: string
  cate: string
  reference: string
  amount: number
}

export interface VoteRecordData {
  proposalId: PublicKey
  voter: PublicKey
  hasVoted: boolean
  vote: string
  votePower: BN
}

export interface ProposalData {
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

// --- Helpers ---
export const ensureBuffer = async (): Promise<typeof Buffer> => {
  if (typeof window !== 'undefined' && !(window as unknown).Buffer) {
    const { Buffer } = await import('buffer')
    ;(window as unknown).Buffer = Buffer
  }
  return typeof window !== 'undefined'
    ? (window as unknown).Buffer
    : (globalThis as unknown).Buffer
}

/**
 * Parse Anchor/Solana error to extract error code
 */
const parseAnchorError = (error: unknown): { code?: number, message: string } => {
  let errorCode: number | undefined
  let errorMessage = 'Unknown error'

  console.log('🔍 Parsing error:', error)

  if (error && typeof error === 'object') {
    // Check for Anchor error format
    if ('code' in error) {
      errorCode = error.code as number
      console.log('✅ Found error code (direct):', errorCode)
    }
    // Check for InstructionError format [index, {Custom: code}]
    else if ('InstructionError' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instructionError = (error as any).InstructionError
      console.log('📦 InstructionError:', instructionError)

      if (Array.isArray(instructionError) && instructionError.length > 1) {
        const customError = instructionError[1]
        console.log('🔧 Custom error:', customError)

        if (customError && typeof customError === 'object' && 'Custom' in customError) {
          errorCode = customError.Custom
          console.log('✅ Found error code (Custom):', errorCode)
        }
      }
    }
    // Check for logs in error
    else if ('logs' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const logs = (error as any).logs
      console.log('📝 Error logs:', logs)

      // Try to extract error code from logs
      if (Array.isArray(logs)) {
        for (const log of logs) {
          const match = log.match(/Error Code: (\d+)/)
          if (match) {
            errorCode = parseInt(match[1])
            console.log('✅ Found error code (logs):', errorCode)
            break
          }
        }
      }
    }

    if ('message' in error) {
      errorMessage = String(error.message)
    }
  }
  else if (error instanceof Error) {
    errorMessage = error.message
  }

  console.log('🎯 Final parsed error:', { code: errorCode, message: errorMessage })
  return errorCode ? { code: errorCode, message: errorMessage } : { message: errorMessage }
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

      const stakeAccount = await program.account['stakeAccount'].fetch(
        stakeAccountPda,
      )

      // Convert from smallest unit to UI amount (divide by 10^6 for 6 decimals)
      // Note: IDL uses snake_case field names
      const stakedAmountRaw = stakeAccount.stakedAmount?.toNumber() || 0
      const pendingUnstakeRaw = stakeAccount.pendingUnstake?.toNumber() || 0
      const pendingRewardsRaw = stakeAccount.pendingRewards?.toNumber() || 0

      return {
        owner: stakeAccount.owner,
        stakedAmount: stakedAmountRaw / 1_000_000,
        lastStakeTime: stakeAccount.lastStakeTime?.toNumber() || 0,
        pendingUnstake: pendingUnstakeRaw / 1_000_000,
        unstakeRequestedAt: stakeAccount.unstakeRequestedAt?.toNumber() || 0,
        pendingRewards: pendingRewardsRaw / 1_000_000,
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
    const dayjs = useDayjs()
    if (unstakeRequestedAt === 0) return 'No cooldown'

    const cooldownEnd = dayjs.unix(unstakeRequestedAt).add(7, 'day')
    const now = dayjs()

    return now.isAfter(cooldownEnd)
      ? 'Cooldown complete'
      : cooldownEnd.from(now) + ' remaining'
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
    const errorObj = error && typeof error === 'object' && 'code' in error
      ? error as { code?: number, message?: string }
      : null

    if (errorObj?.code) {
      switch (errorObj.code) {
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
        case 6012:
          return 'You already have a pending unstake request. Please claim your tokens first before unstaking again.'
        default:
          return `Governance error (${errorObj.code}): ${
            errorObj.message || 'Unknown error occurred'
          }`
      }
    }

    const message = errorObj?.message
      || (error && typeof error === 'object' && 'message' in error ? String(error.message) : null)
      || (error instanceof Error ? error.message : null)
      || 'An unexpected error occurred'

    return message
  }

  /**
   * Check if user can vote on a proposal
   */
  const canVote = (isExpired: boolean, hasVoted: boolean): boolean => {
    return !isExpired && !hasVoted
  }

  /**
   * Check if user can request funds for a proposal
   */
  const canRequestFund = (proposal: ProposalData, userPublicKey: PublicKey): boolean => {
    if (!proposal || !userPublicKey) return false

    const agreeVotes = proposal.agreeVotes?.toNumber() || 0
    const disagreeVotes = proposal.disagreeVotes?.toNumber() || 0

    return agreeVotes > disagreeVotes
  }

  /**
   * Handle voting on a proposal
   */
  const handleVote = async (
    proposalPublicKey: string,
    agree: boolean,
    onSuccess?: () => void,
  ): Promise<boolean> => {
    try {
      const { PublicKey } = await import('@solana/web3.js')
      const proposalPk = new PublicKey(proposalPublicKey)

      await governance.vote(proposalPk, agree)

      if (onSuccess) {
        onSuccess()
      }

      return true
    }
    catch (error) {
      console.error('Vote failed:', error)
      return false
    }
  }

  /**
   * Handle requesting funds for a passed proposal
   */
  const handleRequestFund = async (
    proposalPublicKey: string,
    onSuccess?: () => void,
  ): Promise<boolean> => {
    try {
      const { PublicKey } = await import('@solana/web3.js')
      const proposalPk = new PublicKey(proposalPublicKey)

      await governance.requestFund(proposalPk)

      if (onSuccess) {
        onSuccess()
      }

      return true
    }
    catch (error) {
      console.error('Request fund failed:', error)
      return false
    }
  }

  /**
   * Format timestamp to date string
   */
  const formatDate = (timestamp: number): string => {
    if (!timestamp) return '00/00/0000'
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  /**
   * Format public key address for display
   */
  const formatAddress = (publicKey: unknown): string => {
    if (!publicKey) return '0X00...00'

    let address: string
    if (typeof publicKey === 'string') {
      address = publicKey
    }
    else if (publicKey && typeof publicKey === 'object' && 'toBase58' in publicKey) {
      address = (publicKey as { toBase58: () => string }).toBase58()
    }
    else {
      return '0X00...00'
    }

    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  /**
   * Check if user is the owner of a proposal
   */
  const isProposalOwner = (proposalOwner: unknown, userPublicKey: unknown): boolean => {
    if (!proposalOwner || !userPublicKey) return false

    if (typeof proposalOwner === 'object' && 'equals' in proposalOwner) {
      return (proposalOwner as { equals: (key: unknown) => boolean }).equals(userPublicKey)
    }

    return false
  }

  /**
   * Check if wallet is connected and ready
   */
  const isWalletReady = computed(() => {
    return (
      workspace?.connected?.value
      && workspace?.publicKey?.value
      && workspace?.program?.value
    )
  })

  /**
   * User stake information (reactive)
   */
  const userStakeInfo = ref<{
    stakedAmount: number
    pendingUnstake: number
    unstakeRequestedAt: number
    pendingRewards: number
  } | null>(null)

  /**
   * Check if user has staked tokens
   */
  const hasStakedTokens = computed(() => {
    return userStakeInfo.value && userStakeInfo.value.stakedAmount > 0
  })

  /**
   * Fetch user stake info
   * Automatically uses workspace internally
   */
  const fetchUserStakeInfo = async () => {
    if (!isWalletReady.value) {
      userStakeInfo.value = null
      return
    }

    try {
      const info = await getStakeAccount()
      userStakeInfo.value = info
    }
    catch (error) {
      console.warn('Failed to fetch user stake info:', error)
      userStakeInfo.value = null
    }
  }

  /**
   * Get program from workspace
   */
  const getProgram = () => workspace?.program?.value

  /**
   * Get public key from workspace
   */
  const getPublicKey = () => workspace?.publicKey?.value

  /**
   * Get connection from workspace
   */
  const getConnection = () => workspace?.connection?.value

  /**
   * Get connection status
   */
  const isConnected = computed(() => workspace?.connected?.value || false)

  /**
   * Fetch stats from blockchain
   */
  const fetchStats = async () => {
    const program = workspace?.program?.value
    if (!program) return null

    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

    try {
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

      const stats = await program.account['stats'].fetch(statsPda)

      return {
        totalProposals: stats.totalProposals?.toNumber?.() || 0,
        activeVoters: stats.activeVoters?.toNumber?.() || 0,
        proposalsPassed: stats.proposalsPassed?.toNumber?.() || 0,
        treasuryBalance: (stats.treasuryBalance?.toNumber?.() || 0) / 1_000_000,
        totalStaked: (stats.totalStaked?.toNumber?.() || 0) / 1_000_000,
        totalRewards: (stats.totalRewards?.toNumber?.() || 0) / 1_000_000,
      }
    }
    catch (error) {
      console.warn('Failed to fetch stats:', error)
      return null
    }
  }

  // auto-ensure Buffer on composable usage
  if (typeof window !== 'undefined') ensureBuffer().catch(console.error)

  return {
    // Workspace (for backward compatibility - prefer using helpers instead)
    workspace,
    // Workspace helpers
    isWalletReady,
    isConnected,
    getProgram,
    getPublicKey,
    getConnection,
    // Stake info
    userStakeInfo,
    hasStakedTokens,
    fetchUserStakeInfo,
    // Stats
    fetchStats,
    // State
    isLoading,
    error,
    // Vote power & stake
    calculateVotePower,
    getStakeAccount,
    isCooldownComplete,
    getRemainingCooldown,
    // Voting
    checkVoteRecord,
    isProposalExpired,
    handleGovernanceError,
    // Actions
    canVote,
    canRequestFund,
    handleVote,
    handleRequestFund,
    isProposalOwner,
    // Formatters
    formatDate,
    formatAddress,
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
   * Uses workspace internally - no need to pass program
   */
  async fetchProposals() {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value

    if (!program) {
      throw new Error('Program not initialized')
    }

    const BNClass = BNClassRef.value ?? (() => {
      throw new Error('BN not initialized')
    })()
    try {
      const proposals = await (program.account as unknown).proposal.all()
      return proposals.map((proposal: unknown) => ({
        ...proposal,
        account: {
          ...proposal.account,
          // Ensure proper data types
          agreeVotes: proposal.account.agreeVotes || new BNClass(0),
          disagreeVotes: proposal.account.disagreeVotes || new BNClass(0),
          amount: proposal.account.amount || new BNClass(0),
          createdAt: proposal.account.createdAt || new BNClass(0),
          expiresAt: proposal.account.expiresAt || new BNClass(0),
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
   * Uses workspace internally - no need to pass program
   */
  async fetchLatestProposals() {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value

    if (!program) {
      throw new Error('Program not initialized')
    }

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
   * Uses workspace internally - no need to pass program/user
   * @param formData - The data for the new proposal.
   */
  async createProposal(formData: CreateProposalForm) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }

    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

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
      // Derive stats PDA
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

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
          stats: statsPda,
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
   * Uses workspace internally - no need to pass program/voter
   * @param proposalPublicKey - The PublicKey of the proposal being voted on.
   * @param agree - Boolean vote (true for 'Yes', false for 'No').
   * @param votePower - Optional vote power (will be calculated if not provided).
   */
  async vote(
    proposalPublicKey: PublicKey,
    agree: boolean,
    votePower?: number,
  ) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const voter = workspace.publicKey?.value

    if (!program || !voter) {
      throw new Error('Wallet not connected or program not initialized')
    }

    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

    try {
      const { checkVoteRecord, isProposalExpired }
        = useGovernance()

      // Check if proposal exists and is not expired
      const proposal = await program.account['proposal'].fetch(
        proposalPublicKey,
      )
      if (isProposalExpired(proposal as ProposalData)) {
        throw { code: 6002, message: 'Proposal has expired' }
      }

      // Check if user has already voted
      const { hasVoted } = await checkVoteRecord(proposalPublicKey)
      if (hasVoted) {
        throw { code: 6001, message: 'User has already voted' }
      }

      // Calculate vote power based on staked tokens (v2.0)
      let finalVotePower = votePower || 0

      if (!votePower) {
        try {
          const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from('stake_account'), voter.toBuffer()],
            program.programId,
          )
          const stakeAccount = await program.account['stakeAccount'].fetch(stakeAccountPda)
          const stakedAmountRaw = stakeAccount.staked_amount?.toNumber() || stakeAccount.stakedAmount?.toNumber() || 0
          finalVotePower = stakedAmountRaw / 1_000_000
        }
        catch {
          finalVotePower = 0
        }
      }

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

        // Derive stats PDA for vote
        const [statsPda] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from('stats')],
          program.programId,
        )

        const tx = await program.methods
          .vote(agree)
          .accounts({
            proposal: proposalPublicKey,
            voter: voter,
            voteRecord: voteRecordPDA,
            stakeAccount: stakeAccountPda,
            stats: statsPda,
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
   * Uses workspace internally - no need to pass program/user
   * @param proposalPublicKey - The PublicKey of the proposal to delete.
   */
  async deleteProposal(proposalPublicKey: PublicKey) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }

    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

    try {
      // Check if user owns the proposal
      // @ts-expect-error: proposal account type may not be inferred
      const proposal = await program.account['proposal'].fetch(
        proposalPublicKey,
      )
      if (!proposal.owner.equals(user)) {
        throw { code: 6000, message: 'Only proposal owner can delete' }
      }

      // Derive stake account PDA
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), proposal.owner.toBuffer()],
        program.programId,
      )

      // Derive stats PDA
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

      const tx = await program.methods
        .deleteProposal()
        .accounts({
          proposal: proposalPublicKey,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
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
   * Uses workspace internally - no need to pass program/publicKey
   * @param proposalPublicKey - The PublicKey of the proposal.
   */
  async getVoteRecord(proposalPublicKey: PublicKey) {
    await ensureBuffer()
    try {
      const { checkVoteRecord } = useGovernance()
      return await checkVoteRecord(proposalPublicKey)
    }
    catch (error) {
      console.error('Error fetching vote record:', error)
      return { hasVoted: false, voteRecord: null }
    }
  },

  /**
   * Stake tokens for governance participation (v2.0)
   * Uses workspace internally - no need to pass program/user
   * @param amount - Amount of tokens to stake.
   * @param userTokenAccount - User's token account.
   * @param vaultTokenAccount - Vault token account.
   * @param mint - Token mint address.
   */
  async stake(
    amount: number,
    userTokenAccount: PublicKey,
    vaultTokenAccount: PublicKey,
    mint: PublicKey,
  ) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }

    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

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

      console.log('step 2')
      // Derive stats PDA
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

      console.log('🔍 Staking details:', {
        amount,
        amountInSmallestUnit,
        user: user.toBase58(),
        userTokenAccount: userTokenAccount.toBase58(),
        vaultTokenAccount: vaultTokenAccount.toBase58(),
        mint: mint.toBase58(),
        stakeAccount: stakeAccountPda.toBase58(),
        stats: statsPda.toBase58(),
      })

      console.log('step 4')

      const tx = await program.methods
        .stake(new BN(amountInSmallestUnit))
        .accounts({
          user: user,
          userTokenAccount: userTokenAccount,
          vaultTokenAccount: vaultTokenAccount,
          mint: mint,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
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
   * Unstake tokens (initiates 1-hour cooldown) (v2.0)
   * Uses workspace internally - no need to pass program/user
   * @param amount - Amount of tokens to unstake.
   */
  async unstake(amount: number) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }
    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

    try {
      const [stakeAccountPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), user.toBuffer()],
        program.programId,
      )

      // Convert UI amount to smallest unit (multiply by 10^6 for 6 decimals)
      const amountInSmallestUnit = Math.floor(amount * 1_000_000)

      // Derive stats PDA
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

      const tx = await program.methods
        .unstake(new BN(amountInSmallestUnit))
        .accounts({
          stakeAccount: stakeAccountPda,
          stats: statsPda,
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
   * Uses workspace internally - no need to pass program/user
   * @param userTokenAccount - User's token account.
   * @param vaultTokenAccount - Vault token account.
   * @param mint - Token mint address.
   */
  async claimUnstake(
    userTokenAccount: PublicKey,
    vaultTokenAccount: PublicKey,
    mint: PublicKey,
  ) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }
    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

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

      // Derive stats PDA
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

      const tx = await program.methods
        .calimUnstake()
        .accounts({
          user: user,
          userTokenAccount: userTokenAccount,
          vaultTokenAccount: vaultTokenAccount,
          vaultAuthority: vaultAuthority,
          mint: mint,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
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

      // Log full error for debugging
      if (error && typeof error === 'object') {
        console.error('Error details:', JSON.stringify(error, null, 2))
      }

      const { handleGovernanceError } = useGovernance()
      const errorObj = parseAnchorError(error)

      throw new Error(handleGovernanceError(errorObj))
    }
  },

  /**
   * Initialize or reallocate Stats account (admin only)
   * Uses workspace internally
   */
  async initOrReallocStats() {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }
    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

    try {
      const [statsPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        program.programId,
      )

      // Try to fetch stats first
      let statsExists = false
      try {
        await program.account['stats'].fetch(statsPda)
        statsExists = true
      }
      catch {
        statsExists = false
      }

      let tx
      if (statsExists) {
        // Realloc existing stats
        console.log('📊 Reallocating stats account...')
        tx = await program.methods
          .reallocStats()
          .accounts({
            stats: statsPda,
            authority: user,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc({ skipPreflight: true })
      }
      else {
        // Initialize new stats
        console.log('📊 Initializing stats account...')
        tx = await program.methods
          .initStats()
          .accounts({
            stats: statsPda,
            authority: user,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc({ skipPreflight: true })
      }

      const latestBlockhash = await program.provider.connection.getLatestBlockhash()
      await program.provider.connection.confirmTransaction({
        signature: tx,
        ...latestBlockhash,
      })

      return { signature: tx, action: statsExists ? 'realloc' : 'init' }
    }
    catch (error: unknown) {
      console.error('Error initializing/reallocating stats:', error)

      if (error && typeof error === 'object') {
        console.error('Error details:', JSON.stringify(error, null, 2))
      }

      const { handleGovernanceError } = useGovernance()
      const errorObj = parseAnchorError(error)
      throw new Error(handleGovernanceError(errorObj))
    }
  },

  /**
   * Request fund for a passed proposal
   * Uses workspace internally - no need to pass program/user
   * @param proposalPublicKey - The PublicKey of the proposal.
   */
  async requestFund(proposalPublicKey: PublicKey) {
    await ensureBuffer()
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const user = workspace.publicKey?.value

    if (!program || !user) {
      throw new Error('Wallet not connected or program not initialized')
    }
    const { anchorLib, web3, BNClass } = await loadAnchor()
    if (!anchorLib || !web3 || !BNClass) throw new Error('Failed to load Anchor')

    try {
      // Get runtime config for multisig address
      const config = useRuntimeConfig()
      const multisigAddress = config.public?.solanaMultisigAddress

      if (!multisigAddress) {
        throw new Error('Multisig address not configured')
      }

      const multisig = new web3.PublicKey(multisigAddress)

      // Derive transaction PDA (you may need to adjust seeds based on your program)
      const [transactionPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('transaction'), proposalPublicKey.toBuffer()],
        program.programId,
      )

      const tx = await program.methods
        .requestFund()
        .accounts({
          proposal: proposalPublicKey,
          multisig: multisig,
          transaction: transactionPda,
          creator: user,
          rentPayer: user,
          systemProgram: web3.SystemProgram.programId,
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
      console.error('Error requesting fund:', error)
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
