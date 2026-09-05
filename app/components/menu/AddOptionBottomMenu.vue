<template>
  <div class="w-100 d-flex align-center justify-center flex-column mt-4">
    <div class="w-100 d-flex flex-wrap justify-center ga-2 container-card">
      <template
        v-for="item in addOptions"
        :key="item.title"
      >
        <v-btn
          v-if="!item.disabled"
          :to="item.path"
          :disabled="item.disabled"
          :aria-label="`${item.title} — ${item.typeFile}`"
          variant="plain"
          class="card-add-option rounded-xl py-4 px-0"
        >
          <div class="w-100 d-flex flex-column align-center justify-start ga-1">
            <div class="icon-div rounded-lg pa-2 d-flex align-center justify-center bg-primary100">
              <span
                v-if="item.icon"
                class="icon-add text-grey700"
                :class="item.icon"
              />
              <v-icon
                v-if="item.iconMd"
                color="grey700"
                size="20"
              >
                {{ item.iconMd }}
              </v-icon>
            </div>
            <span class="card-option-title w-100 text-center text-grey700 text-h6 px-1 font-weight-bold mt-1">{{ item.title }}</span>

            <span class="text-center text-subtitle-2 font-weight-bold text-grey500 px-2 rounded-pill bg-grey100 chip-type-file">
              {{ item.typeFile }}
            </span>
          </div>
        </v-btn>
      </template>
    </div>

    <div class="w-100 bg-primary50 rounded-lg pa-2 d-flex align-center justify-start ga-2 info-card mt-4">
      <div class="pa-2 rounded-lg bg-primary d-flex align-center justify-center">
        <v-icon
          color="grey700"
          size="16"
        >
          md:star
        </v-icon>
      </div>
      <div class="d-flex flex-column align-start justify-start ">
        <span class="text-subtitle-1 font-weight-bold text-grey700">Turn your expertise into reputation and income</span>
        <!-- <span class="text-subtitle-2 font-weight-medium text-grey400">Publish educational content to boost your score and earn from sales.</span> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_BOARD_ID, PAPER_CLASSIFICATION_IDS } from '@/constants'

const route = useRoute()
const emit = defineEmits(['close'])

interface AddOption {
  path: string
  title: string
  typeFile: string
  icon?: string
  iconMd?: string
  disabled: boolean
}

const { user } = useUser()
const userBoardId = computed(() => user.value?.board ?? DEFAULT_BOARD_ID)
const { canAddEducationalContent } = useUserPermissions()

const addOptions = computed<AddOption[]>(() => [
  {
    path: `/user/paper/create?board=${userBoardId.value}&classification=${PAPER_CLASSIFICATION_IDS.WORKSHEET}`,
    title: 'Worksheet',
    iconMd: 'md:description_outlined',
    typeFile: 'PDF · DOCX',
    disabled: !canAddEducationalContent.value,
  },
  {
    path: `/user/paper/create?board=${userBoardId.value}&classification=${PAPER_CLASSIFICATION_IDS.PREDICTED_PAPER}`,
    title: 'Predicted Paper',
    icon: 'icon-paper',
    typeFile: 'PDF · DOCX',
    disabled: !canAddEducationalContent.value,
  },
  {
    path: `/user/paper/create?board=${userBoardId.value}&classification=${PAPER_CLASSIFICATION_IDS.STUDY_GUIDE}`,
    title: 'Study Guide',
    iconMd: 'md:menu_book',
    typeFile: 'PDF · DOCX',
    disabled: !canAddEducationalContent.value,
  },
  {
    path: `/user/paper/create?board=${userBoardId.value}&classification=${PAPER_CLASSIFICATION_IDS.TOPICAL_QUESTIONS}`,
    title: 'Topical Questions',
    iconMd: 'md:quiz_outlined',
    typeFile: 'PDF · DOCX',
    disabled: !canAddEducationalContent.value,
  },
  // {
  //   path: `/user/multimedia/create?contentType=${MULTIMEDIA_CONTENT_TYPE_IDS.VIDEO}`,
  //   title: 'Video',
  //   iconMd: 'md:videocam',
  //   typeFile: 'MP4',
  //   disabled: !canAddEducationalContent.value,
  // },
  // {
  //   path: `/user/multimedia/create?contentType=${MULTIMEDIA_CONTENT_TYPE_IDS.PRESENTATION}`,
  //   title: 'Presentation',
  //   iconMd: 'md:slideshow',
  //   typeFile: 'PPTX',
  //   disabled: !canAddEducationalContent.value,
  // },
  {
    path: '/school/add',
    title: 'School',
    icon: 'icon-school',
    typeFile: 'INFO',
    disabled: false,
  },
  // {
  //   path: '/user/question/create',
  //   title: 'Q&A',
  //   icon: 'icon-q-a',
  //   typeFile: 'TEXT',
  //   disabled: false,
  // },
  {
    path: '/user/blogs/create',
    title: 'Blogs',
    iconMd: 'md:art_track',
    typeFile: 'HTML',
    disabled: false,
  },
])

watch(
  () => route.fullPath,
  () => {
    emit('close')
  },
)
</script>

<style scoped>
.container-card{
  max-width : 370px
}
.card-add-option{
  width : 31%;
  max-width : 120px;
  height: auto !important;
  border : 1px solid rgb(var(--v-theme-grey200));
  transition: 0.3s;
  text-decoration: none;
  opacity: 1;
}
.card-add-option :deep(.v-btn__content) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  white-space: wrap !important;
  gap: 4px;
}
.card-add-option:not(.v-btn--disabled):hover{
  transform: translateY(-6px);
  border : 1px solid rgb(var(--v-theme-primary))
}
.card-add-option.v-btn--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.card-add-option.v-btn--disabled:hover{
  transform: none;
  border : 1px solid rgb(var(--v-theme-grey200))
}
.icon-add{
  font-size: 20px;
}
.chip-type-file{
  border : 1px solid rgb(var(--v-theme-grey200));
}
.info-card{
  max-width : 320px;
  border : 1px solid rgb(var(--v-theme-primary100))
}

@media only screen and (min-width: 960px) {
  .container-card {
    max-width: 480px;
  }

  .card-add-option {
    max-width: 144px;
  }
}
</style>
