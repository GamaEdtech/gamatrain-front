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
      maxSupportedTransactionVersion: 0, // allow version 0 transactions
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

    // Helper to resolve symbol
    const getSymbolFromMint = mint => TOKEN_SYMBOLS[mint] || 'UNKNOWN'

    // Helper function to get wallet from token account
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
      if ((inst.parsed?.type === 'transfer' || inst.parsed?.type === 'transferChecked') && inst.parsed.info?.tokenAmount) {
        const info = inst.parsed.info

        // Convert token accounts to wallet addresses
        const sourceWallet = await getWalletFromTokenAccount(info.source)
        const destinationWallet = await getWalletFromTokenAccount(info.destination)

        transfer = {
          sourceWallet,
          destinationWallet,
          amount: info.tokenAmount?.uiAmountString || String(info.amount),
          mint: info.mint, // Mint address
          symbol: getSymbolFromMint(info.mint), // Human-friendly symbol
        }
        break
      }

      // Native SOL transfer
      if (inst.programId.equals(SystemProgram.programId) && inst.parsed?.type === 'transfer') {
        const info = inst.parsed.info
        transfer = {
          sourceWallet: info.source,
          destinationWallet: info.destination,
          amount: Number(info.lamports) / 1e9, // convert lamports to SOL
          mint: 'So11111111111111111111111111111111111111112', // Wrapped SOL mint
          symbol: 'SOL',
        }
        break // exit loop, only first transfer
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
