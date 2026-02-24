<template>
  <div class="container-player w-100 d-flex align-center justify-center bg-grey700 rounded-lg pa-2">
    <v-icon
      color="white"
      size="24"
      @click="togglePlayback"
    >
      {{ isPlaying ? 'md:pause' : 'md:play_arrow' }}
    </v-icon>
    <div class="w-75 d-flex px-2">
      <v-slider
        v-model="currentTime"
        :max="duration"
        :step="0.1"
        hide-details
        track-fill-color="primary"
        track-color="grey200"
        thumb-color="white"
        :thumb-size="16"
        @update:model-value="seekAudio"
        @mousedown="pauseForSeek"
        @mouseup="playAfterSeek"
      />
    </div>
    <span class="text-subtitle-2 text-sm-h6 font-weight-bold text-white mr-1 text-no-wrap">{{ formattedTime }}</span>
    <v-icon
      color="white"
      size="20"
      @click="toggleMute"
    >
      {{ isMuted ? 'md:volume_off' : 'md:volume_up' }}
    </v-icon>

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
const syncMetadata = () => {
  const audio = audioElement.value
  if (!audio) return

  if (isFinite(audio.duration) && audio.duration > 0) {
    duration.value = audio.duration
  }

  currentTime.value = audio.currentTime || 0
}

const togglePlayback = () => {
  if (!audioElement.value) return

  if (!duration.value || !isFinite(duration.value)) {
    syncMetadata()
  }

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
  height: 64px;
}
.avatar-div{
  width: 30px;
  height : 30px;
}
</style>
