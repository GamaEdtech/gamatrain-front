import type { StakeAccount } from '~/types/governance'

export const useStake = () => {
  const { program, publicKey, web3, initPromise } = useWorkspace()

  const userStakeInformation = ref<StakeAccount | null>()
  const loadingStakeInformation = ref(true)
  const error = ref<string | null>(null)

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

  onMounted(async () => {
    await initPromise
    await getUserStakeInformation()
  })

  return { userStakeInformation, loadingStakeInformation }
}
