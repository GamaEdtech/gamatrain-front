<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import type { EditProfileDTO, ExperienceDTO, ProfileFieldCode, User } from '@/types'

const { user, setUser } = useUser()

// The same dialogs as the public profile page; each saves on its own. A dialog's code loads the first time it opens.
const dialog = reactive<Record<ProfileFieldCode, boolean>>({ currentStatusSentence: false, biography: false, skills: false, experience: false })
const mounted = reactive<Record<ProfileFieldCode, boolean>>({ currentStatusSentence: false, biography: false, skills: false, experience: false })

function open(code: ProfileFieldCode) {
  mounted[code] = true
  dialog[code] = true
}

function saved(data: EditProfileDTO) {
  if (user.value) setUser({ ...user.value, ...data } as User)
}

function experienceSaved(data: ExperienceDTO) {
  if (user.value) setUser({ ...user.value, experiences: [...(user.value.experiences ?? []), data] })
}

defineExpose({ open })
</script>
