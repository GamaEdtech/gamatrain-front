<template>
  <v-card class="order-btn-holder d-block d-md-none">
    <v-card-text class="pb-0">
      <v-row class="px-4 text-center">
        <v-col
          cols="12"
          class="pb-1 pt-0"
        >
          <div v-if="contentData?.files?.word.exist">
            <v-btn
              block
              color="primary"
              class="mb-2 text-h6 position-relative"
              variant="flat"
              :loading="qWordFileDownloadLoading && !isDownloading('q_word')"
              @click="$emit('download', 'q_word')"
            >
              <template v-if="isDownloading('q_word')">
                <v-progress-circular
                  :model-value="getDownloadProgress('q_word')"
                  size="20"
                  width="2"
                  color="white"
                  class="position-absolute"
                  style="z-index: 2"
                />
              </template>
              <v-icon
                size="x-large"
                class="btn-icon"
                :class="{ 'text-transparent': isDownloading('q_word') }"
              >
                mdi-file-word-box
              </v-icon>
              <span :class="{ 'text-transparent': isDownloading('q_word') }">
                Download Question Doc
              </span>
              <template
                v-if="
                  requiresCoinPaymentForFile('q_word')
                    && contentData?.files?.word.price === 0
                "
              >
                <v-icon
                  size="small"
                  color="orange"
                  :class="{ 'text-transparent': isDownloading('q_word') }"
                >
                  mdi-coin
                </v-icon>
              </template>
              <template v-else-if="contentData?.files?.word.price > 0">
                <span :class="{ 'text-transparent': isDownloading('q_word') }">
                  | ${{ contentData?.files?.word.price }}
                </span>
              </template>
            </v-btn>
          </div>
          <div v-if="contentData?.files.pdf.exist">
            <v-btn
              class="mb-2 text-h6 text-white font-weight-bold position-relative"
              block
              variant="flat"
              color="#E60012"
              :loading="qPdfFileDownloadLoading && !isDownloading('q_pdf')"
              @click="$emit('download', 'q_pdf')"
            >
              <template v-if="isDownloading('q_pdf')">
                <v-progress-circular
                  :model-value="getDownloadProgress('q_pdf')"
                  size="20"
                  width="2"
                  color="white"
                  class="position-absolute"
                  style="z-index: 2"
                />
              </template>
              <v-icon
                size="x-large"
                class="btn-icon"
                :class="{ 'text-transparent': isDownloading('q_pdf') }"
              >
                mdi-file-pdf-box
              </v-icon>
              <span :class="{ 'text-transparent': isDownloading('q_pdf') }">
                Download Question Paper
              </span>
              <template
                v-if="
                  requiresCoinPaymentForFile('q_pdf')
                    && contentData?.files?.pdf.price === 0
                "
              >
                <v-icon
                  size="small"
                  color="orange"
                  :class="{ 'text-transparent': isDownloading('q_pdf') }"
                >
                  mdi-coin
                </v-icon>
              </template>
              <template v-else-if="contentData?.files?.pdf.price > 0">
                <span :class="{ 'text-transparent': isDownloading('q_pdf') }">
                  | ${{ contentData?.files?.pdf.price }}
                </span>
              </template>
            </v-btn>
          </div>
          <div v-if="contentData?.files.answer.exist">
            <v-btn
              v-show="contentData?.files.answer.ext == 'pdf'"
              class="mb-2 text-h6 font-weight-bold position-relative"
              variant="flat"
              block
              color="teal accent-3"
              :loading="answerFileDownloadLoading && !isDownloading('a_file')"
              @click="$emit('download', 'a_file')"
            >
              <template v-if="isDownloading('a_file')">
                <v-progress-circular
                  :model-value="getDownloadProgress('a_file')"
                  size="20"
                  width="2"
                  color="white"
                  class="position-absolute"
                  style="z-index: 2"
                />
              </template>
              <v-icon
                size="x-large"
                class="btn-icon"
                :class="{ 'text-transparent': isDownloading('a_file') }"
              >
                mdi-file-pdf-box
              </v-icon>
              <span :class="{ 'text-transparent': isDownloading('a_file') }">
                Download Mark Scheme
              </span>
              <template
                v-if="
                  requiresCoinPaymentForFile('a_file')
                    && contentData?.files?.answer.price === 0
                "
              >
                <v-icon
                  size="small"
                  color="orange"
                  :class="{ 'text-transparent': isDownloading('a_file') }"
                >
                  mdi-coin
                </v-icon>
              </template>
              <template v-else-if="contentData?.files?.answer.price > 0">
                <span :class="{ 'text-transparent': isDownloading('a_file') }">
                  | ${{ contentData?.files?.answer.price }}
                </span>
              </template>
            </v-btn>
            <v-btn
              v-show="contentData?.files.answer.ext == 'word'"
              block
              variant="flat"
              color="primary"
              class="mb-2 text-h6 position-relative"
              :loading="answerFileDownloadLoading && !isDownloading('a_file')"
              @click="$emit('download', 'a_file')"
            >
              <template v-if="isDownloading('a_file')">
                <v-progress-circular
                  :model-value="getDownloadProgress('a_file')"
                  size="20"
                  width="2"
                  color="white"
                  class="position-absolute"
                  style="z-index: 2"
                />
              </template>
              <v-icon
                size="x-large"
                class="btn-icon"
                :class="{ 'text-transparent': isDownloading('a_file') }"
              >
                mdi-file-word-box
              </v-icon>
              <span :class="{ 'text-transparent': isDownloading('a_file') }">
                Download Answer Doc
              </span>
              <template
                v-if="
                  requiresCoinPaymentForFile('a_file')
                    && contentData?.files?.answer.price === 0
                "
              >
                <v-icon
                  size="small"
                  color="orange"
                  :class="{ 'text-transparent': isDownloading('a_file') }"
                >
                  mdi-coin
                </v-icon>
              </template>
              <template v-else-if="contentData?.files?.answer.price > 0">
                <span :class="{ 'text-transparent': isDownloading('a_file') }">
                  | ${{ contentData?.files?.answer.price }}
                </span>
              </template>
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
              class="mb-2 text-h6 font-weight-bold position-relative"
              variant="flat"
              :loading="
                extraFileDownloadLoading && !isDownloading('extra', extra.id)
              "
              @click="$emit('download', 'extra', extra.id)"
            >
              <template v-if="isDownloading('extra', extra.id)">
                <v-progress-circular
                  :model-value="getDownloadProgress('extra', extra.id)"
                  size="20"
                  width="2"
                  color="white"
                  class="position-absolute"
                  style="z-index: 2"
                />
              </template>
              <template v-if="extra?.ext == 'mp3'">
                <v-icon
                  size="x-large"
                  class="btn-icon"
                  :class="{
                    'text-transparent': isDownloading('extra', extra.id),
                  }"
                >
                  mdi-volume-high
                </v-icon>
              </template>
              <template v-if="extra?.ext == 'pdf'">
                <v-icon
                  size="x-large"
                  class="btn-icon"
                  :class="{
                    'text-transparent': isDownloading('extra', extra.id),
                  }"
                >
                  mdi-file-pdf-box
                </v-icon>
              </template>
              <span
                :class="{
                  'text-transparent': isDownloading('extra', extra.id),
                }"
              >
                Download {{ extra.type_title ? extra.type_title : "Extra" }}
              </span>
              <template
                v-if="
                  requiresCoinPaymentForFile('extra', extra.id)
                    && extra.price === 0
                "
              >
                <v-icon
                  size="small"
                  color="orange"
                  :class="{
                    'text-transparent': isDownloading('extra', extra.id),
                  }"
                >
                  mdi-coin
                </v-icon>
              </template>
              <template v-else-if="extra.price > 0">
                <span
                  :class="{
                    'text-transparent': isDownloading('extra', extra.id),
                  }"
                >
                  | ${{ extra.price }}
                </span>
              </template>
            </v-btn>
          </div>

          <div v-if="contentData?.exams && contentData?.exams[0]?.status != 7">
            <v-btn
              :to="`/exam/${contentData?.exams[0].id}`"
              block
              color="#5600e8"
              variant="flat"
              class="mb-2 text-h6 font-weight-bold position-relative"
            >
              Begin Quiz
            </v-btn>
          </div>
          <div v-else>
            <v-btn
              :to="`/test-maker/create?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}&paperId=${contentData?.id}`"
              block
              variant="flat"
              outlined
              color="primary"
              class="mb-2 text-h6 font-weight-bold position-relative"
            >
              Create Quiz
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
  requiresCoinPaymentForFile: {
    type: Function,
    default: () => false,
  },
  isDownloading: {
    type: Function,
    default: () => false,
  },
  getDownloadProgress: {
    type: Function,
    default: () => 0,
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

.btn-icon {
  flex-shrink: 0;
  margin-right: 8px;
  position: absolute;
  left: 10px;
}

.text-transparent {
  color: transparent !important;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
