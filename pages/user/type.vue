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
const router = useRouter()
const { user, setUser } = useUser()

const userType = ref('2')

// Redirect to user page on mount
onMounted(() => {
  router.push('/user')
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
    console.log('data', data)
    if (data?.status === 1) {
      // Update user data
      const updatedData = {
        avatar: user.value?.avatar,
        credit: user.value?.credit,
        email: user.value?.email,
        first_name: user.value?.first_name,
        group_id: userType.value.toString(),
        last_name: user.value?.last_name,
        phone: user.value?.phone,
        sex: user.value?.sex,
      }

      console.log('updatedData', updatedData)

      // Update user state
      await setUser(updatedData)
      user.value.group_id = userType.value.toString()

      // Navigate to user page
      router.push('/user')
    }
  }
  catch (err) {
    $toast.error(err?.message || 'An error occurred')
  }
}
</script>

<style scoped></style>
