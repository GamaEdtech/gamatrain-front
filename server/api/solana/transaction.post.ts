// Check a Solana transaction status and details
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig() // server-side only
  const serverApiKey = config.serverApiKey

  const body = await readBody(event)
  const { txid, apiKey } = body

  if (!apiKey || apiKey !== serverApiKey) {
    return { error: true, message: 'Invalid API key' }
  }

  if (!txid) return { error: true, message: 'Transaction ID is required' }

  try {
    const rpcUrl = useRuntimeConfig().public?.solanaRpcUrl || 'https://api.mainnet-beta.solana.com'
    const connection = new Connection(rpcUrl, 'confirmed')

    const tx = await connection.getParsedTransaction(txid, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0, // legacy + v0
    })

    if (!tx) return { error: true, message: 'Transaction not found' }

    const status = tx.meta?.err ? 'Failed' : 'Success'

    // Memo
    const memoInstruction = tx.transaction.message.instructions.find(
      inst => inst.program === 'spl-memo',
    )
    const memo = memoInstruction?.parsed || null

    // Known token symbols (expand as needed)
    const TOKEN_SYMBOLS = {
      So11111111111111111111111111111111111111112: 'SOL', // Wrapped SOL
      EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 'USDC',
      Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 'USDT',
      GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv: 'GET',
      // Add more tokens here...
    }

    const getSymbolFromMint = mint => TOKEN_SYMBOLS[mint] || 'UNKNOWN'

    // Helper function to get wallet owner from token account
    const getWalletFromTokenAccount = async (tokenAccount) => {
      try {
        const accountInfo = await connection.getParsedAccountInfo(new PublicKey(tokenAccount))
        return accountInfo.value?.data?.parsed?.info?.owner || tokenAccount
      }
      catch {
        return tokenAccount
      }
    }

    let transfer = null
    for (const inst of tx.transaction.message.instructions) {
      // SPL Token Transfer
      if ((inst.parsed?.type === 'transfer' || inst.parsed?.type === 'transferChecked')) {
        const info = inst.parsed.info
        const sourceWallet = await getWalletFromTokenAccount(info.source)
        const destinationWallet = await getWalletFromTokenAccount(info.destination)
        // Token2022
        if (inst.parsed.info?.amount) {
          const sourcePubkey = new PublicKey(info.source)

          const sourceInfo = await connection.getParsedAccountInfo(sourcePubkey)
          if (!sourceInfo.value) {
            throw new Error(`Token account ${sourcePubkey.toBase58()} does not exist`)
          }
          const mint = sourceInfo.value.data.parsed.info.mint

          transfer = {
            sourceWallet,
            destinationWallet,
            amount: info.amount, // base units (string, no decimals applied)
            uiAmount: (Number(info.amount) / 1e6).toString(), // human-readable
            mint: info.mint,
            symbol: getSymbolFromMint(mint),
          }
        }
        // SplToken
        else {
          transfer = {
            sourceWallet,
            destinationWallet,
            amount: info.amount, // base units (string, no decimals applied)
            uiAmount: info.tokenAmount.uiAmount, // human-readable
            mint: info.mint,
            symbol: getSymbolFromMint(info.mint),
          }
        }
        break
      }

      // Native SOL transfer
      if (inst.programId.equals(SystemProgram.programId) && inst.parsed?.type === 'transfer') {
        const info = inst.parsed.info

        transfer = {
          sourceWallet: info.source,
          destinationWallet: info.destination,
          amount: String(info.lamports), // lamports
          uiAmount: (Number(info.lamports) / 1e9).toString(), // SOL
          mint: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
        }
        break
      }
    }

    return {
      error: false,
      txid,
      status,
      memo,
      transfer,
    }
  }
  catch (err) {
    return { error: true, message: err.message }
  }
})
