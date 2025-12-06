import type { Program } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'
import type { Proposal, ProposalFormData } from '~/types/governance'

type CheckRequirementResult
  = | { ok: false, message: string }
    | {
      ok: true
      programChain: Program<GamaedtechProgram>
      userPublicKey: PublicKey
      connection: Connection
      message: string
    }

const latestProposals = ref<Proposal[]>()
const loadingGetProposal = ref(true)

const loadingCreateProposal = ref(false)
const loadingDeleteProposal = ref(false)

export const useProposal = () => {
  const { program, web3, initPromise, connection, publicKey, BN } = useWorkspace()

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

  const getUserStatePda = (userPublicKey: PublicKey, programId: PublicKey) => {
    const [userStatePda] = web3.value.PublicKey.findProgramAddressSync(
      [Buffer.from('user_state'), userPublicKey.toBuffer()],
      programId,
    )
    return userStatePda
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

  const getProposalPda = (userPublicKey: PublicKey, programId: PublicKey, proposalCount: number) => {
    const [proposalPda] = web3.value.PublicKey.findProgramAddressSync(
      [
        Buffer.from('proposal'),
        userPublicKey.toBuffer(),
        new BN.value(proposalCount).toArrayLike(Buffer, 'le', 8),
      ],
      programId,
    )

    return proposalPda
  }

  const getProposal = async () => {
    // const check = checkReqiureMent()
    // if (!check.ok) return { success: false, message: check.message }

    // const { programChain } = check
    const programChain = program.value

    loadingGetProposal.value = true
    try {
      const proposalsData: Proposal[] = await programChain!.account.proposal.all()
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

  const create = async (
    data: ProposalFormData,
  ) => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection } = check

    try {
      loadingCreateProposal.value = true

      const userStatePda = getUserStatePda(userPublicKey, programChain.programId)

      let proposalCount = 0
      try {
        const userStateAccount = await programChain.account.userState.fetch(
          userStatePda,
        )
        proposalCount = userStateAccount.proposalCount
      }
      catch {
        proposalCount = 0
      }

      const proposalPda = getProposalPda(userPublicKey, programChain.programId, proposalCount)

      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)

      const statsPda = getStatsPda(programChain.programId)

      const signature = await programChain.methods
        .createProposal(
          data.title.trim(),
          data.brief.trim(),
          data.cate || 'general',
          data.reference || '',
          new BN.value(data.amount || 0),
        )
        .accounts({
          userState: userStatePda,
          proposal: proposalPda,
          user: userPublicKey,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
          systemProgram: web3.value.SystemProgram.programId,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.confirmTransaction(signature, 'confirmed')

      return {
        success: true,
        message: 'Create proposal completed successfully.',
        signature,
      }
    }
    catch (err) {
      return {
        success: false,
        message: 'An unexpected error occurred while processing the Create proposal request.',
        raw: err,
      }
    }
    finally {
      loadingCreateProposal.value = false
    }
  }

  const deleteProposal = async (proposalPublicKey: PublicKey) => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection } = check

    try {
      loadingDeleteProposal.value = true
      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)

      const statsPda = getStatsPda(programChain.programId)

      const signature = await programChain.methods
        .deleteProposal()
        .accounts({
          proposal: proposalPublicKey,
          user: userPublicKey,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.confirmTransaction(signature, 'confirmed')

      return {
        success: true,
        message: 'Delete proposal completed successfully.',
        signature,
      }
    }
    catch (err) {
      return {
        success: false,
        message: 'An unexpected error occurred while processing the delete proposal request.',
        raw: err,
      }
    }
    finally {
      loadingDeleteProposal.value = false
    }
  }

  onMounted(async () => {
    callOnce(async () => {
      await initPromise
      await getProposal()
    })
  })

  return { latestProposals, getProposal, loadingGetProposal, create, loadingCreateProposal, deleteProposal, loadingDeleteProposal }
}
