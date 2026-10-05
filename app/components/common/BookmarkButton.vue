<template>
  <div
    class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
    @click="addBookmarkClick"
  >
    <v-progress-circular
      v-if="loading"
      size="18"
      width="2"
      color="primary-gray-700"
      indeterminate
    />
    <v-icon
      v-else
      :color="bookmarked ? 'primary' : 'primary-gray-700'"
    >
      {{ bookmarked ? 'md:bookmark' : 'md:bookmark_outlined' }}
    </v-icon>
    <v-tooltip
      activator="parent"
      location="top"
    >
      {{ bookmarked ? 'Bookmarked' : 'Bookmark' }}
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import type { BookmarkContentType } from '@/composables/useBookmark'

interface IBookmarkButton {
  type: BookmarkContentType
  id: string | number
}

const props = defineProps<IBookmarkButton>()

const auth = useAuth()
const router = useRouter()
const { addBookmark, loading } = useBookmark()

const bookmarked = ref(false)

const redirectToLogin = () => {
  router.push({})
  setTimeout(() => {
    router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
  }, 100)
}

const addBookmarkClick = async () => {
  if (bookmarked.value || loading.value) return

  if (!auth.isAuthenticated.value) {
    redirectToLogin()
    return
  }

  const success = await addBookmark(props.type, props.id)
  if (success) bookmarked.value = true
}
</script>
