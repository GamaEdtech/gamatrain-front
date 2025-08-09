<script setup>
const _props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  message: String,
  email: String,
  name: String,
  disableNext: Boolean,
  disableBack: Boolean,
})

const _emit = defineEmits(['update:modelValue', 'back', 'next'])
const messageReply = ref(null)
</script>

<template>
  <div class="text-center">
    <v-dialog
      :model-value="modelValue"
      width="500"
      @click:outside="$emit('update:modelValue', false)"
    >
      <v-card class="bg-primary-gray-100">
        <v-card-title
          class="gtext-t4 bg-white flex-column d-flex align-center pt-12"
        >
          <div class="avatarBg">
            <img
              width="64"
              height="64"
              src="/images/adminAuth.png"
              alt="avatar"
            >
          </div>
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            {{ name }}
          </p>
          <p class="primary-gray-500 gtext-t3 mb-6">
            {{ email }}
          </p>
        </v-card-title>

        <div class="mx-16 scrollcontainerdialog">
          <div class="messageContainer">
            <v-card-text class="mt-4 messageText">
              <span class="gtext-t5 pb-4"> {{ message }} </span>
            </v-card-text>
            <div class="bottom-fade" />
          </div>

          <v-row
            class="mt-4"
            no-gutters
          >
            <v-col
              cols="12"
              sm="6"
            >
              <v-btn
                class="rounded-pill mr-7 bg-F8F9FC"
                height="24px"
              >
                <span class="mdi mdi-image-area color-4E5BA6">1.png</span>
              </v-btn>
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="d-flex align-center justify-sm-end mt-2 mt-sm-0"
            >
              <p class="gray--text gtext-t6 text mb-0">
                Send Date:&nbsp;
              </p>
              <p class="primary-gray-600 gtext-t5 mb-0">
                02/22/2025
              </p>
            </v-col>
          </v-row>

          <div class="dashed-divider my-4" />
          <div class="d-flex mb-2">
            <p class="primary-gray-700 gtext-t6 font-weight-medium">
              Reply to&nbsp;
            </p>
            <p />
            <p
              class="gtext-t6 font-weight-medium"
              style="color: #ffb600"
            >
              {{ name }}
            </p>
          </div>
          <v-textarea
            v-model="messageReply"
            variant="solo"
            name="replyMessage"
            placeholder="Enter here.............."
            class="rounded-lg p-3 gtext-t6 primary-gray-700"
            no-resize
            height="181"
          />

          <v-row
            class="align-center"
            no-gutters
          >
            <v-col
              cols="12"
              sm="auto"
              class="mb-2 mb-sm-0"
            >
              <v-btn
                class="rounded-pill mr-sm-4 align-center bg-F8F9FC gtext-t5"
                color="#2E90FA"
                height="32px"
                variant="plain"
                prepend-icon="mdi-paperclip"
              >
                Attach File
              </v-btn>
            </v-col>

            <v-col
              cols="12"
              sm="auto"
            >
              <div
                class="d-flex rounded-pill align-center bg-F8F9FC max-width-fit"
              >
                <p
                  class="gtext-t5 dont-weight-medium mdi mdi-file-pdf-box px-2 py-1 mb-0 color-4E5BA6"
                >
                  Sample.pdf
                </p>
              </div>
            </v-col>
          </v-row>

          <v-card-actions class="px-0">
            <v-spacer />
            <v-btn
              class="closeBtn"
              text
              @click="$emit('update:modelValue', false)"
            >
              <span class="mdi mdi-close gtext-t1" />
            </v-btn>

            <v-row
              class="w-100 mb-12 mt-11 justify-center"
              no-gutters
              align="center"
            >
              <v-col
                cols="12"
                sm="4"
                class="d-flex justify-center order-1 order-sm-2 mb-4 mb-sm-0 replyBtn"
              >
                <v-btn
                  class="bg-primary-gray-700 rounded-pill w-100"
                  density="default"
                >
                  <span class="mdi mdi-reply text-white gtext-t4">Reply</span>
                </v-btn>
              </v-col>

              <v-col
                cols="6"
                sm="4"
                class="d-flex justify-start order-2 order-sm-1 max-width-fit mr-4"
              >
                <v-btn
                  class="bg-white rounded-pill"
                  density="default"
                  :disabled="disableBack"
                  @click="$emit('back')"
                >
                  <span class="mdi mdi-chevron-left primary-gray-900 gtext-t5">Back</span>
                </v-btn>
              </v-col>

              <v-col
                cols="6"
                sm="4"
                class="d-flex justify-end order-3 order-sm-3 max-width-fit ml-4"
              >
                <v-btn
                  class="bg-white rounded-pill"
                  density="default"
                  :disabled="disableNext"
                  @click="$emit('next')"
                >
                  <span
                    class="mdi mdi-chevron-right primary-gray-900 gtext-t5 d-flex flex-row-reverse align-end"
                  >
                    Next
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
:deep(.v-field__input) {
  font-family: Inter, sans-serif;
  font-size: 1.6rem;
  line-height: 1.8rem;
  font-weight: 400;
}
:deep(.v-field) {
  border-radius: 16px;
  border: 1px solid #e4e7ec;
  box-shadow: none;
}
.v-input {
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1.8rem !important;
  font-weight: 400 !important;
}
.dashed-divider {
  border-top: 1px dashed #d0d5dd; /* similar to v-divider */
  width: 100%;
}
.avatarBg {
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f2f4f7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.messageContainer {
  position: relative;
}
.messageText {
  height: 212px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px !important;
}
.messageText::-webkit-scrollbar {
  width: 4px; /* thinner scrollbar */
}

.messageText::-webkit-scrollbar-track {
  background: white; /* or a subtle background */
  border-radius: 4px;
}

.messageText::-webkit-scrollbar-thumb {
  background-color: #98a2b3; /* lighter thumb */
  border-radius: 4px;
}

.bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 18px; /* fading height */
  width: 100%;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    transparent,
    #f2f4f7
  ); /* Adjust color to match your background */
}

.closeBtn {
  width: 24px !important;
  min-width: 24px !important;
  height: 24px !important;
  color: #d0d5dd;
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 0px !important;
}

/* Scoped to dialog card's scrollbar */
:deep(.v-dialog .scrollcontainerdialog::-webkit-scrollbar) {
  width: 60px;
}

:deep(.v-dialog .scrollcontainerdialog::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.v-dialog .v-card::-webkit-scrollbar-track {
  background: transparent;
}

/* Firefox support */
.v-dialog .v-card {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.bg-F8F9FC {
  background-color: #f8f9fc;
}
.color-4E5BA6 {
  color: #4e5ba6;
}

.max-width-fit {
  max-width: fit-content;
}

.replyBtn {
  min-width: 170px;
}
</style>
