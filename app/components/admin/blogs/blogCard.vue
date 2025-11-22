<script setup>
import rejectDialog from '~/components/admin/schools/rejectDialog.vue'

const props = defineProps({
  modelValue: Boolean,
  selectedBlog: Object,
})

const dialogVisible = ref(false)

const { $toast } = useNuxtApp()

const emit = defineEmits([
  'update:modelValue',
  'fetchBlogs',
])

const approveComment = async () => {
  try {
    const res = await useApiService.patch(`/api/v2/admin/blogs/contributions/${props.selectedBlog.postId}/confirm`)
    if (res.succeeded === true) {
      $toast.success('Blog Approved successfully!')
      emit('update:modelValue', false)
      emit('fetchBlogs')
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
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-0">
            {{ selectedBlog.title }}
          </p>
        </v-card-title>

        <v-card-text class="px-16 pt-0 text-center blog-summary">
          " {{ selectedBlog.summary }} "
        </v-card-text>

        <v-card-text class="px-16 pt-0 text-center blog-body">
          <div v-html="selectedBlog.body" />
        </v-card-text>

        <v-card-text class="px-16 pt-0 text-center blog-image">
          <img
            :src="selectedBlog.imageUri"
            alt=""
          >
        </v-card-text>
        <div class="d-flex">
          <v-card-text class="px-16 pt-0 text-center bg-white gtext-t5">
            <span class="mdi mdi-eye-outline" />
            {{ selectedBlog.visibilityType }}
          </v-card-text>
          <v-card-text class="px-16 pt-0 text-center bg-white gtext-t5">
            {{ selectedBlog.publishDate }}
            <span class="mdi mdi-clock-time-eight-outline" />
          </v-card-text>
        </div>

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
            :id="selectedBlog.postId"
            v-model="dialogVisible"
            :type="'blogs'"
            @fetch-items="emit('fetchBlogs')"
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

.blog-summary , .blog-image{
    background-color: white !important;
    color: #475467 !important;
}
.blog-body{
    background-color: white !important;
    color: #101828 !important;
}

::v-deep(.blog-body figure img) , .blog-image img{
  max-width: 360px !important;
  height: auto !important;
}
</style>
