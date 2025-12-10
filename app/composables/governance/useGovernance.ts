import type { ParsedTokenAccountData } from '~/types/governance'
import type { Program } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'
import { useStake } from './useStake'
import { useStats } from './useStats'
import { useProposal } from './useProposal'
import { useVote } from './useVote'

type Web3LibraryType = typeof import('@solana/web3.js')

type CheckRequirementResult
  = | { ok: false, message: string }
    | {
      ok: true
      programChain: Program<GamaedtechProgram>
      userPublicKey: PublicKey
      connection: Connection
      web3: Ref<Web3LibraryType>
      message: string
    }
type RequirementKey = 'program' | 'publicKey' | 'connection' | 'web3' | 'spl'

const tokenBalance = ref<number | null>(null)
const loadingTokenBalance = ref(false)

export const useGovernance = () => {
  const { publicKey, web3, initPromise, connection, connected, BN, program, manualDisconnectWallet } = useWorkspace()

  const stake = useStake()
  const stats = useStats()
  const proposal = useProposal()
  const vote = useVote()

  const checkReqiureMent = (required: RequirementKey[] = ['program', 'publicKey', 'connection', 'web3']): CheckRequirementResult => {
    const programChain = program?.value
    const userPublicKey = publicKey?.value
    const conn = connection.value

    if (!programChain && required.includes('program')) {
      return { ok: false, message: 'Program is not initialized or not ready.' }
    }

    if (!userPublicKey && required.includes('publicKey')) {
      return { ok: false, message: 'Wallet is not connected. Please connect your wallet and try again.' }
    }

    if (!conn && required.includes('connection')) {
      return { ok: false, message: 'Unable to connect to the Solana network. Please try again.' }
    }

    if (!web3.value && required.includes('web3')) {
      return { ok: false, message: 'Unable to load Web3 to Connect Solana network. Check your internet and refresh page.' }
    }

    return {
      ok: true,
      programChain,
      userPublicKey,
      connection: conn,
      web3: web3,
      message: 'All requirement is ready.',
    } as CheckRequirementResult
  }

  const fetchTokenBalance = async () => {
    loadingTokenBalance.value = true
    tokenBalance.value = null

    await initPromise

    try {
      const check = checkReqiureMent()
      if (!check.ok) return { success: false, message: check.message }

      const { userPublicKey, connection, web3 } = check

      const config = useRuntimeConfig()
      const tokenMint = new web3.value.PublicKey(config.public.solanaTokenMint)

      const mintPk = new web3.value.PublicKey(tokenMint)

      const response = await connection.getParsedTokenAccountsByOwner(
        userPublicKey,
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
    }
    finally {
      loadingTokenBalance.value = false
    }
  }

  return { ...stake, ...stats, ...proposal, ...vote, tokenBalance, fetchTokenBalance, connected, publicKey, BN, manualDisconnectWallet }
}
