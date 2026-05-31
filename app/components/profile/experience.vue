<template>
  <div
    class="w-100 d-flex flex-column pa-6 ga-4 bg-white"
  >
    <div class="w-100 d-flex align-center justify-space-between">
      <span class="text-h4 text-sm-h3 font-weight-bold text-grey700">Experience</span>
      <v-btn
        v-if="isEditable && data.length > 0"
        flat
        color="grey100"
        size="28"
        @click="emit('add')"
      >
        <v-icon
          color="grey500"
          size="20"
        >
          md:add
        </v-icon>
      </v-btn>
    </div>

    <div
      v-if="data.length > 0"
      class="d-flex flex-column ga-6 mt-4"
    >
      <template
        v-for="(item, index) in data"
        :key="index"
      >
        <div
          class="w-100 d-flex align-start justify-start ga-1 flex-column"
        >
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-h5 text-sm-h4 text-grey700 font-weight-bold">{{ item.schoolTitle }}</span>
            <div class="d-flex align-center ga-2">
              <v-btn
                v-if="isEditable"
                flat
                color="grey100"
                size="20"
                @click="deleteItem(item.id)"
              >
                <v-icon
                  color="grey500"
                  size="16"
                >
                  md:delete
                </v-icon>
              </v-btn>
              <v-btn
                v-if="isEditable"
                flat
                color="grey100"
                size="20"
                @click="editItem(item)"
              >
                <v-icon
                  color="grey500"
                  size="16"
                >
                  md:edit
                </v-icon>
              </v-btn>
            </div>
          </div>
          <span class="text-h6 text-grey400 font-weight-regular"> {{ formatDateRange(item.startDate, item.endDate) }}</span>

          <div class="d-flex flex-column ga-2 mt-2">
            <span
              v-for="(desc, descIndex) in getDescriptions(item.description)"
              :key="descIndex"
              class="d-flex align-center justify-start ga-3 text-grey700 font-weight-medium text-h6"
            >
              <div class="dot-div rounded-circle bg-grey700" />

              {{ desc }}
            </span>
          </div>
        </div>
        <v-divider
          v-if="index != data.length - 1 "
          color="grey300"
          class="border-opacity-100"
        />
      </template>
    </div>

    <div
      v-else
      class="w-100 d-flex align-center justify-space-between"
    >
      <span class="text-h6 font-weight-regular text-grey500">
        No experience added yet!
      </span>

      <v-btn
        flat
        color="grey700"
        rounded="pill"
        class="text-h6 text-white font-weight-medium"
        width="110"
        height="24"
        @click="emit('add')"
      >
        Add experience
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ExperienceDTO } from '@/types'

interface IExperience {
  data: ExperienceDTO[]
  isEditable: boolean
}

defineProps<IExperience>()
const emit = defineEmits(['edit', 'add', 'delete'])

const formatDateRange = (
  startDate: string,
  endDate: string,
) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  const formattedStart = start.format('MMM YYYY')
  const formattedEnd = end.format('MMM YYYY')

  const yearsDiff = end.diff(start, 'year')
  const monthsDiff = end.diff(start, 'month') % 12

  let duration = ''

  if (yearsDiff > 0) {
    duration += `${yearsDiff} yr${yearsDiff > 1 ? 's' : ''} `
  }

  if (monthsDiff > 0) {
    duration += `${monthsDiff} mo${monthsDiff > 1 ? 's' : ''}`
  }

  return `${formattedStart} - ${formattedEnd} - ${duration.trim()}`
}

const getDescriptions = (
  description: string,
) => {
  return description
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

const deleteItem = (id: number) => {
  emit('delete', id)
}

const editItem = (item: ExperienceDTO) => {
  emit('edit', item)
}
</script>

<style scoped>
.dot-div{
  min-width : 6px;
  min-height : 6px
}
</style>
