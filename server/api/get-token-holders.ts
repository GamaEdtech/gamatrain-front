import { Connection, PublicKey } from '@solana/web3.js'
import { getAccount, getMint } from '@solana/spl-token'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const txid = body?.txid
  if (!txid) return { error: 'Transaction ID (txid) is required' }

  const config = useRuntimeConfig()
  const configuredRpcUrl
    = config.public?.solanaRpcUrl || 'https://api.mainnet-beta.solana.com'

  const connection = new Connection(configuredRpcUrl)

  try {
    const parsed = await connection.getParsedTransaction(txid, 'confirmed')
    if (!parsed) return { error: 'Transaction not found' }

    const status = parsed.meta?.err ? 'Failed' : 'Success'

    // --- Memo ---
    let memo: string | null = null
    for (const ix of parsed.transaction.message.instructions) {
      if (ix.parsed?.type === 'memo') {
        memo = ix.parsed.info?.memo || null
        break
      }
    }

    let SourceWallet: string | null = null
    let DestinationWallet: string | null = null
    let Amount = 0
    let Currency = 'SOL'

    // Look for SPL token transfer
    const tokenInstr = parsed.transaction.message.instructions.find(
      (ix: any) =>
        ix.program === 'spl-token'
        && ix.parsed
        && (ix.parsed.type === 'transfer' || ix.parsed.type === 'transferChecked'),
    )

    if (tokenInstr) {
      const info = tokenInstr.parsed.info
      const sourceTokenAccount = new PublicKey(info.source)
      const destTokenAccount = new PublicKey(info.destination)
      const mintPubkey = new PublicKey(info.mint)

      // Resolve source and destination owners using spl-token
      const sourceAcc = await getAccount(connection, sourceTokenAccount)
      const destAcc = await getAccount(connection, destTokenAccount)
      const mintAcc = await getMint(connection, mintPubkey)

      SourceWallet = sourceAcc.owner.toBase58()
      DestinationWallet = destAcc.owner.toBase58()
      Amount = Number(info.amount) / 10 ** mintAcc.decimals
      Currency = mintPubkey.toBase58() // you can later map this to "USDC" etc.
    }
    else {
      // Otherwise treat as SOL transfer
      const sysInstr = parsed.transaction.message.instructions.find(
        (ix: any) => ix.program === 'system' && ix.parsed?.type === 'transfer',
      )
      if (sysInstr) {
        const info = sysInstr.parsed.info
        SourceWallet = info.source
        DestinationWallet = info.destination
        Amount = Number(info.lamports) / 1e9
        Currency = 'SOL'
      }
    }

    return {
      Status: status,
      Memo: memo,
      SourceWallet,
      DestinationWallet,
      Amount,
      Currency,
    }
  }
  catch (err: any) {
    return { error: err?.message ?? String(err) }
  }
})
