<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    transition="scale-transition"
  >
    <template #activator="{ props: menuProps }">
      <v-text-field
        :model-value="display"
        :label="label"
        :rules="rules"
        :hint="hint"
        :persistent-hint="!!hint"
        readonly
        variant="outlined"
        prepend-inner-icon="md:event"
        v-bind="menuProps"
      />
    </template>
    <v-card
      rounded="xl"
      class="pa-2"
    >
      <div class="date-time-field__pickers">
        <v-date-picker
          v-model="date"
          color="primary"
          hide-header
          show-adjacent-months
        />
        <v-time-picker
          v-model="time"
          color="primary"
          format="24hr"
          hide-header
        />
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!date"
          @click="apply"
        >
          Done
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
// A date and a time picked with Vuetify's date and time pickers (the site's look, not the browser's own input). The
// value is local time as "YYYY-MM-DDTHH:mm", the same as a datetime-local input, so callers convert it like one.
type Rule = (value: string) => boolean | string

defineProps<{ label: string, rules?: Rule[], hint?: string }>()
const model = defineModel<string>({ default: '' })

const open = ref(false)
const date = ref<Date | null>(null)
const time = ref('00:00')

const pad = (n: number) => String(n).padStart(2, '0')

// Shown as "27 Nov 2026, 00:00" in the browser's language.
const display = computed(() => {
  if (!model.value) return ''
  const value = new Date(model.value)
  return Number.isNaN(value.getTime()) ? '' : value.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short', hour12: false })
})

// Opening starts from the current value (or today at midnight).
watch(open, (isOpen) => {
  if (!isOpen) return
  const value = model.value ? new Date(model.value) : null
  date.value = value && !Number.isNaN(value.getTime()) ? value : new Date()
  time.value = value && !Number.isNaN(value.getTime()) ? `${pad(value.getHours())}:${pad(value.getMinutes())}` : '00:00'
})

const apply = () => {
  if (!date.value) return
  const day = date.value
  model.value = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}T${time.value || '00:00'}`
  open.value = false
}
</script>

<style scoped>
.date-time-field__pickers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
