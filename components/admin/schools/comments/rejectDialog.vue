<script setup>
const props = defineProps({
  modelValue: Boolean,
  id: Number,
})
const { $toast } = useNuxtApp()

const comment = ref('')
const emit = defineEmits([
  'update:modelValue',
  'fetchComments',
  'closeCommentCard',
])

const rejectComment = async () => {
  try {
    const res = await useApiService.patch(`/api/v2/admin/schools/comments/contributions/${props.id}/reject`, {
      comment: comment.value,
    })
    if (res.succeeded === true) {
      $toast.success('Comment Rejected successfully!')
      emit('update:modelValue', false)
      emit('closeCommentCard')
      emit('fetchComments')
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
  <div>
    <v-dialog
      :model-value="modelValue"
      width="500"
      @click:outside="$emit('update:modelValue', false)"
    >
      <v-card class="bg-primary-gray-200 rounded-xl">
        <v-card-title
          class="gtext-t4 bg-white flex-column d-flex align-center pt-12"
        >
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            Rejection
          </p>
        </v-card-title>
        <v-card-text>
          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Comment
          </label>
          <v-text-field
            v-model="comment"
            variant="solo"
            density="comfortable"
            class="mt-1"
          />
        </v-card-text>
        <v-card-actions class="px-0 justify-center">
          <v-btn
            class="closeBtn"
            variant="plain"
            @click="$emit('update:modelValue', false)"
          >
            <span class="mdi mdi-close gtext-t1" />
          </v-btn>
          <v-btn
            variant="outlined"
            class="rejectBtn"
            @click="rejectComment"
          >
            Reject
          </v-btn>
        </v-card-actions>
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
  margin-bottom: 14px;
  background-color: white;
  border-radius: 8px;
}
</style>
