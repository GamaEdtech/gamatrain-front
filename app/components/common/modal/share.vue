<template>
  <div class="w-100 d-flex flex-column mt-4">
    <span class="text-h5 font-weight-medium text-grey700">
      Share this content:
    </span>
    <div class="w-100 d-flex flex-wrap flex-sm-nowrap align-center ga-4 ga-sm-1 mt-8">
      <v-btn
        rounded="xl"
        color="primary"
        class="w-100 w-sm-33 text-h5 text-white"
        flat
        @click="copyUrl"
      >
        <v-icon size="16">
          md:content_copy_outlined
        </v-icon>
            &nbsp;
        {{ copyBtnText }}
      </v-btn>

      <v-btn
        target="_blank"
        rounded="xl"
        color="#25d366"
        class="w-100 w-sm-33 text-h5 text-white"
        flat
        @click="shareSocial('whatsapp')"
      >
        <img
          class="icon-image"
          :src="whatsAppIcon"
          alt="share on whatsup "
        >
        &nbsp; WhatsApp
      </v-btn>

      <v-btn
        rounded="xl"
        flat
        color="#00acee"
        class="w-100 w-sm-33 text-h5 text-white"
        @click="shareSocial('telegram')"
      >
        <v-icon> md:near_me_outlined </v-icon> &nbsp; Telegram
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import whatsAppIcon from '~/assets/images/whatsapp.svg'

interface Share {
  title: string
}
const props = defineProps<Share>()

const copyBtnText = ref('Copy')

// Methods
const copyUrl = () => {
  navigator.clipboard.writeText(window.location.href)
  copyBtnText.value = 'Copied'
  setTimeout(() => {
    copyBtnText.value = 'Copy'
  }, 2000)
}

const shareSocial = (platform: string) => {
  if (platform == 'whatsapp')
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`)
  else if (platform == 'telegram')
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${props.title}`,
    )
}
</script>

<style scoped>
.size-icon {
  font-size: 24px;
  margin-right: 12px;
}
.icon-image {
  width: 16px;
  height: 16px;
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(137deg)
    brightness(103%) contrast(101%);
}
</style>
