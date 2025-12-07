import type { Stats } from '~/types/governance'
import type { Program } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'

type Web3LibraryType = typeof import('@solana/web3.js')

const stats = ref<Stats | null>()
const loadingStats = ref(true)

type CheckRequirementResult
  = | { ok: false, message: string }
    | {
      ok: true
      programChain: Program<GamaedtechProgram>
      userPublicKey: PublicKey
      connection: Connection
      web3: Ref<Web3LibraryType>
      message: string
    }
type RequirementKey = 'program' | 'publicKey' | 'connection' | 'web3'

export const useStats = () => {
  const { program, initPromise, web3, connection, publicKey } = useWorkspace()

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

    return {
      ok: true,
      programChain,
      userPublicKey,
      connection: conn,
      web3: web3,
      message: 'All requirement is ready.',
    } as CheckRequirementResult
  }

  const getStatsInformation = async () => {
    const check = checkReqiureMent(['program', 'web3'])
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, web3 } = check

    try {
      loadingStats.value = true
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
    }
    catch (err) {
      console.log('error khord', err)
    }
    finally {
      loadingStats.value = false
    }
  }

  onMounted(async () => {
    callOnce(async () => {
      await initPromise
      await getStatsInformation()
    })
  })

  return { stats, loadingStats, getStatsInformation }
}
