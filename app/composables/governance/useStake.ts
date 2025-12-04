import type { StakeAccount } from '~/types/governance'

const userStakeInformation = ref<StakeAccount | null>()
const loadingStakeInformation = ref(true)
const error = ref<string | null>(null)

const loadinStakeProccess = ref(false)
const loadingUnstakeProcess = ref(false)

export const useStake = () => {
  const { program, publicKey, web3, initPromise, BN, connection, splToken } = useWorkspace()

  const getUserStakeInformation = async () => {
    loadingStakeInformation.value = true
    error.value = null
    const programChain = program?.value
    const userPublicKey = publicKey?.value

    if (!programChain) {
      error.value = 'PROGRAM_NOT_READY'
      console.log(error.value)

      return
    }

    if (!userPublicKey) {
      error.value = 'WALLET_NOT_CONNECTED'
      console.log(error.value)
      return
    }

    if (!web3.value) {
      error.value = 'WEB3_NOT_LOADED'
      console.log(error.value)
      return
    }
    try {
      const [stakeAccountPda] = web3.value.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), userPublicKey.toBuffer()],
        programChain.programId,
      )

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

      console.log('userStakeInformation', userStakeInformation.value)
    }
    catch (err) {
      console.log('error khord', err)
      error.value = 'FAILED_TO_FETCH_STAKE_ACCOUNT'
    }
    finally {
      loadingStakeInformation.value = false
    }
  }

  const getVaultAddress = async () => {
    const programId = program.value?.programId

    const [vaultAuthority] = web3.value.PublicKey.findProgramAddressSync(
      [Buffer.from('vault-authority')],
      programId!,
    )

    return vaultAuthority.toBase58()
  }

  const stakeToken = async (
    amount: number,
  ) => {
    const programChain = program?.value
    const userPublicKey = publicKey?.value

    if (!programChain) {
      return { success: false, message: 'Program is not initialized or not ready.' }
    }

    if (!userPublicKey) {
      return { success: false, message: 'Wallet is not connected. Please connect your wallet and try again.' }
    }

    if (!connection.value) {
      return { success: false, message: 'Unable to connect to the Solana network. Please try again.' }
    }

    try {
      loadinStakeProccess.value = true
      const rawAmount = Math.floor(amount * 1_000_000)
      const amountBN = new BN.value(rawAmount.toString())

      const [stakeAccountPda] = web3.value.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), userPublicKey.toBuffer()],
        programChain.programId,
      )

      const [statsPda] = web3.value.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        programChain.programId,
      )

      const TOKEN_2022_PROGRAM_ID = new web3.value.PublicKey(
        'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
      )
      const config = useRuntimeConfig()
      const tokenMintString = config.public.solanaTokenMint as string
      const tokenMint = new web3.value.PublicKey(tokenMintString)

      const vaultAddressStr = await getVaultAddress()
      const vaultAddress = new web3.value.PublicKey(vaultAddressStr)

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

      await connection.value.confirmTransaction(signature, 'confirmed')

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
    const programChain = program?.value
    const userPublicKey = publicKey?.value

    if (!programChain) {
      return { success: false, message: 'Program is not initialized or not ready.' }
    }

    if (!userPublicKey) {
      return { success: false, message: 'Wallet is not connected. Please connect your wallet and try again.' }
    }

    if (!connection.value) {
      return { success: false, message: 'Unable to connect to the Solana network. Please try again.' }
    }

    try {
      loadingUnstakeProcess.value = true

      const rawAmount = Math.floor(amount * 1_000_000)
      const amountBN = new BN.value(rawAmount.toString())

      const [stakeAccountPda] = web3.value.PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), userPublicKey.toBuffer()],
        programChain.programId,
      )

      const [statsPda] = web3.value.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        programChain.programId,
      )

      const signature = await programChain.methods
        .unstake(amountBN)
        .accounts({
          user: userPublicKey,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.value.confirmTransaction(signature, 'confirmed')

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

  onMounted(async () => {
    callOnce(async () => {
      await initPromise
      await getUserStakeInformation()
    })
  })

  return { userStakeInformation, loadingStakeInformation, getUserStakeInformation, stakeToken, loadinStakeProccess, unstakeToken, loadingUnstakeProcess }
}
