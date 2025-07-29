<template>
  <div
    class="w-100 height-main-div d-flex justify-center align-center position-relative"
  >
    <canvas
      id="canvas"
      class="wrbgl position-absolute left-0 top-0"
    />

    <div class="top-items">
      <v-btn
        size="large"
        color="#ffb300"
        icon
        :readonly="isShowGuidMenu"
        :class="`${stepGuidMenu == `pause` || !isShowGuidMenu ? `` : `fade`}`"
        @click="setPlayingStatus(false)"
      >
        <v-icon
          size="x-large"
          color="white"
        >
          mdi-pause
        </v-icon>
      </v-btn>
      <div
        v-if="stepGuidMenu == `pause`"
        class="description-guid"
      >
        You Can Stop The Game

        <v-btn
          color="#ffb300"
          rounded="lg"
          size="large"
          height="30"
          class="text-white"
          @click="changeStepGuid($event, `questionBox`)"
        >
          Next
        </v-btn>
      </div>

      <div
        :class="[
          'question-box',
          questionStatus,
          stepGuidMenu == `questionBox` || !isShowGuidMenu ? `` : `fade`,
        ]"
      >
        {{ questions[currentQuestionIndex].text }}

        <div
          v-if="stepGuidMenu == `questionBox`"
          class="description-guid"
        >
          You Can See The Current Question

          <v-btn
            color="#ffb300"
            rounded="lg"
            size="large"
            height="30"
            class="text-white"
            @click="changeStepGuid($event, `timerScore`)"
          >
            Next
          </v-btn>
        </div>
      </div>

      <div
        :class="`container-timer-score ${
          stepGuidMenu == `timerScore` || !isShowGuidMenu ? `` : `fade`
        }`"
      >
        <div class="gems-show">
          <div class="gem-image-div">
            <v-icon color="white">
              mdi-diamond-stone
            </v-icon>
          </div>

          <span class="count-gem">{{ countGemCollected }}</span>
        </div>

        <div class="score-div">
          <span class="score-text">{{ score }}</span>
          <v-icon
            class="icon-score"
            color="#ed8a19"
          >
            mdi-star
          </v-icon>
        </div>
        <div :class="['timer-box', { danger: timerDanger }]">
          {{ Math.ceil(timer) }}
        </div>

        <v-btn
          size="large"
          color="#ffb300"
          icon
          :readonly="isShowGuidMenu"
          @click="changeCameraMode"
        >
          <v-icon
            v-if="cameraMode == `default`"
            size="x-large"
            color="white"
          >
            mdi-webcam
          </v-icon>

          <v-icon
            v-if="cameraMode == `close`"
            size="x-large"
            color="white"
          >
            mdi-camera
          </v-icon>
        </v-btn>

        <div
          v-if="stepGuidMenu == `timerScore`"
          class="description-guid score-time"
        >
          You Can See The Remaining time , Score, Gems and changing Mode Camera.

          <v-btn
            color="#ffb300"
            rounded="lg"
            size="large"
            height="30"
            class="text-white"
            @click="changeStepGuid($event, `play`)"
          >
            Next
          </v-btn>
        </div>
      </div>
    </div>

    <div
      v-if="showGemAnimation"
      class="gem-collect-animation"
      :style="gemAnimationStyle"
    >
      +1
    </div>

    <div
      v-if="!isPlayingGame && resultGame == `pending`"
      :class="`overlay-pause ${isShowGuidMenu ? `zindex-less` : ``}`"
    >
      <v-btn
        size="large"
        color="#ffb300"
        icon
        :readonly="isShowGuidMenu"
        :class="`${stepGuidMenu == `play` || !isShowGuidMenu ? `` : `fade`}`"
        @click="setPlayingStatus(true)"
      >
        <v-icon
          size="x-large"
          color="white"
        >
          mdi-play
        </v-icon>
      </v-btn>

      <div
        v-if="stepGuidMenu == `play`"
        class="description-guid play-game"
      >
        You Can Play the game

        <v-btn
          color="#ffb300"
          rounded="lg"
          size="large"
          height="30"
          class="text-white"
          @click="changeStepGuid($event, `ChangeLaneBtn`)"
        >
          Next
        </v-btn>
      </div>
    </div>

    <div
      v-if="resultGame != `pending`"
      class="overlay-result-game"
    >
      <div :class="`modal-status ${resultGame}-modal`">
        <span
          v-if="level != maxLevel"
          :class="`status-text ${resultGame}-text`"
        >
          {{ resultGame == "failed" ? "Game Over!" : "Great!" }}
        </span>
        <span
          v-if="level != maxLevel"
          class="status-text"
        >
          Your Level Is {{ level }}
        </span>

        <span
          v-if="level == maxLevel"
          class="status-text success-text"
        >
          Congratulations <br>
          Complete All Level
        </span>

        <v-btn
          v-if="resultGame == `failed` && level != maxLevel"
          size="large"
          color="#ffb300"
          icon
          @click="resetGame"
        >
          <v-icon
            size="x-large"
            color="white"
          >
            mdi-refresh
          </v-icon>
        </v-btn>

        <v-btn
          v-if="level == maxLevel"
          size="large"
          color="#ffb300"
          icon
          @click="resetWholeGame"
        >
          <v-icon
            size="x-large"
            color="white"
          >
            mdi-refresh
          </v-icon>
        </v-btn>

        <v-btn
          v-if="resultGame == `success` && level != maxLevel"
          size="large"
          color="#ffb300"
          icon
          @click="loadNextLevel"
        >
          <v-icon
            size="x-large"
            color="white"
          >
            mdi-skip-next
          </v-icon>
        </v-btn>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="overlay-loading"
    >
      Loading ...
    </div>

    <div
      v-if="showCounterFirstPlay"
      class="counter-container"
    >
      <transition
        name="zoom-fade"
        @after-enter="nextCount"
      >
        <div
          v-if="currentCountFirstPlay !== 0"
          :key="currentCountFirstPlay"
          class="counter-number"
        >
          {{ currentCountFirstPlay }}
        </div>
      </transition>
    </div>

    <div
      :class="`buttons-div ${
        stepGuidMenu == `ChangeLaneBtn` || !isShowGuidMenu ? `` : `fade`
      }`"
    >
      <v-btn
        size="large"
        color="#ffb300"
        icon
        :readonly="isShowGuidMenu"
        @click="changeLane(-1)"
      >
        <v-icon
          size="x-large"
          color="white"
        >
          mdi-arrow-left-bold
        </v-icon>
      </v-btn>
      <v-btn
        size="large"
        color="#ffb300"
        icon
        :readonly="isShowGuidMenu"
        @click="changeLane(1)"
      >
        <v-icon
          size="x-large"
          color="white"
        >
          mdi-arrow-right-bold
        </v-icon>
      </v-btn>

      <div
        v-if="stepGuidMenu == `ChangeLaneBtn`"
        class="description-guid guid-btn-change-lane"
      >
        You Can Change Lane Car

        <v-btn
          color="#ffb300"
          rounded="lg"
          size="large"
          height="30"
          class="text-white"
          @click="changeStepGuid($event, `Finish`)"
        >
          Finish
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Reactive state
const experience = ref(null)
const ExperienceModule = ref(null)
// question status : error,success,normal
const questionStatus = ref('normal')
const questions = ref([
  {
    text: '10 - 2 =',
    choices: ['4', '22', '45', '8'],
    indexAnswer: 3,
  },
  {
    text: '22 * 2 =',
    choices: ['4', '44', '81', '95'],
    indexAnswer: 1,
  },
  {
    text: '1 + 1 =',
    choices: ['2', '15', '56', '64'],
    indexAnswer: 0,
  },
  {
    text: '9 * 8 =',
    choices: ['72', '35', '12', '64'],
    indexAnswer: 0,
  },
])
const currentQuestionIndex = ref(0)
const timer = ref(40)
const timerDanger = ref(false)
const isPlayingGame = ref(false)
const score = ref(0)

// reslut game option : success,failed,pending
const resultGame = ref('pending')
const isLoading = ref(true)
const currentCountFirstPlay = ref(3)
const showCounterFirstPlay = ref(false)
const isFirstTimePlayingGame = ref(true)

// camera mocde : close,default
const cameraMode = ref('default')
const isShowGuidMenu = ref(false)

// Step Guid Menu : pause,questionBox,timerScore,play,ChangeLaneBtn,Finish
const stepGuidMenu = ref('Finish')
const isUpdateTimer = ref(true)
const countGemCollected = ref(0)
const showGemAnimation = ref(false)
const gemAnimationStyle = ref({})
const animationGemCollectDuration = ref(1500)
const level = ref(1)
const maxLevel = ref(4)

// Methods
const onChangeSceneReady = () => {
  isLoading.value = false
}

const changeStepGuid = (event, step) => {
  event.stopImmediatePropagation()
  stepGuidMenu.value = step
  if (step == 'Finish') {
    isShowGuidMenu.value = false
  }
}

const changeLane = (direction) => {
  experience.value.changeLane(direction)
}

const setPlayingStatus = (status) => {
  if (isFirstTimePlayingGame.value) {
    isFirstTimePlayingGame.value = false
    showCounterFirstPlay.value = true
    nextCount()
    isPlayingGame.value = status

    setTimeout(() => {
      experience.value.setPlayingStatus(status)
    }, 3000)
  }
  else {
    isPlayingGame.value = status
    experience.value.setPlayingStatus(status)
  }
}

const onQuestionChange = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value += 1
  }
}

const onQuestionStatusChange = (status) => {
  questionStatus.value = status
  setTimeout(() => {
    questionStatus.value = 'normal'
  }, 3000)
}

const onChangeIsUpdateTimer = (state) => {
  isUpdateTimer.value = state
}

const onTimerUpdate = (delta) => {
  if (timer.value > 0) {
    if (isUpdateTimer.value) {
      timer.value -= delta

      if (timer.value <= 10 && !timerDanger.value) {
        timerDanger.value = true
      }
    }
  }
  else {
    timer.value = 0
    timerDanger.value = false

    setPlayingStatus(false)
    resultGame.value = 'failed'
  }
}

const onScoreChange = (bonus) => {
  score.value += bonus
}

const onResultGameChange = (result) => {
  if (result.status == 'success') {
    setPlayingStatus(false)
    resultGame.value = 'success'
  }
}

const resetGame = () => {
  isUpdateTimer.value = true
  isLoading.value = true
  experience.value.resetGame()
  currentQuestionIndex.value = 0
  timer.value = 40
  questionStatus.value = 'normal'
  timerDanger.value = false
  score.value = 0
  resultGame.value = 'pending'
  setPlayingStatus(true)
  currentCountFirstPlay.value = 3

  setTimeout(() => {
    setPlayingStatus(false)
    isLoading.value = false
    isFirstTimePlayingGame.value = true
  }, 1000)
}

const resetWholeGame = () => {
  level.value = 1
  isUpdateTimer.value = true
  isLoading.value = true
  score.value = 0
  countGemCollected.value = 0
  currentQuestionIndex.value = 0
  timer.value = 40
  questionStatus.value = 'normal'
  timerDanger.value = false
  resultGame.value = 'pending'
  setPlayingStatus(true)
  currentCountFirstPlay.value = 3
  experience.value.destroy()
  experience.value = null

  import('@/threeJsExperience/car-racing/Experience.js')
    .then((module) => {
      ExperienceModule.value = module.default
      experience.value = new ExperienceModule.value(
        document.getElementById('canvas'),
        questions.value,
        level.value,
        {
          onQuestionChange,
          onQuestionStatusChange,
          onTimerUpdate,
          onScoreChange,
          onResultGameChange,
          onChangeSceneReady,
          onChangeIsUpdateTimer,
          onGemColocted,
        },
      )
    })
    .catch((error) => {
      console.log('error', error)
    })

  setTimeout(() => {
    setPlayingStatus(false)
    isLoading.value = false
    isFirstTimePlayingGame.value = true
  }, 1000)
}

const loadNextLevel = () => {
  if (level.value < maxLevel.value) {
    level.value += 1
    isUpdateTimer.value = true
    isLoading.value = true
    currentQuestionIndex.value = 0
    timer.value = 40
    questionStatus.value = 'normal'
    timerDanger.value = false
    resultGame.value = 'pending'
    setPlayingStatus(true)
    currentCountFirstPlay.value = 3
    experience.value.destroy()
    experience.value = null

    import('@/threeJsExperience/car-racing/Experience.js')
      .then((module) => {
        ExperienceModule.value = module.default
        experience.value = new ExperienceModule.value(
          document.getElementById('canvas'),
          questions.value,
          level.value,
          {
            onQuestionChange,
            onQuestionStatusChange,
            onTimerUpdate,
            onScoreChange,
            onResultGameChange,
            onChangeSceneReady,
            onChangeIsUpdateTimer,
            onGemColocted,
          },
        )
      })
      .catch((error) => {
        console.log('error', error)
      })

    setTimeout(() => {
      setPlayingStatus(false)
      isLoading.value = false
      isFirstTimePlayingGame.value = true
    }, 1000)
  }
}

const nextCount = () => {
  if (currentCountFirstPlay.value > 1) {
    setTimeout(() => {
      currentCountFirstPlay.value--
    }, 500)
  }
  else {
    setTimeout(() => {
      currentCountFirstPlay.value = 0
      showCounterFirstPlay.value = false
    }, 500)
  }
}

const changeCameraMode = () => {
  if (cameraMode.value == 'default') {
    experience.value.changeCameraMode('close')
    cameraMode.value = 'close'
  }
  else {
    experience.value.changeCameraMode('default')
    cameraMode.value = 'default'
  }
}

const startAnimationGemCollect = async () => {
  const startX = window.innerWidth / 2
  const startY = window.innerHeight / 2
  const gemElement = document.querySelector('.gems-show')
  if (gemElement) {
    const gemRect = gemElement.getBoundingClientRect()
    const endX = gemRect.left + gemRect.width / 2
    const endY = gemRect.top + gemRect.height / 2

    gemAnimationStyle.value = {
      left: `${startX}px`,
      top: `${startY}px`,
      opacity: '1',
      transform: 'scale(1)',
    }
    showGemAnimation.value = true
    await new Promise((resolve) => {
      setTimeout(() => {
        gemAnimationStyle.value = {
          left: `${endX}px`,
          top: `${endY}px`,
          opacity: '0',
          transform: 'scale(0.8)',
          transition: `all ${animationGemCollectDuration.value}ms ease-out`,
        }
        resolve()
      }, 50)
    })

    await new Promise(resolve =>
      setTimeout(resolve, animationGemCollectDuration.value),
    )
    showGemAnimation.value = false
  }
}

const onGemColocted = () => {
  countGemCollected.value += 1
  startAnimationGemCollect()
}

// Lifecycle hooks
onMounted(() => {
  // hide footer
  const footer = document.getElementById('footer-container')
  if (footer) {
    footer.style.display = 'none'
  }

  const hasSeenGuide = localStorage.getItem('hasSeenGuideMenu')
  if (!hasSeenGuide) {
    stepGuidMenu.value = 'pause'
    isShowGuidMenu.value = true
    localStorage.setItem('hasSeenGuideMenu', 'true')
  }

  import('@/threeJsExperience/car-racing/Experience.js')
    .then((module) => {
      ExperienceModule.value = module.default
      experience.value = new ExperienceModule.value(
        document.getElementById('canvas'),
        questions.value,
        level.value,
        {
          onQuestionChange,
          onQuestionStatusChange,
          onTimerUpdate,
          onScoreChange,
          onResultGameChange,
          onChangeSceneReady,
          onChangeIsUpdateTimer,
          onGemColocted,
        },
      )
    })
    .catch((error) => {
      console.log('error', error)
    })
})

onBeforeUnmount(() => {
  const footer = document.getElementById('footer-container')
  if (footer) {
    footer.style.display = 'unset'
  }
  if (experience.value) {
    experience.value.destroy()
    experience.value = null
  }
})
</script>

<style scoped>
.height-main-div {
  height: 100dvh;
}

.wrbgl {
  outline: none;
  z-index: 2;
}

/* buttons change lane */
.buttons-div {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 30px;
  position: absolute;
  bottom: 20px;
  width: 100%;
  z-index: 3;
}

/* top items */
.top-items {
  position: absolute;
  z-index: 3;
  top: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

/* question box section */
.question-box {
  padding: 15px 25px;
  border-radius: 20px;
  font-size: 40px;
  font-weight: bold;
  color: white;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.question-box.normal {
  background: linear-gradient(135deg, #7ed6df, #70a1ff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.question-box.success {
  background: linear-gradient(135deg, #55efc4, #00b894);
  box-shadow: 0 4px 15px rgba(0, 255, 100, 0.5);
  animation: successBounce 0.5s;
}

.question-box.error {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
  animation: shake 0.4s;
}

@keyframes successBounce {
  0% {
    transform: translateX(-50%) scale(1);
  }

  50% {
    transform: translateX(-50%) scale(1.1);
  }

  100% {
    transform: translateX(-50%) scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(-50%) translateX(0);
  }

  20%,
  60% {
    transform: translateX(-50%) translateX(-10px);
  }

  40%,
  80% {
    transform: translateX(-50%) translateX(10px);
  }
}

.container-timer-score {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 6px;
  position: relative;
}

/* score section */
.score-div {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.score-text {
  font-size: 24px;
  font-weight: 800;
  color: white;
  position: absolute;
  transform: translate(-2px, 2px);
  z-index: 2;
}

.icon-score {
  font-size: 86px;
}

/* timer section */
.timer-box {
  background: #ffb300;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 20px;
  font-weight: 800;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timer-box.danger {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}

/* overlay menu  */
.overlay-pause {
  position: absolute;
  z-index: 4;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 64%);
}

.zindex-less {
  z-index: 2;
}

/* overlay result game */
.overlay-result-game {
  position: absolute;
  z-index: 4;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 64%);
}

.modal-status {
  width: 90%;
  max-width: 320px;
  height: 90%;
  max-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 10px;
  background-color: white;
  border-radius: 16px;
}

.failed-modal {
  border: 4px solid red;
}

.success-modal {
  border: 4px solid rgb(255 179 0);
}

.status-text {
  font-size: 24px;
  font-weight: bold;
}

.failed-text {
  color: red;
}

.success-text {
  color: #4bb543;
  text-align: center;
}

/* overlay loading */
.overlay-loading {
  position: absolute;
  z-index: 4;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  font-weight: bold;
  color: white;
  font-size: 30px;
  transition: all 0.5s;
}

/* counter start */
.counter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  z-index: 4;
}

.counter-number {
  font-size: 10rem;
  color: #ff3c00;
  font-weight: bold;
}

.zoom-fade-enter-active {
  animation: zoomFade 0.5s ease;
}

.zoom-fade-leave-active {
  opacity: 0;
}

@keyframes zoomFade {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* guid overlay */
.guid-overlay {
  position: absolute;
  z-index: 4;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade {
  opacity: 0.5;
}

.description-guid {
  border-radius: 12px;
  background-color: white;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
  color: black;
  position: absolute;
  top: 100px;
  padding: 10px;
  left: 10px;
  row-gap: 20px;
  z-index: 10;
  min-width: 200px;
  text-align: start;
}

.play-game {
  top: unset;
  left: unset;
  transform: translateY(100px);
}

.guid-btn-change-lane {
  top: unset;
  left: unset;
  transform: translateY(-100px);
}

/* gems Show */
.gems-show {
  width: 100px;
  height: 40px;
  border-radius: 40px;
  background: linear-gradient(135deg, #ffeaa7, #ff8400);
  border: 4px solid #ffc400;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gem-image-div {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  background-color: #ef993f;
  left: -10px;
  top: -10px;
  border: 4px solid #ffc400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-gem {
  font-size: 30px;
  font-weight: bold;
  color: white;
  position: absolute;
  right: 20px;
}

.gem-collect-animation {
  position: fixed;
  z-index: 1000;
  font-size: 80px;
  font-weight: bold;
  color: #ef993f;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  transform: translate(-50%, -50%);
  transition: all 0.5s ease-out;
}

/* responsive tablet */
@media screen and (max-width: 768px) {
  .top-items {
    align-items: flex-start;
  }

  .container-timer-score {
    column-gap: 6px;
    flex-direction: column;
    row-gap: 10px;
  }
  .score-time {
    left: -120px;
    top: 280px;
  }
}

/* responsive mobile */
@media screen and (max-width: 480px) {
  .timer-box {
    width: 56px;
    height: 56px;
    font-size: 14px;
  }

  .question-box {
    padding: 10px 15px;
    font-size: 30px;
  }

  .container-timer-score {
    column-gap: 6px;
    flex-direction: column;
    row-gap: 10px;
  }

  .top-items {
    align-items: flex-start;
  }

  .score-time {
    left: -120px;
    top: 260px;
  }

  .buttons-div {
    bottom: 60px;
  }

  .gems-show {
    width: 80px;
    height: 30px;
  }

  .gem-image-div {
    width: 40px;
    height: 40px;
  }

  .count-gem {
    font-size: 20px;
  }
}
</style>
