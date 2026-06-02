<template>
  <div class="w-100 d-flex flex-column align-center pa-4">
    <span class="w-100 text-h5 text-grey700 font-weight-regular mb-4">
      Is this the school you worked at?
    </span>
    <div
      class="w-100 d-flex justify-center"
      @click.prevent
    >
      <school-card-mobile :school="school" />
    </div>

    <div class="w-100 d-flex justify-center align-center ga-2 mt-10">
      <v-btn
        to="/school/add"
        variant="text"
        height="38"
        width="140"
        class="text-h5 font-weight-medium text-grey700"
        flat
      >
        No, it’s New!
      </v-btn>
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="120"
        class="text-h5 text-grey700 font-weight-medium"
        flat
        @click="emit('confirm')"
      >
        Yes
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SchoolListDTO } from '@/types'

interface IModalSchoolConfirm {
  school: SchoolListDTO
}

defineProps<IModalSchoolConfirm>()
const emit = defineEmits(['confirm'])
</script>

<style scoped>
</style>
