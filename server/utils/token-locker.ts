import { Connection, Keypair, PublicKey, clusterApiUrl, SystemProgram } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'

import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

import idl from '../idl/jup-locker.json'

const { Program, AnchorProvider, Wallet, BN } = anchor.default

export function useLocker() {
  const config = useRuntimeConfig()
  const rpcUrl = config.public?.solanaRpcUrl || clusterApiUrl('mainnet-beta')
  const connection = new Connection(rpcUrl, 'confirmed')
  // Backend signer (admin wallet)
  const secretKey = Uint8Array.from(JSON.parse(config.projectPayerVaultKey))
  const payer = Keypair.fromSecretKey(secretKey)

  // Use Anchor wallet wrapper

  const wallet = new Wallet(payer)
  const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' })
  const program = new Program(idl, provider)
  return { program, wallet, authority: payer.publicKey, connection }
}

export async function createLock(recipient: string, amount: number, durationMonths: number) {
  const { program, authority } = useLocker()
  const config = useRuntimeConfig()

  /* -------------------------------------------------- */
  /* Keys                                           */
  /* -------------------------------------------------- */

  const recipientPubkey = new PublicKey(recipient)
  const mintPubkey = new PublicKey(config.public.solanaTokenMint)

  // 🔑 baseKP = throwaway signer (NOT a wallet)
  const baseKP = Keypair.generate()

  /* -------------------------------------------------- */
  /* Time params (BN required by Anchor)             */
  /* -------------------------------------------------- */

  const startTime = new BN(Math.floor(Date.now() / 1000))
  const durationSeconds = new BN(
    durationMonths * 30 * 24 * 60 * 60,
  )

  /* -------------------------------------------------- */
  /*  Escrow PDA (derived from baseKP)                */
  /* -------------------------------------------------- */

  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), baseKP.publicKey.toBuffer()],
    program.programId,
  )

  /* -------------------------------------------------- */
  /*  Token accounts (Token-2022)                     */
  /* -------------------------------------------------- */

  // Sender ATA (authority owns tokens now)
  const senderToken = getAssociatedTokenAddressSync(
    mintPubkey,
    authority,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  // Escrow ATA (escrow PDA owns locked tokens)
  const escrowToken = getAssociatedTokenAddressSync(
    mintPubkey,
    escrowPda,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  /* -------------------------------------------------- */
  /* Program params                                 */
  /* -------------------------------------------------- */

  const params = {
    vestingStartTime: startTime,
    cliffTime: startTime,
    frequency: durationSeconds,
    cliffUnlockAmount: new BN(0),
    amountPerPeriod: new BN(amount.toString()),
    numberOfPeriod: new BN(1),
    updateRecipientMode: 0,
    cancelMode: 1,
  }

  /* -------------------------------------------------- */
  /*  Send transaction                               */
  /* -------------------------------------------------- */

  const tx = await program.methods
    .createVestingEscrowV2(params, null)
    .accounts({
      base: baseKP.publicKey, //  base signer
      escrow: escrowPda,
      escrowToken,
      senderToken,
      tokenMint: mintPubkey,
      sender: authority, //  token owner
      recipient: recipientPubkey, //  future receiver
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .preInstructions([
      //  Correct way to create escrow ATA
      createAssociatedTokenAccountInstruction(
        authority, // payer
        escrowToken,
        escrowPda,
        mintPubkey,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
    ])
    .signers([baseKP]) //  REQUIRED
    .rpc()

  /* -------------------------------------------------- */
  /*  Return useful info                              */
  /* -------------------------------------------------- */

  return {
    tx,
    escrow: escrowPda.toBase58(),
    escrowToken: escrowToken.toBase58(),
    base: baseKP.publicKey.toBase58(),
  }
}
