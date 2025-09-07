<template>
  <div>
    <v-dialog
      v-model="visible"
      max-width="500"
      :fullscreen="!smAndUp"
      @after-leave="handleAfterLeave"
    >
      <template #default="{ isActive }">
        <v-form
          ref="formRef"
          v-model="formIsValid"
          class="min-h-full"
          @submit.prevent="onSubmit"
        >
          <v-card>
            <div class="px-4 py-4 d-none d-sm-block">
              <div
                class="d-flex justify-end cursor-pointer"
                @click="isActive.value = false"
              >
                <v-icon color="#D0D5DD">
                  mdi-close
                </v-icon>
              </div>
            </div>
            <div
              class="d-flex align-center create-proposal__head py-5 px-4 d-sm-none"
            >
              <div @click="isActive.value = false">
                <v-icon
                  size="large"
                  color="#344054"
                >
                  mdi-chevron-right
                </v-icon>
              </div>
              <div class="pl-2 text-h5 primary-gray-700 font-weight-regular">
                Creat Proposal
              </div>
            </div>
            <div>
              <div
                class="text-h5 primary-gray-500 font-weight-bold pb-4 pl-6 d-none d-sm-block"
              >
                Creat Proposal
              </div>
            </div>
            <v-card-text>
              <h6 class="text-h4 font-weight-bold">
                You are creating a proposal
              </h6>

              <div class="text-h6 text-md-button mt-4 mt-sm-4">
                <span>
                  <v-icon
                    size="large"
                    color="#98A2B3"
                  >mdi-wallet</v-icon></span>
                <span class="pl-1 primary-gray-400">Wallet </span><span class="pl-1 primary-blue-500">0X12...9F</span>
              </div>

              <div class="mt-10">
                <div>
                  <div class="mb-1 primary-gray-700 text-h6">
                    Title
                  </div>
                  <v-text-field
                    v-model="form.title"
                    :rules="[rules.required]"
                    density="compact"
                    variant="outlined"
                    rounded
                  />
                </div>
                <div>
                  <div class="mb-1 primary-gray-700 text-h6">
                    Description
                  </div>
                  <v-textarea
                    v-model="form.description"
                    :rules="[rules.required]"
                    density="compact"
                    variant="outlined"
                    rounded
                  />
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="mb-5 mx-5">
              <v-btn
                variant="text"
                size="large"
                class="w-30"
                rounded
                @click="isActive.value = false"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                variant="flat"
                size="large"
                color="#FFB600"
                rounded
                class="flex-1 w-70"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndUp } = useDisplay()
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['update:modelValue'])
const rules = {
  required: v => !!v || 'This field is required',
}
const formIsValid = ref(false)
const formRef = ref(null)

const form = ref({
  title: null,
  description: null,
})
const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
)

async function onSubmit() {
  const { valid } = await formRef.value.validate()

  if (valid) {
    console.log('Form Valid!')
  }
}

const handleAfterLeave = () => {
  emits('update:modelValue', false)
}
</script>

<style scoped>
.create-proposal__head {
  box-shadow: 0px 0px 20px 0px #1018280d;
}
</style>
