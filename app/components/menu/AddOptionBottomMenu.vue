<template>
  <div class="publish-options w-100 d-flex align-center justify-center flex-column">
    <div class="container-card w-100">
      <template
        v-for="item in addOptions"
        :key="item.title"
      >
        <v-btn
          v-if="!item.disabled"
          :to="item.path"
          :aria-label="`${item.title} — ${item.typeFile}`"
          variant="plain"
          class="card-add-option"
        >
          <div class="publish-option-content w-100 d-flex flex-column align-start justify-start">
            <div class="icon-div d-flex align-center justify-center">
              <span
                v-if="item.icon"
                class="icon-add text-grey700"
                :class="item.icon"
              />
              <v-icon
                v-if="item.iconMd"
                color="brandNavy"
                size="20"
              >
                {{ item.iconMd }}
              </v-icon>
            </div>
            <span class="card-option-title w-100">{{ item.title }}</span>

            <span class="chip-type-file">
              {{ item.typeFile }}
            </span>
          </div>
        </v-btn>
      </template>
    </div>

    <div class="info-card w-100 d-flex align-center justify-start">
      <div class="info-card__icon d-flex align-center justify-center">
        <v-icon
          color="brandNavy"
          size="16"
        >
          md:star
        </v-icon>
      </div>
      <div class="info-card__copy d-flex flex-column align-start justify-start">
        <span class="info-card__title">Turn your expertise into reputation and income</span>
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
  {
    path: '/school/add',
    title: 'School',
    icon: 'icon-school',
    typeFile: 'INFO',
    disabled: false,
  },
  {
    path: '/user/posts/create',
    title: 'Posts',
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
.publish-options {
  gap: 24px;
  padding-top: 24px;
}

.container-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.card-add-option {
  width: 100%;
  min-width: 0;
  min-height: 132px;
  height: auto !important;
  padding: 16px !important;
  color: rgb(var(--v-theme-brandNavy));
  background: rgb(var(--v-theme-white));
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(var(--v-theme-brandNavy), 0.05);
  text-decoration: none;
  opacity: 1;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}

.card-add-option :deep(.v-btn__content) {
  width: 100%;
  height: 100%;
  display: flex;
  white-space: normal !important;
}

.publish-option-content {
  gap: 10px;
  text-align: left;
}

.card-add-option:not(.v-btn--disabled):hover {
  transform: translateY(-2px);
  border-color: rgb(var(--v-theme-primary-darken-1));
  box-shadow: 0 10px 24px rgba(var(--v-theme-brandNavy), 0.12);
}

.card-add-option:not(.v-btn--disabled):active {
  transform: scale(.99);
}

.card-add-option:focus-visible {
  outline: 3px solid rgba(var(--v-theme-primary), 0.32);
  outline-offset: 2px;
}

.card-add-option.v-btn--active {
  background: rgb(var(--v-theme-softGold));
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary)), 0 8px 20px rgba(var(--v-theme-brandNavy), 0.1);
}

.card-add-option.v-btn--active::after {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  width: 22px;
  height: 22px;
  color: rgb(var(--v-theme-brandNavy));
  font-size: 14px;
  font-weight: 800;
  content: '\2713';
  background: rgb(var(--v-theme-primary));
  border-radius: 50%;
  place-items: center;
}

.card-add-option.v-btn--disabled {
  cursor: not-allowed;
  opacity: .48;
}

.card-add-option.v-btn--disabled:hover {
  transform: none;
  border-color: rgb(var(--v-theme-borderSubtle));
  box-shadow: 0 2px 8px rgba(var(--v-theme-brandNavy), 0.05);
}

.icon-div {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  color: rgb(var(--v-theme-brandNavy));
  background: rgb(var(--v-theme-softGold));
  border-radius: 10px;
}

.icon-add {
  font-size: 22px;
}

.card-option-title {
  color: rgb(var(--v-theme-brandNavy));
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.chip-type-file {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 2px 8px;
  color: rgb(var(--v-theme-grey500));
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  background: rgb(var(--v-theme-surfaceSecondary));
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 999px;
}

.info-card {
  gap: 12px;
  padding: 14px 16px;
  background: rgb(var(--v-theme-surfaceSecondary));
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 14px;
}

.info-card__icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  background: rgb(var(--v-theme-softGold));
  border-radius: 10px;
}

.info-card__copy {
  gap: 2px;
}

.info-card__title {
  color: rgb(var(--v-theme-brandNavy));
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.info-card__description {
  color: rgb(var(--v-theme-grey500));
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
}

@media only screen and (min-width: 768px) and (max-width: 1023px) {
  .publish-options {
    gap: 20px;
    padding-top: 20px;
  }

  .container-card {
    gap: 12px;
  }

  .card-add-option {
    min-height: 124px;
    padding: 14px !important;
  }
}

@media only screen and (max-width: 767px) {
  .publish-options {
    gap: 16px;
    padding-top: 20px;
  }

  .container-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .card-add-option {
    min-height: 116px;
    padding: 12px !important;
  }

  .publish-option-content {
    gap: 8px;
  }

  .info-card {
    align-items: flex-start !important;
    padding: 12px;
  }
}

@media only screen and (max-width: 359px) {
  .container-card {
    gap: 8px;
  }

  .card-option-title {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-add-option {
    transition: none;
  }
}
</style>
