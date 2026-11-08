<template>
  <section
    class="audio-player w-100 bg-inverseSurface rounded-lg pa-3 pa-sm-4"
    :aria-label="`Podcast: ${title}`"
  >
    <div class="d-flex align-center ga-3">
      <v-btn
        icon
        color="primary"
        size="large"
        :loading="isBuffering"
        :aria-label="hasError ? 'Retry' : isPlaying ? 'Pause' : 'Play'"
        @click="togglePlayback"
      >
        <v-icon
          :icon="hasError ? 'md:refresh' : isPlaying ? 'md:pause' : 'md:play_arrow'"
          size="28"
        />
      </v-btn>

      <div class="audio-player__info flex-grow-1">
        <div class="d-flex align-center ga-1 text-caption text-onInverseSurfaceSubtle">
          <v-icon
            icon="md:headphones"
            size="14"
          />
          Podcast
        </div>
        <div
          v-if="hasError"
          class="text-body-2 font-weight-bold text-white text-truncate"
          role="status"
        >
          Couldn’t load the audio
        </div>
        <div
          v-else
          class="text-body-2 font-weight-bold text-white text-truncate"
        >
          Listen to this post
        </div>
      </div>

      <div class="d-flex align-center flex-shrink-0">
        <v-btn
          icon
          variant="text"
          color="white"
          class="d-none d-sm-inline-flex"
          aria-label="Back 10 seconds"
          @click="skip(-10)"
        >
          <v-icon icon="md:replay_10" />
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="white"
          class="d-none d-sm-inline-flex"
          aria-label="Forward 10 seconds"
          @click="skip(10)"
        >
          <v-icon icon="md:forward_10" />
        </v-btn>
        <v-btn
          variant="text"
          color="white"
          height="48"
          min-width="48"
          class="px-2 text-none font-weight-bold"
          :aria-label="`Playback speed ${playbackRate}x, change`"
          @click="cyclePlaybackRate"
        >
          {{ playbackRate }}×
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="white"
          class="d-none d-sm-inline-flex"
          :aria-label="isMuted ? 'Unmute' : 'Mute'"
          @click="toggleMute"
        >
          <v-icon :icon="isMuted ? 'md:volume_off' : 'md:volume_up'" />
        </v-btn>
      </div>
    </div>

    <div class="d-flex align-center ga-3 mt-2 text-caption text-onInverseSurfaceSubtle">
      <span class="audio-player__time text-end">{{ formatTime(currentTime) }}</span>
      <v-slider
        :model-value="currentTime"
        :max="duration || 1"
        :step="1"
        :disabled="!duration"
        color="primary"
        track-color="onInverseSurfaceMuted"
        :thumb-size="14"
        hide-details
        class="mx-0"
        aria-label="Seek"
        @start="onSeekStart"
        @update:model-value="onSeekInput"
        @end="onSeekEnd"
      />
      <span class="audio-player__time">{{ duration ? formatTime(duration) : '--:--' }}</span>
    </div>

    <audio
      ref="audioElement"
      :src="src"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @durationchange="readDuration"
      @waiting="isBuffering = true"
      @playing="isBuffering = false"
      @ended="onAudioEnded"
      @error="onAudioError"
      @pause="isPlaying = false"
      @play="isPlaying = true"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface IAudioPlayer {
  src: string
  title?: string
  autoPlay?: boolean
  loop?: boolean
}

const props = withDefaults(defineProps<IAudioPlayer>(), {
  title: 'Podcast',
  autoPlay: false,
  loop: false,
})

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75]

const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isBuffering = ref(false)
const isMuted = ref(false)
const hasError = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1)
// While the seek bar is dragged it owns the position, and playback waits until it is let go.
const isSeeking = ref(false)
let resumeAfterSeek = false

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const togglePlayback = () => {
  const audio = audioElement.value
  if (!audio) return
  if (hasError.value) {
    hasError.value = false
    audio.load()
  }
  if (audio.paused) audio.play().catch(() => {})
  else audio.pause()
}

const skip = (seconds: number) => {
  const audio = audioElement.value
  if (!audio) return
  audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration.value || audio.currentTime)
  currentTime.value = audio.currentTime
}

const cyclePlaybackRate = () => {
  const next = PLAYBACK_RATES[(PLAYBACK_RATES.indexOf(playbackRate.value) + 1) % PLAYBACK_RATES.length]!
  playbackRate.value = next
  if (audioElement.value) audioElement.value.playbackRate = next
}

const toggleMute = () => {
  if (!audioElement.value) return
  isMuted.value = !isMuted.value
  audioElement.value.muted = isMuted.value
}

const onSeekStart = () => {
  isSeeking.value = true
  resumeAfterSeek = isPlaying.value
  audioElement.value?.pause()
}

// Dragging only moves the bar; a keyboard step (no start/end events) seeks at once.
const onSeekInput = (time: number) => {
  currentTime.value = time
  if (!isSeeking.value && audioElement.value) audioElement.value.currentTime = time
}

const onSeekEnd = (time: number) => {
  isSeeking.value = false
  const audio = audioElement.value
  if (!audio) return
  audio.currentTime = time
  if (resumeAfterSeek) audio.play()
}

const onTimeUpdate = () => {
  if (audioElement.value && !isSeeking.value) currentTime.value = audioElement.value.currentTime
}

const readDuration = () => {
  const audio = audioElement.value
  if (audio && isFinite(audio.duration) && audio.duration > 0) duration.value = audio.duration
}

const onLoadedMetadata = () => {
  const audio = audioElement.value
  if (!audio) return
  readDuration()
  audio.playbackRate = playbackRate.value
  if (props.autoPlay) audio.play()
}

// The server-rendered <audio> can load its metadata before hydration attaches the listener above.
onMounted(() => {
  if (audioElement.value && audioElement.value.readyState >= 1) onLoadedMetadata()
})

const onAudioError = () => {
  hasError.value = true
  isBuffering.value = false
  isPlaying.value = false
}

const onAudioEnded = () => {
  isPlaying.value = false
  if (props.loop && audioElement.value) {
    audioElement.value.currentTime = 0
    audioElement.value.play()
  }
}

watch(() => props.src, (newSrc) => {
  if (!audioElement.value || !newSrc) return
  currentTime.value = 0
  duration.value = 0
  hasError.value = false
  audioElement.value.load()
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
})
</script>

<style scoped>
/* Lets the label truncate instead of pushing the controls off a narrow card. */
.audio-player__info {
  min-width: 0;
}

/* Fixed width so the seek bar doesn't jump as the time gains digits. */
.audio-player__time {
  min-width: 2.75rem;
  font-variant-numeric: tabular-nums;
}
</style>
