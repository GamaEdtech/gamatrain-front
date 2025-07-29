<template>
  <section class="how-buy-section py-8">
    <div class="how-buy-wrapper">
      <h2 class="how-buy-title text-center">
        How To Buy $GET
      </h2>
      <v-container>
        <v-row justify="center">
          <v-col
            cols="12"
            md="12"
            lg="12"
          >
            <!-- New illustration layout: tokens + man -->
            <div class="how-buy-hero mb-8">
              <!-- Token icons and names -->
              <div class="how-buy-tokens">
                <div class="token-row">
                  <div class="token-icon-col">
                    <img
                      src="/images/token/Buy/token-get2.png"
                      alt="GET"
                      class="token-icon"
                    >
                  </div>
                  <span class="how-buy-token-label">GET</span>
                </div>
                <div class="token-row">
                  <div class="token-icon-col">
                    <img
                      src="/images/token/Buy/token-usdc.png"
                      alt="USDC"
                      class="token-icon"
                    >
                  </div>
                  <span class="how-buy-token-label">USDC</span>
                </div>
                <div class="token-row">
                  <div class="token-icon-col">
                    <img
                      src="/images/token/Buy/token-usdt.png"
                      alt="USDT"
                      class="token-icon"
                    >
                  </div>
                  <span class="how-buy-token-label">USDT</span>
                </div>
                <div class="token-row">
                  <div class="token-icon-col">
                    <img
                      src="/images/token/Buy/token-wbtc.png"
                      alt="WBTC"
                      class="token-icon"
                    >
                  </div>
                  <span class="how-buy-token-label">WBTC</span>
                </div>
              </div>
              <!-- Man illustration -->
              <div class="how-buy-man d-flex justify-center align-center">
                <img
                  src="/images/token/Buy/guide.svg"
                  alt="Buy Illustration"
                  class="how-buy-illustration"
                >
              </div>
            </div>
            <!-- End hero -->
            <div class="steps-rows">
              <div
                v-for="(row, rowIndex) in stepRows"
                :key="'row-' + rowIndex"
                class="steps-row"
              >
                <!-- Step 1 -->
                <div class="step-wrapper">
                  <div class="step-number">
                    {{ rowIndex * 2 + 1 }}
                  </div>
                  <div class="step-item">
                    <div class="step-content">
                      <div class="step-header">
                        <div class="step-icon-wrapper">
                          <img
                            :src="row[0].icon"
                            :alt="row[0].title + ' Icon'"
                            class="how-buy-icon"
                            contain
                          >
                        </div>
                        <div class="step-title">
                          {{ row[0].title }}
                        </div>
                      </div>
                      <ul class="step-list">
                        <li
                          v-for="(item, i) in row[0].items"
                          :key="i"
                          :class="{ 'warning-text': item.isWarning }"
                        >
                          <template v-if="item.link">
                            Go to
                            <a
                              :href="item.link"
                              target="_blank"
                              rel="noopener"
                              class="how-buy-link"
                            >
                              {{ item.link }}
                            </a>
                            <template v-if="item.extraText">
                              {{ item.extraText }}
                            </template>
                          </template>
                          <template v-else>
                            <span :class="{ 'font-weight-bold': item.isBold }">{{ item.text }}</span>
                          </template>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <!-- Arrow -->
                <span
                  v-if="row[1]"
                  class="step-arrow"
                >→</span>
                <!-- Step 2 or placeholder -->
                <div
                  v-if="row[1]"
                  class="step-wrapper"
                >
                  <div class="step-number">
                    {{ rowIndex * 2 + 2 }}
                  </div>
                  <div class="step-item">
                    <div class="step-content">
                      <div class="step-header">
                        <div class="step-icon-wrapper">
                          <img
                            :src="row[1].icon"
                            :alt="row[1].title + ' Icon'"
                            class="how-buy-icon"
                            contain
                          >
                        </div>
                        <div class="step-title">
                          {{ row[1].title }}
                        </div>
                      </div>
                      <ul class="step-list">
                        <li
                          v-for="(item, i) in row[1].items"
                          :key="i"
                          :class="{ 'warning-text': item.isWarning }"
                        >
                          <template v-if="item.link">
                            Go to
                            <a
                              :href="item.link"
                              target="_blank"
                              rel="noopener"
                              class="how-buy-link"
                            >
                              {{ item.link }}
                            </a>
                            <template v-if="item.extraText">
                              {{ item.extraText }}
                            </template>
                          </template>
                          <template v-else>
                            <span :class="{ 'font-weight-bold': item.isBold }">{{ item.text }}</span>
                          </template>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="step-placeholder"
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: 'Set Up a Wallet',
    icon: '/images/token/Buy/digital-wallet.svg',
    items: [
      { link: 'https://phantom.com' },
      { text: 'Create a wallet and receive your secret recovery phrase' },
      { text: 'Write your phrase down somewhere safe' },
      { text: 'Never share this phrase with anyone ❗' },
    ],
  },
  {
    title: 'Connect to a Decentralized Exchange',
    icon: '/images/token/Buy/buy.svg',
    items: [
      { link: 'https://jup.ag', extraText: ' and create an account' },
      { text: 'Click Connect Wallet and choose Phantom' },
    ],
  },
  {
    title: 'Find the $GET Token',
    icon: '/images/token/Buy/token-get.png',
    items: [
      { text: 'Search for the $GET icon' },
      { text: 'Click on the icon to select it ' },
    ],
  },
  {
    title: 'Choose the Amount & Currency',
    icon: '/images/token/Buy/calculator.svg',
    items: [
      { text: 'Select how much $GET you want to buy' },
      { text: 'Choose which currency to pay with (USDC, USDT, etc.)' },
      { text: 'Review the exchange rate and fees' },
    ],
  },
  {
    title: 'Confirm Transaction',
    icon: '/images/token/Buy/confirmation.svg',
    items: [
      { text: 'Double-check all transaction details' },
      { text: 'Ensure you have enough funds to cover the purchase and fees' },
      { text: 'Approve the transaction in your wallet' },
    ],
  },
  {
    title: 'Verify & Store',
    icon: '/images/token/Buy/folder.svg',
    items: [
      { text: 'Wait for transaction confirmation' },
      { text: 'Check your wallet balance for the $GET tokens' },
      { text: 'Store your tokens securely' },
    ],
  },
]

// Chunk steps into pairs for rows
const stepRows = computed(() => {
  const rows = []
  for (let i = 0; i < steps.length; i += 2) {
    rows.push([steps[i], steps[i + 1]])
  }
  return rows
})
</script>

<style scoped>
/* Base (Mobile First) */
.how-buy-section {
  background: #f7fafd;
  padding: 4rem 0;
}

.how-buy-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.how-buy-title {
  font-size: 2rem;
  font-weight: 800;
  color: #24292f;
  text-align: center;
  margin-bottom: 2rem;
}

.how-buy-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.how-buy-tokens {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 0;
  height: 240px;
  flex-shrink: 0;
  min-width: 120px;
}
.token-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
  white-space: nowrap;
}

.token-icon {
  width: 36px;
  height: 36px;
}

.how-buy-token-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
}

.how-buy-man {
  margin-top: 1.5rem;
}

.how-buy-illustration {
  width: 180px;
  max-width: 100%;
}

.steps-rows {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.steps-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step-wrapper {
  background: #f7fafd;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(53, 52, 52, 0.03);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  font-size: 2rem;
  font-weight: 800;
  color: #24aa94;
  margin-bottom: 0.5rem;
}

.step-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
  padding-top: 2rem;
}

.how-buy-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.step-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #222;
  text-align: center;
}

.step-content {
  text-align: center;
}

.step-list {
  text-align: left;
  font-size: 1.2rem;
  line-height: 1.7;
}

.step-list li {
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.step-arrow {
  display: none;
}

.warning-text {
  color: #e53935;
  font-weight: 700;
}

.font-weight-bold {
  font-weight: 700;
}

.how-buy-link {
  color: #3578e5;
  text-decoration: underline;
  font-weight: 500;
}

/* === MOBILE (default) === */
.how-buy-hero { display: flex; flex-direction: row; align-items: center; justify-content: center; margin-bottom: 2rem; }
.how-buy-tokens { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 1.5rem; margin-bottom: 0; height: 240px; flex-shrink: 0; }
.token-row { display: flex; align-items: center; gap: 1.2rem; }
.token-icon { width: 24px; height: 24px; }
.how-buy-token-label { font-size: 1.5rem; font-weight: 700; color: #222; }
.how-buy-man { margin-top: 0; margin-left: 2.5rem; display: flex; align-items: center; height: 240px; flex-shrink: 0; }
.how-buy-illustration { width: 140px; max-width: 100%; height: 240px; object-fit: contain; }

/* === TABLET (min-width: 600px and max-width: 1199px) === */
@media (min-width: 600px) and (max-width: 1199px) {
  .how-buy-title { font-size: 28px; margin-bottom: 2rem; }
  .how-buy-token-label { font-size: 1.5rem; }
  .how-buy-hero { flex-direction: row; justify-content: center; align-items: center; margin-bottom: 2.5rem; gap: 1.5rem; }
  .how-buy-tokens { flex-direction: column; gap: 1rem; margin-bottom: 0; align-items: flex-start; width: 160px; }
  .token-row { display: flex; flex-direction: row; align-items: center; gap: 1rem; white-space: nowrap; width: 100%; justify-content: flex-start; }
  .token-icon { width: 36px; height: 36px; }
  .how-buy-man { margin-left: 0; }
  .how-buy-illustration { width: 200px; }
  .steps-rows { gap: 2rem; }
  .step-wrapper, .step-item { height: auto !important; min-height: auto !important; max-height: none !important; }
  .step-wrapper {
    background: #fff;
    padding: 2rem 1.4rem;
    overflow: hidden;
  }
  .step-title { font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.8rem; }
  .how-buy-icon { width: 85px; height: 85px; }
  .step-content {
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    padding-left: 0;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .step-list {
    margin: 0;
    padding: 0;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .step-list li {
    font-size: 2rem;
    line-height: 1.3;
    margin-bottom: 0.6rem;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .step-header { padding-top: 0; gap: 1rem; margin-bottom: 1.2rem; }
  .step-number {
    display: none;
  }
}

/* === DESKTOP (min-width: 1200px) === */
@media (min-width: 1200px) {
  .how-buy-title {
    font-size: 4rem;
  }

  .how-buy-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }

  .how-buy-token-label {
    font-size: 2rem;
  }

  .how-buy-illustration {
    width: 340px;
  }

  .steps-row {
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
  }

  .how-buy-icon {
    width: 120px;
    height: 120px;
  }

  .step-title {
    font-size: 3rem;
  }

  .step-list li {
    font-size: 1.8rem;
  }

  .step-wrapper {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 480px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.06);
    width: 100%;
    max-width: none;
    height: auto;
  }
  .step-content {
    padding: 2.5rem;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
