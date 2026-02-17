<template>
  <div class="container-player w-100 d-flex flex-column align-start justify-start bg-grey100 rounded-lg pa-2">
    <div class="d-flex align-center ga-1">
      <div class="avatar-div d-flex align-center justify-center bg-grey400 rounded-circle">
        <v-icon color="primary">
          md:podcasts
        </v-icon>
      </div>
      <span class="font-weight-bold text-h6 text-grey700">{{ title }}</span>
    </div>
    <div class="w-100 d-flex px-2 mt-2">
      <v-slider
        v-model="currentTime"
        :max="duration"
        :step="0.1"
        hide-details
        color="primary"
        track-color="grey400"
        :thumb-size="16"
        @update:model-value="seekAudio"
        @mousedown="pauseForSeek"
        @mouseup="playAfterSeek"
      />
    </div>
    <div class="w-100 d-flex justify-space-between align-center  px-2">
      <span class="text-subtitle-1 font-weight-bold text-grey700">{{ formattedTime }}</span>

      <v-icon
        color="primary"
        size="30"
        @click="togglePlayback"
      >
        {{ isPlaying ? 'md:pause_circle' : 'md:play_circle' }}
      </v-icon>

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            variant="text"
            class="text-subtitle-1 font-weight-bold text-grey700"
          >
            {{ playbackRate }}x
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            v-for="rate in playbackRates"
            :key="rate"
            @click="changePlaybackRate(rate)"
          >
            <v-list-item-title>{{ rate }}x</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <audio
      ref="audioElement"
      :src="src"
      preload="metadata"
      @timeupdate="updateTime"
      @loadedmetadata="onLoadedMetadata"
      @ended="onAudioEnded"
      @pause="onPause"
      @play="onPlay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface IAudioPlayer {
  src: string
  title?: string
  autoPlay?: boolean
  loop?: boolean
}

const propsAudio = withDefaults(defineProps<IAudioPlayer>(), {
  title: 'Podcast',
  autoPlay: false,
  loop: false,
})

// Refs
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const playbackRate = ref(1.0)

// Constants
const playbackRates = [0.5, 1.0, 1.5, 2.0]

// Computed
const formattedTime = computed(() => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  return `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`
})

// Methods
const togglePlayback = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
  }
  else {
    audioElement.value.play()
  }
}

const toggleMute = () => {
  if (!audioElement.value) return

  isMuted.value = !isMuted.value
  audioElement.value.muted = isMuted.value
}

const updateTime = () => {
  if (!audioElement.value) return

  currentTime.value = audioElement.value.currentTime
}

const onLoadedMetadata = () => {
  if (!audioElement.value) return

  duration.value = audioElement.value.duration
  audioElement.value.volume = volume.value

  if (propsAudio.autoPlay) {
    audioElement.value.play()
  }
}

const seekAudio = (time: number) => {
  if (!audioElement.value) return

  audioElement.value.currentTime = time
}

const pauseForSeek = () => {
  if (!audioElement.value || !isPlaying.value) return

  audioElement.value.pause()
}

const playAfterSeek = () => {
  if (!audioElement.value || !isPlaying.value) return

  audioElement.value.play()
}

const changePlaybackRate = (rate: number) => {
  if (!audioElement.value) return

  playbackRate.value = rate
  audioElement.value.playbackRate = rate
}

const onAudioEnded = () => {
  isPlaying.value = false

  if (propsAudio.loop && audioElement.value) {
    audioElement.value.currentTime = 0
    audioElement.value.play()
  }
}

const onPause = () => {
  isPlaying.value = false
}

const onPlay = () => {
  isPlaying.value = true
}

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  if (!audioElement.value) return

  switch (event.key) {
    case ' ':
      event.preventDefault()
      togglePlayback()
      break
    case 'ArrowLeft':
      event.preventDefault()
      audioElement.value.currentTime -= 5
      break
    case 'ArrowRight':
      event.preventDefault()
      audioElement.value.currentTime += 5
      break
    case 'm':
    case 'M':
      event.preventDefault()
      toggleMute()
      break
  }
}

// Watch for src changes
watch(() => propsAudio.src, (newSrc) => {
  if (audioElement.value && newSrc) {
    audioElement.value.load()
    if (propsAudio.autoPlay) {
      setTimeout(() => audioElement.value?.play(), 100)
    }
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
})
</script>

<style scoped>
.container-player{
  max-width: 300px;
  min-height: 100px;
}
.avatar-div{
  width: 30px;
  height : 30px;
}
</style>
