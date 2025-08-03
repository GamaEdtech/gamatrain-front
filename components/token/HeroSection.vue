<template>
  <section class="hero-section">
    <v-container class="hero-container">
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          class="hero-content"
        >
          <div class="content-left">
            <div class="content-left-top">
              <div class="live-trading-badge">
                <span class="live-dot" />
                Live Trading
              </div>

              <h1 class="main-title">
                $GET
              </h1>

              <p class="description">
                The future of decentralized finance, powering innovation,<br>
                enabling growth, and creating value for the community.
              </p>

              <div class="price-section">
                <div class="price">
                  ${{ formattedPrice }}
                </div>
                <div class="change">
                  +6.47%
                </div>
              </div>

              <div class="action-buttons">
                <v-btn
                  target="_blank"
                  href="https://jup.ag/swap/So11111111111111111111111111111111111111112-GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
                  class="buy-btn"
                  rounded
                  elevation="0"
                >
                  Buy $GET Now
                </v-btn>
                <v-btn
                  to="/whitepaper"
                  class="whitepaper-btn"
                  rounded
                  elevation="0"
                >
                  View Whitepaper
                </v-btn>
              </div>
            </div>
          </div>

          <div class="content-right">
            <div class="token-wrapper">
              <img
                src="/images/token/Hero/GET-coin.svg"
                alt="GET Token"
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const finalPrice = ref(0)
const animatedPrice = ref(0)

const formattedPrice = computed(() => {
  // Format to show fewer decimal places
  return animatedPrice.value.toFixed(6)
})

const fetchTokenPrice = async () => {
  try {
    const data = await $fetch(
      'https://lite-api.jup.ag/price/v2?ids=GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv',
    )
    finalPrice.value = Object.values(data.data)[0]['price']

    // Start animation after fetching the price
    animatePrice()
  }
  catch (error) {
    console.error('Error fetching token price:', error)
    finalPrice.value = 0.002546 // Fallback price
    animatePrice()
  }
}

const animatePrice = () => {
  const duration = 1200
  const frameRate = 60
  const totalFrames = Math.round((duration / 1000) * frameRate)
  let frame = 0

  const animate = () => {
    frame++
    const progress = Math.min(frame / totalFrames, 1)
    animatedPrice.value = +(finalPrice.value * progress).toFixed(6)
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

onMounted(() => {
  fetchTokenPrice()
})
</script>

<style scoped>
/* Base styles (Desktop) */
.hero-section {
  background: #000;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.content-left {
  flex: 1;
  max-width: 700px;
}

.content-right {
  flex: 0 0 auto;
}

.live-trading-badge {
  background: rgba(5, 182, 231, 0.3) !important;
  border: 1px solid rgba(110, 119, 129, 1) !important;
  border-radius: 999px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #24aa94;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.main-title {
  font-size: 10rem;
  color: white;
  margin: 0 0 2rem 0;
  line-height: 1;
  text-align: left;
}

.description {
  font-size: 1.5rem;
  line-height: 1.6;
  color: #b0b0b0;
  margin: 0 0 2rem 0;
  max-width: 700px;
  text-align: left;
}

.price-section {
  margin-bottom: 2.5rem;
  text-align: left;
}

.price {
  font-size: 4.5rem;
  color: white;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.change {
  font-size: 1.5rem;
  color: #24aa94;
  font-weight: 600;
}

.token-wrapper {
  width: 400px;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
}

.token-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: slowTilt 8s ease-in-out infinite;
}

.token-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.25) 50%,
    transparent
  );
  animation: shimmer 4s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes slowTilt {
  0%, 100% {
    transform: rotateY(-15deg);
  }
  50% {
    transform: rotateY(15deg);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.buy-btn, .whitepaper-btn {
  padding: 12px 24px !important;
  font-size: 14px !important;
  min-width: 160px !important;
  height: 48px !important;
  border-radius: 999px !important;
  font-weight: 600;
}

.buy-btn {
  background: linear-gradient(90deg, #24aa94 0%, #18806d 100%) !important;
  color: #fff !important;
  border: none !important;
}

.whitepaper-btn {
  background: #484f57 !important;
  color: #fff !important;
  border: 1px solid #bfc5cc !important;
}

/* Mobile styles */
@media (max-width: 480px) {
  .hero-section {
    margin-top: 6rem;
    padding: 1rem;
    min-height: auto;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .content-left {
    width: 100%;
  }

  .content-right {
    width: 100%;
  }

  .live-trading-badge {
    padding: 8px 8px;
    font-size: 10px;
    margin: 0 auto 1.5rem;
  }

  .main-title {
    font-size: 7rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    text-align: center;
    padding: 0 1rem;
  }

  .token-wrapper {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }

  .price-section {
    text-align: center;
  }

  .price {
    font-size: 3rem;
  }

  .change {
    font-size: 1.25rem;
  }

  .action-buttons {
    justify-content: center;
  }

  .buy-btn, .whitepaper-btn {
    padding: 8px 8px !important;
    font-size: 9px !important;
    min-width: 80px !important;
    height: 40px !important;
  }
}

/* Tablet styles */
@media (min-width: 481px) and (max-width: 768px) {
  .hero-section {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

 .live-trading-badge {
    padding: 14px 14px;
    font-size: 16px;
    margin: 0 auto 1.5rem;
  }

  .content-left {
    width: 100%;
  }

  .content-right {
    width: 100%;
  }

  .token-wrapper {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }

  .main-title {
    font-size: 12rem;
    text-align: center;
    margin-top: 2rem;
  }

  .description {
    font-size: 2rem;
    text-align: center;
    margin: 0 auto 2rem;
  }

  .price-section {
    text-align: center;
    margin-bottom: 3rem;
  }
  .price {
    font-size: 4rem;
  }

  .change {
    font-size: 3rem;
  }

  .action-buttons {
    justify-content: center;
  }

  .buy-btn, .whitepaper-btn {
    padding: 10px 12px !important;
    font-size: 16px !important;
    min-width: 80px !important;
    height: 50px !important;
  }
}

@media (min-width: 1024px) {
  .hero-content {
    gap: 2rem;
  }
  .content-left {
    max-width: 600px;
  }
  .token-wrapper {
    width: 380px;
    height: 380px;
  }
  .main-title {
    font-size: 12rem;
    margin-bottom: 3rem;
    margin-top: 2rem;
  }
  .description {
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
  }
  .price-section {
    margin-bottom: 3rem;
  }
  .price {
    font-size: 6rem;
    margin-bottom: 1rem;
  }
  .change {
    font-size: 3.25rem;
  }
  .action-buttons {
    margin-top: 2rem;
  }
  .buy-btn, .whitepaper-btn {
    font-size: 1.5rem !important;
    min-width: 200px !important;
    height: 60px !important;
    padding: 18px 36px !important;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
