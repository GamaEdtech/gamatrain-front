import type { Program } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { StakeAccount } from '~/types/governance'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'

type CheckRequirementResult
  = | { ok: false, message: string }
    | {
      ok: true
      programChain: Program<GamaedtechProgram>
      userPublicKey: PublicKey
      connection: Connection
      message: string
    }

const userStakeInformation = ref<StakeAccount | null>()
const loadingStakeInformation = ref(true)

const loadinStakeProccess = ref(false)
const loadingUnstakeProcess = ref(false)
const loadingClaimProcess = ref(false)

export const useStake = () => {
  const { program, publicKey, web3, initPromise, BN, connection, splToken } = useWorkspace()
  const TOKEN_2022_PROGRAM_ID_STRING = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
  const config = useRuntimeConfig()
  const tokenMintString = config.public.solanaTokenMint as string
  const dayjs = useDayjs()

  const getVault = (programId: PublicKey) => {
    const [vaultAuthority] = web3.value.PublicKey.findProgramAddressSync(
      [Buffer.from('vault-authority')],
      programId,
    )
    return vaultAuthority
  }

  const getStakeAccountPda = (userPublicKey: PublicKey, programId: PublicKey) => {
    const [stakeAccountPda] = web3.value.PublicKey.findProgramAddressSync(
      [Buffer.from('stake_account'), userPublicKey.toBuffer()],
      programId,
    )
    return stakeAccountPda
  }

  const getStatsPda = (programId: PublicKey) => {
    const [statsPda] = web3.value.PublicKey.findProgramAddressSync(
      [Buffer.from('stats')],
      programId,
    )
    return statsPda
  }

  const checkReqiureMent = (): CheckRequirementResult => {
    const programChain = program?.value
    const userPublicKey = publicKey?.value
    const conn = connection.value

    if (!programChain) {
      return { ok: false, message: 'Program is not initialized or not ready.' }
    }

    if (!userPublicKey) {
      return { ok: false, message: 'Wallet is not connected. Please connect your wallet and try again.' }
    }

    if (!conn) {
      return { ok: false, message: 'Unable to connect to the Solana network. Please try again.' }
    }

    if (!web3.value) {
      return { ok: false, message: 'Unable to load Web3 to Connect Solana network. Check your internet and refresh page.' }
    }

    return {
      ok: true,
      programChain,
      userPublicKey,
      connection: conn,
      message: 'All requirement is ready.',
    }
  }

  const getUserStakeInformation = async () => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey } = check

    loadingStakeInformation.value = true
    try {
      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)
      const stakeAccount = await programChain.account['stakeAccount'].fetch(
        stakeAccountPda,
      )

      const stakedAmountRaw = stakeAccount.stakedAmount?.toNumber() || 0
      const pendingUnstakeRaw = stakeAccount.pendingUnstake?.toNumber() || 0
      const pendingRewardsRaw = stakeAccount.pendingRewards?.toNumber() || 0

      userStakeInformation.value = {
        owner: stakeAccount.owner,
        stakedAmount: stakedAmountRaw / 1_000_000,
        lastStakeTime: stakeAccount.lastStakeTime?.toNumber() || 0,
        pendingUnstake: pendingUnstakeRaw / 1_000_000,
        unstakeRequestedAt: stakeAccount.unstakeRequestedAt?.toNumber() || 0,
        pendingRewards: pendingRewardsRaw / 1_000_000,
      }
    }
    catch (err) {
      console.log('error', err)
    }
    finally {
      loadingStakeInformation.value = false
    }
  }

  const stakeToken = async (
    amount: number,
  ) => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection } = check

    try {
      loadinStakeProccess.value = true
      const rawAmount = Math.floor(amount * 1_000_000)
      const amountBN = new BN.value(rawAmount.toString())

      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)
      const statsPda = getStatsPda(programChain.programId)

      const TOKEN_2022_PROGRAM_ID = new web3.value.PublicKey(
        TOKEN_2022_PROGRAM_ID_STRING,
      )
      const tokenMint = new web3.value.PublicKey(tokenMintString)

      const vaultAddress = getVault(programChain.programId)

      const userTokenAccount = await splToken.value.getAssociatedTokenAddress(
        tokenMint,
        userPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
      )

      const vaultTokenAccount = await splToken.value.getAssociatedTokenAddress(
        tokenMint,
        vaultAddress,
        true,
        TOKEN_2022_PROGRAM_ID,
      )

      const signature = await programChain.methods
        .stake(amountBN)
        .accounts({
          user: userPublicKey,
          userTokenAccount,
          vaultTokenAccount,
          mint: tokenMint,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: web3.value.SystemProgram.programId,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.confirmTransaction(signature, 'confirmed')

      return {
        success: true,
        message: 'Stake completed successfully.',
        signature,
      }
    }
    catch (err) {
      return {
        success: false,
        message: 'An unexpected error occurred while processing the staking request.',
        raw: err,
      }
    }
    finally {
      loadinStakeProccess.value = false
    }
  }

  const unstakeToken = async (amount: number) => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection } = check

    try {
      loadingUnstakeProcess.value = true

      const rawAmount = Math.floor(amount * 1_000_000)
      const amountBN = new BN.value(rawAmount.toString())

      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)

      const statsPda = getStatsPda(programChain.programId)

      const signature = await programChain.methods
        .unstake(amountBN)
        .accounts({
          user: userPublicKey,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.confirmTransaction(signature, 'confirmed')

      return {
        success: true,
        message: 'Unstake completed successfully.',
        signature,
      }
    }
    catch (err) {
      console.error('unstake error:', err)
      return {
        success: false,
        message: 'An unexpected error occurred while processing the unstake request.',
        raw: err,
      }
    }
    finally {
      loadingUnstakeProcess.value = false
    }
  }

  const claimToken = async (
  ) => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection } = check

    try {
      loadingClaimProcess.value = true

      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)

      const statsPda = getStatsPda(programChain.programId)

      const vaultAuthority = getVault(programChain.programId)

      const TOKEN_2022_PROGRAM_ID = new web3.value.PublicKey(
        TOKEN_2022_PROGRAM_ID_STRING,
      )
      const tokenMint = new web3.value.PublicKey(tokenMintString)

      const userTokenAccount = await splToken.value.getAssociatedTokenAddress(
        tokenMint,
        userPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
      )

      const vaultTokenAccount = await splToken.value.getAssociatedTokenAddress(
        tokenMint,
        vaultAuthority,
        true,
        TOKEN_2022_PROGRAM_ID,
      )

      const signature = await programChain.methods
        .calimUnstake()
        .accounts({
          user: userPublicKey,
          userTokenAccount,
          vaultTokenAccount,
          vaultAuthority,
          mint: tokenMint,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.confirmTransaction(signature, 'confirmed')

      return {
        success: true,
        message: 'Claim completed successfully.',
        signature,
      }
    }
    catch (err) {
      return {
        success: false,
        message: 'An unexpected error occurred while processing the Claim request.',
        raw: err,
      }
    }
    finally {
      loadingClaimProcess.value = false
    }
  }

  const isCooldownComplete = (unstakeRequestedAt: number): boolean => {
    if (unstakeRequestedAt === 0) return false
    const now = Math.floor(Date.now() / 1000)
    const cooldownPeriodInSecond = 60
    // const cooldownPeriodInSecond = 7 * 24 * 60 * 60
    return now >= unstakeRequestedAt + cooldownPeriodInSecond
  }

  const getRemainingCooldown = (unstakeRequestedAt: number): string => {
    if (unstakeRequestedAt === 0) return 'No cooldown'

    // const cooldownEnd = dayjs.unix(unstakeRequestedAt).add(7, 'day')
    const cooldownEnd = dayjs.unix(unstakeRequestedAt).add(1, 'minute')
    const now = dayjs()

    return now.isAfter(cooldownEnd)
      ? 'Cooldown complete'
      : cooldownEnd.from(now) + ' remaining'
  }

  onMounted(async () => {
    callOnce(async () => {
      await initPromise
      await getUserStakeInformation()
    })
  })

  return { userStakeInformation, loadingStakeInformation, getUserStakeInformation, stakeToken, loadinStakeProccess, unstakeToken, loadingUnstakeProcess, isCooldownComplete, getRemainingCooldown, claimToken, loadingClaimProcess }
}
