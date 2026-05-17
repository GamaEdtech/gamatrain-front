<template>
  <div class="w-100 d-flex flex-column">
    <div
      v-if="xs && isShowAllComments"
      class="overlay-div"
      @click="isShowAllComments = false"
    />
    <div
      class="w-100 d-flex flex-column align-center justify-center position-relative rounded-lg pa-4 brief-div"
    >
      <div class="w-100 d-flex justify-space-between">
        <span class="text-h4 font-weight-medium text-grey700">
          <v-icon
            size="26"
            color="grey700"
          >md:comment</v-icon>
          Comments
        </span>

        <span class="text-h6 text-grey400 font-weight-regular">
          <span class="text-grey500 font-weight-medium">{{
            totalCount
          }}</span>
          Comment
        </span>
      </div>
      <!-- <div class="w-100 d-flex ga-2 align-center mt-5">
        <img
          width="32"
          height="32"
          class="rounded-circle"
          src="/images/member/avatar.svg"
        >
        <span class="text-h5 primary-gray-700">Hello! Big thanks to Gama for this amazing website. I'm a student at
          this school and super happy with it.</span>
      </div> -->
      <span class="text-h6 position-absolute text-greenLight700 text-think">Your thoughts?</span>
      <div
        class="rounded-div position-absolute d-flex align-start justify-center cursor-pointer"
        @click="openComments"
      >
        <v-icon
          color="greenLight700"
          size="30"
        >
          md:keyboard_arrow_down
        </v-icon>
      </div>
    </div>
    <div
      :class="`w-100 all-comment-div ${isShowAllComments ? `open` : `close`} ${
        xs ? `mobile-style` : ``
      }`"
    >
      <div
        class="d-flex d-sm-none w-100 align-center justify-center position-relative mb-6"
      >
        <div class="line-bottom-sheet" />
        <v-icon
          color="grey400"
          size="30"
          class="position-absolute set-position-close-button cursor-pointer"
          @click="isShowAllComments = false"
        >
          md:close
        </v-icon>
      </div>

      <div class="w-100 d-flex d-sm-none justify-space-between px-4">
        <span class="text-h5 font-weight-medium text-grey700">
          <v-icon
            size="20"
            color="grey700"
          >md:comment</v-icon>
          Comments
        </span>

        <span class="text-h5 text-grey400 font-weight-regular">
          <span class="text-grey500 font-weight-medium">{{
            totalCount
          }}</span> Comment
        </span>
      </div>
      <v-divider
        color="black"
        thickness="2"
        class="my-2 d-flex d-sm-none"
      />
      <div
        :class="`w-100 container-comment d-flex flex-column align-start justify-start ga-2 ${
          isShowAllComments ? `pa-4 pa-sm-8` : `close-container`
        }`"
      >
        <common-comments-card
          v-for="(comment, index) in comments"
          :id="id"
          :key="index"
          :comment="comment"
          @like-successfull="likeSuccessfull(comment)"
          @dislike-successfull="dislikeSuccessfull(comment)"
        />
      </div>
      <div
        :class="`send-message-div d-flex w-100 left-0 bottom-0 rounded-lg bg-white ${
          isShowAllComments ? `open-send-message` : ``
        }`"
      >
        <common-comments-form
          :id="id"
          @send-comment-successfull="sendCommentSuccessfull"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { CommentBlogDTO } from '@/types'

interface IComment {
  id: string
}

const props = defineProps<IComment>()
const { initCaptcha } = useRecaptcha()
const { data: comments, getData, totalCount } = useBlogComment()

const { xs } = useDisplay()
const isShowAllComments = ref(false)
const params = {
  page: 1,
  pageSize: 1000,
  postId: props.id,
}

const openComments = () => {
  isShowAllComments.value = !isShowAllComments.value
}

onMounted(() => {
  getData(params)
  initCaptcha()
})

// const sendCommentSuccessfull = (comment: CommentBlogDTO) => {
//   comments.value.push(comment)
//   totalCount.value += 1
// }
const sendCommentSuccessfull = async () => {
  await getData(params)
}

const likeSuccessfull = (comment: CommentBlogDTO) => {
  comment.likeCount += 1
}

const dislikeSuccessfull = (comment: CommentBlogDTO) => {
  comment.dislikeCount += 1
}
</script>

<style scoped>
.brief-div {
  border: 1px solid rgb(var(--v-theme-grey100));
  background-color: rgb(var(--v-theme-greenLight25));
  min-height: 100px;
}
.rounded-div {
  width: 80px;
  height: 34px;
  border-radius: 0 0 40px 40px;
  border-bottom: 1px solid rgb(var(--v-theme-grey100));
  border-left: 1px solid rgb(var(--v-theme-grey100));
  border-right: 1px solid rgb(var(--v-theme-grey100));
  background-color: rgb(var(--v-theme-greenLight25));
  bottom: -34px;
  z-index: 2;
}
.text-think {
  bottom: 10px;
}

.close {
  height: 0;
  border: 1px solid rgb(var(--v-theme-white)) !important;
}
.open {
  height: 500px;
}
.all-comment-div {
  transition: all 0.5s;
  overflow: hidden;
  border: 1px solid rgb(var(--v-theme-grey100));
  border-radius: 0 0 8px 8px;
  position: relative;
}
.container-comment {
  height: calc(100% - 64px);
  overflow: auto;
}
.close-container {
  height: 0;
}

.send-message-div {
  height: 64px;
  box-shadow: 0px -24px 50px 0px #1018280a;
}
.open-send-message {
  position: sticky;
}
.line-bottom-sheet {
  width: 80px;
  height: 6px;
  border-radius: 20px;
  background-color: rgb(var(--v-theme-grey300));
}
.set-position-close-button {
  right: 20px;
}

@media only screen and (max-width: 600px) {
  .overlay-div {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.32);
    z-index: 1005;
  }
  .mobile-style {
    left: 0;
    bottom: -800px;
    border: none;
    min-height: 80%;
    background-color: rgb(var(--v-theme-white));
    padding-top: 24px;
    border-radius: 24px 24px 0 0;
    z-index: 1006;
    position: fixed;
  }
  .open {
    bottom: 0;
  }
  .send-message-div {
    border: 1px solid rgb(var(--v-theme-grey200));
  }
  .container-comment {
    height: calc(100% - 128px);
  }
}
</style>
