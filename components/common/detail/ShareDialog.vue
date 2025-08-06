<template>
  <v-dialog
    transition="dialog-top-transition"
    class="share_dialog"
    max-width="600"
  >
    <template #activator="{ props: dialogProps }">
      <span
        v-bind="dialogProps"
        class="share-trigger pointer"
      >
        <v-icon class="mr-1">mdi-share-variant-outline</v-icon>
        Share
      </span>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="default"
          title="Share"
        />
        <v-card-text class="mt-5">
          <p class="mb-3">
            Share this content:
          </p>
          <v-row>
            <v-col cols="12">
              <v-btn
                outlined
                block
                @click="copyUrl"
              >
                <v-icon class="mr-1">
                  mdi-content-copy
                </v-icon> &nbsp;
                {{ copyBtnText }}
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                target="_blank"
                block
                color="#25d366"
                class="text-white"
                @click="shareSocial('whatsapp')"
              >
                <v-icon class="mr-1">
                  mdi-whatsapp
                </v-icon>
                WhatsApp
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="#00acee"
                class="text-white"
                @click="shareSocial('telegram')"
              >
                <v-icon class="mr-1">
                  mdi-near-me
                </v-icon>
                Telegram
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="isActive.value = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})

// Reactive data
const copyBtnText = ref('Copy')

// Methods
function copyUrl() {
  navigator.clipboard.writeText(window.location.href)
  copyBtnText.value = 'Copied'
  setTimeout(() => {
    copyBtnText.value = 'Copy'
  }, 2000)
}

function shareSocial(platform) {
  if (platform == 'whatsapp')
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`)
  else if (platform == 'telegram')
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${props.title}`,
    )
}
</script>
