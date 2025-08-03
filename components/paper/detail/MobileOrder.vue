<template>
  <v-card class="order-btn-holder d-block d-md-none">
    <v-card-text class="pb-0">
      <v-row class="px-10 text-center">
        <v-col
          cols="12"
          class="pb-1 pt-0"
        >
          <div v-if="contentData?.files?.word.exist">
            <v-btn
              block
              color="primary"
              class="mb-2"
              :loading="qWordFileDownloadLoading"
              @click="$emit('download', 'q_word')"
            >
              <v-icon
                size="x-large"
                class="mr-1"
              >
                mdi-file-pdf-box
              </v-icon>
              Download Question Doc
              {{
                contentData?.files?.word.price > 0
                  ? "| $" + contentData?.files?.word.price
                  : ""
              }}
            </v-btn>
          </div>
          <div v-if="contentData?.files.pdf.exist">
            <v-btn
              class="mb-2 text-white font-weight-bold"
              block
              color="#E60012"
              :loading="qPdfFileDownloadLoading"
              @click="$emit('download', 'q_pdf')"
            >
              <v-icon
                size="x-large"
                class="mr-1"
              >
                mdi-file-pdf-box
              </v-icon>
              Download Question Paper
              {{
                contentData?.files?.pdf.price > 0
                  ? "| $" + contentData?.files?.pdf.price
                  : ""
              }}
            </v-btn>
          </div>
          <div v-if="contentData?.files.answer.exist">
            <v-btn
              v-show="contentData?.files.answer.ext == 'pdf'"
              class="mb-2 font-weight-bold"
              block
              color="teal accent-3"
              :loading="answerFileDownloadLoading"
              @click="$emit('download', 'a_file')"
            >
              <v-icon
                size="x-large"
                class="mr-1"
              >
                mdi-file-pdf-box
              </v-icon>
              Download Mark Scheme
              {{
                contentData?.files?.answer.price > 0
                  ? "| $" + contentData?.files?.answer.price
                  : ""
              }}
            </v-btn>
            <v-btn
              v-show="contentData?.files.answer.ext == 'word'"
              block
              color="primary"
              class="mb-2"
              :loading="answerFileDownloadLoading"
              @click="$emit('download', 'a_file')"
            >
              Download Answer Doc
              {{
                contentData?.files?.answer.price > 0
                  ? "| $" + contentData?.files?.answer.price
                  : ""
              }}
            </v-btn>
          </div>
          <div
            v-if="
              contentData?.files.extra && contentData.files.extra.length > 0
            "
          >
            <v-btn
              v-for="(extra, index) in contentData.files.extra"
              :key="index"
              block
              color="blue"
              class="mb-2 font-weight-bold"
              :loading="extraFileDownloadLoading"
              @click="$emit('download', 'extra', extra.id)"
            >
              <template v-if="extra?.ext =='mp3'">
                <v-icon
                  size="x-large"
                  class="mr-1"
                >
                  mdi-volume-high
                </v-icon>
              </template>
              Download {{ extra.type_title ? extra.type_title : "Extra" }}
              {{ extra.price > 0 ? "| $" + extra.price : "" }}
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <div
            v-if="!isFree"
            class="mb-4"
          >
            <p v-if="!isLoggedIn">
              <span class="mdi mdi-bell icon" />
              <span
                class="login blue--text"
                @click="$emit('open-auth', 'login')"
              >Login</span>
              <span
                class="register blue--text"
                @click="$emit('open-auth', 'register')"
              >
                (register)
              </span>
              <span>to download and charge.</span>
            </p>
            <span v-else>
              Your wallet charge is ${{ userCredit }}
              <nuxt-link
                v-if="isLoggedIn"
                class="blue--text"
                to="/user/charge-wallet"
              >(Top Up Wallet)</nuxt-link>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  contentData: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  userCredit: {
    type: [Number, String],
    default: 0,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  qWordFileDownloadLoading: {
    type: Boolean,
    default: false,
  },
  qPdfFileDownloadLoading: {
    type: Boolean,
    default: false,
  },
  answerFileDownloadLoading: {
    type: Boolean,
    default: false,
  },
  extraFileDownloadLoading: {
    type: Boolean,
    default: false,
  },
})

const _emits = defineEmits(['download', 'open-auth'])
</script>

<style scoped>
.order-btn-holder {
  position: fixed !important;
  bottom: 0 !important;
  z-index: 2 !important;
  padding-top: 16px !important;
  background: #f6f8fa !important;
  border-top: 0.1rem solid #e1e2e3;
  width: 100%;
  left: 0;
  right: 0;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}
</style>
