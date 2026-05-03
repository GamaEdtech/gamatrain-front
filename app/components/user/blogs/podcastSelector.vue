<template>
  <div class="w-100 d-flex flex-column align-start justify-start">
    <span class="w-50 text-h5 font-weight-medium text-grey700 mt-1">
      Podcast
    </span>

    <v-skeleton-loader
      v-if="loading"
      class="w-100 mt-2 rounded-lg"
      height="40"
    />
    <div
      v-if="podcastPreview && !loading"
      class="mt-2 w-100"
    >
      <audio
        controls
        :src="podcastPreview as string"
      />
    </div>
    <div class="w-100 d-flex justify-space-between align-center mt-2">
      <v-btn
        color="white"
        rounded="pill"
        variant="flat"
        class="text-grey900 font-weight-medium text-h5 border-grey400 border-solid border-md"
        @click="triggerPodcastUpload"
      >
        {{ podcastPreview ? "Change Podcast" : "Upload Podcast" }}
      </v-btn>
      <v-btn
        icon
        flat
        variant="text"
        :disabled="!podcastPreview"
        @click="deletePodcast"
      >
        <v-icon
          size="large"
          color="grey500"
        >
          md:delete
        </v-icon>
      </v-btn>
      <input
        ref="podcastInput"
        type="file"
        accept="audio/*"
        style="display: none"
        @change="onPoscastSelected"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
interface IPodcastSelector {
  podcast: string | File | null
  loading?: boolean
}

const props = withDefaults(defineProps<IPodcastSelector>(), {
  loading: false,
})
const emit = defineEmits(['update:podcast'])
const podcastLocal = ref(props.podcast)
const podcastPreview = ref(props.podcast)
const podcastInput = ref<HTMLInputElement>()

watch(
  () => props.podcast,
  (val) => {
    podcastLocal.value = val
    if (typeof val == 'string') {
      podcastPreview.value = val
    }
  },
)

const triggerPodcastUpload = () => {
  (podcastInput.value as HTMLInputElement).click()
}

const onPoscastSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    podcastPreview.value = URL.createObjectURL(file)
    podcastLocal.value = file
    emit('update:podcast', podcastLocal.value)
  }
}

const deletePodcast = () => {
  podcastPreview.value = ''
  podcastLocal.value = ''
  emit('update:podcast', podcastLocal.value)
}
</script>

<style scoped>
</style>
