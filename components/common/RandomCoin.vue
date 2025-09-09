<template>
  <TransitionGroup
    v-if="shouldRenderRandomCoin"
    name="coin-fade"
    tag="div"
  >
    <div
      v-for="coin in coins"
      :key="coin.id"
      :data-coin-id="coin.id"
      class="random-coin"
      :class="{ 'coin-clicked': coin.isClicked }"
      :style="{
        position: 'absolute',
        left: coin.position.x + 'px',
        top: coin.position.y + 'px',
        zIndex: 999,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: coin.isClicked ? 'all 0.5s ease' : 'none',
      }"
      @click="handleCoinClick(coin)"
    >
      <ClientOnly>
        <DotLottieVue
          :ref="(el) => setLottieRef(coin.id, el)"
          loop
          :style="{
            width: coin.isClicked ? '120px' : '40px',
            height: coin.isClicked ? '120px' : '40px',
          }"
          :src="coin.src"
        />
      </ClientOnly>
    </div>
  </TransitionGroup>
  <!-- Start : Box Showing Balance -->
  <div
    ref="boxShowingBalance"
    key="box-showing-balance"
    class="box-showing-balance"
  >
    <span class="amount-balance pulsing">+{{ increaseAmountbalance }} $GET</span>
  </div>
  <!-- End : Box Showing Balance -->
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import successSound from '/assets/sounds/success.mp3'
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const route = useRoute()
const config = useRuntimeConfig()

const excludedRouteNames = [
  'search',
  'school',
  'game-castle',
  'game-car-racing',
]
const shouldRenderRandomCoin = computed(() => {
  const name = route.name ? String(route.name) : ''
  return !excludedRouteNames.some(n => name == n)
})

const coins = ref([])
const lottieRefs = new Map()
const increaseAmountbalance = ref(0)
const showBoxBalance = ref(true)
const boxShowingBalance = ref(null)
let scrollHandler = null
const coinsResponse = ref(null)

const animationFadeInBoxBalance = (boxShowingBalanceElement, nameAnimation) => {
  showBoxBalance.value = true
  boxShowingBalanceElement.classList.add(nameAnimation)
}

const animationFadeOutBoxBalance = (boxShowingBalanceElement) => {
  setTimeout(() => {
    boxShowingBalanceElement.classList.remove('animate-in', 'animate-in-error')
    boxShowingBalanceElement.classList.add('animate-out')
  }, 3400)
  setTimeout(() => {
    boxShowingBalanceElement.classList.remove('animate-out')
    showBoxBalance.value = false
  }, 4400)
}

const startAnimationCacheInWallet = () => {
  const boxShowingBalanceElement = boxShowingBalance.value
  animationFadeInBoxBalance(boxShowingBalanceElement, 'animate-in')
  animationFadeOutBoxBalance(boxShowingBalanceElement)
}

const fetchCoins = async () => {
  const response = await useApiService.get('/api/v2/game/coins', undefined, {
    headers: {
      Authorization: `ApiKey ${config.public.randomCoinApiKey}`,
    },
  })
  coinsResponse.value = response.data
}

function setLottieRef(id, el) {
  if (el) {
    lottieRefs.set(id, el)
  }
  else {
    lottieRefs.delete(id)
  }
}

function setInitialFrame(inst) {
  if (inst && inst.isLoaded) {
    inst.setFrame(19)
    inst.pause()
  }
  else {
    setTimeout(() => setInitialFrame(inst), 50)
  }
}

function checkCoinVisibility() {
  coins.value.forEach((coin) => {
    const el = document.querySelector(`[data-coin-id="${coin.id}"]`)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const margin = 200

    const inView = rect.top < viewportHeight + margin && rect.bottom > -margin
    if (inView) {
      const inst = lottieRefs.get(coin.id)?.getDotLottieInstance()
      inst?.play()
    }
  })
}

function generateRandomPosition() {
  if (typeof window === 'undefined') return { x: 0, y: 0 }

  const documentWidth = document.documentElement.scrollWidth
  const documentHeight = document.documentElement.scrollHeight
  const coinSize = 40

  const x = Math.random() * (documentWidth - coinSize)
  const y = Math.random() * (documentHeight - coinSize)

  return { x, y }
}

function playSound(sound) {
  const audio = new Audio(sound)
  audio.play().catch(e => console.warn('Failed to play audio:', e))
}

const router = useRouter()

async function handleCoinClick(coin) {
  if (!auth?.isAuthenticated?.value) {
    router.push({ query: { auth_form: 'login', auth_noredirect: true } })
    return
  }
  if (coin.isClicked) return

  coin.isClicked = true

  nextTick(() => {
    const inst = lottieRefs.get(coin.id)?.getDotLottieInstance()
    inst?.resize()
    inst?.play()
  })
  playSound(successSound)

  try {
    const response = await useApiService.post('/api/v2/game/easter-egg', {
      id: coin.id,
    })
    if (response.data) {
      increaseAmountbalance.value = response.data.points
    }
  }
  catch {
    console.error('Failed')
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft
  const scrollY = window.pageYOffset || document.documentElement.scrollTop

  coin.position = {
    x: scrollX + (viewportWidth - 120) / 2,
    y: scrollY + (viewportHeight - 120) / 2,
  }

  setTimeout(() => {
    coins.value = coins.value.filter(c => c.id !== coin.id)
    startAnimationCacheInWallet()
  }, 2000)
}

function mapCoinTypeToSrc(type) {
  if (!type) return '/static/coins/bronze.json'
  const t = String(type).toLowerCase()
  if (t === 'gold') return '/static/coins/gold.json'
  if (t === 'silver') return '/static/coins/silver.json'
  return '/static/coins/bronze.json'
}

async function showCoinsWithAnimation() {
  if (!shouldRenderRandomCoin.value) {
    coins.value = []
    return
  }
  try {
    const responseData = coinsResponse?.value
    const serverCoins = Array.isArray(responseData?.coins)
      ? responseData.coins
      : []

    const newCoins = serverCoins.map((item) => {
      const type = (item?.coinType || '').toLowerCase()
      return {
        id: item?.id,
        type,
        src: mapCoinTypeToSrc(type),
        position: generateRandomPosition(),
        isClicked: false,
      }
    })

    coins.value = newCoins

    nextTick(() => {
      coins.value.forEach((coin) => {
        const inst = lottieRefs.get(coin.id)?.getDotLottieInstance()
        if (inst) setInitialFrame(inst)
      })
      checkCoinVisibility()
    })
  }
  catch (e) {
    console.warn('Failed', e)
    coins.value = []
  }
}

watch(
  () => route.path,
  async () => {
    coins.value = []
    try {
      if (!shouldRenderRandomCoin.value) {
        return
      }
      await fetchCoins()
      showCoinsWithAnimation()
    }
    catch (e) {
      console.warn('Failed to refresh coins:', e)
    }
  },
  { immediate: true },
)

watch(coins, async (list) => {
  if (list.length > 0) {
    await nextTick()
    scrollHandler = () => checkCoinVisibility()
    window.addEventListener('scroll', scrollHandler, { passive: true })
  }
  else {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
  }
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style scoped>
@keyframes show-balance-box {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(76px);
    opacity: 1;
  }
}

@keyframes animateOut {
  0% {
    transform: translateY(76px);
    opacity: 1;
  }

  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}

.box-showing-balance {
  padding: 10px 20px;
  border-radius: 10px;
  position: fixed;
  right: 80px;
  top: -10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
  opacity: 0;
  transform: translateY(-20px);
  transition: border 0.5s ease;
  z-index: 3;
  max-width: 300px;
  border: 2px solid green;
  background-color: rgb(197 248 197 / 76%);
}

.box-showing-balance.animate-in {
  animation: show-balance-box 0.6s ease-out forwards;
}

.box-showing-balance.animate-out {
  animation: animateOut 1s ease forwards;
}

.box-showing-balance.animate-in-error {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid red;
  background-color: rgba(255, 199, 199, 0.76);
}

.amount-balance {
  font-size: 20px;
  font-weight: 700;
  color: green;
}

@keyframes pulse-scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.amount-balance.pulsing {
  animation: pulse-scale 0.3s ease-in-out infinite;
}

@media (max-width: 1260px) {
  .box-showing-balance {
    right: 20px;
    top: 20px;
  }
  @keyframes show-balance-box {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }

    100% {
      transform: translateY(50px);
      opacity: 1;
    }
  }
  @keyframes animateOut {
    0% {
      transform: translateY(50px);
      opacity: 1;
    }

    100% {
      transform: translateY(-50px);
      opacity: 0;
    }
  }
}
</style>
