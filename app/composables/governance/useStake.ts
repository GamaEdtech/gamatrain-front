import type { PublicKey } from '@solana/web3.js'

interface StakeAccount {
  owner: PublicKey
  stakedAmount: number
  lastStakeTime: number
  pendingUnstake: number
  unstakeRequestedAt: number
  pendingRewards: number
}

type Web3Type = typeof import('@solana/web3.js')

export const useStake = () => {
  const { program, publicKey, initPromise } = useWorkspace()

  const userStakeInformation = ref<StakeAccount | null>()
  const loadingStakeInformation = ref(true)
  const web3 = ref<Web3Type | null>(null)

  const getUserStakeInformation = async () => {
    const programChain = program?.value
    const userPublicKey = publicKey?.value

    if (!programChain || !userPublicKey || !web3.value) return null
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
    }
    catch {
      console.log('error khord')

      return null
    }
    finally {
      loadingStakeInformation.value = false
    }
  }

  const loadWeb3 = async () => {
    if (!import.meta.client) return null

    if (!web3.value) {
      web3.value = await import('@solana/web3.js')
      console.log('Web3 Loaded!')
    }

    return web3.value
  }

  onMounted(async () => {
    console.log('Composable mounted! DOM is available.')
    await initPromise
    await loadWeb3()
    await getUserStakeInformation()
  })

  return { userStakeInformation, loadingStakeInformation }
}
