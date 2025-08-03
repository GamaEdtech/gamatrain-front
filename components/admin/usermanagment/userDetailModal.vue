<script setup>
import resetPassword from './actions/resetPassword.vue'
import userPermission from './actions/userPermission.vue'
import UserToken from './actions/userToken.vue'

const props = defineProps({
  modelValue: Boolean,
  email: String,
  username: String,
  phoneNumber: String,
  id: String,
})

const { $toast } = useNuxtApp()

const emit = defineEmits([
  'update:modelValue',
  'update:email',
  'update:username',
  'update:phoneNumber',
  'selectAction',
  'fetchUser',
])

const form = reactive({
  email: props.email,
  username: props.username,
  phoneNumber: props.phoneNumber,
  id: props.id,
})

const rules = {
  required: v => !!v || 'Field is required',
  username: v =>
    /^[a-zA-Z0-9]+$/.test(v)
    || 'Username must not contain special characters like ., _, @',
  email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  phone: v => /^(\+?\d{10,15})$/.test(v) || 'Phone number must be valid',
}

const editUserBtn = ref(false)

const editUser = async (id) => {
  try {
    const res = await useApiService.put(`/api/v2/admin/identities/${id}`, {
      username: form.username,
      email: form.email,
      phoneNumber: form.phoneNumber,
      firstName: null,
      lastName: null,
      avatar: null,
      allowedIpAddressesList: [null],
    })
    if (res.succeeded) {
      $toast.success('User Edited Successfully')
      emit('fetchUser')
      editUserBtn.value = !editUserBtn.value
      emit('update:modelValue', false)
    }
    else $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) $toast.error(err.response.data.message)
  }
}

const actionMenu = ref(false)
const selectedActionComponent = ref(null)

const actions = {
  resetPassword: 'Reset Password',
  userToken: 'View / Generate Token',
  userPermission: 'View / Edit Permission',
}

const componentMap = {
  resetPassword: resetPassword,
  userToken: UserToken,
  userPermission: userPermission,
}

const selectAction = (action) => {
  selectedActionComponent.value = componentMap[action]
  actionMenu.value = false
}

watchEffect(() => {
  if (props.email != null) {
    form.email = props.email
  }
  else {
    form.email = ''
  }
  if (props.username != null) {
    form.username = props.username
  }
  else {
    form.username = ''
  }
  if (props.phoneNumber != null) {
    form.phoneNumber = props.phoneNumber
  }
  else {
    form.phoneNumber = ''
  }
})

watch(
  form,
  (newVal) => {
    emit('update:email', newVal.email)
    emit('update:username', newVal.username)
    emit('update:phoneNumber', newVal.phoneNumber)
  },
  { deep: true },
)

const isDisabled = computed(() => {
  const emailIsValid = /.+@.+\..+/.test(form.email)
  const phoneIsValid = /^\d{10,15}$/.test(form.phoneNumber)
  return (
    form.username
    && form.email
    && form.phoneNumber
    && emailIsValid
    && phoneIsValid
  )
})
</script>

<template>
  <div class="text-center">
    <v-dialog
      :model-value="modelValue"
      width="500"
      @click:outside="$emit('update:modelValue', false)"
    >
      <v-card class="bg-primary-gray-200 rounded-xl">
        <v-card-title
          class="gtext-t4 bg-white flex-column d-flex align-center pt-12"
        >
          <div class="avatarBg">
            <img
              width="64"
              height="64"
              src="/images/adminAuth.png"
              alt="avatar"
            >
          </div>
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            {{ username }}
          </p>
        </v-card-title>

        <div class="pa-3">
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium">
                UserName
              </label>
              <v-text-field
                v-model="form.username"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :disabled="!editUserBtn"
                :rules="[rules.required, rules.username]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium">
                Phone Number
              </label>
              <v-text-field
                v-model="form.phoneNumber"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :disabled="!editUserBtn"
                :rules="[rules.required, rules.phone]"
              />
            </div>
          </div>

          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Email
          </label>
          <v-text-field
            v-model="form.email"
            variant="solo"
            density="comfortable"
            class="mt-1"
            :disabled="!editUserBtn"
            :rules="[rules.required, rules.email]"
          />
          <v-card-actions class="px-0">
            <v-btn
              class="closeBtn"
              variant="plain"
              @click="$emit('update:modelValue', false)"
            >
              <span class="mdi mdi-close gtext-t1" />
            </v-btn>
            <v-btn
              class="moreActionBtn relative"
              variant="plain"
              @click="actionMenu = !actionMenu"
            >
              <span class="mdi mdi-dots-vertical gtext-t1" />
            </v-btn>
            <div
              v-show="actionMenu"
              class="actionMenuContainer"
            >
              <div class="py-1 actionMenuItems">
                <button
                  v-for="(label, key) in actions"
                  :key="key"
                  class="w-full text-left px-4 py-2"
                  @click="selectAction(key)"
                >
                  {{ label }}
                </button>
              </div>
            </div>
            <component
              :is="selectedActionComponent"
              v-if="selectedActionComponent"
              :id="props.id"
              :model-value="true"
              @update:model-value="selectedActionComponent = null"
            />
            <v-row class="">
              <v-col class="d-flex justify-center ga-10">
                <v-btn
                  v-show="!editUserBtn"
                  class="editBtn"
                  variant="plain"
                  @click="editUserBtn = !editUserBtn"
                >
                  <span class="mdi mdi-account-edit gtext-t3" />
                  edit
                </v-btn>

                <v-btn
                  v-show="editUserBtn"
                  class="cancelBtn"
                  variant="plain"
                  @click="editUserBtn = !editUserBtn"
                >
                  cancel
                </v-btn>

                <v-btn
                  v-show="editUserBtn"
                  class="rounded-pill gtext-t5 ml-4 saveBtn"
                  :disabled="!isDisabled"
                  @click="editUser(id)"
                >
                  <span>Save</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
:deep(.v-field__input) {
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1rem;
  font-weight: 400;
}
:deep(.v-field) {
  border-radius: 16px;
  border: 1px solid #c6c6c6;
  box-shadow: none;
}
.v-input {
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1.8rem !important;
  font-weight: 400 !important;
}
.avatarBg {
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f2f4f7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
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
  &:hover {
    color: #f04438;
    transition: 300ms;
  }
}
.moreActionBtn {
  width: 24px !important;
  min-width: 24px !important;
  height: 24px !important;
  color: #919191;
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0px !important;
  &:hover {
    color: #424141;
    transition: 300ms;
  }
}

:deep(.v-btn__content) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.saveBtn {
  padding: 0rem 1.2rem;
  background: #ffb600;
  color: #24292f;
  border-radius: 3rem;
}
.editBtn {
  border: 1px solid #c6c6c6;
  color: #919191;
  opacity: 0.9;
  &:hover {
    color: rgb(69, 69, 69);
    opacity: 1;
    transition: 300ms;
    border: 1px solid rgb(69, 69, 69);
  }
}
.cancelBtn {
  padding: 0rem 1.2rem;
  color: white;
  background-color: #344054;
  border-radius: 3rem;
  opacity: 0.9;
  &:hover {
    transition: 300ms;
    opacity: 1;
  }
}
/* Firefox support */
.v-dialog .v-card {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

:deep(.v-btn__content span) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-btn__content) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
  align-items: center;
}
.actionMenuContainer {
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0px 0px 1px black;
  padding: 4px 4px;
}
.actionMenuItems {
  display: flex;
  flex-direction: column;
}
.actionMenuItems button {
  border-radius: 10px;
  &:hover {
    background-color: rgb(161, 161, 161);
    transition: 300ms;
  }
}
</style>
