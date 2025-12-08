import type { Program } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'
import type { VoteRecord } from '~/types/governance'
import { usePDA } from './usePDA'

type Web3LibraryType = typeof import('@solana/web3.js')

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
type RequirementKey = 'program' | 'publicKey' | 'connection' | 'web3' | 'spl'

const laodingVoteProcess = ref(false)

export const useVote = () => {
  const { program, web3, initPromise, connection, publicKey } = useWorkspace()
  const { getVoteRecordPda, getStakeAccountPda, getStatsPda } = usePDA()

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

  const getVoteInformationProposal = async (proposalPublicKey: PublicKey): Promise<VoteRecord | null> => {
    const check = checkReqiureMent(['program', 'publicKey', 'web3'])
    if (!check.ok) return null

    await initPromise
    const { programChain, userPublicKey } = check

    try {
      const voteRecordPDA = getVoteRecordPda(userPublicKey, programChain.programId, proposalPublicKey)

      const voteRecord = await programChain?.account['voteRecord'].fetch(
        voteRecordPDA,
      ) as VoteRecord
      if (voteRecord) {
        return voteRecord
      }

      return null
    }
    catch (err) {
      console.log('error', err)
      return null
    }
  }

  const voteProppsal = async (
    proposalPublicKey: PublicKey,
    agree: boolean,
  ) => {
    const check = checkReqiureMent()
    if (!check.ok) return { success: false, message: check.message }

    const { programChain, userPublicKey, connection, web3 } = check

    try {
      laodingVoteProcess.value = true

      const voteRecordPDA = getVoteRecordPda(userPublicKey, programChain.programId, proposalPublicKey)

      const stakeAccountPda = getStakeAccountPda(userPublicKey, programChain.programId)

      const statsPda = getStatsPda(programChain.programId)

      const signature = await programChain.methods
        .vote(agree)
        .accounts({
          proposal: proposalPublicKey,
          voteRecord: voteRecordPDA,
          voter: userPublicKey,
          stakeAccount: stakeAccountPda,
          stats: statsPda,
          systemProgram: web3.value.SystemProgram.programId,
        })
        .rpc({ commitment: 'confirmed' })

      await connection.confirmTransaction(signature, 'confirmed')

      return {
        success: true,
        message: 'Vote on proposal completed successfully.',
        signature,
      }
    }
    catch (err) {
      return {
        success: false,
        message: 'An unexpected error occurred while processing the Vote proposal request.',
        raw: err,
      }
    }
    finally {
      laodingVoteProcess.value = false
    }
  }

  return { getVoteInformationProposal, laodingVoteProcess, voteProppsal }
}
