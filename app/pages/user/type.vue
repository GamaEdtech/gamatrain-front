<template>
  <v-container class="role-page d-flex flex-column align-center py-8 py-sm-12">
    <div class="text-center mb-8">
      <h1 class="text-h5 text-sm-h4 font-weight-bold text-grey800">
        How will you use GamaTrain?
      </h1>
      <p class="text-body-1 text-grey600 mt-2 mb-0">
        Pick one, and we'll set up your dashboard for it.
      </p>
    </div>

    <div
      class="role-options d-flex flex-column flex-sm-row ga-4 w-100"
      role="radiogroup"
      aria-label="Your role"
    >
      <v-card
        v-for="role in roles"
        :key="role.value"
        role="radio"
        :aria-checked="selectedUserGroup === role.value"
        tabindex="0"
        rounded="xl"
        :border="selectedUserGroup === role.value ? 'primary md opacity-100' : true"
        :color="selectedUserGroup === role.value ? 'primary' : undefined"
        :variant="selectedUserGroup === role.value ? 'tonal' : 'flat'"
        class="role-card flex-1-1 pa-5 d-flex flex-column align-center text-center"
        @click="selectedUserGroup = role.value"
        @keydown.enter.prevent="selectedUserGroup = role.value"
        @keydown.space.prevent="selectedUserGroup = role.value"
      >
        <div class="d-flex justify-center mb-3">
          <img
            v-for="(image, index) in role.images"
            :key="image"
            :src="image"
            alt=""
            width="56"
            height="56"
            :class="{ 'ml-n4': index > 0 }"
          >
        </div>
        <div class="d-flex align-center ga-2">
          <v-icon
            :color="selectedUserGroup === role.value ? 'primary' : 'grey500'"
            size="20"
          >
            {{ selectedUserGroup === role.value ? 'md:radio_button_checked' : 'md:radio_button_unchecked' }}
          </v-icon>
          <span class="text-h6 font-weight-bold text-grey800">{{ role.title }}</span>
        </div>
        <p class="text-body-2 text-grey600 mt-2 mb-0">
          {{ role.description }}
        </p>
      </v-card>
    </div>

    <v-btn
      flat
      rounded="pill"
      height="44"
      color="primary"
      class="role-continue mt-8 text-body-1 font-weight-bold text-none"
      :disabled="!selectedUserGroup"
      :loading="loadingChangeGroup"
      @click="save"
    >
      Continue
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { UserGroup } from '@/types'
import manStudent from '@/assets/images/man-student.svg'
import womanStudent from '@/assets/images/woman-student.svg'
import manTeacher from '@/assets/images/man-teacher.svg'
import womanTeacher from '@/assets/images/woman-teacher.svg'

definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: 'Choose your role',
})

const roles = [
  {
    value: UserGroup.Student,
    title: 'Student',
    description: 'Practise with past papers and online exams, and see how you improve.',
    images: [manStudent, womanStudent],
  },
  {
    value: UserGroup.Teacher,
    title: 'Teacher',
    description: 'Share past papers, build exams for your students, and see how they do.',
    images: [manTeacher, womanTeacher],
  },
]

const { user, getProfile, setUser } = useUser()
const { changeGroup, loadingChangeGroup } = useProfile()
const { hasChosenUserType } = useUserPermissions()

const selectedUserGroup = ref<UserGroup | null>(
  user.value?.group === UserGroup.Student || user.value?.group === UserGroup.Teacher
    ? user.value.group
    : null,
)

// Redirect to user page on mount
onMounted(() => {
  if (hasChosenUserType.value)
    navigateTo('/user')
})

const save = async () => {
  if (!selectedUserGroup.value) return

  const response = await changeGroup(selectedUserGroup.value)

  if (response?.succeeded && user.value) {
    user.value.group = selectedUserGroup.value

    // changeGroup only returns a boolean, not the updated user - refetch the
    // real profile so `roles` (which hasChosenUserType and the user-type
    // middleware both gate on) reflects the role just set server-side,
    // instead of navigating with a stale roles array and getting bounced back here.
    const { data: profileResponse } = await getProfile()
    if (profileResponse?.succeeded && profileResponse.data) {
      setUser(profileResponse.data)
    }

    navigateTo('/user')
  }
}
</script>

<style scoped>
.role-options {
  max-width: 640px;
}
.role-card {
  cursor: pointer;
}
.role-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.role-continue {
  min-width: 240px;
}
</style>
