/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { Connection, PublicKey, type Transaction, type VersionedTransaction } from '@solana/web3.js'
import type { Idl, Wallet } from '@coral-xyz/anchor'
import idl from '~/idl/gamaedtech_program.json'

// --- Constants ---
const preflightCommitment = 'processed'
const commitment = 'confirmed'

// --- Types ---
interface WorkspaceState {
  wallet: Ref<any>
  connection: Ref<any>
  provider: Ref<any>
  program: Ref<any>
  connected: Ref<boolean>
  publicKey: Ref<any | null>
}

// Global workspace (singleton)
let globalWorkspace: WorkspaceState | null = null

/**
 * SSR-friendly Solana workspace composable
 */
export const useWorkspace = (): WorkspaceState => {
  if (globalWorkspace) return globalWorkspace

  const wallet = ref<any>(null)
  const connected = ref(false)
  const publicKey = ref<any | null>(null)
  const connection = ref<any>(null)
  const provider = ref<any>(null)
  const program = ref<any>(null)

  globalWorkspace = { wallet, connection, provider, program, connected, publicKey }

  // Initialize only on client side
  if (import.meta.client) {
    nextTick(() => {
      initializeWorkspace()
    })
  }

  return globalWorkspace
}

/**
 * Initialize workspace once on client
 */
async function initializeWorkspace() {
  if (!globalWorkspace || !import.meta.client) return

  const { wallet, connection, provider, program, connected, publicKey } = globalWorkspace

  try {
    // Load runtime config (RPC URL)
    const config = useRuntimeConfig()
    const rpcUrl = config.public?.solanaRpcUrl || 'https://api.devnet.solana.com'

    // Connect to Solana RPC
    connection.value = new Connection(rpcUrl, commitment)

    // --- Dynamic imports ---
    const [{ AnchorProvider, Program }, wallets] = await Promise.all([
      import('@coral-xyz/anchor').then(m => ({ AnchorProvider: m.AnchorProvider, Program: m.Program })),
      import('solana-wallets-vue'),
    ])

    const { useAnchorWallet, useWallet } = wallets
    const anchorWallet = useAnchorWallet()
    const walletStore = useWallet()

    wallet.value = anchorWallet
    connected.value = walletStore.connected?.value || false
    publicKey.value = walletStore.publicKey?.value || null

    // Reactively update wallet info
    if (walletStore.connected) {
      watch(() => walletStore.connected.value, (isConnected) => {
        connected.value = isConnected
      })
    }

    if (walletStore.publicKey) {
      watch(() => walletStore.publicKey.value, (pk) => {
        publicKey.value = pk
      })
    }

    // --- Provider setup ---
    const setupProvider = () => {
      if (!connection.value) return null

      if (!wallet.value?.value) {
        // Dummy wallet for disconnected state
        const dummyWallet: Wallet = {
          publicKey: new PublicKey('11111111111111111111111111111111'),
          async signTransaction<T extends Transaction | VersionedTransaction>(): Promise<never> {
            throw new Error('Wallet not connected')
          },
          async signAllTransactions<T extends Transaction | VersionedTransaction>(): Promise<never> {
            throw new Error('Wallet not connected')
          },
        }
        return new AnchorProvider(connection.value, dummyWallet, { preflightCommitment, commitment })
      }

      return new AnchorProvider(connection.value, wallet.value.value, { preflightCommitment, commitment })
    }

    // --- Program setup ---
    const setupProgram = () => {
      if (!provider.value) return null
      try {
        return new Program(idl as Idl, idl.address, provider.value)
      }
      catch (error) {
        console.error('Failed to create program:', error)
        return null
      }
    }

    // Update functions
    const updateProvider = () => {
      provider.value = setupProvider()
    }

    const updateProgram = () => {
      program.value = setupProgram()
    }

    // Initial setup
    updateProvider()
    updateProgram()

    // Reactivity: wallet → provider → program
    watch(() => wallet.value?.value, () => {
      updateProvider()
      updateProgram()
    })

    watch(() => provider.value, () => {
      updateProgram()
    })
  }
  catch (error) {
    console.error('❌ Failed to initialize workspace:', error)
  }
}
