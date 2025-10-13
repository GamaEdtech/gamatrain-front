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
        <span class="text-h4 font-weight-bold primary-gray-700">
          <v-icon size="26">md:comment</v-icon>
          Comments
        </span>

        <span class="text-h6 primary-gray-400">
          <span class="primary-gray-500 font-weight-bold">{{
            comments.length
          }}</span>
          Comment
        </span>
      </div>
      <div class="w-100 d-flex ga-2 align-center mt-5">
        <img
          width="32"
          height="32"
          class="rounded-circle"
          src="/images/member/avatar.svg"
        >
        <span class="text-h5 primary-gray-700">Hello! Big thanks to Gama for this amazing website. I'm a student at
          this school and super happy with it.</span>
      </div>
      <span class="text-h6 position-absolute text-think">Your thoughts?</span>
      <div
        class="rounded-div position-absolute d-flex align-start justify-center cursor-pointer"
        @click="openComments"
      >
        <v-icon
          color="#02B719"
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
          color="#98A2B3"
          size="30"
          class="position-absolute set-position-close-button cursor-pointer"
          @click="isShowAllComments = false"
        >
          md:close
        </v-icon>
      </div>

      <div class="w-100 d-flex d-sm-none justify-space-between px-4">
        <span class="text-h5 font-weight-bold primary-gray-700">
          <v-icon size="20">md:comment</v-icon>
          Comments
        </span>

        <span class="text-h5 primary-gray-400">
          <span class="primary-gray-500 font-weight-bold">2</span> Comment
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
        <div
          v-for="(comment, index) in comments"
          :key="index"
          class="main-comment w-100 d-flex flex-column ga-4 pb-4"
        >
          <div class="w-100 d-flex align-center justify-space-between">
            <div class="img-name d-flex ga-2 align-center">
              <img
                width="40"
                height="40"
                class="rounded-circle"
                :src="
                  comment.avatar ? comment.avatar : `/images/member/avatar.svg`
                "
              >
              <div class="d-flex flex-column align-start">
                <span class="text-h5 primary-gray-700">{{ comment.fistName }} {{ comment.lastName }}</span>
                <span class="text-h6 primary-gray-500">{{ comment.role }}</span>
              </div>
            </div>
            <span class="score d-flex align-center ga-1 primary-gray-400">
              <v-icon color="#FFB600">md:bar_chart</v-icon>
              <span class="primary-gray-700 font-weight-bold">{{
                comment.score
              }}</span>
              Score
            </span>
          </div>
          <span class="w-100 pl-4 pl-sm-8 text-h5 primary-gray-700">{{
            comment.text
          }}</span>
          <div
            class="w-100 pl-4 pl-sm-8 d-flex align-center justify-space-between"
          >
            <div class="d-flex ga-4 option-div">
              <span
                class="d-flex align-center ga-2 text-subtitle-1 primary-gray-700 cursor-pointer"
              >
                {{ comment.countLike }}
                <v-icon v-if="comment.isLike">md:thumb_up</v-icon>
                <v-icon v-if="!comment.isLike">md:thumb_up_outlined</v-icon>
              </span>

              <span
                class="d-flex align-center ga-2 text-subtitle-1 primary-gray-700 cursor-pointer"
              >
                {{ comment.countDislike }}
                <v-icon v-if="comment.isDislike">md:thumb_down</v-icon>
                <v-icon v-if="!comment.isDislike">md:thumb_down_outlined</v-icon>
              </span>

              <span
                class="d-flex align-center ga-2 text-subtitle-1 reply-text cursor-pointer"
              >
                <v-icon>md:reply</v-icon>
                Reply
              </span>
            </div>
            <span class="primary-gray-400"> {{ comment.dateSubmit }} </span>
          </div>

          <div
            v-if="comment.replies.length > 0"
            class="replies-div pl-4 pl-sm-8 d-flex flex-column ga-8 mt-4"
          >
            <div
              v-for="(reply, i) in comment.replies"
              :key="i"
              class="w-100 d-flex flex-column ga-4"
            >
              <div class="w-100 d-flex align-center justify-space-between">
                <div class="img-name d-flex ga-2 align-center">
                  <img
                    width="40"
                    height="40"
                    class="rounded-circle"
                    :src="
                      reply.avatar ? reply.avatar : `/images/member/avatar.svg`
                    "
                  >
                  <div class="d-flex flex-column align-start">
                    <span class="text-h5 primary-gray-700">{{ reply.fistName }} {{ reply.lastName }}</span>
                    <span class="text-h6 primary-gray-500">{{
                      reply.role
                    }}</span>
                  </div>
                </div>
                <span class="score d-flex align-center ga-1 primary-gray-400">
                  <v-icon color="#FFB600">md:bar_chart</v-icon>
                  <span class="primary-gray-700 font-weight-bold">{{
                    reply.score
                  }}</span>
                  Score
                </span>
              </div>
              <span class="w-100 pl-4 pl-sm-8 text-h5 primary-gray-700">{{
                reply.text
              }}</span>
              <div
                class="w-100 pl-4 pl-sm-8 d-flex align-center justify-space-between"
              >
                <div class="d-flex ga-4 option-div">
                  <span
                    class="d-flex align-center ga-2 text-subtitle-1 primary-gray-700 cursor-pointer"
                  >
                    {{ reply.countLike }}
                    <v-icon v-if="reply.isLike">md:thumb_up</v-icon>
                    <v-icon v-if="!reply.isLike">md:thumb_up_outlined</v-icon>
                  </span>

                  <span
                    class="d-flex align-center ga-2 text-subtitle-1 primary-gray-700 cursor-pointer"
                  >
                    {{ reply.countDislike }}
                    <v-icon v-if="reply.isDislike">md:thumb_down</v-icon>
                    <v-icon v-if="!reply.isDislike">md:thumb_down_outlined</v-icon>
                  </span>
                </div>
                <span class="primary-gray-400"> {{ reply.dateSubmit }} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="`send-message-div d-flex w-100 left-0 bottom-0 rounded-lg bg-white ${
          isShowAllComments ? `open-send-message` : ``
        }`"
      >
        <v-text-field
          variant="solo"
          hide-details
          placeholder="Got something to say?"
        >
          <template #prepend-inner>
            <img
              width="32"
              height="32"
              class="rounded-circle"
              :src="user?.avatar ? user?.avatar : `/images/member/avatar.svg`"
            >
          </template>

          <template #append-inner>
            <v-btn
              flat
              icon
              width="32"
              height="32"
              color="#12B76A"
            >
              <v-icon color="white">
                md:send
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface Comment {
  avatar?: string
  fistName: string
  lastName: string
  role: string
  score: string | number
  text: string
  countLike: string | number
  countDislike: string | number
  isLike: boolean
  isDislike: boolean
  dateSubmit: string
  replies: Comment[]
}

const { user } = useUser()
const { xs } = useDisplay()
const isShowAllComments = ref(false)

const comments: Comment[] = [
  {
    avatar: '/images/member/mehdi-zare.png',
    fistName: 'John',
    lastName: 'Doe',
    role: 'Student',
    score: 4,
    text: 'This question really helped me understand the topic better.',
    countLike: 12,
    countDislike: 1,
    isLike: true,
    isDislike: false,
    dateSubmit: '2025-10-07',
    replies: [
      {
        avatar: '/images/member/fahim-kavian.jpeg',
        fistName: 'Sarah',
        lastName: 'Williams',
        role: 'Teacher',
        score: 5,
        text: 'Glad to hear that, John!',
        countLike: 5,
        countDislike: 0,
        isLike: false,
        isDislike: true,
        dateSubmit: '2025-10-07',
        replies: [],
      },
      {
        avatar: '/images/member/ali-poorbazargan.png',
        fistName: 'Alex',
        lastName: 'Brown',
        role: 'Student',
        score: 3,
        text: 'I agree, it was really clear.',
        countLike: 3,
        countDislike: 0,
        isLike: false,
        isDislike: false,
        dateSubmit: '2025-10-07',
        replies: [],
      },
    ],
  },
  {
    fistName: 'Emma',
    lastName: 'Johnson',
    role: 'Student',
    score: 5,
    text: 'Excellent explanation, thank you!',
    countLike: 20,
    countDislike: 0,
    isLike: false,
    isDislike: false,
    dateSubmit: '2025-10-08',
    replies: [],
  },
  {
    avatar: '/images/member/sadeq-naderi.png',
    fistName: 'Michael',
    lastName: 'Smith',
    role: 'Student',
    score: 2,
    text: 'I found it a bit confusing in the middle part.',
    countLike: 2,
    countDislike: 3,
    isLike: false,
    isDislike: false,
    dateSubmit: '2025-10-08',
    replies: [
      {
        fistName: 'Sarah',
        lastName: 'Williams',
        role: 'Teacher',
        score: 5,
        text: 'Thanks for the feedback, Michael! I’ll try to clarify that section.',
        countLike: 4,
        countDislike: 0,
        isLike: false,
        isDislike: false,
        dateSubmit: '2025-10-08',
        replies: [],
      },
    ],
  },
  {
    fistName: 'David',
    lastName: 'Miller',
    role: 'Student',
    score: 3,
    text: 'Good overall, but I think some examples were missing.',
    countLike: 6,
    countDislike: 1,
    isLike: false,
    isDislike: false,
    dateSubmit: '2025-10-08',
    replies: [
      {
        fistName: 'Alex',
        lastName: 'Brown',
        role: 'Student',
        score: 3,
        text: 'Yeah, more examples would be helpful.',
        countLike: 2,
        countDislike: 0,
        isLike: false,
        isDislike: false,
        dateSubmit: '2025-10-08',
        replies: [],
      },
    ],
  },
]

const openComments = () => {
  isShowAllComments.value = !isShowAllComments.value
}
</script>

<style scoped>
.brief-div {
  border: 1px solid #f2f4f7;
  background-color: #f9fff5;
  /* border: 1px solid #000000; */
  /* background-color: #adf081; */
  min-height: 190px;
}
.rounded-div {
  width: 80px;
  height: 34px;
  border-radius: 0 0 40px 40px;
  /* border-bottom: 1px solid #000000;
  border-left: 1px solid #000000;
  border-right: 1px solid #000000;
  background-color: #adf081; */
  border-bottom: 1px solid #f2f4f7;
  border-left: 1px solid #f2f4f7;
  border-right: 1px solid #f2f4f7;
  background-color: #f9fff5;
  bottom: -34px;
  z-index: 2;
}
.text-think {
  color: #02b719;
  bottom: 10px;
}

.close {
  height: 0;
  border: 1px solid white !important;
}
.open {
  height: 400px;
}
.all-comment-div {
  transition: all 0.5s;
  overflow: hidden;
  /* border: 1px solid #000000; */
  border: 1px solid #f2f4f7;
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

.reply-text {
  color: #2e90fa;
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
  background-color: #d0d5dd;
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
    background-color: white;
    padding-top: 24px;
    border-radius: 24px 24px 0 0;
    z-index: 1006;
    position: fixed;
  }
  .open {
    bottom: 0;
  }
  .send-message-div {
    border: 1px solid #e4e7ec;
  }
  .container-comment {
    height: calc(100% - 128px);
  }
}
</style>
