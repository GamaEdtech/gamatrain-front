<template>
  <div>
    <!-- Dialog for share -->
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
          <v-icon class="mr-1 icon">md:share</v-icon>
          Share
        </span>
      </template>
      <template #default="{ isActive }">
        <v-card>
          <v-toolbar
            color="default"
            title="Share"
          />
          <v-card-text>
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
                  <v-icon class="mr-1 icon">
                    md:content_copy
                  </v-icon>
                  &nbsp;
                  {{ copyBtnText }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  target="_blank"
                  block
                  color="#25d366"
                  class="text-white"
                  @click="shareWhatsApp"
                >
                  WhatsApp
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="#00acee"
                  class="text-white"
                  @click="shareTelegram"
                >
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['copy', 'share'])

const copyBtnText = ref('Copy')

function copyUrl() {
  emit('copy')
  copyBtnText.value = 'Copied'
}

function shareWhatsApp() {
  emit('share', 'whatsapp')
}

function shareTelegram() {
  emit('share', 'telegram')
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
