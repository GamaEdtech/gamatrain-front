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

  <test-counting-wallet-animation
    :is-start-animation="isStartWalletAnimation"
    :direction="1"
    :delta-price="increaseAmountbalance"
    @complete-animation="completeWalletAnimation"
  />
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import successSound from '/assets/sounds/success.mp3'
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const route = useRoute()
const config = useRuntimeConfig()

const includedRouteNames = [
  'blog-id-slug',
  'tutorial-id-slug',
  'qa-id-slug',
  'paper-id-slug',
  'multimedia-id-slug',

]

const shouldRenderRandomCoin = computed(() => {
  return includedRouteNames.includes(String(route.name))
})

const coins = ref([])
const lottieRefs = new Map()
const increaseAmountbalance = ref(0)
const isStartWalletAnimation = ref(false)

let scrollHandler = null
const coinsResponse = ref(null)

const startAnimationCacheInWallet = () => {
  isStartWalletAnimation.value = true
}
const completeWalletAnimation = () => {
  isStartWalletAnimation.value = false
}

const fetchCoins = async () => {
  const response = await useApiService.get(
    '/api/v2/games/easter-egg/fortune-wheel',
    undefined,
    {
      headers: {
        Authorization: `ApiKey ${config.public.randomCoinApiKey}`,
      },
    },
  )
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
    const response = await useApiService.post(
      '/api/v2/games/easter-egg/points',
      {
        id: coin.id,
      },
    )
    if (response.data) {
      increaseAmountbalance.value = response.data.points / 1_000_000
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
