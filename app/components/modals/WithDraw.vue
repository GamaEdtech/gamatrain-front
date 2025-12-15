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
      <v-row class="d-flex align-center">
        <v-col cols="10">
          <span class="text-h4">Withdraw</span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:close
          </v-icon>
        </v-col>
      </v-row>

      <div class="w-100 d-flex flex-column align-center justify-center mt-4">
        <span class="text-h5 text-center">
          Enter the amount you want to withdraw from the account.
        </span>
      </div>

      <div class="w-100 d-flex align-center justify-center mt-6">
        <v-text-field
          class="w-100 mx-4 text-center"
          variant="outlined"
          hide-details
          density="comfortable"
          rounded="lg"
          color="#ffb300"
        >
        <!-- <template #prepend-inner>
          <img
            width="20"
            height="20"
            :src="selectedCurrency.logoURI"
            alt="Coin Logo"
            class="rounded-circle"
          >
        </template> -->
        </v-text-field>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { mdAndUp } = useDisplay()

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  userBalance: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:showDialog'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
