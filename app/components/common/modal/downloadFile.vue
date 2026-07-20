<template>
  <div
    class="w-100 d-flex flex-wrap flex-column bg-white pa-2"
  >
    <span class="text-h5 text-sm-h4 font-weight-bold text-grey700 mt-4"> Your download is ready and saved on your device!</span>

    <span class="text-h6 font-weight-medium text-grey400 mt-1">  If the file doesn't save to your device, click here to open it in a new tab and download it manually.</span>

    <div class="w-100 d-flex align-center justify-center ga-2 mt-4">
      <v-btn
        color="primary"
        :href="link"
        target="_blank"
        variant="text"
        class="text-h5 font-weight-medium"
      >
        Show file in new tab
      </v-btn>
      <v-btn
        variant="text"
        class="text-h5 font-weight-medium"
        @click="emit('close')"
      >
        Close
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IModalDownloadFile {
  link: string
}

defineProps<IModalDownloadFile>()

const emit = defineEmits(['close'])
</script>

<style scoped>

</style>
