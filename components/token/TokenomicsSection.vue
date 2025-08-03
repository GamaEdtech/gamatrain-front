<template>
  <section class="tokenomics-section">
    <div class="tokenomics-container">
      <h2 class="tokenomics-title">
        Tokenomics
      </h2>
      <h4 class="tokenomics-subtitle">
        See exactly how $GET tokens are allocated
      </h4>

      <!-- Desktop View -->
      <div class="tokenomics-main">
        <div class="tokenomics-chart-card">
          <img
            src="/images/token/Tokenomics/Tokenomics_Pie_Green.png"
            alt="Tokenomics Section"
            class="tokenomics-svg"
          >
        </div>
        <div class="tokenomics-breakdowns">
          <div
            v-for="item in breakdowns"
            :key="item.key"
            class="tokenomics-breakdown-card"
            style="cursor: pointer"
            @click="openBreakdown(item)"
          >
            <img
              :src="item.icon"
              :alt="item.title"
              class="tokenomics-icon"
            >
            <div class="tokenomics-info">
              <div class="tokenomics-detail-row">
                <div
                  class="tokenomics-percent"
                  :style="{ color: item.color }"
                >
                  {{ item.percent }}
                </div>
                <div class="tokenomics-title-detail">
                  <div
                    class="tokenomics-title"
                    :style="{ color: item.color }"
                  >
                    {{ item.title }}
                  </div>
                  <div class="tokenomics-detail">
                    {{ item.detail }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- iPad Mini View -->
      <div class="tokenomics-ipad-mini">
        <img
          src="/images/token/Tokenomics/TokenomicsSec.png"
          alt="Tokenomics for iPad Mini"
          class="tokenomics-ipad-svg"
        >
      </div>

      <!-- Mobile View -->
      <div class="mobile-view">
        <img
          src="/images/token/Tokenomics/Tokenomics_Pie_Green.png"
          alt="Tokenomics Mobile"
          class="tokenomics-mobile-svg"
        >
        <div class="mobile-breakdowns">
          <div
            v-for="item in breakdowns"
            :key="item.key"
            class="mobile-breakdown-card"
            @click="openBreakdown(item)"
          >
            <img
              :src="item.icon"
              :alt="item.title"
              class="mobile-icon"
            >
            <div class="mobile-info">
              <div class="mobile-title-row">
                <div
                  class="mobile-title"
                  :style="{ color: item.color }"
                >
                  {{ item.title }}
                </div>
                <div
                  class="mobile-percent"
                  :style="{ color: item.color }"
                >
                  {{ item.percent }}
                </div>
              </div>
              <div class="mobile-detail">
                {{ item.detail }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal popup for breakdown details -->
      <v-dialog
        v-model="dialog"
        max-width="600"
        :persistent="isMobile === true ? false : true "
        class="tokenomics-modal-dialog"
      >
        <v-card class="tokenomics-modal-card">
          <v-card-title class="headline modal-title">
            {{
              selectedBreakdown?.title
            }}
          </v-card-title>
          <v-card-text>
            <div class="modal-percent">
              {{ selectedBreakdown?.percent }}
            </div>
            <div class="modal-amount">
              {{ selectedBreakdown?.amount }}
            </div>
            <div class="modal-popup-text">
              {{ selectedBreakdown?.popupText }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="modal-close-btn"
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const display = useGlobalDisplay()
const isMobile = ref(false)
const dialog = ref(false)
const selectedBreakdown = ref(null)

function openBreakdown(item) {
  selectedBreakdown.value = item
  dialog.value = true
}

const breakdowns = [
  {
    key: 'governance',
    icon: '/images/token/Tokenomics/Governance.svg',
    title: 'Governance',
    detail: '7B $GET - Locked for 10 years.',
    popupText:
      'These tokens are reserved for community governance. "Locked" means that these tokens are not available for a certain amount of time. After unlocking, these tokens will help guide decisions like new features, tokenomics, and more.',
    percent: '70%',
    color: '#188896',
  },
  {
    key: 'team',
    icon: '/images/token/Tokenomics/Team.svg',
    title: 'Team',
    detail: '2B $GET - Development fund',
    popupText:
      'These tokens are reserved for core contributors. This includes the team, developers, and anyone else contributing to the development and maintenance of the GamaTrain platform.',
    percent: '20%',
    color: '#df2121',
  },
  {
    key: 'liquidity',
    icon: '/images/token/Tokenomics/Liquidity.svg',
    title: 'Liquidity',
    detail: '1B $GET - Market liquidity',
    popupText:
      'These tokens are used to make it easier to buy and sell $GET on exchanges. They help provide price stability of the token and avoid big price swings.',
    percent: '10%',
    color: '#95c9d7',
  },
]

onMounted(() => {
  isMobile.value = display.xs.value
  watch(
    () => display.xs.value,
    (newVal) => {
      isMobile.value = newVal
    },
  )
})
</script>

<style scoped>
/* === MOBILE (default) === */
.tokenomics-section { background: #24292f0d; padding: 2rem 0; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; }
.tokenomics-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.tokenomics-title { text-align: center; color: #121111; font-size: 24px; font-weight: 700; margin-bottom: 1rem; }
.tokenomics-subtitle { text-align: center; color: #797676; font-size: 16px; font-weight: 400; }
.tokenomics-main { display: none; }
.tokenomics-ipad-mini { display: none; }
.mobile-view { display: block; width: 100%; padding: 0 1rem; }
.tokenomics-mobile-svg {
  width: 100%;
  height: auto;
  max-width: 320px;
  display: block;
  margin: 0 auto 2rem auto;
  justify-content: center;
  mix-blend-mode: multiply;
}

@media (max-width: 480px) {
  .tokenomics-mobile-svg {
    max-width: 340px;
    margin: 0 auto 2.5rem auto;
  }
}
.mobile-breakdowns { display: flex; flex-direction: column; gap: 1.5rem; }
.mobile-breakdown-card { display: flex; align-items: center; background: #f5f5f6; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18); padding: 1.5rem; min-height: 90px; position: relative; transition: box-shadow 0.2s, background 0.2s; }
.mobile-breakdown-card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28); background: #444446; }
.mobile-icon { width: 32px; height: 32px; margin-right: 1rem; flex-shrink: 0; }
.mobile-info { flex: 1; }
.mobile-title-row { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.mobile-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
.mobile-percent { font-size: 2rem; font-weight: 800; margin-left: 1rem; }
.mobile-detail { font-size: 1.1rem; color: #414242; }
.tokenomics-modal-card { background: #dfe0e3; color: #171616; padding: 2.5rem 2rem; border-radius: 24px; }
.modal-title { font-size: 2.5rem; color: #0a0a0a; font-weight: 800; margin-bottom: 1rem; }
.modal-percent { font-size: 2.8rem; font-weight: 700; color: #0f871f; margin-bottom: 1rem; }
.modal-amount { font-size: 1.5rem; color: #b0bec5; margin-bottom: 1rem; }
.modal-popup-text { font-size: 2.25rem; color: #322e2e; line-height: 1.7; }
.modal-close-btn { color: #2121df !important; font-weight: 700; font-size: 1.6rem; text-transform: none; letter-spacing: 0; }
:deep(.tokenomics-modal-dialog .v-overlay__content) { align-items: flex-start !important; margin-top: 50px; }

/* === TABLET (min-width: 481px and max-width: 1199px) === */
@media (min-width: 481px) and (max-width: 1199px) {
  .tokenomics-section { padding: 4rem 0; background: #f2f2f5; }
  .tokenomics-title { font-size: 36px; margin-bottom: 1.5rem; color: #070808; }
  .tokenomics-subtitle { font-size: 20px; margin-bottom: 0.5rem; color: #58595a; }
  .mobile-view { display: none; }
  .tokenomics-main { display: none; }
  .tokenomics-ipad-mini { display: block; width: 100%; padding: 0 1rem; }
  .tokenomics-ipad-svg { width: 100%; height: auto; max-width: 100%; }
  .tokenomics-container { padding: 0; }
}

/* === DESKTOP (min-width: 1200px) === */
@media (min-width: 1200px) {
  .tokenomics-section { padding: 6rem 0; background: #edebeb; }
  .tokenomics-title { font-size: 4rem; color: #161515; margin-bottom: 3rem; }
  .tokenomics-subtitle { font-size: 24px; color: #3e3d3d; margin-bottom: 4rem; }
  .mobile-view { display: none; }
  .tokenomics-ipad-mini { display: none; }
  .tokenomics-main { display: flex; gap: 3rem; align-items: flex-start; justify-content: center; }
  .tokenomics-chart-card { flex: 0 0 600px; border-radius: 25px; display: flex; align-items: center; justify-content: center; background: rgba(40, 39, 39, 0.8); }
  .tokenomics-svg { width: 750px; border-radius: 25px; max-width: 100%; height: auto; display: block; margin: 0 auto; padding: 3rem; }
  .tokenomics-breakdowns { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; min-width: 400px; }
  .tokenomics-breakdown-card { display: flex; align-items: center; background: rgba(40, 39, 39, 0.8); border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18); padding: 3.8rem 4rem; min-height: 120px; position: relative; transition: box-shadow 0.2s, background 0.2s; backdrop-filter: blur(10px); cursor: pointer; }
  .tokenomics-breakdown-card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28); background: rgba(68, 68, 70, 0.9); }
  .tokenomics-icon { width: 54px; height: 54px; margin-right: 1.5rem; flex-shrink: 0; }
  .tokenomics-info { flex: 1; }
  .tokenomics-info .tokenomics-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; text-align: left; color: #fff; }
  .tokenomics-detail-row {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    margin-top: 0.25rem;
  }
  .tokenomics-percent {
    font-size: 3.5rem;
    font-weight: 700;
    margin-top: 0.2rem;
    flex-shrink: 0;
    min-width: 70px;
    text-align: left;
  }
  .tokenomics-title-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .tokenomics-title {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 3.25rem;
    text-align: center;
    color: #100f0f;
  }
  .tokenomics-detail {
    font-size: 2rem;
    color: #b0bec5;
    margin-bottom: 1rem;
    text-align: left;
  }
  .governance-percent { color: #188896; }
  .team-percent { color: #df2121; }
  .liquidity-percent { color: #95c9d7; }
}
</style>
