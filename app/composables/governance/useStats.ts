import type { Stats } from '~/types/governance'

export const useStats = () => {
  const { program, initPromise, web3 } = useWorkspace()

  const stats = ref<Stats | null>()
  const loadingStats = ref(true)
  const error = ref<string | null>(null)

  const getStatsInformation = async () => {
    loadingStats.value = true
    error.value = null
    const programChain = program?.value

    if (!programChain) {
      error.value = 'PROGRAM_NOT_READY'
      return
    }

    if (!web3.value) {
      error.value = 'WEB3_NOT_LOADED'
      return
    }
    try {
      const [statsPda] = web3.value.PublicKey.findProgramAddressSync(
        [Buffer.from('stats')],
        programChain.programId,
      )

      const statsInfo = await programChain.account['stats'].fetch(statsPda)

      stats.value = {
        totalProposals: statsInfo.totalProposals?.toNumber?.() || 0,
        activeVoters: statsInfo.activeVoters?.toNumber?.() || 0,
        proposalsPassed: statsInfo.proposalsPassed?.toNumber?.() || 0,
        treasuryBalance: (statsInfo.treasuryBalance?.toNumber?.() || 0) / 1_000_000,
        totalStaked: (statsInfo.totalStaked?.toNumber?.() || 0) / 1_000_000,
        totalRewards: (statsInfo.totalRewards?.toNumber?.() || 0) / 1_000_000,
        totalClaimedRewards: (statsInfo.totalClaimedRewards
          ?.toNumber?.() || 0) / 1_000_000,
      }
      console.log('statsInfo', stats.value)
    }
    catch (err) {
      console.log('error khord', err)
      error.value = 'FAILED_TO_FETCH_STATS'
    }
    finally {
      loadingStats.value = false
    }
  }

  onMounted(async () => {
    await initPromise
    await getStatsInformation()
  })

  return { stats, loadingStats }
}
