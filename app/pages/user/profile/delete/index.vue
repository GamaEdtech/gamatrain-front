<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
      <h1 class="text-h4 text-grey700 font-weight-regular">
        Confirm your identity
      </h1>

      <h4 class="text-h6 text-grey700 font-weight-regular mt-5">
        For your security, please confirm your identity before deleting your account.
      </h4>
      <div
        class="d-flex flex-column ga-1 mt-8"
      >
        <span class="text-h6 text-grey700 font-weight-medium">Password</span>
        <v-text-field
          v-model="passwordUser"
          density="compact"
          variant="outlined"
          label=""
          outlined
          rounded="pill"
          color="primary"
          max-width="320"
          :append-inner-icon="
            showPassword ? 'md:visibility' : 'md:visibility_off'
          "
          :type="showPassword ? 'text' : 'password'"
          :rules="[password, required]"
          @click:append-inner="showPassword = !showPassword"
        />
      </div>
    </v-form>

    <v-row>
      <v-col
        cols="12"
        class="pb-0 d-flex justify-center mt-4"
      >
        <v-btn
          flat
          rounded="pill"
          width="250"
          height="40"
          class="text-h5 font-weight-medium text-grey800"
          color="primary"
          :disabled="!isFormValid"
          @click="showConfrimDeleteModal = true"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>

    <common-modal-base
      v-model:show-dialog="showConfrimDeleteModal"
      title=""
      :max-width="600"
    >
      <user-profile-delete-modal-delete
        :password="passwordUser"
        @close="showConfrimDeleteModal = false"
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

const { password, required } = useValidationRules()

const showPassword = ref(false)
const passwordUser = ref('')
const isFormValid = ref(false)
const showConfrimDeleteModal = ref(false)
</script>

<style scoped></style>
