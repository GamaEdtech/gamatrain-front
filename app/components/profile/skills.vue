<template>
  <div
    class="w-100 d-flex flex-column pa-6 ga-4 bg-white"
  >
    <div class="w-100 d-flex align-center justify-space-between">
      <span class="text-h4 text-sm-h3 font-weight-bold text-grey700">Skills</span>
      <v-btn
        v-if="isEditable && data && data?.length > 0"
        flat
        color="grey100"
        size="28"
        @click="emit('editSkill')"
      >
        <v-icon
          color="grey500"
          size="20"
        >
          md:edit
        </v-icon>
      </v-btn>
    </div>

    <div
      v-if="data && data?.length > 0"
      class="d-flex flex-wrap ga-4"
    >
      <v-chip
        v-for="(item, index) in data"
        :key="index"
        variant="flat"
        color="primary50"
      >
        <span class="text-h5 font-weight-medium text-primary">
          {{ item }}
        </span>
      </v-chip>
    </div>
    <div
      v-else
      class="w-100 d-flex align-center justify-space-between"
    >
      <span class="text-h6 font-weight-regular text-grey500">
        No skills added yet!
      </span>

      <v-btn
        v-if="isEditable"
        flat
        color="grey700"
        rounded="pill"
        class="text-h6 text-white font-weight-medium"
        width="84"
        height="24"
        @click="emit('editSkill')"
      >
        Add skills
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ISkills {
  data?: string[] | null
  isEditable: boolean
}

defineProps<ISkills>()
const emit = defineEmits(['editSkill'])
</script>

<style scoped>
</style>
