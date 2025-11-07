<script setup>
import useApiService from '~/composables/useApiService'

defineProps({
  modelValue: Boolean,
})
const { $toast } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'fetchUser'])

const form = ref(null)
const formIsValid = ref(false)

const newUser = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  required: v => !!v || 'This field is required',
  username: v => /^[a-zA-Z0-9]+$/.test(v) || 'Username must not contain special characters like ., _, @',
  email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  phone: v => /^(\+?\d{10,15})$/.test(v) || 'Phone number must be valid',
  minPassword: v => (v && v.length >= 6) || 'Password must be at least 6 characters',
  matchPassword: v => v === newUser.password || 'Passwords must match',
}

const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const submitUser = async () => {
  try {
    const res = await useApiService.post('/api/v2/admin/identities', null, {
      params: {
        Username: newUser.username,
        Password: newUser.password,
        ConfirmPassword: newUser.confirmPassword,
        Email: newUser.email,
        PhoneNumber: newUser.phone,
        FirstName: newUser.firstName,
        LastName: newUser.lastName,
      } })
    if (res.succeeded) {
      Object.keys(newUser).forEach((key) => {
        newUser[key] = ''
      })
      form.value.reset()
      $toast.success('User Added Successfully')
      emit('update:modelValue', false)
      emit('fetchUser')
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400)
      $toast.error(err.response.data.message)
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @click:outside="$emit('update:modelValue', false)"
  >
    <v-card class="bg-primary-gray-200 rounded-xl">
      <v-card-title class="d-flex flex-column align-center py-10 pb-6 ga-3 bg-white">
        <div class="rounded-pill bg-primary-gray-100 pa-4">
          <v-icon class="fontsize-80 primary-blue-500">
            mdi mdi-account-multiple-plus
          </v-icon>
        </div>
        <span class="gtext-t3 font-weight-medium">Add New User</span>
      </v-card-title>

      <v-card-text class="py-2">
        <v-form
          ref="form"
          v-model="formIsValid"
        >
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                First Name
              </label>
              <v-text-field
                v-model="newUser.firstName"
                variant="solo"
                density="compact"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Last Name
              </label>
              <v-text-field
                v-model="newUser.lastName"
                variant="solo"
                density="compact"
              />
            </div>
          </div>
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                UserName
              </label>
              <v-text-field
                v-model="newUser.username"
                variant="solo"
                density="compact"
                :rules="[rules.required, rules.username]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Phone Number
              </label>
              <v-text-field
                v-model="newUser.phone"
                variant="solo"
                type="email"
                density="compact"
                :rules="[rules.required, rules.phone]"
                placeholder="+119876545678"
              />
            </div>
          </div>
          <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
            Email
          </label>
          <v-text-field
            v-model="newUser.email"
            variant="solo"
            type="email"
            density="compact"
            :rules="[rules.required, rules.email]"
            placeholder="example@gmail.com"
          />
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Password
              </label>
              <v-text-field
                v-model="newUser.password"
                :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off' "
                :type="passwordVisible ? 'text' : 'password'"
                variant="solo"
                density="compact"
                :rules="[rules.required, rules.minPassword]"
                @click:append-inner="passwordVisible = !passwordVisible"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                confirm Password
              </label>
              <v-text-field
                v-model="newUser.confirmPassword"
                :append-inner-icon="confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off' "
                :type="confirmPasswordVisible ? 'text' : 'password'"
                variant="solo"
                density="compact"
                :rules="[rules.required, rules.matchPassword]"
                @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible"
              />
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-center ga-10 mb-2">
        <v-btn
          class="closeBtn"
          variant="plain"
          @click="$emit('update:modelValue', false)"
        >
          <span class="mdi mdi-close gtext-t1" />
        </v-btn>
        <v-btn
          class="rounded-pill gtext-t5 ml-4 submitBtn"
          :disabled="!formIsValid"
          @click="submitUser"
        >
          <span>Submit</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-btn__content span){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-btn__content){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-field__input){
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1rem;
  font-weight: 400;
}
:deep(.v-field){
  border-radius: 16px;
  border: 1px solid #c6c6c6;
  box-shadow: none;
}
.v-input{
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1rem !important;
  font-weight: 400 !important;
}
.submitBtn{
    height: 3.4rem;
    padding: 0.6rem 1.8rem;
    background: #ffb600;
    color: #24292f;
    border-radius: 3rem;
}
.closeBtn {
    width: 24px !important;
    min-width: 24px !important;
    height: 24px !important;
    color: #919191;
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 0px !important;
    &:hover{
        color: #F04438;
        transition: 300ms;
    }
}

/* Scoped to dialog card's scrollbar */
:deep(.v-dialog::-webkit-scrollbar) {
  width: 60px;
}

:deep(.v-dialog::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.v-dialog .v-card::-webkit-scrollbar-track {
  background: transparent;
}
.fontsize-80{
  font-size: 80px !important;
}
</style>
