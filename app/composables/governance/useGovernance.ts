import type { ParsedTokenAccountData } from '~/types/governance'
import { useStake } from './useStake'
import { useStats } from './useStats'
import { useProposal } from './useProposal'

const tokenBalance = ref<number | null>(null)
const loadingTokenBalance = ref(false)
const tokenBalanceError = ref<string | null>(null)

export const useGovernance = () => {
  const { publicKey, web3, initPromise, connection, connected, BN } = useWorkspace()

  const stake = useStake()
  const stats = useStats()
  const proposal = useProposal()

  const fetchTokenBalance = async () => {
    loadingTokenBalance.value = true
    tokenBalanceError.value = null
    tokenBalance.value = null

    await initPromise

    try {
      const config = useRuntimeConfig()
      const tokenMint = new web3.value.PublicKey(config.public.solanaTokenMint)

      if (!connection.value) {
        tokenBalanceError.value = 'CONNECTION_NOT_READY'
        return
      }
      if (!publicKey.value) {
        tokenBalanceError.value = 'WALLET_NOT_CONNECTED'
        return
      }

      const mintPk = new web3.value.PublicKey(tokenMint)

      const response = await connection.value.getParsedTokenAccountsByOwner(
        publicKey.value,
        { mint: mintPk },
        'finalized',
      )

      let rawAmount = 0n
      let decimals = 0

      for (const { account } of response.value) {
        const parsed = account.data as ParsedTokenAccountData

        const tokenAmount = parsed?.parsed?.info?.tokenAmount
        if (!tokenAmount) continue

        const amt = BigInt(tokenAmount.amount ?? '0')
        decimals = Number(tokenAmount.decimals ?? 0)

        rawAmount += amt
      }

      const ui = decimals >= 0 ? Number(rawAmount) / 10 ** decimals : 0

      tokenBalance.value = ui
    }
    catch (err) {
      console.error('fetchTokenBalance error:', err)
      tokenBalanceError.value = 'FAILED_TO_FETCH_TOKEN_BALANCE'
    }
    finally {
      loadingTokenBalance.value = false
    }
  }

  return { ...stake, ...stats, ...proposal, tokenBalance, fetchTokenBalance, connected, publicKey, BN }
}
