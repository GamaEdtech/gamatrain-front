/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { Connection, PublicKey, type Transaction, type VersionedTransaction } from '@solana/web3.js'
import type { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor'

import rawIdl from '~/idl/gamaedtech_program.json'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'

type Web3Type = typeof import('@solana/web3.js')
const idlJson = (rawIdl as any).default ?? rawIdl

// --- Constants ---
const preflightCommitment = 'processed'
const commitment = 'confirmed'

// --- Workspace State ---
interface WorkspaceState {
  wallet: Ref<any>
  connection: Ref<Connection | null>
  provider: Ref<AnchorProvider | null>
  program: Ref<Program<GamaedtechProgram> | null>
  connected: Ref<boolean>
  publicKey: Ref<PublicKey | null>
  web3: Ref<Web3Type>
  initPromise: Promise<void>
}

// Singleton workspace
let globalWorkspace: WorkspaceState | null = null

let initPromise: Promise<void> | null = null
let initResolve: (() => void) | null = null

export const useWorkspace = (): WorkspaceState => {
  if (globalWorkspace) return globalWorkspace

  const wallet = ref<any>(null)
  const connected = ref(false)
  const publicKey = ref<PublicKey | null>(null)
  const connection = ref<Connection | null>(null)
  const provider = ref<AnchorProvider | null>(null)
  const program = ref<Program<GamaedtechProgram> | null>(null)
  const web3 = ref<any>(null)

  if (!initPromise) {
    initPromise = new Promise((resolve) => {
      initResolve = resolve
    })
  }

  globalWorkspace = { wallet, connection, provider, program, connected, publicKey, web3, initPromise }

  if (import.meta.client) nextTick(() => initializeWorkspace())

  return globalWorkspace
}

async function initializeWorkspace() {
  if (!globalWorkspace || !import.meta.client) return

  const { wallet, connection, provider, program, connected, publicKey, web3 } = globalWorkspace

  try {
    const config = useRuntimeConfig()
    const rpcUrl = config.public?.solanaRpcUrl || 'https://api.devnet.solana.com'
    connection.value = new Connection(rpcUrl, commitment)

    // Dynamic imports
    const [{ Program, AnchorProvider }, wallets] = await Promise.all([
      import('@coral-xyz/anchor').then(m => ({ Program: m.Program, AnchorProvider: m.AnchorProvider })),
      import('solana-wallets-vue'),
      import('@solana/web3.js').then(m => (web3.value = m)),
    ])

    const { useAnchorWallet, useWallet } = wallets
    const anchorWallet = useAnchorWallet()
    const walletStore = useWallet()

    wallet.value = anchorWallet
    connected.value = walletStore.connected?.value ?? false
    publicKey.value = walletStore.publicKey?.value ?? null

    // Reactivity
    if (walletStore.connected) watch(() => walletStore.connected.value, (val) => {
      connected.value = val
    })
    if (walletStore.publicKey) watch(() => walletStore.publicKey.value, (val) => {
      publicKey.value = val
    })

    const setupProvider = (): AnchorProvider => {
      if (!connection.value) throw new Error('Connection not initialized')

      if (!wallet.value?.value) {
        const dummyWallet: Wallet = {
          publicKey: new PublicKey('11111111111111111111111111111111'),
          async signTransaction<T extends Transaction | VersionedTransaction>() { throw new Error('Wallet not connected') },
          async signAllTransactions<T extends Transaction | VersionedTransaction>() { throw new Error('Wallet not connected') },
        }
        return new AnchorProvider(connection.value, dummyWallet, { preflightCommitment, commitment })
      }

      return new AnchorProvider(connection.value, wallet.value.value, { preflightCommitment, commitment })
    }

    const setupProgram = (provider: AnchorProvider | null): Program<GamaedtechProgram> | null => {
      if (!provider) return null
      try {
        return new Program<GamaedtechProgram>(idlJson as GamaedtechProgram, provider)
      }
      catch (err) {
        console.error('Failed to create program:', err)
        return null
      }
    }

    const updateProvider = () => {
      provider.value = setupProvider()
    }
    const updateProgram = () => {
      program.value = setupProgram(provider.value)
    }

    updateProvider()
    updateProgram()

    watch(() => wallet.value?.value, () => {
      updateProvider()
      updateProgram()
    })
    watch(() => provider.value, () => {
      updateProgram()
    })

    if (initResolve) initResolve()
  }
  catch (err) {
    console.error('❌ Failed to initialize workspace:', err)
    if (initResolve) initResolve()
  }
}
