<template>
  <div
    class="w-100 h-100 mt-16 d-flex flex-column ga-4 align-center justify-center set-height"
  >
    <!-- <v-text-field
      v-model="amount"
      label="Label"
      class="height-input"
      min-width="300"
      variant="outlined"
    />

    <v-select
      v-model="selectToken"
      :items="payTokenOptions"
      item-title="name"
      item-value="mint"
      label="Select"
      persistent-hint
      return-object
      single-line
      class="height-input"
      min-width="300"
      variant="outlined"
    />

    <v-btn
      size="x-large"
      color="primary"
      flat
      rounded="lg"
      class="text-h4"
      @click="showWalletModal = true"
    >
      Connect wallet
    </v-btn>

    <v-btn
      size="x-large"
      color="primary"
      flat
      rounded="lg"
      class="text-h4"
      @click="showWalletBalance"
    >
      log amount in wallet
    </v-btn>

    <v-btn
      size="x-large"
      color="primary"
      flat
      rounded="lg"
      class="text-h4"
      @click="showDisconnectModal = true"
    >
      disconnect
    </v-btn>

    <v-btn
      size="x-large"
      color="success"
      flat
      rounded="lg"
      class="text-h4"
      @click="startPaymentProccess"
    >
      Pay
    </v-btn>

    <div
      v-if="lastSig"
      class="mt-3 text-sm"
    >
      send transaction:
      <a
        :href="`https://explorer.solana.com/tx/${lastSig}?cluster=devnet`"
        target="_blank"
      >see in Explorer</a>
    </div>

    <v-dialog
      v-model="showWalletModal"
      max-width="500"
    >
      <div
        class="d-flex flex-column align-center justify-center pa-6 bg-white rounded-lg"
      >
        <span class="text-h4 font-weight-bold w-100 text-start">Connect Your Wallet</span>
        <span class="text-h6 font-weight-normal w-100 text-start mt-2">Choose a wallet to connect</span>
        <div class="d-flex w-100 align-center justify-center mt-6">
          <ClientOnly>
            <WalletMultiButton />
          </ClientOnly>
        </div>

        <v-btn
          width="100"
          class="mt-4 text-h5 font-weight-bold rounded-lg"
          color="grey"
          flat
          @click="showWalletModal = false"
        >
          Cancel
        </v-btn>
      </div>
    </v-dialog>

    <v-dialog
      v-model="showDisconnectModal"
      max-width="500"
    >
      <div
        class="d-flex flex-column align-center justify-center pa-6 bg-white rounded-lg"
      >
        <span class="text-h4 font-weight-bold w-100 text-start">Disconnect Wallet</span>
        <span class="text-h6 font-weight-normal w-100 text-start mt-2">
          Are you sure you want to disconnect your wallet? This will clear all
          your current swap data.</span>
        <div class="w-100 d-flex ga-2 align-center justify-center mt-6">
          <v-btn
            class="text-h5 font-weight-bold"
            variant="text"
            flat
            @click="showDisconnectModal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="text-h5 font-weight-bold rounded-lg"
            variant="elevated"
            color="error"
            flat
            @click="handleDisconnect"
          >
            Disconnect Wallet
          </v-btn>
        </div>
      </div>
    </v-dialog> -->
  </div>
</template>

<script setup>
// import { ref } from 'vue'
// import { useSolanaClient } from '~/composables/useSolanaClient'
// // import { Buffer } from "buffer";
// import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js'
// // import {
// //   getAssociatedTokenAddress,
// //   createTransferInstruction,
// // } from "@solana/spl-token";

// const splTokenLib = ref(null)
// const selectToken = ref(null)
// const payTokenOptions = ref([
//   {
//     mint: 'So11111111111111111111111111111111111111112',
//     symbol: 'SOL',
//     name: 'Solana',
//     logoURI:
//       'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
//     decimals: 9,
//   },
//   {
//     // mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//     mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // mint in devnet
//     symbol: 'USDC',
//     name: 'USD Coin',
//     logoURI:
//       'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
//     decimals: 6,
//   },
//   {
//     // mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
//     mint: 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr', // mint in devnet
//     symbol: 'USDT',
//     name: 'Tether USD',
//     logoURI:
//       'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
//     decimals: 6,
//   },
// ])

// const amount = ref('0.01')
// const lastSig = ref(null)

// const wallet = ref(null)
// const showWalletModal = ref(false)
// const showDisconnectModal = ref(false)
// // Dynamic component import for WalletMultiButton
// const WalletMultiButton = defineAsyncComponent(async () => {
//   if (import.meta.client) {
//     const { WalletMultiButton } = await import('solana-wallets-vue')
//     return WalletMultiButton
//   }
//   return { template: '<div>Loading...</div>' }
// })

// // Initialize wallet on client side
// onMounted(async () => {
//   if (import.meta.client) {
//     try {
//       const { useWallet } = await import('solana-wallets-vue')
//       wallet.value = useWallet()
//       console.log('Wallet initialized:', wallet.value)
//       console.log('Initial connection state:', wallet.value?.connected)
//     }
//     catch (error) {
//       console.error('Failed to initialize wallet:', error)
//     }

//     try {
//       if (!window.Buffer) {
//         const { Buffer } = await import('buffer')
//         window.Buffer = Buffer
//       }

//       const {
//         getAssociatedTokenAddress,
//         createTransferInstruction,
//         createAssociatedTokenAccountInstruction,
//       } = await import('@solana/spl-token')

//       splTokenLib.value = {
//         getAssociatedTokenAddress,
//         createTransferInstruction,
//         createAssociatedTokenAccountInstruction,
//       }
//     }
//     catch (err) {
//       console.error('Failed to spl token:', err)
//     }
//   }
// })

// // Handle wallet disconnect
// const handleDisconnect = async () => {
//   try {
//     const w = wallet.value
//     if (w?.disconnect) {
//       await w.disconnect()
//       console.log('Wallet disconnected successfully')
//     }
//     else {
//       console.warn('Wallet does not support disconnect method')
//       // For wallets that don't have disconnect method, we can try to reset the wallet reference
//       wallet.value = null
//     }

//     // Reset all state
//   }
//   catch (error) {
//     console.error('Failed to disconnect wallet:', error)
//     errorMessage.value = 'Failed to disconnect wallet. Please try again.'
//     // Clear error message after 5 seconds
//     setTimeout(() => {
//       errorMessage.value = null
//     }, 10000)
//   }
//   showDisconnectModal.value = false
// }

// const startPaymentProccess = async () => {
//   try {
//     if (!wallet.value?.connected || !wallet.value.publicKey) {
//       showWalletModal.value = true
//       return
//     }

//     if (!selectToken.value) {
//       console.warn('token must be selected')
//       return
//     }

//     // const { getConnection, getTokenAccountsByOwner } = useSolanaClient()
//     // const { getConnection } = useSolanaClient()
//     // const connection = await getConnection()
//     // const owner = wallet.value.publicKey

//     const payAmount = parseFloat(amount.value)
//     if (isNaN(payAmount) || payAmount <= 0) {
//       console.warn('your input is not valid')
//       return
//     }

//     // const lamports = await connection.getBalance(owner)
//     // const solBalance = lamports / 1e9
//     // const networkFeeReserve = 0.001

//     // if (solBalance < networkFeeReserve) {
//     //   console.warn("for transaction fee your balance is not enough");
//     //   return;
//     // }

//     console.log('selectToken.value', selectToken.value)
//     // if (selectToken.value.symbol === 'SOL') {
//     //   if (solBalance < payAmount + networkFeeReserve) {
//     //     console.warn(`your sol balance is not enough: ${solBalance} SOL`)
//     //     return
//     //   }
//     //   console.log('your sol balance is okay✅')
//     // }
//     // else {
//     //   const tokenAccounts = await getTokenAccountsByOwner({
//     //     owner: owner.toBase58(),
//     //     mint: selectToken.value.mint,
//     //   })

//     //   let tokenBalance = 0
//     //   if (tokenAccounts.length > 0) {
//     //     const acc = tokenAccounts[0]
//     //     tokenBalance = Number(acc.amount) / 10 ** acc.decimals
//     //   }

//     //   if (tokenBalance < payAmount) {
//     //     console.warn(
//     //       `your balance ${selectToken.value.symbol} is not eough: ${tokenBalance}`,
//     //     )
//     //     return
//     //   }

//     //   console.log(`${selectToken.value.symbol} balance is okay✅`)
//     // }

//     sendTransaction()
//     console.log('✅ ready for payment...')
//   }
//   catch (err) {
//     console.error('error in check balance:', err)
//   }
// }

// const sendTransaction = async () => {
//   try {
//     if (!wallet.value?.connected || !wallet.value.publicKey) {
//       throw new Error('Wallet is not connected')
//     }

//     const { getConnection } = useSolanaClient()
//     const connection = await getConnection()

//     const destination = new PublicKey(
//       '8nsSJjDKxNcxrDkvkR7BPsRiSsTzd7y9mhtQy6ZRuvsh',
//     )
//     const sender = wallet.value.publicKey

//     console.log(
//       'amount * 10 ** selectToken.value.decimals',
//       amount.value * 10 ** selectToken.value.decimals,
//     )

//     const rawAmount = BigInt(
//       Math.round(amount.value * 10 ** selectToken.value.decimals),
//     )

//     const transaction = new Transaction()

//     if (selectToken.value.symbol === 'SOL') {
//       transaction.add(
//         SystemProgram.transfer({
//           fromPubkey: sender,
//           toPubkey: destination,
//           lamports: rawAmount,
//         }),
//       )
//     }
//     else {
//       const mintPubkey = new PublicKey(selectToken.value.mint)

//       console.log('splTokenLib.value', splTokenLib.value)

//       const fromTokenAccount
//         = await splTokenLib.value.getAssociatedTokenAddress(mintPubkey, sender)
//       const toTokenAccount = await splTokenLib.value.getAssociatedTokenAddress(
//         mintPubkey,
//         destination,
//       )
//       console.log('fromTokenAccount', fromTokenAccount)
//       console.log('toTokenAccount', toTokenAccount)

//       const toTokenAccountInfo = await connection.getAccountInfo(
//         toTokenAccount,
//       )
//       console.log('toTokenAccountInfo', toTokenAccountInfo)

//       if (!toTokenAccountInfo) {
//         transaction.add(
//           splTokenLib.value.createAssociatedTokenAccountInstruction(
//             sender,
//             toTokenAccount,
//             destination,
//             mintPubkey,
//           ),
//         )
//       }

//       transaction.add(
//         splTokenLib.value.createTransferInstruction(
//           fromTokenAccount,
//           toTokenAccount,
//           sender,
//           rawAmount,
//         ),
//       )
//     }

//     const signature = await wallet.value.sendTransaction(
//       transaction,
//       connection,
//     )

//     await connection.confirmTransaction(signature, 'confirmed')

//     console.log('✅ Transaction sent:', signature)
//   }
//   catch (error) {
//     console.error('❌ Payment failed:', error)
//   }
// }

// const showWalletBalance = async () => {
//   try {
//     if (!wallet.value?.connected || !wallet.value.publicKey) {
//       console.warn('Wallet is not connected')
//       return
//     }

//     const owner = wallet.value.publicKey
//     const { getConnection, getTokenAccountsByOwner } = useSolanaClient()
//     const connection = await getConnection()

//     const lamports = await connection.getBalance(owner)
//     const sol = lamports / 1e9
//     console.log(`SOL balance: ${sol} SOL`)

//     const tokenAccounts = await getTokenAccountsByOwner({
//       owner: owner.toBase58(),
//     })

//     if (tokenAccounts.length === 0) {
//       console.log('No SPL tokens found')
//     }
//     else {
//       tokenAccounts.forEach((acc) => {
//         const uiAmount = Number(acc.amount) / 10 ** acc.decimals
//         console.log(`Token account: ${acc.pubkey} | amount: ${uiAmount}`)
//       })
//     }
//   }
//   catch (err) {
//     console.error('Failed to fetch balances:', err)
//   }
// }
</script>

<style>
/* .set-height {
  min-height: 100vh;
}
.height-input {
  max-height: 60px;
}
.swv-modal {
  z-index: 2401 !important;
} */
</style>
