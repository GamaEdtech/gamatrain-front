<template>
  <v-card
    rounded="lg"
    border
    elevation="0"
    class="pa-4 pa-sm-5"
  >
    <div class="d-flex align-center justify-space-between flex-wrap ga-3">
      <div class="d-flex align-center ga-3">
        <v-avatar
          :image="contentData?.avatar || '/images/member/avatar.svg'"
          size="44"
        />
        <div class="text-h5 text-grey600">
          Uploaded by <b class="text-grey900">{{ authorName }}</b>
          <p class="text-h6 text-grey500">
            <template v-if="contentData?.ownerIdentity">
              {{ contentData.ownerIdentity }} ·
            </template>
            Updated {{ fromNowLocal(contentData?.up_date) }}
          </p>
        </div>
      </div>
      <common-follow-button :user-id="contentData?.user_" />
    </div>

    <div
      v-if="contentData?.description"
      class="description text-h5 text-grey700 mt-4 position-relative"
      :class="seeCompleteDescription ? 'description--open' : 'description--closed'"
    >
      <div
        ref="descriptionContent"
        v-html="contentData.description"
      />
      <div
        v-if="hasOverflow && !seeCompleteDescription"
        class="blur-div position-absolute left-0 bottom-0 w-100"
      />
    </div>
    <button
      v-if="hasOverflow"
      type="button"
      class="pa-0 bg-transparent border-0 text-left cursor-pointer text-h5 d-flex align-center ga-1 mt-1"
      :aria-expanded="seeCompleteDescription"
      @click="seeCompleteDescription = !seeCompleteDescription"
    >
      <span class="text-info">{{ seeCompleteDescription ? 'Read less' : 'Read more' }}</span>
      <v-icon color="info">
        {{ seeCompleteDescription ? 'md:keyboard_arrow_up' : 'md:keyboard_arrow_down' }}
      </v-icon>
    </button>
  </v-card>
</template>

<script setup lang="ts">
interface IContentDetailsSection {
  avatar: string
  first_name: string
  last_name: string
  description: string
  up_date: string
  user_: string
  ownerIdentity?: string
}

const props = defineProps<{
  contentData: IContentDetailsSection
}>()

const { fromNowLocal } = useDateTime()

const authorName = computed(() => `${props.contentData?.first_name ?? ''} ${props.contentData?.last_name ?? ''}`.trim())

const seeCompleteDescription = ref(false)
const descriptionContent = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
const collapsedDescriptionHeight = 72
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
/* The collapsed height is set in CSS, so the server-rendered page already has it and nothing shifts on load. */
.description--closed {
  max-height: 72px;
  overflow: hidden;
}
.blur-div {
  height: 40px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(var(--v-theme-surface), 0) 0%, rgb(var(--v-theme-surface)) 80%);
}
</style>
