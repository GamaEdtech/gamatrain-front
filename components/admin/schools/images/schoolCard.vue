<script setup>
const props = defineProps({
  modelValue: Boolean,
  id: String,
  fileId: String,
  schoolName: String,
  schoolId: String,
})

const { $toast } = useNuxtApp()

const emit = defineEmits([
  'update:modelValue',
])
const approveImage = async () => {
  try {
    await useApiService.patch(`/api/v1/admin/schools/images/contributions/${props.id}/confirm`)
    if (res.succeeded === true) {
      $toast.success('Image Approved successfully!')
      emit('update:modelValue', false)
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}
const rejectImage = async () => {
  try {
    await useApiService.patch(`/api/v1/admin/schools/images/contributions/${props.id}/reject`)
    if (res.succeeded === true) {
      $toast.success('Image Rejected successfully!')
      emit('update:modelValue', false)
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}
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
              :src="`https://api.gamaedtech.com/Files/School/${fileId}`"
              alt="avatar"
            >
          </div>
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            {{ schoolName }}
          </p>
        </v-card-title>

        <div class="pa-3 bg-white">
          <v-card-actions class="px-0">
            <v-btn
              class="closeBtn"
              variant="plain"
              @click="$emit('update:modelValue', false)"
            >
              <span class="mdi mdi-close gtext-t1" />
            </v-btn>
            <v-row>
              <v-col
                align="center"
                class="pr-0"
              >
                <v-btn
                  variant="outlined"
                  class="rejectBtn"
                  @click="rejectImage"
                >
                  Reject
                </v-btn>
              </v-col>
              <v-col
                align="center"
                class="pl-0"
              >
                <v-btn
                  variant="outlined"
                  class="approveBtn"
                  @click="approveImage"
                >
                  Approve
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
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #f2f4f7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  padding: 8px;
}
.avatarBg > img{
  width: inherit;
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

.rejectBtn{
  width: 200px;
  border-color: #f04438;
  border-width: 2px;
  color: #f04438;
}
.approveBtn{
  width: 200px;
  border-color: #12b76a;
  border-width: 2px;
  color: #12b76a;
}

:deep(.v-btn__content) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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
</style>
