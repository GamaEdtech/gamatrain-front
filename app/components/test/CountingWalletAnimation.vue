<template>
  <div
    v-show="showBoxBalance"
    ref="boxShowingBalanceRef"
    class="box-showing-balance"
  >
    <span
      ref="amountBalanceRef"
      class="amount-balance"
    >{{
      formattedBalance
    }}</span>
  </div>
</template>

<script setup lang="ts">
interface ICountingWalletAnimation {
  isStartAnimation: boolean
  direction: number
  deltaPrice: number
}

const props = defineProps<ICountingWalletAnimation>()
const emit = defineEmits(['completeAnimation'])

const balance = ref(0.0)
const showBoxBalance = ref(true)
const boxShowingBalanceRef = ref(null)
const amountBalanceRef = ref(null)

const formattedBalance = computed(() => {
  const value = Number(balance.value).toFixed(7)
  return balance.value > 0 ? `+${value}` : value
})

const animationFadeInBoxBalance = (boxShowingBalanceElement: HTMLElement, nameAnimation: string) => {
  showBoxBalance.value = true
  boxShowingBalanceElement.classList.add(nameAnimation)
}
const animationCountingBalance = (
  amountBalanceElement: HTMLElement,
  balanceChangeDirection: number,
) => {
  setTimeout(() => {
    const startValue = Number(balance.value)
    const displacementAmount = props.deltaPrice
    const endValue = parseFloat(
      (startValue + displacementAmount * balanceChangeDirection).toFixed(7),
    )
    const duration = 1000
    const stepTime = 30
    let current = startValue
    const steps = Math.ceil(duration / stepTime)
    const amountStep = Math.abs(endValue - startValue) / steps
    amountBalanceElement.classList.add(
      'pulsing',
      balanceChangeDirection == 1 ? 'increasing' : 'decreasing',
    )
    const counter = setInterval(() => {
      current = current + balanceChangeDirection * amountStep
      if (current >= endValue && balanceChangeDirection == 1) {
        current = endValue
        clearInterval(counter)
      }
      if (current <= endValue && balanceChangeDirection == -1) {
        current = endValue
        clearInterval(counter)
      }
      balance.value = parseFloat(current.toFixed(7))
    }, stepTime)
  }, 600)
}
const animationFadeOutBoxBalance = (
  amountBalanceElement: HTMLElement,
  boxShowingBalanceElement: HTMLElement,
) => {
  setTimeout(() => {
    boxShowingBalanceElement.classList.remove('animate-in', 'animate-in-error')
    boxShowingBalanceElement.classList.add('animate-out')
  }, 3000)
  setTimeout(() => {
    amountBalanceElement.classList.remove(
      'pulsing',
      'decreasing',
      'increasing',
    )
    boxShowingBalanceElement.classList.remove('animate-out')
    showBoxBalance.value = false
    balance.value = 0
    emit('completeAnimation')
  }, 3500)
}

const startAnimation = () => {
  const boxShowingBalanceElement = boxShowingBalanceRef.value
  const amountBalanceElement = amountBalanceRef.value
  animationFadeInBoxBalance(boxShowingBalanceElement!, props.direction == 1 ? 'animate-in' : 'animate-in-error')
  animationCountingBalance(amountBalanceElement!, props.direction)
  animationFadeOutBoxBalance(amountBalanceElement!, boxShowingBalanceElement!)
}

watch(() => props.isStartAnimation, () => {
  if (props.isStartAnimation) {
    startAnimation()
  }
})
</script>

<style scoped>
/* Box Showing Balance */
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
  border: 2px solid rgb(var(--v-theme-primary));
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
}

.box-showing-balance.animate-in {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success) , 0.25);
}

.box-showing-balance.animate-out {
  animation: animateOut 0.5s ease forwards;
}

.box-showing-balance.animate-in-error {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid rgb(var(--v-theme-lightError));
  background-color: rgba(var(--v-theme-lightError) , 0.25);
}

.amount-balance {
  font-size: 20px;
  font-weight: 700;
  color: black;
}

.amount-balance.increasing {
  color: rgb(var(--v-theme-success));
}

.amount-balance.decreasing {
  color: rgb(var(--v-theme-lightError));
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

@media (max-width: 1264px) {
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
