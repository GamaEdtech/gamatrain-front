<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Username
        </div>
        <v-text-field
          v-model="newUser.username"
          rounded="lg"
          density="compact"
          placeholder="Username"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[rules.required, rules.username]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Email
        </div>
        <v-text-field
          v-model="newUser.email"
          rounded="lg"
          density="compact"
          placeholder="Email"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[rules.required, rules.email]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Password
        </div>
        <v-text-field
          v-model="newUser.password"
          rounded="lg"
          density="compact"
          placeholder="Password"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[rules.required, rules.minPassword]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Confirm Password
        </div>
        <v-text-field
          v-model="newUser.confirmPassword"
          rounded="lg"
          density="compact"
          placeholder="Confirm Password"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[rules.required, rules.matchPassword]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          First Name
        </div>
        <v-text-field
          v-model="newUser.firstName"
          rounded="lg"
          density="compact"
          placeholder="First Name"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Last Name
        </div>
        <v-text-field
          v-model="newUser.lastName"
          rounded="lg"
          density="compact"
          placeholder="Last Name"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
        />
      </div>
    </v-form>
    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :loading="loadingAddItem"
      :disabled="!isFormValid || loadingAddItem"
      flat
      @click="addUser"
    >
      Add
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['AddUserSuccessFull'])

const { addItem, loadingAddItem } = useUserManagerAdmin()

const newUser = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})
type NewUser = typeof newUser

const isFormValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required',
  username: (v: string) => /^[a-zA-Z0-9]+$/.test(v) || 'Username must not contain special characters like ., _, @',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  minPassword: (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters',
  matchPassword: (v: string) => v === newUser.password || 'Passwords must match',
}

const addUser = async () => {
  if (!isFormValid.value) return

  const response = await addItem(newUser)
  if (response.succeeded) {
    Object.keys(newUser).forEach((key) => {
      newUser[key as keyof NewUser] = ''
    })
    emit('AddUserSuccessFull')
  }
}
</script>

<style scoped>
</style>
