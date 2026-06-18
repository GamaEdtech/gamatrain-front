<template>
  <div class="w-100 d-flex flex-column">
    <div class="w-100 d-flex flex-column align-center ga-4">
      <div class="icon-div d-flex align-center justify-center rounded-circle bg-grey100">
        <v-icon
          color="lightError"
          size="64"
        >
          md:warning
        </v-icon>
      </div>
      <span class="text-h3 font-weight-bold text-grey700">Delete Account</span>
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start mt-6 position-relative py-8 px-4 px-md-16">
      <span class="text-h5 text-md-h4 font-weight-medium text-grey700 z-index-item">Are you sure you want to delete your account?</span>
      <v-checkbox
        v-model="isConfrimCheckBox"
        color="primary"
        class="text-h4 z-index-item mt-12 mt-md-7"
        hide-details
        false-icon="md:check_box_outline_blank"
        true-icon="md:check_box"
      >
        <template #label>
          <span class="text-h5 text-grey800 font-weight-regular ml-2">I understand that my account will be permanently deleted after 7 days.</span>
        </template>
      </v-checkbox>
      <div class="w-100 d-flex justify-center align-center ga-2 mt-10 z-index-item">
        <v-btn
          color="white"
          rounded="pill"
          height="38"
          :width="mdAndUp ? `220` : `80`"
          class="text-h5 font-weight-medium text-grey800 border-button-discard"
          flat
          :loading="loadingDeleteItem"
          @click="emit('close')"
        >
          Discard
        </v-btn>
        <v-btn
          color="lightError"
          rounded="pill"
          height="38"
          :width="mdAndUp ? `220` : `140`"
          class="text-h5 text-white font-weight-medium"
          :disabled="!isConfrimCheckBox"
          flat
          :loading="loadingDeleteItem"
          @click="confirmDelete"
        >
          Delete
        </v-btn>
      </div>
      <div class="bg-grey100 position-absolute background-div" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IDeleteModal {
  password: string
}

const emit = defineEmits(['close'])
const props = defineProps<IDeleteModal>()

const router = useRouter()
const { deleteItem, loadingDeleteItem } = useProfile()
const { user } = useUser()
const { mdAndUp } = useDisplay()
const isConfrimCheckBox = ref(false)

const confirmDelete = async () => {
  const response = await deleteItem({
    password: props.password,
    username: user.value?.userName ?? '',
  })
  if (response.succeeded) {
    emit('close')
    router.push('/user')
  }
}
</script>

<style scoped>
.z-index-item{
  z-index : 2
}
.background-div{
  height: calc(100% + 12px);
  width: calc(100% + 36px);
  left: -24px;
  bottom: -12px;
}
.icon-div{
  width : 100px;
  height : 100px
}
.border-button-discard{
  border : 1px solid rgb(var(--v-theme-grey200))
}
</style>
