<template>
  <div class="d-flex flex-column ga-4">
    <template v-if="progress">
      <user-profile-progress-level-header
        :progress="progress"
        :first-name="user?.firstName"
        :last-name="user?.lastName"
        :avatar-uri="user?.avatarUri"
      />

      <div class="d-flex flex-wrap ga-4 align-start">
        <user-profile-progress-quest-list
          :quests="progress.quests"
          class="progress-panel__main"
          @start="start"
        />
        <div class="d-flex flex-column ga-4 progress-panel__side">
          <user-profile-progress-school-goal
            :school="progress.school"
            @pick-school="emit('quest', 'school')"
          />
          <user-profile-progress-practice-streak :practice="progress.practice" />
        </div>
      </div>
    </template>

    <v-skeleton-loader
      v-else-if="loadingProgress"
      type="image, list-item-two-line@3"
      class="rounded-lg"
    />

    <lazy-common-modal-base
      v-if="mounted.currentStatusSentence"
      v-model:show-dialog="dialog.currentStatusSentence"
      title="Status"
    >
      <lazy-profile-modal-current-status
        :status="user?.currentStatusSentence ?? ''"
        @close="dialog.currentStatusSentence = false"
        @success="saved"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-if="mounted.biography"
      v-model:show-dialog="dialog.biography"
      title="Biography"
    >
      <lazy-profile-modal-biography
        :bio="user?.biography ?? ''"
        @close="dialog.biography = false"
        @success="saved"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-if="mounted.skills"
      v-model:show-dialog="dialog.skills"
      title="Skills"
    >
      <lazy-profile-modal-skills
        :skills="user?.skills"
        @close="dialog.skills = false"
        @success="saved"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-if="mounted.experience"
      v-model:show-dialog="dialog.experience"
      title="Experience"
    >
      <lazy-profile-modal-experience
        @close="dialog.experience = false"
        @success="experienceSaved"
      />
    </lazy-common-modal-base>

    <lazy-user-profile-progress-level-reached-dialog
      v-if="progress && reachedOpen"
      v-model="reachedOpen"
      :level="progress.level"
      :percent="progress.percent"
      :quests="progress.quests"
      @start="start"
    />
  </div>
</template>

<script setup lang="ts">
import type { EditProfileDTO, ExperienceDTO, ProfileQuestCode, User } from '@/types'

/** Quests the page itself handles (its photo picker and name fields), plus picking a school. */
type PageQuest = 'avatar' | 'firstName' | 'lastName' | 'school'

const emit = defineEmits<{ quest: [code: PageQuest] }>()

const { progress, loadingProgress, getProgress } = useProfileProgress()
const { user, setUser } = useUser()

/** The profile fields edited in their own dialog (the same dialogs as the public profile page). */
type DialogQuest = 'currentStatusSentence' | 'biography' | 'skills' | 'experience'
const dialog = reactive<Record<DialogQuest, boolean>>({ currentStatusSentence: false, biography: false, skills: false, experience: false })
// A dialog's code loads the first time it opens.
const mounted = reactive<Record<DialogQuest, boolean>>({ currentStatusSentence: false, biography: false, skills: false, experience: false })
const reachedOpen = ref(false)

const isDialogQuest = (code: ProfileQuestCode): code is DialogQuest => code in dialog

function start(code: ProfileQuestCode) {
  if (isDialogQuest(code)) {
    mounted[code] = true
    dialog[code] = true
  }
  else {
    emit('quest', code)
  }
}

/**
 * Reloads the progress; when the level went up, shows the "level reached" moment. Called after anything that changes
 * the profile: a dialog here, or the page's own Submit.
 */
async function refresh() {
  const before = progress.value
  await getProgress()
  const after = progress.value
  if (before && after && profileLevelNumber(after.level) > profileLevelNumber(before.level)) {
    reachedOpen.value = true
  }
}

function saved(data: EditProfileDTO) {
  if (user.value) setUser({ ...user.value, ...data } as User)
  refresh()
}

function experienceSaved(data: ExperienceDTO) {
  if (user.value) setUser({ ...user.value, experiences: [...(user.value.experiences ?? []), data] })
  refresh()
}

onMounted(() => {
  getProgress()
})

defineExpose({ refresh })
</script>

<style scoped>
.progress-panel__main {
  flex: 999 1 420px;
  min-width: 0;
}

.progress-panel__side {
  flex: 1 1 300px;
  min-width: 0;
}
</style>
