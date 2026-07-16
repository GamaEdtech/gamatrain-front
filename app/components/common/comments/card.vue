<template>
  <div
    class="main-comment w-100 d-flex flex-column ga-4 pb-4 position-relative"
  >
    <div class="w-100 d-flex align-center justify-space-between">
      <div class="img-name d-flex ga-2 align-center">
        <img
          v-if="comment.creationUserAvatarUri"
          width="40"
          height="40"
          class="rounded-circle image-user"
          :src="comment.creationUserAvatarUri"
        >
        <v-icon
          v-else
          size="40"
          class="image-user"
        >
          md:account_circle
        </v-icon>
        <!-- <div
                v-if="comment.replies.length > 0"
                class="circle-div"
              />
              <div
                v-if="comment.replies.length > 0"
                class="main-line-comment"
              /> -->
        <div class="d-flex flex-column align-start">
          <span class="text-h5 text-grey700 font-weight-medium">{{ comment.creationUser }} </span>
          <!-- <span class="text-h6 primary-gray-500">{{ comment.role }}</span> -->
        </div>
      </div>
      <!-- <span class="score d-flex align-center ga-1 text-grey400">
              <v-icon color="warning">md:bar_chart</v-icon>
              <span class="text-grey700 font-weight-bold">{{
                comment.score
              }}</span>
              Score
            </span> -->
    </div>
    <span class="w-100 pl-6 pl-sm-8 text-h5 text-grey700 font-weight-regular">{{
      comment.comment
    }}</span>
    <div
      class="w-100 pl-6 pl-sm-8 d-flex align-center justify-space-between"
    >
      <div class="d-flex ga-4 option-div">
        <span
          class="d-flex align-center ga-2 text-subtitle-1 text-grey700 cursor-pointer"
        >
          {{ comment.likeCount }}
          <v-progress-circular
            v-if="loadingLikeItem"
            indeterminate
            size="16"
            color="primary"
          />
          <v-icon
            v-else
            @click="likeComment"
          >{{ comment.likedByCurrentUser ? `md:thumb_up`:`md:thumb_up_outlined` }}</v-icon>
        </span>

        <span
          class="d-flex align-center ga-2 text-subtitle-1 text-grey700 cursor-pointer"
        >
          {{ comment.dislikeCount }}
          <v-progress-circular
            v-if="loadingDislikeItem"
            indeterminate
            size="16"
            color="primary"
          />
          <v-icon
            v-else
            @click="dislikeComment"
          >{{ comment.dislikedByCurrentUser ? `md:thumb_down`:`md:thumb_down_outlined` }}</v-icon>
        </span>

        <!-- <span
                class="d-flex align-center ga-2 text-subtitle-1 reply-text cursor-pointer"
              >
                <v-icon>md:reply</v-icon>
                Reply
              </span> -->
      </div>
      <span class="text-grey700 font-weight-regular"> {{ formatLocal(comment.creationDate, "MM/DD/YYYY") }} </span>
    </div>

    <!-- <div
            v-if="comment.replies.length > 0"
            class="replies-div pl-8 d-flex flex-column ga-8 mt-4"
          >
            <div
              v-for="(reply, i) in comment.replies"
              :key="i"
              class="w-100 d-flex flex-column ga-4"
            >
              <div class="w-100 d-flex align-center justify-space-between">
                <div
                  class="img-name d-flex ga-2 align-center position-relative"
                >
                  <img
                    width="40"
                    height="40"
                    class="rounded-circle image-user"
                    :src="
                      reply.avatar ? reply.avatar : `/images/member/avatar.svg`
                    "
                  >
                  <div class="arc-wrap">
                    <div class="arc" />
                  </div>
                  <div class="circle-reply-div" />
                  <div class="d-flex flex-column align-start">
                    <span class="text-h5 text-grey700 font-weight-medium">{{ reply.fistName }} {{ reply.lastName }}</span>
                    <span class="text-h6 text-grey500">{{
                      reply.role
                    }}</span>
                  </div>
                </div>
                <span class="score d-flex align-center ga-1 text-grey400">
                  <v-icon color="warning">md:bar_chart</v-icon>
                  <span class="text-grey700 font-weight-bold">{{
                    reply.score
                  }}</span>
                  Score
                </span>
              </div>
              <span class="w-100 pl-4 pl-sm-8 text-h5 text-grey700 font-weight-regular">{{
                reply.text
              }}</span>
              <div
                class="w-100 pl-4 pl-sm-8 d-flex align-center justify-space-between"
              >
                <div class="d-flex ga-4 option-div">
                  <span
                    class="d-flex align-center ga-2 text-subtitle-1 text-grey700 cursor-pointer"
                  >
                    {{ reply.countLike }}
                    <v-icon v-if="reply.isLike">md:thumb_up</v-icon>
                    <v-icon v-if="!reply.isLike">md:thumb_up_outlined</v-icon>
                  </span>

                  <span
                    class="d-flex align-center ga-2 text-subtitle-1 text-grey700 cursor-pointer"
                  >
                    {{ reply.countDislike }}
                    <v-icon v-if="reply.isDislike">md:thumb_down</v-icon>
                    <v-icon v-if="!reply.isDislike">md:thumb_down_outlined</v-icon>
                  </span>
                </div>
                <span class="text-grey400 font-weight-medium"> {{ reply.dateSubmit }} </span>
              </div>
            </div>
          </div> -->
  </div>
</template>

<script setup lang="ts">
import type { CommentBlogDTO } from '@/types'

interface ICardComment {
  id: string
  comment: CommentBlogDTO
}

const props = defineProps<ICardComment>()
const emit = defineEmits(['likeSuccessfull', 'dislikeSuccessfull'])

const router = useRouter()
const { $toast } = useNuxtApp()
const { formatLocal } = useDateTime()
const auth = useAuth()
const { like, loadingLikeItem, dislike, loadingDislikeItem } = useBlogComment()

const likeComment = async () => {
  if (auth.isAuthenticated.value) {
    if (props.comment.likedByCurrentUser) {
      $toast.error('You have already liked this comment.')
    }
    else {
      const response = await like(props.id, props.comment.id.toString())
      if (response.succeeded) {
        emit('likeSuccessfull')
      }
    }
  }
  else {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
}

const dislikeComment = async () => {
  if (auth.isAuthenticated.value) {
    if (props.comment.dislikedByCurrentUser) {
      $toast.error('You have already disliked this comment.')
    }
    else {
      const response = await dislike(props.id, props.comment.id.toString())
      if (response.succeeded) {
        emit('dislikeSuccessfull')
      }
    }
  }
  else {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
}
</script>

<style scoped>
.reply-text {
  color: rgb(var(--v-theme-info));
}
.image-user {
  z-index: 4;
}
.circle-div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  background-color: rgb(var(--v-theme-grey200));
  top: 34px;
  left: 12px;
  z-index: 3;
}
.main-line-comment {
  width: 2px;
  height: calc(100% - 156px);
  position: absolute;
  background-color: rgb(var(--v-theme-grey200));
  top: 40px;
  left: 17px;
}

.circle-reply-div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  background-color: rgb(var(--v-theme-grey200));
  top: 12px;
  left: -6px;
  z-index: 3;
}
.arc-wrap {
  width: 24px;
  height: 24px;
  display: inline-block;
  transform: rotate(180deg);
  position: absolute;
  top: -4px;
  left: -15px;
  z-index: 3;
}

.arc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-grey200));
  box-sizing: border-box;
  clip-path: polygon(50% 50%, 100% 50%, 100% 0, 50% 0);
  -webkit-mask-clip: padding-box;
}
</style>
