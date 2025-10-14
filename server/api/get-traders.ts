import { Connection, PublicKey } from '@solana/web3.js'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

  if (event.method === 'OPTIONS') return ''

  try {
    const GET_TOKEN_MINT = 'GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv'
    const mintKey = new PublicKey(GET_TOKEN_MINT)

    // Program IDs: Raydium + Jupiter
    const PROGRAM_IDS = [
      new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'), // Orca
      new PublicKey('LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'), // Metora
      new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'), // Raydium
      new PublicKey('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'), // Jupiter
    ]

    // Get Solana RPC URL from runtime config or use default
    const config = useRuntimeConfig()
    const configuredRpcUrl = config.public?.solanaRpcUrl || 'https://api.mainnet-beta.solana.com'

    // RPC endpoints
    const rpcEndpoints = [
      configuredRpcUrl,
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana',
    ]

    let connection: Connection | null = null
    for (const url of rpcEndpoints) {
      try {
        const testConn = new Connection(url, 'confirmed')
        await testConn.getVersion()
        connection = testConn
        console.log('Connected to:', url)
        break
      }
      catch {
        console.log('Failed:', url)
      }
    }
    if (!connection) throw new Error('No working RPC endpoint')

    // UTC timestamps for yesterday
    const now = new Date()
    const startUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 0, 0, 0)).getTime() / 1000
    const endUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 23, 59, 59)).getTime() / 1000

    // Largest token accounts
    const tokenAccounts = await connection.getTokenLargestAccounts(mintKey)
    const transactions: unknown[] = []
    const seenSignatures = new Set<string>()

    for (const account of tokenAccounts.value) {
      if (transactions.length >= 100) break

      const sigs = await connection.getSignaturesForAddress(new PublicKey(account.address), { limit: 50 })
      for (const sig of sigs) {
        if (seenSignatures.has(sig.signature)) continue
        seenSignatures.add(sig.signature)

        if (!sig.blockTime) continue
        if (sig.blockTime < startUtc || sig.blockTime > endUtc) continue

        const tx = await connection.getParsedTransaction(sig.signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0,
        })
        if (!tx) continue

        // Filter for Raydium or Jupiter
        const isRelevant = tx.transaction.message.instructions.some(
          (ix: unknown) => ix.programId && PROGRAM_IDS.some(pid => ix.programId.toBase58() === pid.toBase58()),
        )

        if (isRelevant) {
          // Wallet = first signer
          const signerKey = tx.transaction.message.accountKeys.find((k: unknown) => k.signer)?.pubkey.toBase58() || null

          transactions.push({
            signature: sig.signature,
            slot: sig.slot,
            blockTime: sig.blockTime,
            date: sig.blockTime ? new Date(sig.blockTime * 1000).toISOString() : null,
            account: account.address,
            wallet: signerKey,
          })
          if (transactions.length >= 100) break
        }
      }
    }

    // Sort newest first
    transactions.sort((a, b) => (b.blockTime ?? 0) - (a.blockTime ?? 0))

    // Pick one random wallet
    const wallets = transactions.map(t => t.wallet).filter(Boolean)
    const randomWallet = wallets.length > 0 ? wallets[Math.floor(Math.random() * wallets.length)] : null

    return {
      token: GET_TOKEN_MINT,
      dex: 'Raydium + Jupiter + Orca + Metora',
      count: transactions.length,
      randomWallet,
      transactions,
    }
  }
  catch (err: unknown) {
    console.error('Error fetching last-day token transactions:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch last-day token transactions',
      data: { error: err.message },
    })
  }
})
