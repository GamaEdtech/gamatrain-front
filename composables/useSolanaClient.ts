// Client-scoped Solana composable with lazy dynamic imports and SSR safety
import type { Connection as SolanaConnection, PublicKey as SolanaPublicKey, Commitment } from '@solana/web3.js'

type Finality = Commitment | 'processed' | 'confirmed' | 'finalized'

export type TokenBalanceResult = {
  amount: string
  decimals: number
  uiAmount: number | null
  uiAmountString: string
}

let connectionPromise: Promise<SolanaConnection> | null = null

async function getConnection(): Promise<SolanaConnection> {
  if (!import.meta.client) {
    throw new Error('Solana client is only available in the browser')
  }
  if (!connectionPromise) {
    connectionPromise = (async () => {
      const { Connection } = await import('@solana/web3.js')
      const config = useRuntimeConfig()
      const endpoint = (config.public?.solanaRpcUrl as string | undefined) || 'https://api.mainnet-beta.solana.com'
      return new Connection(endpoint, 'confirmed')
    })()
  }
  return connectionPromise
}

async function toPublicKey(base58: string): Promise<SolanaPublicKey> {
  if (!import.meta.client) {
    throw new Error('PublicKey is only available in the browser')
  }
  if (!base58 || typeof base58 !== 'string') {
    throw new Error('Invalid public key string')
  }
  const { PublicKey } = await import('@solana/web3.js')
  return new PublicKey(base58)
}

export async function fetchTokenBalance(params: {
  owner: string
  mint: string
  commitment?: Finality
}): Promise<TokenBalanceResult> {
  if (!import.meta.client) {
    throw new Error('fetchTokenBalance can only run on the client')
  }
  const { owner, mint, commitment } = params
  const [connection, ownerPk, mintPk] = await Promise.all([
    getConnection(),
    toPublicKey(owner),
    toPublicKey(mint),
  ])
  try {
    const resp = await connection.getParsedTokenAccountsByOwner(
      ownerPk,
      { mint: mintPk },
      commitment,
    )

    let rawAmount = 0n
    let decimals = 0

    for (const { account } of resp.value) {
      const accData = account.data as unknown as {
        parsed?: { info?: { tokenAmount?: { amount?: string, decimals?: number } } }
      }
      const tokenAmount = accData.parsed?.info?.tokenAmount
      if (!tokenAmount) continue
      const amtStr = String(tokenAmount.amount ?? '0')
      const dec = Number(tokenAmount.decimals ?? 0)
      decimals = dec
      rawAmount += BigInt(amtStr)
    }

    const ui = decimals >= 0 ? Number(rawAmount) / 10 ** decimals : null
    const uiStr = decimals >= 0 ? (Number(rawAmount) / 10 ** decimals).toString() : '0'

    return {
      amount: rawAmount.toString(),
      decimals,
      uiAmount: Number.isFinite(ui ?? NaN) ? ui : null,
      uiAmountString: uiStr,
    }
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error fetching token balance'
    throw new Error(`Solana fetchTokenBalance failed: ${msg}`)
  }
}

export async function getTokenAccountsByOwner(params: {
  owner: string
  mint?: string
  commitment?: Finality
}): Promise<Array<{ pubkey: string, amount: string, decimals: number }>> {
  if (!import.meta.client) {
    throw new Error('getTokenAccountsByOwner can only run on the client')
  }
  const { owner, mint, commitment } = params
  const [connection, ownerPk] = await Promise.all([
    getConnection(),
    toPublicKey(owner),
  ])
  try {
    const filter: { mint: SolanaPublicKey } | { programId: SolanaPublicKey } = mint
      ? { mint: await toPublicKey(mint) }
      : { programId: await toPublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }

    const resp = await connection.getParsedTokenAccountsByOwner(
      ownerPk,
      filter,
      commitment,
    )

    return resp.value.map(({ pubkey, account }) => {
      const accData = account.data as unknown as {
        parsed?: { info?: { tokenAmount?: { amount?: string, decimals?: number } } }
      }
      const tokenAmount = accData.parsed?.info?.tokenAmount
      return {
        pubkey: pubkey.toBase58(),
        amount: String(tokenAmount?.amount ?? '0'),
        decimals: Number(tokenAmount?.decimals ?? 0),
      }
    })
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error fetching token accounts'
    throw new Error(`Solana getTokenAccountsByOwner failed: ${msg}`)
  }
}

export function useSolanaClient() {
  return {
    getConnection,
    fetchTokenBalance,
    getTokenAccountsByOwner,
  }
}
