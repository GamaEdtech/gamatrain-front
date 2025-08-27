<template>
  <TransitionGroup
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
        zIndex: 9999,
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
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import successSound from '/assets/sounds/success.mp3'

const route = useRoute()

const coins = ref([])
const lottieRefs = new Map()

let scrollHandler = null

const { data: coinsResponse, refresh: refreshCoins } = await useAsyncData(
  'game-coins',
  () => useApiService.get('/api/coins').then(r => r?.data),
)

let hasInitialized = false

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

function getPointsForCoin(type) {
  const t = String(type || '').toLowerCase()
  if (t === 'gold') return 9
  if (t === 'silver') return 6
  return 1
}

function handleCoinClick(coin) {
  if (coin.isClicked) return

  coin.isClicked = true

  nextTick(() => {
    const inst = lottieRefs.get(coin.id)?.getDotLottieInstance()
    inst?.resize()
    inst?.play()
  })
  playSound(successSound)

  try {
    const points = getPointsForCoin(coin.type)
    useApiService.post('/api/v2/game/easter-egg', { points }).catch(() => {})
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
  try {
    const responseData = coinsResponse?.value
    const coinTypes = Array.isArray(responseData?.coins)
      ? responseData.coins
      : []
    const newCoins = coinTypes.map((type, i) => ({
      id: Date.now() + '-' + i,
      type,
      src: mapCoinTypeToSrc(type),
      position: generateRandomPosition(),
      isClicked: false,
    }))
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
    setTimeout(async () => {
      try {
        if (hasInitialized) {
          await refreshCoins()
        }
        else {
          hasInitialized = true
        }
      }
      catch (e) {
        console.warn('Failed to refresh coins:', e)
      }
      finally {
        showCoinsWithAnimation()
      }
    }, 1000)
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
