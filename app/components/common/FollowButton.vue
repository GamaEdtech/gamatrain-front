<template>
  <v-btn
    v-if="showButton"
    variant="text"
    color="info"
    class="text-h5 text-none px-1"
    :prepend-icon="isFollowing ? 'md:notifications' : 'md:notifications_outlined'"
    :loading="checkingStatus || loadingFollow || loadingUnfollow"
    @click="toggleFollow"
  >
    {{ isFollowing ? 'unfollow' : 'follow' }}
  </v-btn>
</template>

<script setup lang="ts">
interface IFollowButton {
  /** The content author's core user id (`user_` on paper, exam and multimedia details). */
  userId: string | number | null | undefined
}

const props = defineProps<IFollowButton>()

const { isAuthenticated } = useAuth()
// Set only once the profile request succeeds (init-user plugin or the login dialog), so it means the token is valid.
const { user } = useUser()
const router = useRouter()
const { follow, unFollow, checkConnectionStatus, loadingFollow, loadingUnfollow } = useConnection()

const authorId = computed(() => Number(props.userId))
const hasAuthor = computed(() => Number.isInteger(authorId.value) && authorId.value > 0)
const isOwnContent = computed(() => user.value?.coreId === authorId.value)
const showButton = computed(() => hasAuthor.value && !isOwnContent.value)

const isFollowing = ref(false)
// The user is loaded on the client only, but the auth cookie is readable on the server, so a probably signed-in
// viewer gets the loading state from the first render instead of a "follow" that flips to "unfollow".
const checkingStatus = ref(isAuthenticated.value && hasAuthor.value)
// A signed-out click opens the login dialog; the follow is finished once the login succeeds.
const followAfterLogin = ref(false)
let statusRequest = 0

const refreshStatus = async () => {
  const request = ++statusRequest

  if (!user.value || !showButton.value) {
    isFollowing.value = false
    checkingStatus.value = false
    return
  }

  checkingStatus.value = true
  const response = await checkConnectionStatus({ ids: [authorId.value], idType: 'CoreId' })
  if (request !== statusRequest) return

  isFollowing.value = response.succeeded && !!response.data?.[0]?.isFollowing
  checkingStatus.value = false
}

const toggleFollow = async () => {
  if (!user.value) {
    followAfterLogin.value = true
    // The header opens the login dialog for this query and then clears it, so the page stays where it is.
    router.push({ query: { auth_form: 'login' } })
    return
  }

  const response = isFollowing.value
    ? await unFollow(authorId.value)
    : await follow(authorId.value)

  if (response.succeeded) isFollowing.value = !isFollowing.value
  // A refusal such as "already following" means our state is stale, so re-read it.
  else await refreshStatus()
}

const onUserChange = async () => {
  await refreshStatus()

  if (!followAfterLogin.value || !user.value) return
  followAfterLogin.value = false
  if (showButton.value && !isFollowing.value) await toggleFollow()
}

onMounted(refreshStatus)
// Logging in through the dialog keeps the page, and navigating between papers reuses this component.
watch(user, onUserChange)
watch(authorId, () => {
  followAfterLogin.value = false
  refreshStatus()
})
</script>
