import type { Connection } from '@solana/web3.js'

interface TokenHolder {
  wallet: string
  amount: number
}

export default defineEventHandler(async (event) => {
  const { Connection, PublicKey } = await import('@solana/web3.js').catch(() => {
    throw new Error('Failed to load @solana/web3.js')
  })

  const { AccountLayout } = await import('@solana/spl-token').catch(() => {
    throw new Error('Failed to load @solana/spl-token')
  })
  // Set CORS headers for browser requests
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (event.method === 'OPTIONS') {
    return ''
  }

  try {
    // GET token mint address from the existing configuration
    const GET_TOKEN_MINT = 'GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv'

    // Get Solana RPC URL from runtime config or use default
    const config = useRuntimeConfig()
    const configuredRpcUrl = config.public?.solanaRpcUrl || 'https://api.mainnet-beta.solana.com'

    // Try multiple RPC endpoints if the first one fails
    const rpcEndpoints = [
      configuredRpcUrl,
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana',
    ]

    console.log('Fetching holders for token:', GET_TOKEN_MINT)

    let connection: Connection | null = null
    let workingRpc = ''

    // Try each RPC endpoint until one works
    for (const endpoint of rpcEndpoints) {
      try {
        console.log('Testing connection to:', endpoint)
        const testConnection = new Connection(endpoint, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 30000,
        })
        await testConnection.getVersion()

        connection = testConnection
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        workingRpc = endpoint
        console.log('Successfully connected to:', endpoint)
        break
      }
      catch (rpcError) {
        console.log('Failed to connect to:', endpoint, rpcError)
        continue
      }
    }

    if (!connection) {
      throw new Error('Could not connect to any Solana RPC endpoint')
    }

    // Convert mint address to PublicKey
    const mintPublicKey = new PublicKey(GET_TOKEN_MINT)

    // Get token supply and decimals
    let tokenDecimals = 6 // Default based on our test, but we'll verify
    try {
      const supply = await connection.getTokenSupply(mintPublicKey)
      tokenDecimals = supply.value.decimals
      console.log(`Token supply: ${supply.value.uiAmount}, decimals: ${tokenDecimals}`)
    }
    catch (supplyError) {
      console.error('Error getting token supply:', supplyError)
      console.log('Continuing with default decimals...')
    }

    const holders: TokenHolder[] = []

    // Get the largest token accounts (most reliable method)
    try {
      console.log('Getting largest token accounts...')
      const largestAccounts = await connection.getTokenLargestAccounts(mintPublicKey)
      console.log(`Found ${largestAccounts.value.length} largest accounts`)

      for (const account of largestAccounts.value) {
        if (account.uiAmount && account.uiAmount > 0) {
          // We need to get the owner of this token account
          try {
            const accountInfo = await connection.getAccountInfo(new PublicKey(account.address))
            if (accountInfo) {
              const accountData = AccountLayout.decode(accountInfo.data)
              const owner = accountData.owner.toBase58()

              holders.push({
                wallet: owner,
                amount: Math.floor(account.uiAmount),
              })
            }
          }
          catch {
            console.log('Error getting account info for:', account.address)
          }
        }
      }
    }
    catch (largestError) {
      console.error('Error getting largest accounts:', largestError)
      throw largestError
    }

    // Sort by amount descending
    holders.sort((a, b) => b.amount - a.amount)

    console.log(`Returning ${holders.length} token holders`)

    // Return the holders array as requested in the requirements
    return holders
  }
  catch (error) {
    console.error('Error fetching token holders:', error)

    // Return appropriate error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch token holders',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})
