<template>
  <div class="donate-page mt-14">
    <h1>Donate</h1>

    <p>
      Support us by transferring $GET, SOL, USDC, or other assets on the Solana network.
    </p>

    <div class="wallet">
      <strong>Solana Address: </strong>
      <code>8oAaAbMmbYzaFcg1cAwzhaXd5KtbpFay5wWUXx6AmoRv</code>
    </div>

    <p>
      Your support helps us grow the community and build the world’s largest school database
      and past paper directory.
    </p>

    <p>
      We aim to create a better platform for students and teachers worldwide.
    </p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: `Donate`,
  ogTitle: `Donate`,
  twitterTitle: `Donate`,
})
</script>

<style scoped>
.donate-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.6;
}

.wallet {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin: 12px 0;
  word-break: break-all;
}
</style>
