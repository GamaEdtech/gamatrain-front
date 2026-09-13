<template>
  <v-card
    class="w-100 mt-4 pa-4"
    flat
    rounded="lg"
    border
  >
    <div class="w-100 d-flex align-center justify-space-between ga-2 flex-wrap">
      <div class="d-flex align-center ga-2">
        <v-icon
          color="primary"
          size="24"
        >
          md:assignment
        </v-icon>
        <span class="text-h5 text-grey700 font-weight-bold">Overview</span>
      </div>

      <v-chip
        :color="isComplete ? 'success' : 'warning'"
        variant="flat"
        class="font-weight-bold text-h5"
      >
        {{ isComplete ? 'Complete' : 'Incomplete' }}
      </v-chip>
    </div>

    <div class="w-100 d-flex flex-wrap ga-2 mt-4">
      <v-card
        class="flex-grow-1 pa-3 d-flex align-center ga-3"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="180"
      >
        <v-avatar
          size="64"
          color="grey100"
        >
          <v-img
            v-if="user?.avatarUri"
            :src="user?.avatarUri"
            :alt="fullName"
          />
          <v-icon
            v-else
            size="28"
            color="grey500"
          >
            md:person
          </v-icon>
        </v-avatar>

        <div class="min-w-0">
          <div class="text-grey800 text-h5 font-weight-bold text-truncate">
            {{ fullName }}
          </div>
          <div class="text-grey500 text-h6 mt-1">
            Code: {{ contentData?.exam.code }}
          </div>
        </div>
      </v-card>

      <v-card
        v-for="item in overviewItems"
        :key="item.label"
        class="pa-3 d-flex flex-column ga-1 flex-grow-1"
        color="grey100"
        flat
        rounded="lg"
        border
        min-width="180"
      >
        <span class="text-grey500 text-h6 font-weight-medium">{{ item.label }}</span>
        <span class="text-grey800 text-h5 font-weight-bold">{{ item.value }}</span>
      </v-card>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamResultDetailDTO } from '@/types'

const props = defineProps<{
  contentData: ExamResultDetailDTO | null
}>()

const { user } = useUser()
const fullName = useFullName(user.value!)

// const participantName = computed(() => {
//   const user = props.contentData?.user
//   return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || '-'
// })

const isComplete = computed(() => Number(props.contentData?.userData.status) === 1)

const overviewItems = computed(() => {
  const data = props.contentData
  if (!data) return []

  return [
    { label: 'Started at', value: data.userData.subdate_jalali || data.userData.subdate },
    { label: 'Test duration', value: `${data.exam.azmoon_time} min` },
    { label: 'Response time', value: formatSeconds(data.userData.submit_time) },
    { label: 'Score', value: data.userData.result_score },
    { label: 'Questions', value: data.exam.tests_num },
    { label: 'Result ID', value: data.userData.id },
  ]
})

const formatSeconds = (value: string | number) => {
  const totalSeconds = Number(value)
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0 seconds'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = []

  if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  if (seconds || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`)

  return parts.join(' and ')
}
</script>
