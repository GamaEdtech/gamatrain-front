#!/usr/bin/env node

/**
 * Initialize Vault Token Account for Governance Staking
 *
 * This script creates the vault token account that holds staked tokens.
 * It must be run ONCE before users can stake tokens.
 *
 * Usage:
 *   node scripts/initialize-vault.mjs /path/to/authority-keypair.json
 *
 * Requirements:
 *   - Authority keypair (wallet that will pay for account creation)
 *   - Sufficient SOL for rent (~0.002 SOL)
 *   - Token mint address configured in environment
 *
 * Network:
 *   - For devnet: Set NUXT_PUBLIC_SOLANA_NETWORK=devnet
 *   - For mainnet: Set NUXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          // Remove quotes if present
          const cleanValue = value.replace(/^["']|["']$/g, '')
          process.env[key.trim()] = cleanValue
        }
      })
      logSuccess('Environment variables loaded from .env')
    }
    else {
      logWarning('.env file not found, using system environment variables')
    }
  }
  catch (error) {
    logWarning(`Failed to load .env file: ${error.message}`)
  }
}

// Get configuration from environment
function getConfig() {
  loadEnv()

  const network = process.env.NUXT_PUBLIC_SOLANA_NETWORK || 'devnet'
  const rpcUrl = network === 'mainnet-beta'
    ? (process.env.NUXT_PUBLIC_SOLANA_RPC_MAINNET || 'https://api.mainnet-beta.solana.com')
    : (process.env.NUXT_PUBLIC_SOLANA_RPC_DEVNET || 'https://api.devnet.solana.com')

  const tokenMint = process.env.NUXT_PUBLIC_SOLANA_TOKEN_MINT
  const programId = process.env.NUXT_PUBLIC_SOLANA_PROGRAM_ID
    || '9F77hJsRRXs7vF9UDncZKth2r5wEPgcRkEfyoZDNQ3eK'

  if (!tokenMint) {
    throw new Error(
      'NUXT_PUBLIC_SOLANA_TOKEN_MINT not found in environment variables',
    )
  }

  return {
    network,
    rpcUrl,
    tokenMint,
    programId,
  }
}

// Derive vault authority PDA
function getVaultAuthority(programId) {
  const [vaultAuthority, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault-authority')],
    new PublicKey(programId),
  )
  return { vaultAuthority, bump }
}

async function main() {
  log('\n🚀 Vault Token Account Initialization Script\n', 'bright')

  // Check command line arguments
  const args = process.argv.slice(2)
  if (args.length === 0) {
    logError('Missing keypair path argument')
    log('\nUsage:', 'yellow')
    log('  node scripts/initialize-vault.mjs /path/to/authority-keypair.json\n')
    log('Example:', 'yellow')
    log('  node scripts/initialize-vault.mjs ~/.config/solana/id.json\n')
    process.exit(1)
  }

  const keypairPath = args[0]

  // Load configuration
  let config
  try {
    config = getConfig()
    logInfo(`Network: ${config.network}`)
    logInfo(`RPC URL: ${config.rpcUrl}`)
    logInfo(`Token Mint: ${config.tokenMint}`)
    logInfo(`Program ID: ${config.programId}`)
  }
  catch (error) {
    logError(`Configuration error: ${error.message}`)
    process.exit(1)
  }

  // Load authority keypair
  let authority
  try {
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
    authority = Keypair.fromSecretKey(new Uint8Array(keypairData))
    logSuccess(`Authority keypair loaded: ${authority.publicKey.toBase58()}`)
  }
  catch (error) {
    logError(`Failed to load keypair: ${error.message}`)
    process.exit(1)
  }

  // Create connection
  const connection = new Connection(config.rpcUrl, 'confirmed')

  // Check authority balance
  try {
    const balance = await connection.getBalance(authority.publicKey)
    const balanceSOL = balance / 1e9
    logInfo(`Authority balance: ${balanceSOL.toFixed(4)} SOL`)

    if (balanceSOL < 0.01) {
      logWarning(
        'Low balance! You need at least 0.01 SOL to create the vault account.',
      )
    }
  }
  catch (error) {
    logWarning(`Failed to check balance: ${error.message}`)
  }

  // Derive vault authority PDA
  const { vaultAuthority, bump } = getVaultAuthority(config.programId)
  logSuccess(`Vault Authority PDA: ${vaultAuthority.toBase58()} (bump: ${bump})`)

  // Get vault token account address
  const tokenMintPubkey = new PublicKey(config.tokenMint)
  const vaultTokenAccount = await getAssociatedTokenAddress(
    tokenMintPubkey,
    vaultAuthority,
    true, // allowOwnerOffCurve = true (for PDA)
    TOKEN_2022_PROGRAM_ID,
  )

  logInfo(`Vault Token Account: ${vaultTokenAccount.toBase58()}`)

  // Check if vault token account already exists
  try {
    const accountInfo = await connection.getAccountInfo(vaultTokenAccount)
    if (accountInfo) {
      logWarning('Vault token account already exists!')
      logInfo('No action needed. The vault is already initialized.')
      log('\n✨ Done!\n', 'green')
      process.exit(0)
    }
  }
  catch {
    // Account doesn't exist, continue with creation
  }

  // Create vault token account
  log('\n📝 Creating vault token account...', 'yellow')

  try {
    const instruction = createAssociatedTokenAccountInstruction(
      authority.publicKey, // payer
      vaultTokenAccount, // associated token account
      vaultAuthority, // owner (PDA)
      tokenMintPubkey, // mint
      TOKEN_2022_PROGRAM_ID,
    )

    const { blockhash, lastValidBlockHeight }
      = await connection.getLatestBlockhash()

    const transaction = new Transaction({
      feePayer: authority.publicKey,
      blockhash,
      lastValidBlockHeight,
    }).add(instruction)

    // Sign and send transaction
    transaction.sign(authority)
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      },
    )

    logInfo(`Transaction signature: ${signature}`)
    log('⏳ Confirming transaction...', 'yellow')

    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    })

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
    }

    logSuccess('Vault token account created successfully!')

    // Verify account creation
    const accountInfo = await connection.getAccountInfo(vaultTokenAccount)
    if (accountInfo) {
      logSuccess('Vault account verified on-chain')
    }

    log('\n✨ Vault initialization complete!\n', 'green')
    log('📋 Summary:', 'bright')
    log(`   Network: ${config.network}`)
    log(`   Vault Authority: ${vaultAuthority.toBase58()}`)
    log(`   Vault Token Account: ${vaultTokenAccount.toBase58()}`)
    log(`   Transaction: ${signature}`)
    log('\n🎉 Users can now stake tokens!\n', 'green')
  }
  catch (err) {
    logError(`Failed to create vault token account: ${err.message}`)
    if (err.logs) {
      log('\nTransaction logs:', 'yellow')
      err.logs.forEach(logLine => console.log(`  ${logLine}`))
    }
    process.exit(1)
  }
}

// Run the script
main().catch((err) => {
  logError(`Unexpected error: ${err.message}`)
  console.error(err)
  process.exit(1)
})
