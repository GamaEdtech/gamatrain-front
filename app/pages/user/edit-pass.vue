<template>
  <v-container class="w-100 d-flex flex-column">
    <v-row>
      <v-col
        cols="12"
        class="pl-5 text-h4 text-grey700"
      >
        <v-icon
          large
          color="primary"
        >
          md:key_vertical_outlined
        </v-icon>
        <span class="font-weight-bold"> Change Password </span>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="currentPassword"
          density="compact"
          variant="outlined"
          label="Current password"
          outlined
          rounded="lg"
          color="primary"
          :append-inner-icon="
            showCurrentPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showCurrentPassword ? 'text' : 'password'"
          :rules="[requiredRule]"
          @click:append-inner="showCurrentPassword = !showCurrentPassword"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="newPassword"
          density="compact"
          variant="outlined"
          label="New password"
          outlined
          rounded="lg"
          color="primary"
          :append-inner-icon="
            showNewPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showNewPassword ? 'text' : 'password'"
          :rules="passwordRules"
          @click:append-inner="showNewPassword = !showNewPassword"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="repeatNewPassword"
          density="compact"
          variant="outlined"
          label="Repeat new password"
          outlined
          rounded="lg"
          color="primary"
          :append-inner-icon="
            showRepeatNewPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showRepeatNewPassword ? 'text' : 'password'"
          :rules="repeatPasswordRules"
          @click:append-inner="showRepeatNewPassword = !showRepeatNewPassword"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-divider class="my-3" />
      <v-col
        cols="12"
        class="pb-0 d-flex justify-center"
      >
        <v-btn
          flat
          rounded="lg"
          width="250"
          class="text-h5 font-weight-bold"
          color="success"
          :disabled="!isFormValid"
          :loading="loadingChangePassword"
          @click="updatePassword"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center mt-12">
      <div class="box-delete d-flex flex-column align-start justify-start pa-4 bg-grey50 rounded-lg">
        <span class="text-h5 text-md-h4 text-grey500 font-weight-bold">Request Account Deletion</span>
        <v-divider class="w-100 my-1" />
        <template v-if="!user?.orphanDate">
          <span
            class="text-h6 text-grey700 font-weight-regular mt-4"
          >
            Permanently delete your account and related data. You’ll have 7 days to cancel this request before your account is permanently deleted.
          </span>
          <NuxtLink
            to="/user/profile/delete"
            class="text-subtitle-1 text-md-h5 text-lightError font-weight-medium mt-6 text-decoration-none"
          >
            Delete Account
          </NuxtLink>
        </template>

        <template v-else>
          <span
            class="text-h6 text-grey700 font-weight-regular mt-4"
          >
            Only <span class="text-h5 font-weight-bold text-lightError">{{ deletionTimeLeft }}</span> left before your account is permanently deleted. You can still cancel this request and keep your account.
          </span>
          <v-btn
            flat
            rounded="lg"
            color="grey200"
            height="36"
            class="text-subtitle-1 text-md-h5 text-grey700 font-weight-medium mt-6"
            @click="showCancelDeleteModal = true"
          >
            Cancel deletion request
          </v-btn>
        </template>
      </div>
    </v-row>
    <common-modal-base
      v-model:show-dialog="showCancelDeleteModal"
      title=""
    >
      <user-profile-delete-modal-cancel @close="showCancelDeleteModal = false" />
    </common-modal-base>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: 'Change Password',
})

const { $dayjs } = useNuxtApp()
const router = useRouter()
const { user } = useUser()
const { changePassword, loadingChangePassword } = useProfile()
const {
  required,
  minLength,
  pattern,
  matches,
} = useValidationRules()

const showCurrentPassword = ref(false)
const currentPassword = ref('')

const showNewPassword = ref(false)
const newPassword = ref('')

const showRepeatNewPassword = ref(false)
const repeatNewPassword = ref('')

const requiredRule = required

const passwordRules = [
  required,
  minLength(8),
  pattern(/[A-Z]/, 'Must include at least one uppercase letter'),
  pattern(/[a-z]/, 'Must include at least one lowercase letter'),
  pattern(/\d/, 'Must include at least one number'),
]

const repeatPasswordRules = [
  required,
  matches(newPassword, 'passwords', 'Passwords do not match'),
]

const currentTime = ref($dayjs())
const showCancelDeleteModal = ref(false)
const deletionTimeLeft = computed(() => {
  if (!user.value?.orphanDate) return ''

  const deletionDate = $dayjs(user.value.orphanDate).add(7, 'day')
  const remainingMinutes = deletionDate.diff(currentTime.value, 'minute')

  if (remainingMinutes <= 0) return '0 minutes'

  const remainingDays = Math.ceil(remainingMinutes / (24 * 60))

  if (remainingDays >= 1 && remainingMinutes >= 24 * 60) {
    return `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
  }

  const hours = Math.floor(remainingMinutes / 60)
  const minutes = remainingMinutes % 60
  const parts = []

  if (hours) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`)
  if (minutes || !parts.length) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`)
  }

  return parts.join(' and ')
})

const isFormValid = computed(() => {
  return (
    currentPassword.value
    && passwordRules.every(rule => rule(newPassword.value) === true)
    && repeatPasswordRules.every(rule => rule(repeatNewPassword.value) === true)
  )
})

const updatePassword = async () => {
  if (!isFormValid.value) return

  const response = await changePassword({
    oldpass: currentPassword.value,
    newpass: newPassword.value,
    repeat_newpass: repeatNewPassword.value,
  })

  if (response?.succeeded) {
    router.push('/user')
  }
}
</script>

<style scoped>
.box-delete{
  width : 560px;
  min-height : 180px;
  border : 1px solid rgb(var(--v-theme-grey200))
}

@media (max-width: 960px) {
  .box-delete {
    width : 320px;
  }
}
</style>
