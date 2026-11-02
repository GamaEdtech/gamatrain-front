<template>
  <!-- Shown after a download. Most people then open the file from here (Clarity: "Show file in new tab" was the most
       clicked button after a download), since a file saved in the background is hard to find on a phone. So opening
       it is the main action. -->
  <div class="w-100 d-flex flex-column pa-2">
    <div class="d-flex align-center ga-3 mt-2">
      <v-avatar
        color="success500"
        variant="tonal"
        size="44"
      >
        <v-icon aria-hidden="true">
          md:download_done
        </v-icon>
      </v-avatar>
      <div>
        <p class="text-h4 font-weight-bold text-grey900">
          Saved to your downloads
        </p>
        <p class="text-h6 text-grey500 mt-1">
          Can't find it? Open it here and save it from there.
        </p>
      </div>
    </div>

    <div class="d-flex flex-column flex-sm-row ga-2 mt-5">
      <v-btn
        color="primary"
        :href="link"
        target="_blank"
        rel="noopener"
        size="large"
        rounded="lg"
        flat
        prepend-icon="md:open_in_new"
        class="flex-1-1-0 text-h5 font-weight-heavy text-none"
        :disabled="!link"
      >
        Open file
      </v-btn>
      <v-btn
        variant="outlined"
        color="grey600"
        size="large"
        rounded="lg"
        class="flex-1-1-0 text-h5 font-weight-bold text-none"
        @click="emit('close')"
      >
        Done
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
