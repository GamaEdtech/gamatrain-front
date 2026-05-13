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
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
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
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Phone Number
        </div>
        <v-text-field
          v-model="newUser.phoneNumber"
          rounded="lg"
          density="compact"
          placeholder="Phone Number"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[rules.required, rules.phone]"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
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
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
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
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>
    </v-form>
    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :disabled="!isFormValid || loadingGetItemById"
      :loading="loadingEditItem"
      flat
      @click="editUser"
    >
      Edit
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserDTO,
} from '@/types'

interface IUserDetailModal {
  id: string
}

const props = defineProps<IUserDetailModal>()
const emit = defineEmits(['EditUserSuccessFull'])

const { getItemById, loadingGetItemById, editItem, loadingEditItem } = useUserManagerAdmin()

const newUser = reactive({
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
})
type NewUser = typeof newUser

const isFormValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required',
  username: (v: string) => /^[a-zA-Z0-9]+$/.test(v) || 'Username must not contain special characters like ., _, @',
  phone: (v: string) => /^(\+?\d{10,15})$/.test(v) || 'Phone number must be valid',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
}

const editUser = async () => {
  if (!isFormValid.value) return

  const response = await editItem(newUser, props.id)
  if (response.succeeded) {
    Object.keys(newUser).forEach((key) => {
      newUser[key as keyof NewUser] = ''
    })
    emit('EditUserSuccessFull')
  }
}

onMounted(async () => {
  const response = await getItemById(props.id)
  if (response.succeeded && response.data) {
    newUser.username = (response.data as AdminUserDTO).username
    newUser.email = (response.data as AdminUserDTO).email
    newUser.phoneNumber = (response.data as AdminUserDTO).phoneNumber
    newUser.firstName = (response.data as AdminUserDTO).firstName
    newUser.lastName = (response.data as AdminUserDTO).lastName
  }
})
</script>

<style scoped>
</style>
