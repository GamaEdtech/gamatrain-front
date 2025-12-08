import type { Program } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { StakeAccount } from '~/types/governance'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'
import { usePDA } from './usePDA'

type Web3LibraryType = typeof import('@solana/web3.js')
type splTokenLibraryType = typeof import('@solana/spl-token')

type CheckRequirementResult
  = | { ok: false, message: string }
    | {
      ok: true
      programChain: Program<GamaedtechProgram>
      userPublicKey: PublicKey
      connection: Connection
      web3: Ref<Web3LibraryType>
      spl: Ref<splTokenLibraryType>
      message: string
    }
type RequirementKey = 'program' | 'publicKey' | 'connection' | 'web3' | 'spl'

const userStakeInformation = ref<StakeAccount | null>()
const loadingStakeInformation = ref(true)

const loadinStakeProccess = ref(false)
const loadingUnstakeProcess = ref(false)
const loadingClaimProcess = ref(false)

export const useStake = () => {
  const { program, publicKey, web3, initPromise, BN, connection, splToken, connected } = useWorkspace()
  const { getVault, getStakeAccountPda, getStatsPda } = usePDA()
  const TOKEN_2022_PROGRAM_ID_STRING = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
  const config = useRuntimeConfig()
  const tokenMintString = config.public.solanaTokenMint as string
  const dayjs = useDayjs()

  const checkReqiureMent = (required: RequirementKey[] = ['program', 'publicKey', 'connection', 'web3']): CheckRequirementResult => {
    const programChain = program?.value
    const userPublicKey = publicKey?.value
    const conn = connection.value

    if (!programChain && required.includes('program')) {
      return { ok: false, message: 'Program is not initialized or not ready.' }
    }

    if (!userPublicKey && required.includes('publicKey')) {
      return { ok: false, message: 'Wallet is not connected. Please connect your wallet and try again.' }
    }

    if (!conn && required.includes('connection')) {
      return { ok: false, message: 'Unable to connect to the Solana network. Please try again.' }
    }

    if (!web3.value && required.includes('web3')) {
      return { ok: false, message: 'Unable to load Web3 to Connect Solana network. Check your internet and refresh page.' }
    }

    if (!splToken.value && required.includes('spl')) {
      return { ok: false, message: 'Unable to load Spl to Connect Solana network. Check your internet and refresh page.' }
    }

    return {
      ok: true,
      programChain,
      userPublicKey,
      connection: conn,
      web3: web3,
      spl: splToken,
      message: 'All requirement is ready.',
    } as CheckRequirementResult
  }

  const getUserStakeInformation = async () => {
    const check = checkReqiureMent()
    if (!check.ok) {
      console.log(3)
      loadingStakeInformation.value = false
      return { success: false, message: check.message }
    }

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
    const check = checkReqiureMent(['connection', 'program', 'publicKey', 'spl', 'web3'])
    console.log(1)
    console.log('check', check)
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection, web3, spl } = check

    try {
      console.log(2)
      loadinStakeProccess.value = true
      const rawAmount = Math.floor(amount * 1_000_000)
      console.log(3)
      const amountBN = new BN.value(rawAmount.toString())
      console.log(4)
      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)
      console.log(5)
      const statsPda = getStatsPda(programChain.programId)
      console.log(6)
      const TOKEN_2022_PROGRAM_ID = new web3.value.PublicKey(
        TOKEN_2022_PROGRAM_ID_STRING,
      )
      console.log(7)
      const tokenMint = new web3.value.PublicKey(tokenMintString)
      console.log(8)
      const vaultAddress = getVault(programChain.programId)
      console.log(9)
      const userTokenAccount = await spl.value.getAssociatedTokenAddress(
        tokenMint,
        userPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
      )
      console.log(10)

      const vaultTokenAccount = await spl.value.getAssociatedTokenAddress(
        tokenMint,
        vaultAddress,
        true,
        TOKEN_2022_PROGRAM_ID,
      )
      console.log(11)
      console.log('phantom public key', window.solana?.publicKey?.toBase58())
      console.log('workspace public key 1', userPublicKey)
      console.log('workspace public key 2', publicKey.value?.toBase58())

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
      console.log(12)

      await connection.confirmTransaction(signature, 'confirmed')
      console.log(13)

      return {
        success: true,
        message: 'Stake completed successfully.',
        signature,
      }
    }
    catch (err) {
      console.log(14)
      console.log('error', err)
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
    const check = checkReqiureMent(['connection', 'program', 'publicKey', 'spl', 'web3'])
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection, web3, spl } = check

    try {
      loadingClaimProcess.value = true

      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)

      const statsPda = getStatsPda(programChain.programId)

      const vaultAuthority = getVault(programChain.programId)

      const TOKEN_2022_PROGRAM_ID = new web3.value.PublicKey(
        TOKEN_2022_PROGRAM_ID_STRING,
      )
      const tokenMint = new web3.value.PublicKey(tokenMintString)

      const userTokenAccount = await spl.value.getAssociatedTokenAddress(
        tokenMint,
        userPublicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
      )

      const vaultTokenAccount = await spl.value.getAssociatedTokenAddress(
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

  callOnce(() => {
    watch(connected, async (newVal, oldVal) => {
      if (newVal === oldVal) return
      if (newVal === true) {
        await initPromise
        await getUserStakeInformation()
      }
      else {
        userStakeInformation.value = null
        loadingStakeInformation.value = false
      }
    }, { immediate: true })
  })

  return { userStakeInformation, loadingStakeInformation, getUserStakeInformation, stakeToken, loadinStakeProccess, unstakeToken, loadingUnstakeProcess, isCooldownComplete, getRemainingCooldown, claimToken, loadingClaimProcess }
}
