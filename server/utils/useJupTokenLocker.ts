// /server/utils/locker.actions.ts
import {
  PublicKey,
  Keypair,
  SystemProgram,
} from '@solana/web3.js'
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import * as anchor from '@coral-xyz/anchor'
import { useJupLockerProgram } from './useJupLockerProgram'

const { BN } = anchor.default

export function useJupTokenLocker() {
  const { program, authority, connection } = useJupLockerProgram()
  const config = useRuntimeConfig()

  const createLock = async (
    recipient: string,
    amount: number,
    durationMonths: number,
  ) => {
    /* ---------------- Keys ---------------- */

    const recipientPubkey = new PublicKey(recipient)
    const mintPubkey = new PublicKey(
      config.public.solanaTokenMint,
    )

    const baseKP = Keypair.generate()

    /* ---------------- Time ---------------- */

    const startTime = new BN(Math.floor(Date.now() / 1000))
    const durationSeconds = new BN(
      durationMonths * 30 * 24 * 60 * 60,
    )

    /* ---------------- PDA ---------------- */

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), baseKP.publicKey.toBuffer()],
      program.programId,
    )

    /* ---------------- ATAs ---------------- */

    const senderToken = getAssociatedTokenAddressSync(
      mintPubkey,
      authority,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    const escrowToken = getAssociatedTokenAddressSync(
      mintPubkey,
      escrowPda,
      true,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    /* ---------------- Params ---------------- */

    const params = {
      vestingStartTime: startTime,
      cliffTime: startTime,
      frequency: durationSeconds,
      cliffUnlockAmount: new BN(0),
      amountPerPeriod: new BN(amount.toString()),
      numberOfPeriod: new BN(1),
      updateRecipientMode: 0,
      cancelMode: 0,
    }

    /* ---------------- TX ---------------- */

    const tx = await program.methods
      .createVestingEscrowV2(params, null)
      .accounts({
        base: baseKP.publicKey,
        escrow: escrowPda,
        escrowToken,
        senderToken,
        tokenMint: mintPubkey,
        sender: authority,
        recipient: recipientPubkey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions([
        createAssociatedTokenAccountInstruction(
          authority,
          escrowToken,
          escrowPda,
          mintPubkey,
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      ])
      .signers([baseKP])
      .rpc()

    let confirmed = false

    try {
      await connection.confirmTransaction(tx, 'finalized')
      confirmed = true
    }
    catch {
      confirmed = false
    }

    return {
      tx,
      confirmed,
      escrow: escrowPda.toBase58(),
      escrowToken: escrowToken.toBase58(),
      base: baseKP.publicKey.toBase58(),
    }
  }

  return {
    createLock,
  }
}
