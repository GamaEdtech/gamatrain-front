/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import type { Transaction, VersionedTransaction } from '@solana/web3.js'
import { AnchorProvider, Program, type Idl, type Wallet } from '@coral-xyz/anchor'
import idl from '~/idl/gamaedtech_program.json'

// --- Constants ---
const preflightCommitment = 'processed'
const commitment = 'confirmed'
const PROGRAM_ID_STRING = idl.address

// --- Types ---
interface WorkspaceState {
  wallet: Ref<any>
  connection: Ref<any>
  provider: Ref<any>
  program: Ref<any>
  connected: Ref<boolean>
  publicKey: Ref<any | null>
}

// Global workspace state (singleton)
let globalWorkspace: WorkspaceState | null = null

/**
 * SSR-friendly workspace composable for Solana interaction
 * This replaces the plugin approach with a proper composable pattern
 */
export const useWorkspace = (): WorkspaceState => {
  // Return existing instance if available
  if (globalWorkspace) {
    return globalWorkspace
  }

  // Client-only refs to avoid SSR issues
  const wallet = ref<any>(null)
  const connected = ref(false)
  const publicKey = ref<any | null>(null)
  const connection = ref<any>(null)
  const provider = ref<any>(null)
  const program = ref<any>(null)

  // Create the workspace state
  globalWorkspace = {
    wallet,
    connection,
    provider,
    program,
    connected,
    publicKey,
  }

  // Initialize only on client side and only once
  if (import.meta.client) {
    // Use nextTick to ensure DOM is ready
    nextTick(() => {
      initializeWorkspace()
    })
  }

  return globalWorkspace
}

/**
 * Initialize the workspace - called only once
 */
async function initializeWorkspace() {
  if (!globalWorkspace) return
  if (!import.meta.client) return

  const { wallet, connection, provider, program, connected, publicKey } = globalWorkspace

  try {
    // Initialize connection first
    const config = useRuntimeConfig()
    const rpcUrl = config.public?.solanaRpcUrl || 'https://api.devnet.solana.com'
    connection.value = new Connection(rpcUrl, commitment)

    // Dynamic import of wallet functionality
    const { useAnchorWallet, useWallet } = await import('solana-wallets-vue')
    const anchorWallet = useAnchorWallet()
    const walletStore = useWallet()

    wallet.value = anchorWallet

    // Set initial values
    connected.value = walletStore.connected?.value || false
    publicKey.value = walletStore.publicKey?.value || null

    // Watch wallet connection state
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

    // Setup provider reactively
    const setupProvider = () => {
      if (!connection.value) return null

      if (!wallet.value?.value) {
        // Return dummy provider for when wallet is not connected
        const dummyWallet: any = {
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

      return new AnchorProvider(connection.value, wallet.value.value, {
        preflightCommitment,
        commitment,
      })
    }

    // Setup program reactively
    const setupProgram = () => {
      const currentProvider = provider.value
      if (!currentProvider) return null

      try {
        return new Program(idl as any, currentProvider) as any
      }
      catch (error) {
        console.error('Failed to create program:', error)
        return null
      }
    }

    // Update provider when wallet changes
    const updateProvider = () => {
      provider.value = setupProvider()
    }

    // Update program when provider changes
    const updateProgram = () => {
      program.value = setupProgram()
    }

    // Initial setup
    updateProvider()
    updateProgram()

    // Watch for changes
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
