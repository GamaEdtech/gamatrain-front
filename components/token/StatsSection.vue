<template>
  <div class="stats-section">
    <v-container>
      <div class="stats-section__content">
        <h1 class="stats-section__title">
          LIVE STATISTICS
        </h1>
        <p class="stats-section__desc pt-1">
          Real-time data and analytics for the $GET token ecosystem
        </p>

        <div>
          <v-row class="mt-2 mx-5">
            <v-col cols="6">
              <div class="stats-section-stats__card darken-card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                      >
                        mdi-poll
                      </v-icon>
                      <template #fallback>
                        <v-icon
                          size="x-large"
                          color="white"
                        >
                          mdi-poll
                        </v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                </div>
                <div class="stats-section-stats__card--title">
                  Market Cap
                </div>
                <div class="stats-section-stats__card--value">
                  $ 2.3B
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stats-section-stats__card darken-card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                      >
                        mdi-finance
                      </v-icon>
                      <template #fallback>
                        <v-icon
                          size="x-large"
                          color="white"
                        >
                          mdi-finance
                        </v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                </div>
                <div class="stats-section-stats__card--title">
                  24h Volume
                </div>
                <div class="stats-section-stats__card--value">
                  $ 1124.5M
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stats-section-stats__card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                      >
                        mdi-cached
                      </v-icon>
                      <template #fallback>
                        <v-icon
                          size="x-large"
                          color="white"
                        >
                          mdi-cached
                        </v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                  <div class="stats-section-stats__card--percent text-white">
                    75%
                  </div>
                </div>
                <div class="stats-section-stats__card--title">
                  Circulating Supply
                </div>
                <div class="stats-section-stats__card--value">
                  750M GET
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stats-section-stats__card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                      >
                        mdi-account-arrow-up
                      </v-icon>
                      <template #fallback>
                        <v-icon
                          size="x-large"
                          color="white"
                        >
                          mdi-account-arrow-up
                        </v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                  <div
                    class="stats-section-stats__card--percent text-deep-orange-lighten-1"
                  >
                    -3.4%
                  </div>
                </div>
                <div class="stats-section-stats__card--title">
                  Holders
                </div>
                <div class="stats-section-stats__card--value">
                  45.672
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="mt-4">
          <h2 class="stats-section-chart__title">
            Price Performance
          </h2>
        </div>

        <!-- Mobile Layout: Vertical Stacking -->
        <div
          v-if="isMobile"
          class="mobile-chart-layout"
        >
          <!-- Mobile Price Display -->
          <div class="mobile-price-section mb-4">
            <div class="stats-section-chart__card mobile-price-card">
              <div class="stats-section-chart__box mobile-price-box">
                $0.00892
              </div>
            </div>
          </div>

          <!-- Mobile Token List -->
          <div class="mobile-token-section mb-4">
            <div class="stats-section-chart__coins mobile-token-list">
              <div class="d-flex align-center mb-3">
                <img
                  src="/images/token/Stats/token-get.png"
                  alt="GET token"
                  class="token-icon mobile-token-icon mr-3"
                  loading="lazy"
                  @error="createImageLoadHandler()"
                >
                <span class="token-label mobile-token-label">GET</span>
              </div>
              <div class="d-flex align-center mb-3">
                <img
                  src="/images/token/Stats/token-usdc.png"
                  alt="USDC token"
                  class="token-icon mobile-token-icon mr-3"
                  loading="lazy"
                  @error="$event.target.style.display='none'"
                >
                <span class="token-label mobile-token-label">USDC</span>
              </div>
              <div class="d-flex align-center mb-3">
                <img
                  src="/images/token/Stats/token-usdt.png"
                  alt="USDT token"
                  class="token-icon mobile-token-icon mr-3"
                  loading="lazy"
                  @error="$event.target.style.display='none'"
                >
                <span class="token-label mobile-token-label">USDT</span>
              </div>
              <div class="d-flex align-center">
                <img
                  src="/images/token/Stats/token-wbtc.png"
                  alt="WBTC token"
                  class="token-icon mobile-token-icon mr-3"
                  loading="lazy"
                  @error="$event.target.style.display='none'"
                >
                <span class="token-label mobile-token-label">WBTC</span>
              </div>
            </div>
          </div>

          <!-- Mobile Chart -->
          <div class="mobile-chart-section">
            <iframe
              class="stats-section-chart__iframe mobile-chart-iframe"
              width="100%"
              :style="{ height: chartHeight }"
              src="https://birdeye.so/tv-widget/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Etc%2FUTC&chartLeftToolbar=show&theme=dark"
              allowfullscreen
            />
          </div>
        </div>

        <!-- Desktop Layout: Horizontal -->
        <v-row
          v-else
          class="mt-2 mx-5"
        >
          <v-col
            cols="4"
            sm="3"
            class="d-flex flex-column h-100 px-2 py-0"
          >
            <div>
              <div class="stats-section-chart__card">
                <div class="stats-section-chart__box">
                  $0.00892
                </div>
              </div>
              <div class="stats-section-chart__coins flex-grow-1">
                <div class="d-flex align-center mb-2 mb-md-4">
                  <img
                    src="/images/token/Stats/token-get.png"
                    alt="GET"
                    class="token-icon mr-2"
                  >
                  <span class="token-label">GET</span>
                </div>
                <div class="d-flex align-center mb-2 mb-md-4">
                  <img
                    src="/images/token/Stats/token-usdc.png"
                    alt="USDC"
                    class="token-icon mr-2"
                  >
                  <span class="token-label">USDC</span>
                </div>
                <div class="d-flex align-center mb-2 mb-md-4">
                  <img
                    src="/images/token/Stats/token-usdt.png"
                    alt="USDT"
                    class="token-icon mr-2"
                  >
                  <span class="token-label">USDT</span>
                </div>
                <div class="d-flex align-center">
                  <img
                    src="/images/token/Stats/token-wbtc.png"
                    alt="WBTC"
                    class="token-icon mr-2"
                  >
                  <span class="token-label">WBTC</span>
                </div>
              </div>
            </div>
          </v-col>
          <v-col
            cols="8"
            sm="9"
            class="px-2 py-0"
          >
            <iframe
              class="stats-section-chart__iframe"
              width="100%"
              :style="{ height: chartHeight }"
              src="https://birdeye.so/tv-widget/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Etc%2FUTC&chartLeftToolbar=show&theme=dark"
              allowfullscreen
            />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const display = useDisplay()
const { createImageLoadHandler } = useSafeImage()

// Reactive state for responsive layout management
const isMobile = ref(false)
const layoutMode = ref('horizontal')
const chartHeight = ref('145px')

// Computed properties for responsive breakpoint detection
const isExtraSmall = computed(() => display.xs.value)
const isSmallAndUp = computed(() => display.smAndUp.value)
const screenSize = computed(() => {
  if (display.xs.value) return 'xs'
  if (display.sm.value) return 'sm'
  if (display.md.value) return 'md'
  if (display.lg.value) return 'lg'
  return 'xl'
})

// Use computed properties to avoid unused variable warnings
const _ = { isExtraSmall, isSmallAndUp, screenSize }

// Responsive state management with fallback
const updateResponsiveState = () => {
  try {
    isMobile.value = display.xs.value
    layoutMode.value = display.xs.value ? 'vertical' : 'horizontal'
    chartHeight.value = display.xs.value ? '250px' : '100%'
  }
  catch (error) {
    // Fallback for display detection failures
    console.warn('Display detection failed, using mobile-safe defaults:', error)
    isMobile.value = true
    layoutMode.value = 'vertical'
    chartHeight.value = '250px'
  }
}

onMounted(() => {
  updateResponsiveState()

  // Watch for screen size changes with error handling
  watch(
    () => display.xs.value,
    () => {
      updateResponsiveState()
    },
    { immediate: true },
  )
})
</script>

<style scoped>
.stats-section-chart__coins {
  background: #000518;
  border: 1px solid #1c3771;
  border-radius: 8px;
  margin-top: 10px;
  padding: 5px 5px;
  height: 100%;
}
.token-icon {
  width: 15px;
  height: 15px;
}
.token-label {
  font-size: 10px;
  color: #fff;
  font-weight: 700;
}
.stats-section-chart__card {
  border-radius: 8px;
  border: 2px solid #f8ba23;
  padding: 4px 4px;
}
.stats-section-chart__box {
  border-radius: 6px;
  border: 2px solid #132c5b;
  padding: 4px 2px;
  color: #fff;
  font-size: 10px;
  text-align: center;
  font-weight: 700;
}
.stats-section-chart__title {
  font-size: 20px;
  color: #fff;
  text-align: center;
}
.stats-section-chart__iframe {
  height: 145px;
}

/* Mobile-specific styles */
.mobile-chart-layout {
  padding: 0 20px;
}

.mobile-price-section {
  display: flex;
  justify-content: center;
}

.mobile-price-card {
  width: 100%;
  max-width: 300px;
  padding: 12px;
}

.mobile-price-box {
  font-size: 16px;
  padding: 12px 8px;
  font-weight: 800;
}

.mobile-token-section {
  display: flex;
  justify-content: center;
}

.mobile-token-list {
  width: 100%;
  max-width: 300px;
  padding: 16px;
}

.mobile-token-icon {
  width: 20px;
  height: 20px;
}

.mobile-token-label {
  font-size: 12px;
  font-weight: 700;
}

.mobile-chart-section {
  width: 100%;
}

.mobile-chart-iframe {
  border-radius: 8px;
}
.stats-section-stats__card {
  border-radius: 8px;
  padding: 1.2rem;
  background: #70eef1;
}
.darken-card {
  background: #17a79d;
}
.stats-section-stats__card--icon {
  width: 24px;
  height: 20px;
  background: #07132f;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 6px;
}
.stats-section-stats__card--percent {
  background: #061530;
  width: 41px;
  height: 19px;
  border-radius: 20px;
  color: #49d886;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  padding: 5px;
}
.stats-section-stats__card--title {
  color: #0e1037;
  font-weight: 800;
  margin-top: 7px;
  font-size: 9px;
}
.stats-section-stats__card--value {
  background: #05122e;
  color: #efefec;
  border-radius: 4px;
  width: 100%;
  text-align: center;
  font-weight: 800;
  padding: 5px 5px;
  margin-top: 2px;
}
.stats-section {
  background: #03122e;
  padding: 3rem 0;
}

.stats-section__title {
  font-size: 28px;
  color: #fff;
  text-align: center;
}
.stats-section__desc {
  text-align: center;
  color: #fff;
  font-size: 10px;
}
/* Enhanced mobile spacing and touch targets */
@media (max-width: 599px) {
  .mobile-chart-layout {
    padding: 0 16px;
  }

  .mobile-price-section {
    margin-bottom: 20px;
  }

  .mobile-token-section {
    margin-bottom: 20px;
  }

  .mobile-token-list .d-flex {
    min-height: 44px; /* Minimum touch target size */
    align-items: center;
  }

  .stats-section {
    padding: 2rem 0;
  }
}

@media (min-width: 600px) {
  .stats-section-chart__iframe {
    height: 100%;
  }
  .stats-section-chart__coins {
    padding: 15px 15px;
  }
  .stats-section-chart__card {
    padding: 8px 10px;
  }
  .stats-section-chart__box {
    font-size: 20px;
  }
  .stats-section-chart__title {
    font-size: 34px;
  }
  .token-icon {
    width: 30px;
    height: 30px;
  }
  .token-label {
    font-size: 18px;
  }
  .stats-section__title {
    font-size: 38px;
  }
  .stats-section__desc {
    font-size: 20px;
  }
  .stats-section-stats__card--icon {
    width: 50px;
    height: 44px;
  }
  .stats-section-stats__card--percent {
    width: 82px;
    height: 42px;
    font-size: 20px;
  }
  .stats-section-stats__card--title {
    font-weight: 800;
    margin-top: 7px;
    font-size: 20px;
  }
  .stats-section-stats__card--value {
    background: #05122e;
    color: #efefec;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    font-weight: 800;
    padding: 10px 5px;
    margin-top: 2px;
    font-size: 28px;
  }
}
@media (min-width: 960px) {
  .stats-section-stats__card {
    padding: 1.7rem;
  }
}
</style>
