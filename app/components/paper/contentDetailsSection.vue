<template>
  <div class="w-100 d-flex align-center justify-space-between">
    <div class="ga-1 d-flex align-center">
      <v-img
        width="48"
        height="48"
        :src="contentData?.avatar"
        class="rounded-circle"
        alt="user profile"
      />
      <p class="text-h5 font-weight-bold">
        {{ contentData?.first_name }} {{ contentData?.last_name }}
      </p>
    </div>
    <span class="text-h5 d-flex align-center ga-1 cursor-pointer">
      <v-progress-circular
        v-if="loadingFollow || loadingCheckConnectionStatus || loadingUnfollow"
        color="info"
        size="20"
        indeterminate
        :width="2"
      />
      <div
        v-else
        class="text-h5 d-flex align-center text-info ga-1"
        @click="startFollowProccess"
      >
        <v-icon color="info">{{ isFollow ? 'md:notifications':'md:notifications_outlined' }}</v-icon>
        {{ isFollow ? 'unfollow':'follow' }}
      </div>
    </span>
  </div>

  <div
    :class="`w-100 text-h5 mt-4 position-relative ${
      seeCompleteDescription ? `open-description` : `close-description`
    }`"
  >
    <div
      ref="descriptionContent"
      v-html="contentData?.description"
    />

    <div
      v-if="hasOverflow && !seeCompleteDescription"
      class="blur-div position-absolute left-0 bottom-0 w-100"
    />
  </div>
  <button
    v-if="hasOverflow"
    type="button"
    class="w-100 pa-0 bg-transparent border-0 text-left cursor-pointer text-h5 d-flex align-center ga-1 mt-1"
    :aria-expanded="seeCompleteDescription"
    @click="seeCompleteDescription = !seeCompleteDescription"
  >
    <span class="text-info">{{ seeCompleteDescription ? `See Less` : `See More` }}</span>
    <v-icon color="info">
      {{ seeCompleteDescription ? 'md:keyboard_arrow_up' : 'md:keyboard_arrow_down' }}
    </v-icon>
  </button>

  <div class="w-100 d-flex align-center justify-space-between mt-8">
    <span class="text-h5 d-flex align-center primary-gray-600 ga-1">
      <v-icon color="#475467">md:files_outlined</v-icon>
      {{ contentData?.test_type_title }}
    </span>
    <span class="text-h5 d-flex align-center primary-gray-600 ga-1">
      <v-icon color="#475467">md:update</v-icon>
      {{ fromNowLocal(contentData?.up_date) }}
    </span>
  </div>

  <div class="w-100 d-flex flex-wrap ga-2 mt-3">
    <v-chip
      class="bg-primary-gray-100"
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}`"
      flat
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.section_title }}</span>
    </v-chip>
    <v-chip
      class="bg-primary-gray-100"
      flat
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}`"
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.base_title }}</span>
    </v-chip>
    <v-chip
      class="bg-primary-gray-100"
      flat
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.lesson_title }}</span>
    </v-chip>
    <v-chip
      class="bg-primary-gray-100"
      flat
      :small="mdAndDown"
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.edu_month_title }}</span>
    </v-chip>
    <v-chip
      :small="mdAndDown"
      :to="`/search?type=paper&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}&edu_year=${contentData?.edu_year}`"
      class="bg-primary-gray-100"
      flat
    >
      <span class="primary-gray-500 text-h6 font-weight-bold">
        {{ contentData?.edu_year }}</span>
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IContentDetailsSection {
  avatar: string
  first_name: string
  last_name: string
  description: string
  test_type_title?: string
  up_date: string
  section: string
  section_title: string
  base: string
  base_title: string
  lesson: string
  lesson_title: string
  edu_month_title: string
  edu_year: string
  ownerIdentity: string
  user_: string
}

const props = defineProps<{
  contentData: IContentDetailsSection
}>()

const { fromNowLocal } = useDateTime()
const { mdAndDown } = useDisplay()
const { follow, loadingFollow, unFollow, loadingUnfollow, checkConnectionStatus, loadingCheckConnectionStatus } = useConnection()
const { isAuthenticated } = useAuth()
const router = useRouter()

const seeCompleteDescription = ref(false)
const isFollow = ref(false)

const startFollowProccess = async () => {
  if (isAuthenticated.value) {
    if (isFollow.value) {
      // const response =
      await unFollow(props.contentData.user_)
      // if (response.succeeded) {
      //   isFollow.value = false
      // }
    }
    else {
      // const response =
      await follow(props.contentData.user_)
      // if (response.succeeded) {
      //   isFollow.value = true
      // }
    }
  }
  else {
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
}

const descriptionContent = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
const collapsedDescriptionHeight = 70
let descriptionResizeObserver: ResizeObserver | null = null

function updateDescriptionOverflow() {
  hasOverflow.value = (descriptionContent.value?.scrollHeight ?? 0) > collapsedDescriptionHeight
}

onMounted(async () => {
  await nextTick()
  updateDescriptionOverflow()

  if (descriptionContent.value && typeof ResizeObserver !== 'undefined') {
    descriptionResizeObserver = new ResizeObserver(updateDescriptionOverflow)
    descriptionResizeObserver.observe(descriptionContent.value)
  }

  if (isAuthenticated.value) {
    const response = await checkConnectionStatus({
      ids: [Number(props.contentData.user_)],
      idType: 'CoreId',
    })
    if (response.succeeded && response.data && response.data.length > 0) {
      isFollow.value = response.data[0]?.isFollowing || false
    }
  }
})

watch(
  () => props.contentData?.description,
  async () => {
    seeCompleteDescription.value = false
    await nextTick()
    updateDescriptionOverflow()
  },
)

onBeforeUnmount(() => {
  descriptionResizeObserver?.disconnect()
})
</script>

<style scoped>
.open-description {
  height: unset;
  min-height: 70px;
  overflow: unset;
}
.close-description {
  max-height: 70px;
  overflow: hidden;
}
.blur-div {
  height: 40px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 80%);
}
</style>
