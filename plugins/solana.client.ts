import type { Router, RouteLocationNormalized } from 'vue-router'
/* Lazy, client-only Solana wallets plugin
   - Avoids bundling solana-wallets-vue and adapters on routes that don't need them
   - Installs the plugin only when visiting /get-token (or when already on that route)
*/
export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.client) {
    return
  }

  const router = nuxtApp.$router as unknown as Router
  let installed = false

  const shouldUseWallets = (path: string) => {
    // Adjust this predicate if you add more routes that need wallets
    return (
      path.startsWith('/get-token')
      || path.startsWith('/governance')
    )
  }

  async function installWallets() {
    if (installed) return

    // Load styles and plugin only when needed
    await import('solana-wallets-vue/styles.css')
    const { default: SolanaWallets } = await import('solana-wallets-vue')
    const { WalletAdapterNetwork } = await import('@solana/wallet-adapter-base')
    const walletsMod = await import('@solana/wallet-adapter-wallets')

    // Network from runtime config (defaults to mainnet)
    const config = useRuntimeConfig()
    const netStr = (config.public?.solanaNetwork as string | undefined)?.toLowerCase() || 'mainnet'
    let network: typeof WalletAdapterNetwork.Mainnet | typeof WalletAdapterNetwork.Devnet | typeof WalletAdapterNetwork.Testnet
    switch (netStr) {
      case 'devnet':
        network = WalletAdapterNetwork.Devnet
        break
      case 'testnet':
        network = WalletAdapterNetwork.Testnet
        break
      default:
        network = WalletAdapterNetwork.Mainnet
        break
    }

    const walletOptions = {
      wallets: [
        new walletsMod.PhantomWalletAdapter(),
        new walletsMod.CloverWalletAdapter(),
        new walletsMod.Coin98WalletAdapter(),
        new walletsMod.SolflareWalletAdapter({ network }),
      ],
      autoConnect: true,
    }

    nuxtApp.vueApp.use(SolanaWallets, walletOptions)
    installed = true
  }

  // Install immediately if the initial route matches
  const initialPath = router.currentRoute.value.path || ''
  if (shouldUseWallets(initialPath)) {
    await installWallets()
  }

  // Install on navigation into a matching route
  router.beforeEach(async (to: RouteLocationNormalized) => {
    if (shouldUseWallets(to.path)) {
      await installWallets()
    }
  })
})
