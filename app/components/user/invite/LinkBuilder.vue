<template>
  <div class="w-100 bg-white border rounded-xl pa-4 pa-md-6 d-flex flex-column ga-4">
    <div class="d-flex flex-column ga-1">
      <h3 class="text-h4 font-weight-bold text-grey700">
        Your invite link
      </h3>
      <span class="text-h6 text-grey500">
        Pick the page your students should land on. Every link carries your code, so sign-ups from any of them count.
      </span>
    </div>

    <v-chip-group
      v-model="target"
      mandatory
      column
      selected-class="bg-primary text-grey900"
      class="ma-0"
    >
      <v-chip
        v-for="option in targets"
        :key="option.value"
        :value="option.value"
        :prepend-icon="option.icon"
        variant="outlined"
        class="text-h6 font-weight-medium"
      >
        {{ option.label }}
      </v-chip>
    </v-chip-group>

    <v-text-field
      v-if="target === 'custom'"
      v-model="customUrl"
      label="Paste a gamatrain page link"
      placeholder="https://gamatrain.com/paper/..."
      rounded="lg"
      density="comfortable"
      variant="outlined"
      color="primary"
      base-color="grey400"
      bg-color="white"
      :error-messages="customError"
      hide-details="auto"
      prepend-inner-icon="md:link"
    />

    <div class="link-row w-100 d-flex flex-column flex-sm-row align-stretch ga-2">
      <div
        class="link-box flex-grow-1 bg-grey100 rounded-lg px-4 d-flex align-center text-h6 text-grey700"
        data-testid="invite-link"
      >
        <span class="text-truncate">{{ inviteLink || 'Paste a page link above' }}</span>
      </div>
      <v-btn
        color="primary"
        rounded="lg"
        height="48"
        flat
        :disabled="!inviteLink"
        :prepend-icon="copied ? 'md:check' : 'md:content_copy'"
        class="text-h5 font-weight-bold text-grey900 px-6"
        @click="copyLink"
      >
        {{ copied ? 'Copied' : 'Copy link' }}
      </v-btn>
    </div>

    <div class="d-flex flex-wrap align-center ga-2">
      <span class="text-h6 text-grey500 mr-1">Share:</span>
      <v-btn
        v-if="canNativeShare"
        variant="tonal"
        rounded="pill"
        height="36"
        class="text-none text-h6"
        prepend-icon="md:share"
        :disabled="!inviteLink"
        @click="nativeShare"
      >
        Share
      </v-btn>
      <v-btn
        v-for="channel in channels"
        :key="channel.name"
        variant="tonal"
        rounded="pill"
        height="36"
        class="text-none text-h6"
        :prepend-icon="channel.icon"
        :href="inviteLink ? channel.href(inviteLink) : undefined"
        :disabled="!inviteLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ channel.name }}
      </v-btn>
      <v-btn
        variant="tonal"
        rounded="pill"
        height="36"
        class="text-none text-h6"
        prepend-icon="md:qr_code_2"
        :disabled="!inviteLink"
        @click="showQr = true"
      >
        QR code
      </v-btn>
    </div>

    <span class="text-subtitle-1 text-grey500">
      Your code: <b class="text-grey700">{{ code }}</b>. Anyone who signs up within 30 days of opening your link becomes your
      invitee for good.
    </span>

    <lazy-common-modal-base
      v-model:show-dialog="showQr"
      title="Invite QR code"
      subtitle="Show it in class or print it on a handout."
      :max-width="420"
    >
      <div class="w-100 d-flex flex-column align-center ga-4 pt-4">
        <div
          ref="qrRef"
          class="bg-white pa-3 rounded-lg border"
        >
          <qrcode-vue
            :value="inviteLink"
            :size="240"
            level="M"
            render-as="canvas"
          />
        </div>
        <v-btn
          color="primary"
          rounded="pill"
          flat
          prepend-icon="md:download"
          class="text-h5 font-weight-bold text-grey900"
          @click="downloadQr"
        >
          Download PNG
        </v-btn>
      </div>
    </lazy-common-modal-base>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

import { buildInviteLink } from '~/utils/inviteCode'

const props = defineProps<{ code: string }>()

const { $toast } = useNuxtApp()

type Target = 'home' | 'papers' | 'blog' | 'custom'

const targets: { value: Target, label: string, icon: string, path?: string }[] = [
  { value: 'home', label: 'Home page', icon: 'md:home', path: '/' },
  { value: 'papers', label: 'Past papers', icon: 'md:description', path: '/search?type=paper' },
  { value: 'blog', label: 'Blog', icon: 'md:article', path: '/post' },
  { value: 'custom', label: 'Any page', icon: 'md:link' },
]

const target = ref<Target>('home')
const customUrl = ref('')
const copied = ref(false)
const showQr = ref(false)
const qrRef = ref<HTMLElement | null>(null)
const canNativeShare = ref(false)

const origin = useRequestURL().origin

/** A pasted link must be one of our own pages; anything else would send students elsewhere with your code. */
const customError = computed(() => {
  if (!customUrl.value.trim()) return ''
  try {
    const url = new URL(customUrl.value.trim())
    return url.host === new URL(origin).host ? '' : 'Use a link to a page on this site.'
  }
  catch {
    return 'That doesn\'t look like a link.'
  }
})

const inviteLink = computed(() => {
  if (target.value === 'custom') {
    if (!customUrl.value.trim() || customError.value) return ''
    return buildInviteLink(customUrl.value.trim(), props.code)
  }

  const path = targets.find(t => t.value === target.value)?.path ?? '/'
  return buildInviteLink(`${origin}${path}`, props.code)
})

const shareText = 'Join me on Gamatrain: past papers, exams and study tools for students.'

const channels = [
  { name: 'WhatsApp', icon: 'md:chat', href: (link: string) => `https://wa.me/?text=${encodeURIComponent(`${shareText} ${link}`)}` },
  { name: 'Telegram', icon: 'md:send', href: (link: string) => `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}` },
  { name: 'Email', icon: 'md:mail', href: (link: string) => `mailto:?subject=${encodeURIComponent('Join me on Gamatrain')}&body=${encodeURIComponent(`${shareText}\n\n${link}`)}` },
]

let copiedTimer: ReturnType<typeof setTimeout> | null = null

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    $toast.error('Could not copy. Select the link and copy it yourself.')
  }
}

const nativeShare = async () => {
  try {
    await navigator.share({ title: 'Gamatrain', text: shareText, url: inviteLink.value })
  }
  catch {
    // Closed the share sheet: nothing to do.
  }
}

const downloadQr = () => {
  const canvas = qrRef.value?.querySelector('canvas')
  if (!canvas) return
  const link = document.createElement('a')
  link.download = 'gamatrain-invite-qr.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

onMounted(() => {
  canNativeShare.value = typeof navigator.share === 'function'
})

onBeforeUnmount(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>

<style scoped>
.link-box {
  min-height: 48px;
  min-width: 0;
}
</style>
