<template>
  <div class="w-100 d-flex flex-column ga-3">
    <v-row
      v-if="loading && !items.length"
      dense
    >
      <v-col
        v-for="i in 4"
        :key="i"
        cols="12"
        sm="6"
        lg="3"
      >
        <v-skeleton-loader
          height="132"
          class="rounded-xl"
        />
      </v-col>
    </v-row>

    <template v-else>
      <v-row
        v-if="waiting.length"
        dense
      >
        <v-col
          v-for="item in waiting"
          :key="item.key"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-card
            :to="item.link"
            hover
            border
            flat
            rounded="xl"
            class="h-100 pa-4 d-flex flex-column ga-3"
          >
            <div class="d-flex align-center ga-3">
              <v-avatar
                :color="item.toneColor"
                variant="tonal"
                rounded="lg"
                size="36"
              >
                <v-icon size="20">
                  {{ item.icon }}
                </v-icon>
              </v-avatar>
              <span class="text-h6 font-weight-medium text-grey600 text-truncate flex-grow-1">{{ item.label }}</span>
              <v-icon
                size="18"
                color="grey400"
              >
                md:arrow_forward
              </v-icon>
            </div>

            <span class="text-h2 font-weight-bold text-grey800">{{ item.count.toLocaleString('en-US') }}</span>

            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-if="item.newLast7Days"
                color="error"
                variant="tonal"
                size="small"
                class="text-h6 font-weight-bold"
              >
                +{{ item.newLast7Days }} this week
              </v-chip>
              <v-chip
                v-if="item.oldestDate"
                :color="item.overdue ? 'warning' : 'grey600'"
                variant="tonal"
                size="small"
                class="text-h6 font-weight-bold"
              >
                oldest {{ fromNowLocal(item.oldestDate) }}
              </v-chip>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div
        v-if="clear.length"
        class="d-flex flex-wrap align-center ga-2"
      >
        <v-icon
          color="success"
          size="18"
        >
          md:check_circle
        </v-icon>
        <span class="text-h6 text-grey500">
          {{ waiting.length ? 'All clear:' : 'All caught up, nothing is waiting.' }}
        </span>
        <template v-if="waiting.length">
          <v-chip
            v-for="item in clear"
            :key="item.key"
            :to="item.link"
            variant="tonal"
            color="grey600"
            size="small"
            class="text-h6"
          >
            {{ item.label }}
          </v-chip>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { AttentionItemDTO } from '@/types'
import { ATTENTION_OVERDUE_DAYS, ATTENTION_QUEUES } from '~/constants'

const props = defineProps<{
  items: AttentionItemDTO[]
  loading: boolean
}>()

const { local, fromNowLocal } = useDateTime()

const decorated = computed(() => props.items.map((item) => {
  const meta = ATTENTION_QUEUES[item.key]
  const overdue = !!item.oldestDate && (local(item.oldestDate)?.isBefore(dayjs().subtract(ATTENTION_OVERDUE_DAYS, 'day')) ?? false)
  // Fresh items are the ones to act on today; an old backlog with nothing new is a warning, not an alarm.
  const toneColor = item.newLast7Days > 0 ? 'error' : overdue ? 'warning' : 'info'
  return { ...item, ...meta, overdue, toneColor }
}))

const waiting = computed(() => decorated.value
  .filter(t => t.count > 0)
  .sort((a, b) => b.newLast7Days - a.newLast7Days || b.count - a.count))

const clear = computed(() => decorated.value.filter(t => t.count === 0))
</script>
