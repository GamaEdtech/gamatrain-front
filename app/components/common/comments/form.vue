<template>
  <v-text-field
    v-model="commentText"
    variant="solo"
    hide-details
    placeholder="Got something to say?"
  >
    <template #prepend-inner>
      <v-avatar
        v-if="user?.avatar"
        size="32"
      >
        <v-img
          :src="user?.avatar"
          alt="user avatar"
        />
      </v-avatar>
      <v-icon
        v-else
        size="32"
      >
        md:account_circle
      </v-icon>
    </template>

    <template #append-inner>
      <v-btn
        flat
        icon
        width="32"
        height="32"
        color="greenLight500"
        :loading="loadingAddItem || loadingToken"
        @click="sendComment"
      >
        <v-icon color="white">
          md:send
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
interface IFormComment {
  id: string
}

const props = defineProps<IFormComment>()
const emit = defineEmits(['sendCommentSuccessfull'])

const { $toast } = useNuxtApp()
const router = useRouter()
const { user } = useUser()
const auth = useAuth()
const { getToken, isLoaded } = useRecaptcha()
const loadingToken = ref(false)
const { addItem, loadingAddItem } = useBlogComment()

const commentText = ref('')

const sendComment = async () => {
  if (auth.isAuthenticated.value) {
    if (!isLoaded()) {
      $toast.error('reCAPTCHA not loaded yet. Please try again.')
    }

    loadingToken.value = true
    const token = await getToken('submit')

    const response = await addItem({
      captcha: token,
      comment: commentText.value,
    }, props.id)
    loadingToken.value = false
    if (response.succeeded && response.data) {
      // const fullName = [user.value?.firstName, user.value?.lastName]
      //   .filter(Boolean)
      //   .join(' ')

      // const creationUser
      //   = fullName || user.value?.userName || 'unknown'
      // const comment = {
      //   id: response.data.id,
      //   creationUser: creationUser,
      //   creationUserAvatar: user.value?.avatar,
      //   creationDate: new Date(),
      //   comment: commentText.value,
      //   likeCount: 0,
      //   dislikeCount: 0,
      // }
      // emit('sendCommentSuccessfull', comment)
      emit('sendCommentSuccessfull')
      commentText.value = ''
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

<style scoped></style>
