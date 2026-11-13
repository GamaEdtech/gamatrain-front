<template>
  <v-card
    flat
    rounded="lg"
    border
    tag="section"
    class="pa-4 pa-sm-6 privacy-card"
    aria-labelledby="privacy-card-title"
  >
    <h2
      id="privacy-card-title"
      class="text-h6 font-weight-bold text-grey900"
    >
      Who can see your profile
    </h2>
    <p class="ma-0 mt-1 text-body-2 text-grey600">
      Saved as soon as you choose.
    </p>

    <v-radio-group
      :model-value="visibility"
      class="mt-3"
      hide-details
      :disabled="saving || !user"
      aria-labelledby="privacy-card-title"
      @update:model-value="change"
    >
      <v-radio
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        color="secondary"
        class="privacy-card__option"
      >
        <template #label>
          <span class="d-flex flex-column py-2">
            <span class="font-weight-bold text-grey900">{{ option.title }}</span>
            <span class="text-body-2 text-grey600">{{ option.hint }}</span>
          </span>
        </template>
      </v-radio>
    </v-radio-group>
  </v-card>
</template>

<script setup lang="ts">
import type { ProfileVisibility } from '@/types'

const { user, setUser } = useUser()
const { editItem } = useProfile()
const { $toast } = useNuxtApp()

const saving = ref(false)
const visibility = computed(() => user.value?.profileVisibility ?? 'Private')

const options: { value: ProfileVisibility, title: string, hint: string }[] = [
  { value: 'Public', title: 'Public', hint: 'Anyone can open your profile, and your school page can show your name if you choose.' },
  { value: 'ConnectionsOnly', title: 'Connections only', hint: 'Only people you\'re connected with can open your profile.' },
  { value: 'Private', title: 'Private', hint: 'Only you can see your profile. You\'re never named on a school page.' },
]

async function change(value: unknown) {
  const next = value as ProfileVisibility
  if (!user.value || next === visibility.value) return
  saving.value = true
  const response = await editItem({ profileVisibility: next })
  saving.value = false
  if (response?.succeeded) {
    setUser({ ...user.value, profileVisibility: next })
    $toast.success('Saved. Your profile is now ' + options.find(t => t.value === next)?.title.toLowerCase() + '.')
  }
}
</script>

<style scoped>
.privacy-card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.privacy-card__option + .privacy-card__option {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}
</style>
