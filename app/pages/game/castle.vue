<template>
  <div
    ref="mainElement"
    class="main"
  >
    <!-- Main game container for ThreeJS rendering -->
    <div
      ref="container"
      class="container"
    />

    <!-- Game UI Components -->
    <InteractionPrompt
      v-if="
        (!isMathModalOpen && promptOperation === 'door')
          || (!isChestOpen && promptOperation === 'chest')
          || promptOperation === 'gate'
      "
      :opration="promptOperation"
      :is-near="isNear"
      @door-interaction="handleDoorInteraction"
      @gate-interaction="handleGateInteraction"
      @chest-interaction="handleChestInteraction"
    />

    <MathModal
      v-if="isMathModalOpen"
      :problem="currentProblem"
      :answer="currentAnswer"
      :levels="levels"
      :near-door="nearDoor"
      :level="level"
      :step="step"
      @close-math-modal="closeMathModal"
    />

    <StepProcess :step="step" />

    <LevelUp
      :level-up-modal="levelUpModal"
      :level="level"
      @close-level-up-modal="closeLevelUpModal"
    />

    <!-- Mobile-only controls -->
    <MobileMovementController
      :is-mobile-or-tablet="isMobileOrTablet"
      @move-start="handleMoveStart"
      @move-end="handleMoveEnd"
    />

    <MobileScreenControls
      :main-element="mainElement"
      :is-mobile-or-tablet="isMobileOrTablet"
    />

    <!-- Game instructions modal -->
    <HelpModal />

    <!-- Coins -->
    <Coins
      :coins="coins"
      :reward="currentStepData!.reward?.amount"
      :is-chest-open="isChestOpen"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  reactive,
  type _Ref,
} from 'vue'
import { useThreeJS } from '../../composables/game/useThreejs'
import { useCharacterController } from '../../composables/game/castle/useCharacterController'
import MathModal from '@/components/game/castle/MathModal.vue'
import useModels from '~/composables/game/castle/useModels'
import InteractionPrompt from '../../components/game/castle/interactionPrompt.vue'
import * as THREE from 'three'
import StepProcess from '~/components/game/castle/stepProcess.vue'
import LevelUp from '~/components/game/castle/levelUp.vue'
import MobileMovementController from '~/components/game/castle/mobileMovementController.vue'
import MobileScreenControls from '~/components/game/castle/mobileScreenControls.vue'
import HelpModal from '~/components/game/castle/helpModal.vue'
import useGate from '~/composables/game/castle/useGate'
import type { DoorModels } from '~/interfaces/DoorModels.interface'
import type { Level } from '~/interfaces/DoorStatus'
import type { Levels, Step } from '~/interfaces/levels.interface'
import Coins from '~/components/game/castle/coins.vue'
import { useSound } from '~/composables/game/useSound'
import { usePhysics } from '~/composables/game/castle/usePhysics'
import { createGround } from '~/composables/game/castle/usePhysicsEnv'
// ==========================================
// Game Configuration
// ==========================================

const levels = ref<Levels>({
  level1: {
    step1: {
      reward: {
        amount: 50,
        position: 'position4',
        room: 'room1',
      },
      door001: { problem: '2 + 3', answer: '5' },
      door002: { problem: '5 + 7', answer: '12' },
      door003: { problem: '10 + 8', answer: '18' },
      door004: { problem: '4 + 6', answer: '10' },
    },
    step2: {
      door001: { problem: '10 - 3', answer: '7' },
      door002: { problem: '9 - 5', answer: '4' },
      door003: { problem: '15 - 6', answer: '9' },
      door004: { problem: '20 - 7', answer: '13' },
    },
    step3: {
      door001: { problem: '10 / 2', answer: '5' },
      door002: { problem: '18 / 3', answer: '6' },
      door003: { problem: '20 / 4', answer: '5' },
      door004: { problem: '16 / 2', answer: '8' },
    },
    step4: {
      door001: { problem: '2 * 3', answer: '6' },
      door002: { problem: '4 * 5', answer: '20' },
      door003: { problem: '6 * 2', answer: '12' },
      door004: { problem: '3 * 7', answer: '21' },
    },
  },
})

// ==========================================
// State Management
// ==========================================

// Core game state
const level = ref<number>(1)
const step = ref<number>(1)
const modelsLoaded = ref<boolean>(false)
const isNear = ref(false)
const isMathModalOpen = ref(false)
const levelUpModal = ref<boolean>(false)
const promptOperation = ref<string>('') // Note: Named 'promptOperation' but passed as 'opration' prop due to component definition
const nearDoor = ref<'door001' | 'door002' | 'door003' | 'door004' | null>(
  null,
)
const isChestOpen = ref<boolean>(false)
const coins = ref<number>(0)

// Initialize sound system
const { playSound } = useSound()

// Device detection
const isMobile = ref(false)
const isMobileOrTablet = computed(() => {
  return isMobile.value || window.innerWidth <= 1024
})

// DOM references
const mainElement = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)

// 3D objects references
const characterContainer = ref<THREE.Object3D<THREE.Object3DEventMap>>()
let characterController: ReturnType<typeof useCharacterController> | null
  = null
// controller for castle & chest models
let modelsController: {
  visibleChest: (status: boolean) => void
  chestInteractions: (character: THREE.Object3D) => boolean
  chestAnimation: (() => { play: () => void, stop: () => void }) | null
  chestUpdate: (delta: number) => void
  chestPosition: (position: THREE.Vector3, rotation: THREE.Euler) => void
} | null = null

// Gate visibility
const visibleGate = ref<() => void>()
const unVisibleGate = ref<() => void>()

// select coins ref
const coinsRef = ref<InstanceType<typeof Coins> | null>(null)

// select camera ref
const cameraRef = ref<THREE.PerspectiveCamera | null>(null)

// throw coin from them chest
let throwCoinsMethod:
  | ((
    boxSize: { width: number, height: number, depth: number },
    side: 'left' | 'right',
    count?: number
  ) => void)
  | null = null
let boxSizeRef: { width: number, height: number, depth: number } | null = null

let cleanupPhysics: (() => void) | null = null

// ==========================================
// Computed Properties
// ==========================================

const stepKey = computed(() => `step${step.value}` as keyof Level[keyof Level])
const levelKey = computed(() => `level${level.value}` as keyof Level)

const currentStepData = computed(() => {
  const levelData = levels.value[levelKey.value]
  return levelData
    ? levelData[stepKey.value as 'step1' | 'step2' | 'step3' | 'step4']
    : null
})

const currentAnswer = computed(() => {
  if (!nearDoor.value || !currentStepData.value) return ''
  return currentStepData.value[nearDoor.value]?.answer || ''
})

const currentProblem = computed(() => {
  if (!nearDoor.value || !currentStepData.value) return ''
  return currentStepData.value[nearDoor.value]?.problem || ''
})

// References to 3D door models
const doorModels = reactive<DoorModels>({
  door001: { model: null },
  door002: { model: null },
  door003: { model: null },
  door004: { model: null },
})

// Game progress tracking - which doors have been solved
const openedDoors = ref<Level[]>([
  {
    id: 'level1',
    steps: {
      step1: { door001: false, door002: false, door003: false, door004: false },
      step2: { door001: false, door002: false, door003: false, door004: false },
      step3: { door001: false, door002: false, door003: false, door004: false },
      step4: { door001: false, door002: false, door003: false, door004: false },
    },
  },
  {
    id: 'level2',
    steps: {
      step1: { door001: false, door002: false, door003: false, door004: false },
      step2: { door001: false, door002: false, door003: false, door004: false },
      step3: { door001: false, door002: false, door003: false, door004: false },
      step4: { door001: false, door002: false, door003: false, door004: false },
    },
  },
])

// ==========================================
// Watchers
// ==========================================

// Show/hide treasure chest based on reward availability

const chestPosations = {
  room1: {
    posistion1: {
      x: 60.14,
      z: 432.3029,
    },
    posistion2: {
      x: -73,
      z: 432.3029,
    },
    posistion3: {
      x: 60.8881,
      z: 308.8857,
    },
    posistion4: {
      x: -72.58,
      z: 308.8857,
    },
  },
  room2: {
    posistion1: {
      x: 60.9895,
      z: 186.1586,
    },
    posistion2: {
      x: -73,
      z: 186.1586,
    },
    posistion3: {
      x: 60.8881,
      z: 62.6348,
    },
    posistion4: {
      x: -72.58,
      z: 62.6348,
    },
  },
  room3: {
    posistion1: {
      x: 60,
      z: -59.3259,
    },
    posistion2: {
      x: -73,
      z: -59.3259,
    },
    posistion3: {
      x: 60,
      z: -182.2485,
    },
    posistion4: {
      x: -72.58,
      z: -182.2485,
    },
  },
  room4: {
    posistion1: {
      x: 60,
      z: -305.2359,
    },
    posistion2: {
      x: -73,
      z: -305.2359,
    },
    posistion3: {
      x: 60,
      z: -427.753,
    },
    posistion4: {
      x: -72.58,
      z: -427.753,
    },
  },
}

const modelsVisiblity = (stepData: Step) => {
  console.log(modelsController)

  if (!modelsController) return
  modelsController.visibleChest(!!stepData.reward)

  if (!stepData.reward) return

  const roomData
    = chestPosations[stepData.reward.room as keyof typeof chestPosations]
  const positionKey = `posistion${stepData.reward.position.slice(
    -1,
  )}` as keyof typeof roomData
  modelsController.chestPosition(
    new THREE.Vector3(roomData[positionKey].x, 0, roomData[positionKey].z),
    new THREE.Euler(
      0,
      ['position1', 'position3'].includes(stepData.reward.position)
        ? -(Math.PI / 2)
        : Math.PI / 2,
      0,
    ),
  )
}

watch(currentStepData, (newData) => {
  if (!newData) return

  modelsVisiblity(newData)
})

// ==========================================
// Helper Functions
// ==========================================

/**
 * Detects if the current device is mobile/tablet based on user agent and screen size
 */
const detectDevice = () => {
  const mobileRegex
    = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  isMobile.value
    = mobileRegex.test(navigator.userAgent) || window.innerWidth <= 1024
}

/**
 * Handles window resize events for responsive behavior
 */
const handleResize = () => {
  detectDevice()
}

/**
 * Resets the character position and door rotations
 */
const resetGameState = () => {
  // Reset character position
  if (characterContainer.value) {
    characterContainer.value.position.set(0, 50, 450)
  }

  // Reset door rotations
  for (const door in doorModels) {
    const doorKey = door as keyof typeof doorModels
    doorModels[doorKey].model?.rotation.set(0, 0, -1.564)
  }

  isChestOpen.value = false

  // reset chest animation
  modelsController?.chestAnimation?.()?.stop()

  // cleanup physics
  cleanupPhysics?.()
}

// ==========================================
// Event Handlers
// ==========================================

/**
 * Handles the closing of the math challenge modal
 * @param isProblemSolved Whether the math problem was correctly solved
 */

const DOOR_OPEN_SOUND
  = '/assets/sounds/STREAMING-door-creaking-open-glitchedtones-2-2-00-01.mp3'

const closeMathModal = (isProblemSolved: boolean) => {
  isMathModalOpen.value = false

  if (isProblemSolved && nearDoor.value) {
    // Mark the door as solved in game state
    const currentStep = `step${step.value}` as keyof Level[keyof Level]
    const doorKey = nearDoor.value as keyof typeof doorModels

    if (
      openedDoors.value[level.value - 1]
      && openedDoors.value[level.value - 1].steps[
        currentStep as 'step1' | 'step2' | 'step3' | 'step4'
      ]
    ) {
      openedDoors.value[level.value - 1].steps[
        currentStep as 'step1' | 'step2' | 'step3' | 'step4'
      ][doorKey] = true
      playSound(DOOR_OPEN_SOUND, 0.7)
    }

    // Return to pointer lock on desktop
    if (
      !isMobileOrTablet.value
      && document.pointerLockElement !== container.value
    ) {
      container.value?.requestPointerLock()
    }
  }
}

/**
 * Handles door interaction events (when player presses E key or taps interact)
 */
const handleDoorInteraction = () => {
  console.log('Door interaction triggered')
  // Exit pointer lock on desktop
  if (!isMobileOrTablet.value && document.pointerLockElement) {
    document.exitPointerLock()
  }
  isMathModalOpen.value = true
}

/**
 * Handles gate interaction to progress to next step or level
 */
const handleGateInteraction = () => {
  console.log('Gate interaction triggered')

  // Prevent progressing beyond available levels
  if (level.value > openedDoors.value.length) return

  step.value += 1

  // Check if this is the final step in the level
  if (step.value === 5) {
    levelUpModal.value = true
    level.value += 1
    step.value = 1
  }

  resetGameState()
}

// Sound paths
const CHEST_OPEN_SOUND
  = '/assets/sounds/STREAMING-opening-closing-wooden-chest-joshua-chivers-1-00-04 (mp3cut.net) (1).mp3'
const COINS_GRAB_SOUND
  = '/assets/sounds/STREAMING-puff-of-magic-treasure-chest-light-smartsound-fx-1-00-04 (mp3cut.net).mp3'

const handleChestInteraction = () => {
  modelsController?.chestAnimation?.()?.play()

  // Play chest opening sound
  playSound(CHEST_OPEN_SOUND, 0.7)

  isChestOpen.value = true

  console.log('coinsRef.value')
  console.log(coinsRef.value)

  if (!currentStepData.value?.reward) return

  // Play coins grab sound and lunch coins after a short delay
  setTimeout(() => {
    launchCoins()
    playSound(COINS_GRAB_SOUND, 0.5)
  }, 1600)

  coins.value += currentStepData.value?.reward?.amount

  console.log('Chest interaction triggered')
}

/**
 * Closes the level up modal
 */
const closeLevelUpModal = () => {
  levelUpModal.value = false
}

/**
 * Handles the start of movement from mobile controls
 * @param direction The direction to move (forward, backward, left, right)
 */
const handleMoveStart = (direction: string) => {
  if (!characterController) return

  switch (direction) {
    case 'forward':
      characterController.moveState.forward = true
      break
    case 'backward':
      characterController.moveState.backward = true
      break
    case 'left':
      characterController.moveState.left = true
      break
    case 'right':
      characterController.moveState.right = true
      break
  }
}

/**
 * Handles the end of movement from mobile controls
 * @param direction The direction that stopped moving
 */
const handleMoveEnd = (direction: string) => {
  if (!characterController) return

  switch (direction) {
    case 'forward':
      characterController.moveState.forward = false
      break
    case 'backward':
      characterController.moveState.backward = false
      break
    case 'left':
      characterController.moveState.left = false
      break
    case 'right':
      characterController.moveState.right = false
      break
  }
}

// ==========================================
// Game Initialization
// ==========================================

/**
 * Initializes the character and interaction systems
 */
const initializeCharacterAndInteractions = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) => {
  characterController = useCharacterController(
    scene,
    camera,
    container.value!,
    doorModels,
    openedDoors.value,
    nearDoor,
    level,
    step,
  )

  const { gateInteractions, visible, unVisible } = useGate(scene)
  const isNearGate = ref(false)
  const isNearChest = ref(false)
  visibleGate.value = visible
  unVisibleGate.value = unVisible

  characterController.createCharacter()
  characterController.setupControls()

  const updateCharacter = characterController.updateCharacter
  const updateInteractions = updateCharacter()?.updateInteractions
  characterContainer.value = characterController.characterContainer

  // Start the character animation loop
  const clock = new THREE.Clock()

  const animateCharacter = () => {
    updateCharacter()
    if (updateInteractions) {
      updateInteractions(() => {
        if (currentStepData.value?.reward) {
          isNearChest.value
            = (modelsController?.chestInteractions(
              characterContainer.value as THREE.Object3D,
            )
            && !isChestOpen.value)
          || false
        }
        isNearGate.value
          = gateInteractions(characterContainer.value as THREE.Object3D) || false
      })
    }
    // advance chest opening animation
    modelsController?.chestUpdate(clock.getDelta())

    requestAnimationFrame(animateCharacter)
  }
  animateCharacter()

  // Watch for proximity to interactive objects
  watch(
    () => [
      characterController?.isNearDoor.value,
      isNearGate.value,
      isNearChest.value,
    ],
    (newValue, oldValue) => {
      const [newDoorStatus, newGateStatus, newChestStatus] = newValue || []
      const [oldDoorStatus, oldGateStatus, oldChestStatus] = oldValue || []

      // Update interaction prompt for gates
      if (newGateStatus !== oldGateStatus) {
        isNear.value = !!newGateStatus
        promptOperation.value = isNear.value ? 'gate' : ''
      }

      // Update interaction prompt for doors
      if (newDoorStatus !== oldDoorStatus) {
        isNear.value = !!newDoorStatus
        promptOperation.value = isNear.value ? 'door' : ''
      }

      // Update interaction prompt for chests
      if (newChestStatus !== oldChestStatus) {
        isNear.value = !!newChestStatus
        promptOperation.value = isNear.value ? 'chest' : ''
      }
    },
    { immediate: true },
  )
}

// lunch coins from the chest
const launchCoins = () => {
  if (throwCoinsMethod && boxSizeRef) {
    throwCoinsMethod(
      boxSizeRef,
      ['position1', 'position3'].includes(
        currentStepData.value?.reward?.position || '',
      )
        ? 'right'
        : 'left',
      80,
    )
  }
}

// ==========================================
// Lifecycle Hooks
// ==========================================

onMounted(async () => {
  if (!container.value) return

  console.log('Castle page mounted, initializing scene')

  // Initialize device detection
  detectDevice()
  window.addEventListener('resize', handleResize)

  // Initialize ThreeJS
  const {
    scene,
    camera,
    setupScene,
    startAnimationLoop,
    cleanup: cleanupThree,
  } = useThreeJS()

  cameraRef.value = camera.value

  // Set up the 3D scene in the container
  setupScene(container.value, modelsLoaded)

  // Load 3D models for the scene
  useModels(scene, doorModels, modelsLoaded).then((modelController) => {
    modelsController = modelController

    if (currentStepData.value) {
      modelsVisiblity(currentStepData.value)
    }
  })

  // Watch for models to finish loading
  watch(modelsLoaded, (isLoaded) => {
    if (!isLoaded) return

    console.log('Castle models loaded, initializing character controller')
    initializeCharacterAndInteractions(scene.value, camera.value)
  })

  // initialize physics
  const { initPhysics, throwCoins, updatePhysics, cleanup } = usePhysics(
    scene.value,
  )

  initPhysics()

  // create ground
  createGround(scene.value)

  // throw coins method
  throwCoinsMethod = throwCoins

  // cleanup physics
  cleanupPhysics = cleanup

  // Start the main ThreeJS rendering loop
  startAnimationLoop(() => {
    if (currentStepData.value?.reward) {
      const roomData
        = chestPosations[
          currentStepData.value.reward.room as keyof typeof chestPosations
        ]
      const positionKey
        = `posistion${currentStepData.value.reward.position.slice(
          -1,
        )}` as keyof typeof roomData

      boxSizeRef = {
        x: roomData[positionKey].x,
        y: 0,
        z: roomData[positionKey].z,
      }

      updatePhysics(boxSizeRef)
    }
  })

  // Cleanup when component unmounts
  onUnmounted(() => {
    cleanupThree()
    if (characterController) {
      characterController.cleanup()
    }
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style>
/* Game container styles */
.container {
  width: 100%;
  height: calc(100vh - 8rem);
  position: relative;
}

/* Main wrapper styles */
.main {
  position: relative;
  margin-top: 8rem;
  /* Space for header/navigation */
}
</style>
