<template>
  <div class="mt-15">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>Select account type</h2>
          <p>Please select user type</p>
          <v-divider class="my-2" />

          <v-radio-group v-model="userType">
            <v-radio
              value="6"
              label="I'm student"
            />
            <v-radio
              value="5"
              label="I'm teacher"
            />
          </v-radio-group>

          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const { $toast } = useNuxtApp()
const { user } = useUser()

const userType = ref(2)

// Redirect to user page on mount
onMounted(() => {
  if (user.value.group === 6 || user.value.group === 5)
    navigateTo('/user')
})

// Watch for user type changes
watch(userType, async (_newType) => {
  await setUserType()
})

// Update user type
async function setUserType() {
  try {
    const response = await useApiService.post('/api/v1/users/group', {
      group: userType.value,
    })
    const data = response
    if (data?.status === 1) {
      user.value.group = Number(userType.value)

      // update bk v2
      const profilePayload = new FormData()
      profilePayload.append(
        'Group',
        Number(userType.value),
      )

      useApiService.put(
        '/api/v2/identities/profiles',
        profilePayload,
      )
      // Navigate to user page
      navigateTo('/user')
    }
  }
  catch (err) {
    $toast.error(err?.message || 'An error occurred')
  }
}
</script>

<style scoped></style>
