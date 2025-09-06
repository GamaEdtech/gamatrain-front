<script setup>
import rejectDialog from '~/components/admin/schools/rejectDialog.vue'

const props = defineProps({
  modelValue: Boolean,
  selectedComment: Object,
})

const dialogVisible = ref(false)

const { $toast } = useNuxtApp()
const rateKeys = [
  'artisticActivitiesRate',
  'behaviorRate',
  'classesQualityRate',
  'educationRate',
  'facilitiesRate',
  'itTrainingRate',
  'safetyAndHappinessRate',
  'tuitionRatioRate',
  'averageRate',
]

// optional: make labels nicer
const formatLabel = (key) => {
  return key
    .replace(/Rate$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}
const emit = defineEmits([
  'update:modelValue',
  'fetchComments',
])

const approveComment = async () => {
  try {
    const res = await useApiService.patch(`/api/v2/admin/schools/comments/contributions/${props.selectedComment.id}/confirm`)
    if (res.succeeded === true) {
      $toast.success('Comment Approved successfully!')
      emit('update:modelValue', false)
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
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            {{ selectedComment.schoolName }}
          </p>
        </v-card-title>
        <v-card-text class="bg-white px-16 pt-0">
          " {{ selectedComment.comment }} "
          <div class="mt-5" />
          <div
            v-for="(key, index) in rateKeys"
            :key="index"
            class="d-flex align-center mb-2 justify-space-between"
          >
            <span class="mr-4 primary-gray-600 gtext-t5">
              {{ formatLabel(key) }}
            </span>

            <div class="d-flex align-center">
              <div
                v-for="n in 5"
                :key="n"
                class="rating-block"
                :class="{ filled: n <= selectedComment[key] }"
              />
              <span class="ml-3 primary-gray-600 gtext-t5">
                {{ selectedComment[key] }}
              </span>
            </div>
          </div>
        </v-card-text>

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
                  @click="dialogVisible = !dialogVisible"
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
                  @click="approveComment"
                >
                  Approve
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <reject-dialog
            :id="selectedComment.id"
            v-model="dialogVisible"
            :type="'schools/comments'"
            @fetch-items="emit('fetchComments')"
            @close-card="$emit('update:modelValue', false)"
          />
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
.approveBtn{
  width: 200px;
  border-color: #12b76a;
  border-width: 2px;
  color: #12b76a;
  margin-bottom: 14px;
  background-color: white;
  border-radius: 8px;
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

.rating-block {
  width: 24px;
  height: 16px;
  margin-right: 4px;
  border-radius: 4px;
  background-color: #e0e0e0;
}
.rating-block.filled {
  background-color: #ffb600;
}
</style>
