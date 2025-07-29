<template>
  <div class="d-flex mb-4">
    <div class="w-100">
      <div class="d-flex align-center justify-space-between header">
        <h1 class="detail-title gama-text-h5">
          {{ contentData.title }}
        </h1>
      </div>

      <div class="description-holder my-4">
        <!-- Topics -->
        <p
          v-if="contentData.topics && contentData.topics.length > 0"
          class="gama-text-body2"
        >
          <i class="fa-solid fa-list ml-1 icon" />
          Topics:
        </p>
        <ul v-if="contentData.topics && contentData.topics.length > 0">
          <li
            v-for="(item, index) in contentData.topics"
            :key="index"
          >
            {{ item.title }}
          </li>
        </ul>
        <!-- End topics -->

        <!-- Question number -->
        <p
          v-if="contentData.tests_num"
          class="mt-1 gama-text-body2"
        >
          <i class="fa-solid fa-question ml-1 icon" />
          Questions: {{ contentData.tests_num }}
        </p>
        <!-- End question number -->

        <!-- Difficulty level -->
        <p
          v-if="contentData.level"
          class="mt-1 gama-text-body2"
        >
          <i class="fa-solid fa-temperature-three-quarters ml-1 icon" />
          Difficulty level: {{ contentData.level }}
        </p>
        <!-- End difficulty level -->

        <!-- Start date -->
        <p class="mt-1 gama-text-body2">
          <i class="fa-solid fa-circle-play" />
          Start:
          {{ contentData.start_date ? contentData.start_date : "-" }}
        </p>
        <!-- End start date -->

        <!-- End date -->
        <p class="mt-1 gama-text-body2">
          <i class="fa-solid fa-circle-stop" />
          End:
          {{ contentData.end_date ? contentData.end_date : "-" }}
        </p>
        <!-- End end date -->

        <!-- Duration -->
        <p
          v-if="contentData.azmoon_time"
          class="mt-1 gama-text-body2"
        >
          <i class="fa-solid fa-clock" />
          Duration: {{ contentData.azmoon_time }} minutes
        </p>
        <!-- End duration -->
      </div>

      <div class="label-holder">
        <v-chip
          v-show="contentData.section_title"
          link
          class="mr-1"
          :to="`/search?type=azmoon&section=${contentData.section}`"
        >
          {{ contentData.section_title }}
        </v-chip>
        <v-chip
          v-show="contentData.base_title"
          link
          :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`"
          class="mr-1"
        >
          {{ contentData.base_title }}
        </v-chip>
        <v-chip
          v-show="contentData.lesson_title"
          link
          :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
          class="ma-1"
        >
          {{ contentData.lesson_title }}
        </v-chip>
        <v-chip
          v-show="contentData.paperID"
          :small="display.mdAndDown.value"
          link
          :to="`/paper/${contentData.paperID}`"
          class="ma-1 primary"
        >
          Past Paper
        </v-chip>
      </div>
    </div>
  </div>

  <!-- Download Btn and Description -->
  <div
    v-if="!isFree"
    class="text-center download-sec"
  >
    <div class="d-none d-md-block mb-4">
      <p
        v-if="!isLoggedIn"
        class="gama-text-body2"
      >
        <span class="mdi mdi-bell icon" />
        <span
          class="login pointer"
          @click="onLogin"
        >Login</span>
        <span
          class="register pointer"
          @click="onRegister"
        > (register) </span>
        to download and charge your wallet.
      </p>
      <span
        v-else
        class="gama-text-body2"
      >
        Your wallet charge is ${{ credit }}
      </span>
      <nuxt-link
        v-if="isLoggedIn"
        class="blue--text"
        to="/user/charge-wallet"
      >(Top Up Wallet)
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: [Number, String],
    default: 0,
  },
})

// Create a shortcut computed property for better readability
const contentData = computed(() => props.contentData)
const display = useDisplay()
const emit = defineEmits(['login', 'register'])

// Computed properties
const isFree = computed(() => {
  const participationPrice = contentData.value.participation?.price || 0
  const pdfPrice = contentData.value.files?.pdf?.price || 0

  return !(participationPrice > 0 && pdfPrice > 0)
})

// Methods
function onLogin() {
  emit('login')
}

function onRegister() {
  emit('register')
}
</script>
