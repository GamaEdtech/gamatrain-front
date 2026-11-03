<template>
  <section
    class="detail-section"
    aria-labelledby="boards-title"
  >
    <div class="section-head">
      <h2
        id="boards-title"
        class="section-title"
      >
        Education board
      </h2>
      <v-btn
        variant="text"
        color="info"
        size="small"
        class="text-none gtext-t5 px-2 section-action"
        @click="openModalContribute"
      >
        {{ schoolBoards.length ? 'Edit' : 'Add board' }}
      </v-btn>
    </div>
    <div
      v-if="schoolBoards.length"
      class="d-flex flex-wrap ga-2"
    >
      <v-chip
        v-for="board in schoolBoards"
        :key="board.id"
        color="grey800"
        variant="flat"
        label
        size="large"
        class="bg-grey50 font-weight-bold gtext-t5"
      >
        <!-- Board logos are content images, not interface icons. -->
        <template
          v-if="board.icon"
          #prepend
        >
          <img
            :src="`/images/boards/${board.icon}.svg`"
            alt=""
            width="22"
            height="22"
            loading="lazy"
            class="mr-2"
          >
        </template>
        {{ board.title }}
      </v-chip>
    </div>
    <p
      v-else
      class="section-empty"
    >
      The education board hasn't been added yet.
    </p>

    <v-dialog
      v-model="dialogModel"
      max-width="500"
      :fullscreen="!mdAndUp"
    >
      <div class="w-100 d-flex flex-wrap flex-column bg-surface pa-6 rounded-xl mobile-style">
        <div class="d-flex align-center">
          <span class="text-h4 font-weight-bold">Which boards does this school follow?</span>
          <v-spacer />
          <v-btn
            variant="text"
            icon
            aria-label="Close"
            @click="closeModal"
          >
            <v-icon
              size="x-large"
              color="grey400"
            >
              md:close
            </v-icon>
          </v-btn>
        </div>
        <div
          v-if="isLoadingBoard"
          class="w-100 d-flex flex-wrap align-center my-6 ga-2"
        >
          <v-skeleton-loader
            v-for="size in sizeSkeletonBoard"
            :key="size"
            :width="size"
            height="48"
            class="bg-transparent rounded-lg"
          />
        </div>
        <div
          v-else
          class="w-100 d-flex flex-wrap align-center justify-center my-6 ga-2"
        >
          <v-btn
            v-for="board in boards"
            :key="board.id"
            flat
            :color="selectedBoards.includes(Number(board.id)) ? `grey700` : `grey200`"
            height="48"
            rounded="lg"
            :aria-pressed="selectedBoards.includes(Number(board.id))"
            @click="chooseBoard(board)"
          >
            <img
              v-if="board.icon"
              :src="`/images/boards/${board.icon}.svg`"
              alt=""
              width="26"
              height="26"
              class="mr-1"
            >
            <span :class="`font-weight-bold text-h5 ${selectedBoards.includes(Number(board.id)) ? `text-white` : `text-grey900`}`">{{ board.title }}</span>
          </v-btn>
        </div>
        <v-btn
          class="w-100 text-black font-weight-bold text-h5 ma-auto"
          rounded="pill"
          color="primary"
          max-width="300"
          flat
          :loading="loadingContribute"
          @click="saveBoards"
        >
          Save
        </v-btn>
      </div>
    </v-dialog>
  </section>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const props = defineProps({
  schoolBoards: {
    type: Array,
    default: () => [],
  },
})

const { loadingGetData: isLoadingBoard, data: boards, getData: getBoards } = useBoard()
const { $toast } = useNuxtApp()
const { mdAndUp } = useDisplay()
const route = useRoute()
const { requireSignIn } = useContributeGate()

const selectedBoards = ref([])
const loadingContribute = ref(false)
const sizeSkeletonBoard = [100, 110, 90, 120, 90, 84]
const dialogModel = ref(false)

function closeModal() {
  dialogModel.value = false
}

// The board list is only needed once the editor opens.
async function openModalContribute() {
  if (!requireSignIn()) return
  selectedBoards.value = props.schoolBoards.map(item => Number(item.id))
  dialogModel.value = true
  if (!boards.value?.length) await getBoards()
}

function chooseBoard(board) {
  const id = Number(board.id)
  selectedBoards.value = selectedBoards.value.includes(id)
    ? selectedBoards.value.filter(item => item !== id)
    : [...selectedBoards.value, id]
}

async function saveBoards() {
  loadingContribute.value = true
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/contributions`,
      { boards: selectedBoards.value },
    )
    if (response.succeeded) {
      $toast?.success('Thank you! Your contribution has been submitted and is pending review.')
      dialogModel.value = false
    }
    else {
      $toast?.error(response?.errors?.[0]?.message || 'Failed to update Boards')
    }
  }
  catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      $toast?.error('Please login to update the education board')
    }
    else {
      $toast?.error('Failed to update Boards')
    }
  }
  finally {
    loadingContribute.value = false
  }
}

defineExpose({ openModal: openModalContribute })
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
