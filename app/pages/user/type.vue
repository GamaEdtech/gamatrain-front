<template>
  <v-container class="w-100 d-flex flex-column">
    <h1 class="text-h3 font-weight-bold text-grey700">
      Choose your role
    </h1>
    <span class="text-h5 font-weight-regular text-grey500 mt-8">This helps us personalize GamaTrain for you.</span>
    <div class="d-flex align-center justify-center ga-2 mt-16">
      <div
        :class="`box-role bg-grey50 px-6 pt-4 d-flex flex-column rounded-lg cursor-pointer ${selectedUserGroup === UserGroup.Student ? `box-role-selected`:``}`"
        @click="selectedUserGroup = UserGroup.Student"
      >
        <div class="d-flex justify-center">
          <img
            src="@/assets/images/man-student.svg"
            alt="Student"
            class="mr-n4"
          >
          <img
            src="@/assets/images/woman-student.svg"
            alt="Student"
          >
        </div>
        <v-checkbox
          :model-value="selectedUserGroup === UserGroup.Student"
          color="primary"
          class="text-h5"
          hide-details
          readonly
          false-icon="md:radio_button_unchecked"
          true-icon="md:radio_button_checked"
        >
          <template #label>
            <span class="text-h5 text-sm-h4 text-grey800 font-weight-regular">Student</span>
          </template>
        </v-checkbox>
      </div>

      <div
        :class="`box-role bg-grey50 px-6 pt-4 d-flex flex-column rounded-lg cursor-pointer ${
          selectedUserGroup === UserGroup.Teacher ? `box-role-selected`:``}`"
        @click="selectedUserGroup = UserGroup.Teacher"
      >
        <div class="d-flex justify-center">
          <img
            src="@/assets/images/man-teacher.svg"
            alt="Teacher"
            class="mr-n4"
          >
          <img
            src="@/assets/images/woman-teacher.svg"
            alt="Teacher"
          >
        </div>
        <v-checkbox
          :model-value="selectedUserGroup === UserGroup.Teacher"
          color="primary"
          class="text-h5"
          hide-details
          readonly
          false-icon="md:radio_button_unchecked"
          true-icon="md:radio_button_checked"
        >
          <template #label>
            <span class="text-h5 text-sm-h4 text-grey800 font-weight-regular">Teacher</span>
          </template>
        </v-checkbox>
      </div>
    </div>
    <div
      class="w-100 d-flex justify-center mt-12"
    >
      <v-btn
        flat
        rounded="lg"
        width="250"
        class="text-h5 font-weight-bold"
        color="success"
        :loading="loadingChangeGroup || loadingEditItem"
        @click="save"
      >
        Submit
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { UserGroup } from '@/types'

definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: 'Choose Role',
})

const { user, getProfile, setUser } = useUser()
const { changeGroup, loadingChangeGroup, editItem, loadingEditItem } = useProfile()
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

    const responseEditProfile = await editItem({ group: selectedUserGroup.value })
    if (responseEditProfile.succeeded) {
      // changeGroup/editItem only return a boolean, not the updated user -
      // refetch the real profile so `roles` (which hasChosenUserType and
      // the user-type middleware both gate on) reflects the role we just
      // set server-side, instead of navigating with a stale roles array
      // and immediately getting bounced back here.
      const { data: profileResponse } = await getProfile()
      if (profileResponse?.succeeded && profileResponse.data) {
        setUser(profileResponse.data)
      }

      navigateTo('/user')
    }
  }
}
</script>

<style scoped>
.box-role{
  border : 1px solid rgb(var(--v-theme-grey200))
}
.box-role-selected{
  border-color : rgb(var(--v-theme-primary));
}
</style>
