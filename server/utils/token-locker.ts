import { Connection, Keypair, PublicKey, clusterApiUrl, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'

import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeAccountInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptAccount,
  ACCOUNT_SIZE,
} from '@solana/spl-token'

import idl from '../idl/jup-locker.json'

const { Program, AnchorProvider, Wallet, BN } = anchor.default

// Token-2022 program (constant)
const TOKEN_2022_PROGRAM = new PublicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
)
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
  console.log('test')
  return { program, wallet, authority: payer.publicKey, connection }
}

export async function createLock(recipient: string, amount: number, durationMonths: number) {
  const { program, connection, wallet, authority } = useLocker()

  const config = useRuntimeConfig()

  const recipientPubkey = new PublicKey(recipient)
  const mintPubkey = new PublicKey(config.public.solanaTokenMint)

  /* ---------- Time params ---------- */
  const startTime = new BN(Math.floor(Date.now() / 1000))
  const durationSeconds = new BN(
    durationMonths * 30 * 24 * 60 * 60,
  )

  /* ---------- Escrow PDA ---------- */
  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), authority.toBuffer()],
    program.programId,
  )

  /* ---------- Escrow Token PDA (Token-2022) ---------- */
  const [escrowToken] = PublicKey.findProgramAddressSync(
    [
      escrowPda.toBuffer(),
      TOKEN_2022_PROGRAM_ID.toBuffer(),
      mintPubkey.toBuffer(),
    ],
    TOKEN_2022_PROGRAM,
  )

  /* ---------- Sender Token (Token-2022 ATA) ---------- */
  const senderToken = await getAssociatedTokenAddress(
    mintPubkey,
    authority,
    false,
    TOKEN_2022_PROGRAM_ID,
  )

  /* ---------- Event Authority PDA ---------- */
  const [eventAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('__event_authority')],
    program.programId,
  )

  /* -------------------------------------------------- */
  /* 1️⃣ Initialize escrow_token (REQUIRED)              */
  /* -------------------------------------------------- */
  const escrowInfo = await connection.getAccountInfo(escrowToken)

  if (!escrowInfo) {
    const lamports
      = await getMinimumBalanceForRentExemptAccount(connection)

    const initTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: authority,
        newAccountPubkey: escrowToken,
        space: ACCOUNT_SIZE,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeAccountInstruction(
        escrowToken,
        mintPubkey,
        escrowPda,
        TOKEN_2022_PROGRAM_ID,
      ),
    )

    await sendAndConfirmTransaction(
      connection,
      initTx,
      [wallet],
    )
  }

  /* -------------------------------------------------- */
  /* 2️⃣ Call Anchor program                             */
  /* -------------------------------------------------- */
  const params = {
    vestingStartTime: startTime,
    cliffTime: startTime,
    frequency: durationSeconds,
    cliffUnlockAmount: new BN(0),
    amountPerPeriod: new BN(amount.toString()),
    numberOfPeriod: new BN(1),
    updateRecipientMode: 1,
    cancelMode: 0,
  }

  const tx = await program.methods
    .createVestingEscrowV2(params, null)
    .accounts({
      base: authority,
      escrow: escrowPda,
      tokenMint: mintPubkey,
      escrowToken,
      sender: authority,
      senderToken,
      recipient: recipientPubkey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      eventAuthority,
      program: program.programId,
    })
    .rpc()

  return {
    tx,
    escrowPda: escrowPda.toBase58(),
    escrowToken: escrowToken.toBase58(),
  }
}
