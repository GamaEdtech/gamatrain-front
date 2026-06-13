<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-wrap"
    >
      <v-col
        cols="12"
        class="pl-5 text-h4 text-h4"
      >
        <v-icon
          large
          color="primary"
        >
          md:person_remove_outlined
        </v-icon>
        <span class="font-weight-bold"> Delete Account </span>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="username"
          density="compact"
          variant="outlined"
          label="Username"
          outlined
          rounded="lg"
          color="primary"
          :rules="[required]"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="passwordUser"
          density="compact"
          variant="outlined"
          label="Password"
          outlined
          rounded="lg"
          color="primary"
          :append-inner-icon="
            showPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showPassword ? 'text' : 'password'"
          :rules="[password]"
          @click:append-inner="showPassword = !showPassword"
        />
      </v-col>
    </v-form>

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
          color="error"
          :disabled="!isFormValid"
          @click="showConfrimDeleteModal = true"
        >
          Delete
        </v-btn>
      </v-col>
    </v-row>

    <common-modal-base
      v-model:show-dialog="showConfrimDeleteModal"
      title="Delete"
    >
      <common-modal-delete
        :loading="loadingDeleteItem"
        @confirm="confirmDelete"
      />
    </common-modal-base>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: 'Delete Account',
})

const router = useRouter()
const { cleanUser } = useUser()
const { clearAuth } = useAuth()
const { required, password } = useValidationRules()
const { deleteItem, loadingDeleteItem } = useProfile()

const username = ref('')
const showPassword = ref(false)
const passwordUser = ref('')
const isFormValid = ref(false)
const showConfrimDeleteModal = ref(false)

const confirmDelete = async () => {
  const response = await deleteItem({
    username: username.value,
    password: passwordUser.value,
  })
  if (response.succeeded) {
    cleanUser()
    clearAuth()
    if (import.meta.client) {
      localStorage.removeItem('v2_token')
      localStorage.clear()
      sessionStorage.clear()
    }
    router.push('/')
  }
}
</script>

<style scoped></style>
