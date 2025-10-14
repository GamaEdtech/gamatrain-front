<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row>
        <v-col
          cols="8"
          class="d-flex align-center"
        >
          <span class="text-h4 text-sm-h3">Share</span>
        </v-col>
        <v-col
          cols="4"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            class="ml-4"
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:cancel
          </v-icon>
        </v-col>
        <v-col cols="12">
          <p class="mb-3">
            Share this content:
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-btn
            rounded="xl"
            color="primary"
            class="w-100 text-h5"
            flat
            @click="copyUrl"
          >
            <v-icon size="16">
              md:content_copy_outlined
            </v-icon>
            &nbsp;
            {{ copyBtnText }}
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-btn
            target="_blank"
            rounded="xl"
            color="#25d366"
            class="w-100 text-h5 text-white"
            flat
            @click="shareSocial('whatsapp')"
          >
            <img
              class="icon-image"
              src="@/assets/images/whatsapp.svg"
              alt="whatsup"
            >
            &nbsp; WhatsApp
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-btn
            rounded="xl"
            flat
            color="#00acee"
            class="w-100 text-h5 text-white"
            @click="shareSocial('telegram')"
          >
            <v-icon> md:near_me_outlined </v-icon> &nbsp; Telegram
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IShareModal {
  showDialog?: boolean
  title: string
}

const { mdAndUp } = useDisplay()
const props = withDefaults(defineProps<IShareModal>(), {
  showDialog: false,
})

const emit = defineEmits(['update:showDialog'])

// Start Section Handle Status Modal
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}
// End Section Handle Status Modal

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

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
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
