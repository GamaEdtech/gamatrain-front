<template>
  <v-row v-show="commentList.length">
    <v-col cols="12">
      <h3 class="gtext-h5 primary-gray-600">
        Comments
      </h3>
    </v-col>
    <v-col
      cols="12"
      md="12"
    >
      <v-card
        v-for="comment in displayedComments"
        :key="comment.id"
        class="comment-card primary-gray-100 pt-4 mb-3"
        elevation="1"
      >
        <v-card-text>
          <div class="comment-card-header">
            <div class="d-flex float-left">
              <v-avatar size="60">
                <img
                  class="profile-avatar"
                  :src="comment.creationUserAvatar"
                >
              </v-avatar>
              <div class="ml-2">
                <div class="gtext-t2 primary-gray-900">
                  {{ comment.creationUser }}
                </div>
              </div>
            </div>
            <div class="float-right">
              <v-rating
                v-model="comment.averageRate"
                background-color="orange lighten-3"
                color="orange"
                half-increments
                hover
                size="24"
                readonly
              />
            </div>
          </div>
          <v-divider class="mb-5" />
          <div class="gtext-t2 primary-gray-700 mb-6">
            "{{ comment.comment }}"
          </div>
          <div class="pb-8">
            <div class="float-left">
              <v-btn
                class="bg-primary-gray-700 text-white mr-6"
                variant="flat"
                size="x-small"
                icon
              >
                <v-icon
                  size="14"
                  color="white"
                >
                  mdi-thumb-down
                </v-icon>
              </v-btn>
              <v-btn
                class="bg-primary-gray-700 text-white mr-6"
                variant="flat"
                size="x-small"
                icon
              >
                <v-icon
                  size="14"
                  color="white"
                >
                  mdi-thumb-up
                </v-icon>
              </v-btn>
              <v-btn
                class="bg-primary-blue-500 text-white"
                variant="flat"
                size="x-small"
                icon
              >
                <v-icon
                  size="14"
                  color="white"
                >
                  mdi-forum
                </v-icon>
              </v-btn>
            </div>
            <div class="float-right gtext-t5">
              {{ comment.creationDate }}
            </div>
          </div>
        </v-card-text>
      </v-card>
      <div class="text-center mt-14">
        <v-btn
          v-if="showLoadMoreButton"
          rounded
          class="text-transform-none gtext-t4 font-weight-medium"
          color="white"
          size="x-large"
          @click="loadMoreComments"
        >
          Load more
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  commentList: {
    type: Array,
    required: true,
  },
})

// State for pagination
const displayedCount = ref(10)
const commentsPerPage = 10

// Computed properties
const displayedComments = computed(() => {
  return props.commentList.slice(0, displayedCount.value)
})

const showLoadMoreButton = computed(() => {
  return props.commentList.length > displayedCount.value
})

// Methods
const loadMoreComments = () => {
  displayedCount.value += commentsPerPage
}

// Reset displayed count when commentList changes
watch(
  () => props.commentList,
  () => {
    displayedCount.value = 10
  },
  { deep: true },
)
</script>

<style scoped>
.comment-card-header {
  height: 8rem;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  background-position: center;
  object-fit: cover;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  background-size: cover;
}
</style>
