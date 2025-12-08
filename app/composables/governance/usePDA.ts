import type { PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'

export const usePDA = () => {
  const { web3, BN } = useWorkspace()

  const getVault = (programId: PublicKey) => {
    const [vaultAuthority] = web3.value!.PublicKey.findProgramAddressSync(
      [Buffer.from('vault-authority')],
      programId,
    )
    return vaultAuthority
  }
  const getStakeAccountPda = (userPublicKey: PublicKey, programId: PublicKey) => {
    const [stakeAccountPda] = web3.value!.PublicKey.findProgramAddressSync(
      [Buffer.from('stake_account'), userPublicKey.toBuffer()],
      programId,
    )
    return stakeAccountPda
  }

  const getStatsPda = (programId: PublicKey) => {
    const [statsPda] = web3.value!.PublicKey.findProgramAddressSync(
      [Buffer.from('stats')],
      programId,
    )
    return statsPda
  }

  const getVoteRecordPda = (userPublicKey: PublicKey, programId: PublicKey, proposalPublicKey: PublicKey) => {
    const [voteRecordPDA] = web3.value!.PublicKey.findProgramAddressSync(
      [
        Buffer.from('vote-record'),
        proposalPublicKey.toBuffer(),
        userPublicKey.toBuffer(),
      ],
      programId,
    )

    return voteRecordPDA
  }

  const getUserStatePda = (userPublicKey: PublicKey, programId: PublicKey) => {
    const [userStatePda] = web3.value!.PublicKey.findProgramAddressSync(
      [Buffer.from('user_state'), userPublicKey.toBuffer()],
      programId,
    )
    return userStatePda
  }

  const getProposalPda = (userPublicKey: PublicKey, programId: PublicKey, proposalCount: number) => {
    const [proposalPda] = web3.value!.PublicKey.findProgramAddressSync(
      [
        Buffer.from('proposal'),
        userPublicKey.toBuffer(),
        new BN.value(proposalCount).toArrayLike(Buffer, 'le', 8),
      ],
      programId,
    )

    return proposalPda
  }

  return { getVault, getStakeAccountPda, getStatsPda, getVoteRecordPda, getUserStatePda, getProposalPda }
}
