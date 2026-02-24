import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import idl from '../idl/jup-locker.json'

const { Program, AnchorProvider, Wallet } = anchor.default

export function useJupLockerProgram() {
  const config = useRuntimeConfig()

  const rpcUrl
    = config.public?.solanaRpcUrl || clusterApiUrl('mainnet-beta')

  const connection = new Connection(rpcUrl, 'confirmed')

  // 🔐 Backend signer (ADMIN)
  const secretKey = Uint8Array.from(
    JSON.parse(config.projectPayerVaultKey),
  )
  const payer = Keypair.fromSecretKey(secretKey)

  const wallet = new Wallet(payer)
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })

  const program = new Program(idl as unknown, provider)

  return {
    program,
    connection,
    authority: payer.publicKey,
    payer,
  }
}
