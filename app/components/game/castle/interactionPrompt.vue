<template>
  <v-fade-transition>
    <v-card
      v-if="isNear"
      class="door-interaction-prompt"
      elevation="10"
      color="primary"
      rounded="lg"
    >
      <v-card-text class="pa-4 text-center">
        <div class="d-flex align-center justify-center mb-2">
          <v-icon
            :icon="currentPrompt.icon"
            size="large"
            class="mr-2"
          />
          <span class="text-h6 font-weight-medium">{{ currentPrompt.name }} Interaction</span>
        </div>

        <v-divider class="my-2" />

        <p
          v-if="isMobile"
          class="mb-2"
        >
          {{ currentPrompt.target.phone.text }}
        </p>
        <p
          v-else
          class="mb-2"
        >
          Press <kbd>{{ currentPrompt.key }}</kbd> {{ currentPrompt.target.pc }}
        </p>

        <v-btn
          variant="flat"
          color="white"
          class="mt-2 text-grey-darken-3 font-weight-bold"
          block
          @click="handleKeyPress"
        >
          <v-icon start>
            mdi-keyboard
          </v-icon>
          <span v-if="!isMobile">Press {{ currentPrompt.key }} key</span>
          <span v-else>{{ currentPrompt.target.phone.button }}</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display'

interface Opration {
  icon: string
  name: string
  key: string
  target: {
    phone: {
      text: string
      button: string
    }
    pc: string
  }

}

interface Oprations {
  gate: Opration
  door: Opration
  chest: Opration
}

const isMobile = useDisplay().mobile.value

const props = defineProps<{
  isNear: boolean
  opration: string
}>()

const oprations: Oprations = {
  door: {
    icon: 'mdi-door-open',
    name: 'Door',
    key: 'E',
    target: {
      phone: {
        text: 'Press below button to fix math problem and open the door',
        button: 'Fix problem',
      },
      pc: 'to fix math problem and open the door',
    },
  },
  gate: {
    icon: 'mdi-page-next',
    name: 'Gate',
    key: 'N',
    target: {
      phone: {
        text: 'Press below button to go to next step',
        button: 'Next step',
      },
      pc: 'go to next step',
    },
  },
  chest: {
    icon: 'mdi-treasure-chest',
    name: 'Chest',
    key: 'F',
    target: {
      phone: {
        text: 'Press below button to open the chest',
        button: 'Open chest',
      },
      pc: 'to open the chest',
    },
  },
}

const currentPrompt = computed(() => oprations[props.opration as 'door'])

const emit = defineEmits(['doorInteraction', 'gateInteraction', 'chestInteraction'])

// Handle keyboard interaction
const handleKeyPress = (event: KeyboardEvent) => {
  if (isMobile && props.isNear) {
    if (props.opration === 'door') {
      emit('doorInteraction')
    }
    else if (props.opration === 'gate') {
      emit('gateInteraction')
    }
    else if (props.opration === 'chest') {
      emit('chestInteraction')
    }
  }
  else {
    if (event.code === 'KeyE' && props.isNear && props.opration === 'door') {
      console.log('Door interaction triggered via E key')
      emit('doorInteraction')
    }
    else if (event.code === 'KeyN' && props.isNear) {
      console.log('Gate interaction triggered via N key')
      emit('gateInteraction')
    }
    else if (event.code === 'KeyF' && props.isNear && props.opration === 'chest') {
      console.log('Chest interaction triggered via F key')
      emit('chestInteraction')
    }
  }
}

// Setup and cleanup keyboard listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
  console.log('Door interaction component mounted, listening for key E')
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

// Debug log when door proximity changes
watch(() => props.isNear, (newValue) => {
  console.log('Door proximity changed in component:', newValue)
})
</script>

<style>
.door-interaction-prompt {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, -120%);
    max-width: 350px;
    width: 90%;
    z-index: 9999;
    /* Ensure it's on top of everything */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    opacity: 1 !important;
}

kbd {
    background-color: #ffd574;
    color: black;
    padding: 3px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: bold;
    display: inline-block;
    margin: 0 4px;
}
</style>
