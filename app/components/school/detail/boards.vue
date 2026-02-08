<template>
  <div class="w-100 d-flex flex-column align-start justify-start mt-6">
    <div class="w-100 d-flex align-center justify-space-between">
      <span class="text-grey600 text-h4">Boards</span>
      <span
        class="text-h5 text-info pointer"
        @click="openModalContribute"
      >
        Contribute
      </span>
    </div>
    <div
      v-if="isLoadingBoard"
      class="w-100 d-flex flex-wrap align-center my-6 ga-2"
    >
      <v-skeleton-loader
        width="100"
        height="48"
        class="bg-transparent rounded-lg"
      />
      <v-skeleton-loader
        width="110"
        height="48"
        class="bg-transparent rounded-lg"
      />
      <v-skeleton-loader
        width="90"
        height="48"
        class="bg-transparent rounded-lg"
      />
      <v-skeleton-loader
        width="120"
        height="48"
        class="bg-transparent rounded-lg"
      />
      <v-skeleton-loader
        width="90"
        height="48"
        class="bg-transparent rounded-lg"
      />
      <v-skeleton-loader
        width="84"
        height="48"
        class="bg-transparent rounded-lg"
      />
    </div>
    <div
      v-else
      class="w-100 d-flex flex-wrap align-center my-6 ga-2"
    >
      <template
        v-for="(board, index) in boards"
        :key="index"
      >
        <v-btn
          v-if="schoolBoards.some(s => s.code === Number(board.id))"
          flat
          :color="schoolBoards.some(s => s.code === Number(board.id)) ? `grey700` : `grey300`"
          height="48"
          rounded="lg"
        >
          <img
            :src="board.img"
            :alt="board.title"
            width="26"
            height="26"
            class="mr-1"
          >
          <span :class="`font-weight-bold text-h5 ${schoolBoards.some(s => s.code === Number(board.id)) ? `text-grey300`:`text-grey900`}`">{{
            board.title
          }}</span>
        </v-btn>
      </template>

      <span
        v-if="schoolBoards.length == 0"
        class="ml-2 text-h5 text-grey700 font-weight-bold"
      >
        Education board information hasn’t been added for this school yet. Know it? Contribute and help keep our data accurate.
      </span>
    </div>

    <v-dialog
      v-model="dialogModel"
      max-width="500"
      :fullscreen="!mdAndUp"
      persistent
      @click="clickOnOverlay"
    >
      <div
        class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
        @click="clickOnModal"
      >
        <v-row class="d-flex align-center">
          <v-col cols="10">
            <span class="text-h4">Boards</span>
          </v-col>
          <v-col
            cols="2"
            class="d-flex align-center justify-end ga-2"
          >
            <v-icon
              size="x-large"
              color="grey400"
              @click="closeModal"
            >
              md:close
            </v-icon>
          </v-col>
        </v-row>
        <v-row
          class="w-100 d-flex flex-wrap align-center justify-center my-6 ga-2"
        >
          <v-btn
            v-for="(board, index) in boards"
            :key="index"
            flat
            :color="selectedBoards.includes(Number(board.id)) ? `grey700` : `grey300`"
            height="48"
            rounded="lg"
            @click="chooseBoard(board)"
          >
            <img
              :src="board.img"
              :alt="board.title"
              width="26"
              height="26"
              class="mr-1"
            >
            <span :class="`font-weight-bold text-h5 ${selectedBoards.includes(Number(board.id)) ? `text-grey300`:`text-grey900`}`">{{
              board.title
            }}</span>
          </v-btn>
        </v-row>
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
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const props = defineProps({
  schoolBoards: {
    type: Array,
    default: () => [],
  },
})

const auth = useAuth()
const { $toast } = useNuxtApp()
const { boardImgs } = useBoard()
const { mdAndUp } = useDisplay()
const route = useRoute()
const router = useRouter()
const isLoadingBoard = ref(true)
const selectedBoards = ref([])
const boards = ref([])
const loadingContribute = ref(false)

onMounted(async () => {
  await getBoards()
})

const getBoards = async () => {
  try {
    isLoadingBoard.value = true
    const responseBoard = await useApiService.get(
      '/api/v1/types/list/?type=section',
    )
    if (responseBoard.data) {
      boards.value = responseBoard.data.map((item, index) => ({
        ...item,
        img: boardImgs[index % boardImgs.length],
      }))
    }
  }
  catch (error) {
    console.error('error', error)
  }
  finally {
    isLoadingBoard.value = false
  }
}

const dialogModel = ref(false)

const closeModal = () => {
  dialogModel.value = false
  selectedBoards.value = []
}

const clickOnOverlay = () => {
  dialogModel.value = false
  selectedBoards.value = []
}

const clickOnModal = (event) => {
  event.stopPropagation()
}

const openModalContribute = () => {
  if (!auth?.isAuthenticated?.value) {
    router.push({ query: { auth_form: 'login', auth_noredirect: true } })
  }
  else {
    dialogModel.value = true
    selectedBoards.value = props.schoolBoards.map(item => item.code)
  }
}

const chooseBoard = (board) => {
  if (selectedBoards.value.includes(Number(board.id))) {
    selectedBoards.value = selectedBoards.value.filter(id => id !== Number(board.id))
  }
  else {
    selectedBoards.value.push(Number(board.id))
  }
}

const saveBoards = async () => {
  loadingContribute.value = true
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${route.params.id}/contributions`,
      { BoardCodes: selectedBoards.value },
    )
    if (response.succeeded) {
      $toast?.success(
        'Your contribution has been successfully submitted',
      )
      dialogModel.value = false
      selectedBoards.value = []
    }
    else {
      $toast?.error(
        response?.errors?.[0]?.message || 'Failed to update Boards',
      )
    }
  }
  catch (err) {
    if (
      err.response
      && (err.response.status === 401 || err.response.status === 403)
    ) {
      $toast?.error('Please login to update facilities')
    }
    else {
      $toast?.error('Failed to update Boards')
    }
  }
  finally {
    loadingContribute.value = false
  }
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
