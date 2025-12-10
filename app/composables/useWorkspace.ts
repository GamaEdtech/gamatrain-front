import { watch } from 'vue'
import type { Ref } from 'vue'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { Program, AnchorProvider, BN as BNClass, Wallet } from '@coral-xyz/anchor'
import type { AnchorWallet } from 'solana-wallets-vue'
import type { GamaedtechProgram } from '~/idl/type/gamaedtech_program'
import type { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'

type Web3LibraryType = typeof import('@solana/web3.js')
type splTokenLibraryType = typeof import('@solana/spl-token')
type anchorLibraryType = typeof import('@coral-xyz/anchor')
type walletVueLibraryType = typeof import('solana-wallets-vue')

interface WorkspaceState {
  wallet: Ref<AnchorWallet | null | undefined>
  connection: Ref<Connection | null>
  provider: Ref<AnchorProvider | null>
  program: Ref<Program<GamaedtechProgram> | null>
  connected: Ref<boolean>
  publicKey: Ref<PublicKey | null>
  web3: Ref<Web3LibraryType | null>
  BN: Ref<BNClass | null>
  splToken: Ref<splTokenLibraryType | null>
  anchor: Ref<anchorLibraryType | null>
  walletLibrary: Ref<walletVueLibraryType | null>
  Buffer: Ref<typeof Buffer | null>
  initPromise: Promise<void> | null
  manualDisconnectWallet: () => void
}
interface AnchorWalletCustom {
  publicKey: PublicKey
  signTransaction: SignerWalletAdapterProps['signTransaction']
  signAllTransactions: SignerWalletAdapterProps['signAllTransactions']
}
interface WalletStore {
  publicKey: Ref<PublicKey | null>
  signTransaction: Ref<SignerWalletAdapterProps['signTransaction'] | undefined>
  signAllTransactions: Ref<
    SignerWalletAdapterProps['signAllTransactions'] | undefined
  >
};

let workspace: WorkspaceState | null = null

let initPromise: Promise<void> | null = null
let initResolve: (() => void) | null = null

const PREFLIGHT = 'processed'
const COMMITMENT = 'confirmed'

export const useWorkspace = () => {
  if (workspace) return workspace

  const state: WorkspaceState = {
    wallet: ref(null),
    connected: ref(false),
    publicKey: ref(null),
    connection: ref(null),
    provider: ref(null),
    program: ref(null),
    web3: ref(null),
    BN: ref(null),
    splToken: ref(null),
    anchor: ref(null),
    walletLibrary: ref(null),
    Buffer: ref(null),
    initPromise: null,
    manualDisconnectWallet: manualDisconnectWallet,
  }

  if (!initPromise) {
    initPromise = new Promise((resolve) => {
      initResolve = resolve
    })
  }
  state.initPromise = initPromise
  workspace = state
  if (import.meta.client) nextTick(() => initialize(state))

  return state
}

async function initialize(ws: WorkspaceState) {
  try {
    await initLibraries(ws)
    await initConnection(ws)
    await initWalletAndSync(ws)
    await initProvider(ws)
    await initProgram(ws)
  }
  catch (err) {
    console.error('[workspace] initialize error:', err)
  }
  finally {
    if (initResolve) {
      initResolve()
    }
  }
}

async function manualDisconnectWallet() {
  // console.log('manualDisconnectWallet')
  // workspace?.walletHelper.value.disconnect()
  // workspace!.wallet.value = null
  // workspace!.connected.value = false
  // workspace!.publicKey.value = null

  // workspace!.provider.value = null
  // workspace!.program.value = null
}

async function initLibraries(ws: WorkspaceState) {
  const buffer = await import('buffer')
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = buffer.Buffer
  }

  const [anchorLib, wallets, web3Lib, splLib] = await Promise.all([
    import('@coral-xyz/anchor'),
    import('solana-wallets-vue'),
    import('@solana/web3.js'),
    import('@solana/spl-token'),
  ])

  ws.Buffer.value = buffer.Buffer
  ws.anchor.value = anchorLib
  ws.walletLibrary.value = wallets
  ws.web3.value = web3Lib
  ws.splToken.value = splLib
  ws.BN.value = anchorLib.BN ?? null
}

async function initConnection(ws: WorkspaceState) {
  const config = useRuntimeConfig()
  const rpcUrl = config.public?.solanaRpcUrl ?? 'https://api.devnet.solana.com'
  if (ws.web3.value) {
    ws.connection.value = new ws.web3.value.Connection(rpcUrl, COMMITMENT)
  }
}

function createAnchorWallet(walletStore: WalletStore): Ref<AnchorWalletCustom | null> {
  if (!walletStore) return ref(null)

  const publicKey = walletStore.publicKey
  const signTransaction = walletStore.signTransaction
  const signAllTransactions = walletStore.signAllTransactions

  return computed(() => {
    if (
      !publicKey.value
      || !signTransaction.value
      || !signAllTransactions.value
    ) return null

    return {
      publicKey: publicKey.value,
      signTransaction: signTransaction.value,
      signAllTransactions: signAllTransactions.value,
    }
  })
}

async function initWalletAndSync(ws: WorkspaceState) {
  if (ws.walletLibrary.value) {
    const { useWallet } = ws.walletLibrary.value
    const walletStore = useWallet()

    const anchorWallet = createAnchorWallet(walletStore)

    watch(() => anchorWallet.value, async (v) => {
      if (v) {
        ws.wallet.value = v
        await initProvider(ws)
        await initProgram(ws)
      }
    })
    if (anchorWallet.value) {
      ws.wallet.value = anchorWallet.value
    }

    ws.connected.value = walletStore.connected?.value ?? false
    ws.publicKey.value = walletStore.publicKey?.value ?? null

    watch(() => walletStore.connected.value, async (v) => {
      ws.connected.value = v
    })

    watch(() => walletStore.publicKey.value, async (v) => {
      ws.publicKey.value = v
    })
  }
}

async function initProvider(ws: WorkspaceState) {
  if (ws.anchor.value) {
    const AnchorProvider = ws.anchor.value.AnchorProvider

    const connection = ws.connection.value
    if (!connection) throw new Error('Connection not initialized for provider')

    const walletInstance = ws.wallet.value

    if (!walletInstance && ws.web3.value) {
      console.log('dummy wallet')
      const dummyKeypair = ws.anchor.value.web3.Keypair.generate()
      const dummy: Wallet = {
        publicKey: new ws.web3.value.PublicKey('11111111111111111111111111111111'),
        payer: dummyKeypair,
        async signTransaction() { throw new Error('Wallet not connected') },
        async signAllTransactions() { throw new Error('Wallet not connected') },
      }
      ws.provider.value = new AnchorProvider(connection, dummy, { preflightCommitment: PREFLIGHT, commitment: COMMITMENT })
      return
    }

    console.log('real wallet')
    ws.provider.value = new AnchorProvider(connection, walletInstance as Wallet, { preflightCommitment: PREFLIGHT, commitment: COMMITMENT })
  }
}

async function initProgram(ws: WorkspaceState) {
  if (!ws.provider.value) {
    ws.program.value = null
    return
  }
  if (ws.anchor.value) {
    try {
      const rawIdl = await import('~/idl/gamaedtech_program.json')
      const idlJson = rawIdl.default ?? rawIdl
      ws.program.value = new ws.anchor.value.Program<GamaedtechProgram>(idlJson as GamaedtechProgram, ws.provider.value)
    }
    catch (err) {
      console.error('[workspace] failed to create program', err)
      ws.program.value = null
    }
  }
}
