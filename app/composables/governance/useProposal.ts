import type { Program } from '@coral-xyz/anchor'
import type { Connection } from '@solana/web3.js'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'
import type { Proposal } from '~/types/governance'

type CheckRequirementResult
  = | { ok: false, message: string }
    | {
      ok: true
      programChain: Program<GamaedtechProgram>
      // userPublicKey: PublicKey
      connection: Connection
      message: string
    }

const latestProposals = ref<Proposal[]>()
const loadingGetProposal = ref(true)

export const useProposal = () => {
  const { program, web3, initPromise, connection } = useWorkspace()

  // const getVault = (programId: PublicKey) => {
  //   const [vaultAuthority] = web3.value.PublicKey.findProgramAddressSync(
  //     [Buffer.from('vault-authority')],
  //     programId,
  //   )
  //   return vaultAuthority
  // }

  // const getStakeAccountPda = (userPublicKey: PublicKey, programId: PublicKey) => {
  //   const [stakeAccountPda] = web3.value.PublicKey.findProgramAddressSync(
  //     [Buffer.from('stake_account'), userPublicKey.toBuffer()],
  //     programId,
  //   )
  //   return stakeAccountPda
  // }

  // const getStatsPda = (programId: PublicKey) => {
  //   const [statsPda] = web3.value.PublicKey.findProgramAddressSync(
  //     [Buffer.from('stats')],
  //     programId,
  //   )
  //   return statsPda
  // }

  const checkReqiureMent = (): CheckRequirementResult => {
    const programChain = program?.value
    // const userPublicKey = publicKey?.value
    const conn = connection.value

    if (!programChain) {
      return { ok: false, message: 'Program is not initialized or not ready.' }
    }

    // if (!userPublicKey) {
    //   return { ok: false, message: 'Wallet is not connected. Please connect your wallet and try again.' }
    // }

    if (!conn) {
      return { ok: false, message: 'Unable to connect to the Solana network. Please try again.' }
    }

    if (!web3.value) {
      return { ok: false, message: 'Unable to load Web3 to Connect Solana network. Check your internet and refresh page.' }
    }

    return {
      ok: true,
      programChain,
      // userPublicKey,
      connection: conn,
      message: 'All requirement is ready.',
    }
  }

  const getProposal = async () => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain } = check

    loadingGetProposal.value = true
    try {
      const proposalsData: Proposal[] = await programChain.account.proposal.all()
      console.log('proposalsData', proposalsData)

      proposalsData.sort((a: Proposal, b: Proposal) => {
        const aCreated = a.account.createdAt.toNumber
          ? a.account.createdAt.toNumber()
          : Number(a.account.createdAt)
        const bCreated = b.account.createdAt.toNumber
          ? b.account.createdAt.toNumber()
          : Number(b.account.createdAt)
        return bCreated - aCreated
      })
      latestProposals.value = proposalsData.slice(0, 10)
    }
    catch (err) {
      console.log('error', err)
    }
    finally {
      loadingGetProposal.value = false
    }
  }

  onMounted(async () => {
    callOnce(async () => {
      await initPromise
      await getProposal()
    })
  })

  return { latestProposals, loadingGetProposal }
}
