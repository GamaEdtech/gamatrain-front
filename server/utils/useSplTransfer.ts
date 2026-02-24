import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js'

import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'

export function useSplTransfer() {
  const config = useRuntimeConfig()

  // Backend signer (admin wallet)
  const secretKey = Uint8Array.from(JSON.parse(config.projectPayerVaultKey))
  const payer = Keypair.fromSecretKey(secretKey)

  const mint = config.public.solanaTokenMint

  const rpcUrl = config.public?.solanaRpcUrl || clusterApiUrl('mainnet-beta')
  const connection = new Connection(rpcUrl, 'confirmed')

  /**
   * Transfer Token-2022 SPL tokens and auto-create ATA
   */
  const transferSplToken = async ({
    to,
    amount,
    mint: mintOverride,
  }: {
    to: string
    amount: number
    mint?: string
  }) => {
    const mintPk = new PublicKey(mintOverride || mint)
    const toPk = new PublicKey(to)
    const fromPk = payer.publicKey

    // Token-2022 ATA Program
    const ATA_PROGRAM_ID = new PublicKey(
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    )
    // ---- Derive correct Token-2022 ATAs ----
    const fromAta = await getAssociatedTokenAddress(
      mintPk,
      fromPk,
      false,
      TOKEN_2022_PROGRAM_ID,
      ATA_PROGRAM_ID,
    )

    const toAta = await getAssociatedTokenAddress(
      mintPk,
      toPk,
      false,
      TOKEN_2022_PROGRAM_ID,
      ATA_PROGRAM_ID,
    )

    const instructions = []

    // ---- Create FROM ATA if needed ----
    instructions.push(
      createAssociatedTokenAccountIdempotentInstruction(
        payer.publicKey,
        fromAta,
        fromPk,
        mintPk,
        TOKEN_2022_PROGRAM_ID,
        ATA_PROGRAM_ID,
      ),
    )

    // ---- Create TO ATA if needed ----
    instructions.push(
      createAssociatedTokenAccountIdempotentInstruction(
        payer.publicKey,
        toAta,
        toPk,
        mintPk,
        TOKEN_2022_PROGRAM_ID,
        ATA_PROGRAM_ID,
      ),
    )

    // ---- Transfer Token-2022 tokens ----
    instructions.push(
      createTransferInstruction(
        fromAta,
        toAta,
        payer.publicKey,
        amount,
        [],
        TOKEN_2022_PROGRAM_ID,
      ),
    )

    const tx = new Transaction().add(...instructions)

    const signature = await sendAndConfirmTransaction(connection, tx, [payer])

    const { value } = await connection.getSignatureStatuses([signature])
    const confirmationStatus = value[0]?.confirmationStatus ?? 'unknown'

    return {
      signature,
      confirmationStatus,
    }
  }

  return {
    transferSplToken,
  }
}
