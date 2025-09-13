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
            <!-- Live Trading Badge -->
            <NuxtLink
              class="figma-live-badge"
              to="https://jup.ag/tokens/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
              target="_blank"
            >
              <span class="figma-live-dot" />
              Live Trading
            </NuxtLink>

            <!-- Price Display -->
            <div class="figma-price-display">
              <!-- $GET Title -->
              <h1 class="figma-get-title">
                $GET
              </h1>

              <div class="figma-price-container">
                <span class="figma-price">${{ formattedPrice }}</span>
                <div class="figma-price-change">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6434 7.05386L18.0834 8.49386L13.2034 13.3739L9.91344 10.0839C9.52344 9.69386 8.89344 9.69386 8.50344 10.0839L2.50344 16.0939C2.11344 16.4839 2.11344 17.1139 2.50344 17.5039C2.89344 17.8939 3.52344 17.8939 3.91344 17.5039L9.20344 12.2039L12.4934 15.4939C12.8834 15.8839 13.5134 15.8839 13.9034 15.4939L19.4934 9.91386L20.9334 11.3539C21.2434 11.6639 21.7834 11.4439 21.7834 11.0039V6.70386C21.7934 6.42386 21.5734 6.20386 21.2934 6.20386H17.0034C16.5534 6.20386 16.3334 6.74386 16.6434 7.05386Z"
                      fill="#12B76A"
                    />
                  </svg>

                  <span class="figma-percentage">+1.65%</span>
                </div>
              </div>
            </div>

            <!-- Token Purchase Component -->
            <div class="figma-purchase-wrapper">
              <token-purchase />
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
      'https://lite-api.jup.ag/price/v3?ids=GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv',
    )
    finalPrice.value = Object.values(data)?.[0]?.usdPrice ?? 0
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
.v-container{
  padding: 0px !important;
}
.hero-section {
  background: #24292F;
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
  justify-content: space-between;
  gap: 4rem;
}

.content-left {
  flex: 1;
  max-width: 600px;
}

.content-right {
  flex: 0 0 auto;
}

/* Figma-exact Live Trading Badge */
.figma-live-badge {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #9CA3AF;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.figma-live-dot {
  width: 8px;
  height: 8px;
  background: rgba(2, 183, 25, 1);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Figma-exact $GET Title */
.figma-get-title {
  font-size: 120px;
  font-weight: 700;
  color: #FFC107;
  margin: 0 0 1.5rem 0;
  line-height: 1;
  text-align: left;
}

/* Figma-exact Price Display */
.figma-price-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3rem;
}

.figma-price-container{
  display: flex;
  gap: 10px;
}

.figma-price {
  font-size: 32px;
  font-weight: 600;
  color: rgba(208, 213, 221, 1);
}

.figma-price-change {
  display: flex;
  align-items: center;
  gap: 8px;
}

.figma-percentage {
  font-size: 18px;
  font-weight: 600;
  color: rgba(18, 183, 106, 1);
}

/* Purchase Component Wrapper */
.figma-purchase-wrapper {
  margin-top: 2rem;
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
@media (max-width: 599px) {
  .hero-section {
    padding: 1rem;
    min-height: auto;
  }

  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
    gap: 2rem;
  }

  .content-left {
    width: 100%;
    text-align: center;
  }

  .content-right {
    width: 100%;
    margin-top: 6.5rem;
  }

  .figma-live-badge {
    margin: 0 auto 1.5rem;
  }

  .figma-get-title {
    font-size: 40px;
    text-align: center;
    width: 100%
  }

  .figma-price-display {
    justify-content: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .figma-price {
    font-size: 24px;
  }

  .figma-percentage {
    font-size: 14px;
  }

  .token-wrapper {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
}

/* Tablet styles */
@media (min-width: 600px) and (max-width: 1199px) {
  .hero-section {
    padding: 1.5rem;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .content-left {
    width: 100%;
    text-align: center;
  }

  .content-right {
    width: 100%;
  }

  .figma-live-badge {
    margin: 0 auto 1.5rem;
  }

  .figma-get-title {
    font-size: 96px;
    text-align: center;
  }

  .figma-price-display {
    justify-content: center;
    margin-bottom: 2.5rem;
  }

  .figma-price {
    font-size: 28px;
  }

  .figma-percentage {
    font-size: 16px;
  }

  .token-wrapper {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
}

/* Desktop styles */
@media (min-width: 1200px) {
  .hero-content {
    gap: 4rem;
    align-items: center;
  }

  .content-left {
    max-width: 450px;
    text-align: left;
  }

  .figma-get-title {
    font-size: 50px;
  }

  .figma-price {
    font-size: 22px;
  }

  .figma-percentage {
    font-size: 18px;
  }

  .token-wrapper {
    width: 400px;
    height: 400px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
