<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column pa-4"
  >
    <div class="w-100 d-flex flex-column align-start">
      <span class="text-h5 text-grey700 font-weight-regular">Who can see my profile</span>
      <div class="w-100 d-flex align-start justify-start mt-8">
        <v-radio-group
          v-model="privacy"
          :rules="[required]"
          required
        >
          <v-radio
            v-for="(item, index) in privacyOption"
            :key="index"
            :value="item"
            color="primary"
            class="text-h5"
          >
            <template #label>
              <span class="text-h5 text-grey700 font-weight-regular">{{ item }}</span>
            </template>
          </v-radio>
        </v-radio-group>
      </div>
    </div>
    <div class="w-100 d-flex justify-center align-center ga-2 mt-16">
      <v-btn
        color="grey200"
        variant="outlined"
        rounded="pill"
        height="38"
        width="80"
        class="text-h5 font-weight-medium"
        flat
        :loading="loadingEditItem"
        @click="closeModal"
      >
        <span class="text-grey800">
          Discard
        </span>
      </v-btn>
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="220"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        :loading="loadingEditItem"
        :disabled="!isFormValid"
        @click="save"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { ProfileVisibility } from '@/types'

interface IModalPrivacy {
  privacy: ProfileVisibility
}

const props = defineProps<IModalPrivacy>()
const emit = defineEmits(['close', 'success'])

const {
  required,
} = useValidationRules()
const { editItem, loadingEditItem } = useProfile()

const privacyOption = ['Private', 'Public', 'ConnectionsOnly',
]
const privacy = ref<ProfileVisibility>(props.privacy)
const isFormValid = ref(false)

const closeModal = () => {
  emit('close')
}

const save = async () => {
  const response = await editItem({
    profileVisibility: privacy.value,
  })

  if (response?.succeeded) {
    emit('success', {
      profileVisibility: privacy.value,
    })
    emit('close')
  }
}
</script>

<style scoped>
</style>
