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
        <span class="text-body-1 text-grey700 font-weight-bold">Overview</span>
      </div>

      <v-chip
        :color="isComplete ? 'success' : 'warning'"
        variant="flat"
        class="font-weight-bold text-body-1"
      >
        {{ isComplete ? 'Complete' : 'Incomplete' }}
      </v-chip>
    </div>

    <v-row
      no-gutters
      class="w-100 flex-grow-0 mt-4 bg-grey100 rounded-lg border-grey300 border-sm border-opacity-100"
    >
      <v-col
        cols="12"
        sm="4"
        md
        class="pa-3 d-flex align-center ga-3 min-w-0"
      >
        <v-avatar
          size="64"
          color="grey100"
        >
          <v-img
            v-if="contentData?.user.avatar"
            :src="contentData?.user.avatar"
            :alt="participantName"
          />
          <v-icon
            v-else
            size="28"
            color="grey500"
          >
            md:person
          </v-icon>
        </v-avatar>

        <div class="min-w-0 d-flex flex-column">
          <span class="text-grey800 text-body-1 font-weight-bold text-truncate">
            {{ participantName }}
          </span>
          <span class="text-grey500 text-caption font-weight-medium mt-1">
            Code: {{ contentData?.exam.code }}
          </span>
        </div>
      </v-col>

      <v-col
        v-for="item in overviewItems"
        :key="item.label"
        cols="12"
        sm="4"
        md
        class="pa-3 d-flex flex-column align-start justify-center ga-1"
      >
        <span class="text-grey500 text-caption font-weight-medium">
          <v-icon class="mr-2">{{ item.icon }}</v-icon>
          {{ item.label }}</span>
        <span class="text-grey800 text-body-1 font-weight-bold pl-8">{{ item.value }}</span>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { ExamResultDetailDTO } from '@/types'

const props = defineProps<{
  contentData: ExamResultDetailDTO | null
}>()

const participantName = computed(() => {
  const user = props.contentData?.user
  return `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || '-'
})

const isComplete = computed(() => Number(props.contentData?.userData.status) === 1)

const overviewItems = computed(() => {
  const data = props.contentData
  if (!data) return []

  return [
    { label: 'Started at', value: data.userData.subdate_jalali || data.userData.subdate, icon: 'md:calendar_month_outlined' },
    { label: 'Duration', value: `${data.exam.azmoon_time} min`, icon: 'md:schedule_outlined' },
    { label: 'Response time', value: formatResponseTime(data.userData.submit_time, data.exam.azmoon_time), icon: 'md:electric_bolt' },
    { label: 'Result ID', value: data.userData.id, icon: 'md:article_outlined' },
  ]
})

const TEHRAN_OFFSET_SECONDS = 3.5 * 60 * 60

const formatResponseTime = (value: string | number, durationMinutes: string | number) => {
  const totalSeconds = Number(value)
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '-'
  if (totalSeconds === 0) return '0 seconds'

  const durationSeconds = Number(durationMinutes) * 60
  const correctedSeconds = totalSeconds - TEHRAN_OFFSET_SECONDS
  const shouldApplyTimezoneFix
    = Number.isFinite(durationSeconds)
      && durationSeconds > 0
      && totalSeconds > durationSeconds
      && correctedSeconds >= 0
      && correctedSeconds <= durationSeconds

  return formatSeconds(shouldApplyTimezoneFix ? correctedSeconds : totalSeconds)
}

const formatSeconds = (value: number) => {
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = value % 60
  const parts = []

  if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  if (seconds || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`)

  if (parts.length <= 2) return parts.join(' and ')

  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
}
</script>
