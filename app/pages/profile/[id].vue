<template>
  <v-container
    v-if="contentData"
    class="d-flex flex-column ga-2 mt-16"
  >
    <profile-header
      :data="contentData"
      :is-editable="isEditable"
      :visibility="user?.profileVisibility"
      :default-bio="DEFAULT_BIO"
      @edit-bio="showBioModal = true"
      @edit-privacy="showPrivacyModal = true"
      @edit-personal="showPersonalModal = true"
      @edit-status="showStatusModal = true"
    />
    <profile-skills
      class="box-shadow-div"
      :data="contentData.skills"
      :is-editable="isEditable"
      @edit-skill="showSkillsModal = true"
    />
    <profile-experience
      :data="contentData.experiences"
      :is-editable="isEditable"
      class="box-shadow-div"
      @add="showExperienceModal = true"
      @delete="deleteExperience"
      @edit="editExperience"
    />
    <!-- <profile-register-content class="box-shadow-div" /> -->
    <!-- <profile-education class="box-shadow-div" /> -->

    <lazy-modals-base
      v-model:show-dialog="showBioModal"
      title="Biography"
    >
      <lazy-profile-modal-biography
        :bio="contentData.biography ? contentData.biography : DEFAULT_BIO"
        @close="showBioModal = false"
        @success="changeBioSuccessfully"
      />
    </lazy-modals-base>

    <lazy-modals-base
      v-model:show-dialog="showPrivacyModal"
      title="Privacy"
    >
      <lazy-profile-modal-privacy
        :privacy="user?.profileVisibility!"
        @close="showPrivacyModal = false"
        @success="changePrivacySuccessfully"
      />
    </lazy-modals-base>

    <lazy-modals-base
      v-model:show-dialog="showStatusModal"
      title="Status"
    >
      <lazy-profile-modal-current-status
        :status="contentData.currentStatusSentence ?? ''"
        @close="showStatusModal = false"
        @success="changeCurrentStatusSuccessfully"
      />
    </lazy-modals-base>

    <lazy-modals-base
      v-model:show-dialog="showPersonalModal"
      title="Profile"
    >
      <lazy-profile-modal-personal
        :data="user"
        @close="showPersonalModal = false"
        @success="changePersonalSuccessfully"
      />
    </lazy-modals-base>

    <lazy-modals-base
      v-model:show-dialog="showSkillsModal"
      title="Skill"
    >
      <lazy-profile-modal-skills
        :skills="contentData.skills"
        @close="showSkillsModal = false"
        @success="changeSkillsSuccessfully"
      />
    </lazy-modals-base>

    <lazy-modals-base
      v-model:show-dialog="showExperienceModal"
      title="Experience"
      @update:show-dialog="closeExperienceModal"
    >
      <lazy-profile-modal-experience
        :experience="selectedExperienceForEdit"
        @close="closeExperienceModal(false)"
        @success="changeExperienceSuccessfully"
        @edit-success="editExperienceSuccessfully"
      />
    </lazy-modals-base>

    <lazy-modals-base
      v-model:show-dialog="showDeleteExperienceModal"
      title="Delete"
    >
      <lazy-profile-modal-experience-delete
        :id="selectedExperienceForDelete"
        @success="deleteExperienceSuccessfully"
      />
    </lazy-modals-base>
  </v-container>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
  ProfileDTO,
  EditProfileDTO,
  ProfileVisibility,
  User,
  ExperienceDTO,
} from '@/types'

const route = useRoute()
const router = useRouter()
const { getItemById } = useProfile()
const { user, setUser } = useUser()

const { data: contentData } = await useAsyncData(
  `profile-${route.params.id}`,
  async () => {
    try {
      const response = await getItemById(route.params.id as string) as ApiResult<ProfileDTO>

      if (response.data) {
        return response.data
      }
      else {
        showError({
          statusCode: 404,
          statusMessage: 'Page Not Founded!',
        })
        return null
      }
    }
    catch (e: unknown) {
      showError({
        statusCode: 404,
        statusMessage: 'Page Not Founded!',
      })
      const error = e as AppError
      if (error?.status === 404) {
        router.push('/search?type=paper')
      }
      throw error
    }
  },
)

const isEditable = computed(() => {
  return user.value?.handle === route.params.id
})

const showBioModal = ref(false)
const DEFAULT_BIO = 'I’m Growing with Gama 🚀'
const showPrivacyModal = ref(false)
const showStatusModal = ref(false)
const showPersonalModal = ref(false)
const showSkillsModal = ref(false)
const showExperienceModal = ref(false)
const showDeleteExperienceModal = ref(false)
const selectedExperienceForDelete = ref('')
const selectedExperienceForEdit = ref()

const changeBioSuccessfully = (data: EditProfileDTO) => {
  if (!contentData.value)
    return
  contentData.value = {
    ...contentData.value,
    biography: data.biography!,
  }
}

const changePrivacySuccessfully = (data: EditProfileDTO) => {
  if (!contentData.value)
    return

  const newUser = {
    ...user.value,
    profileVisibility: data.profileVisibility as ProfileVisibility,
  } as User
  setUser(newUser)
}

const changeCurrentStatusSuccessfully = (data: EditProfileDTO) => {
  if (!contentData.value)
    return

  contentData.value = {
    ...contentData.value,
    currentStatusSentence: data.currentStatusSentence!,
  }
}

const changePersonalSuccessfully = (data: EditProfileDTO) => {
  if (!contentData.value || !user.value)
    return
  const previousHandle = user.value.handle

  const newUser: User = {
    ...user.value,
    firstName: data.firstName ?? user.value.firstName,
    lastName: data.lastName ?? user.value.lastName,
    handle: data.handle ?? user.value.handle,
    countryId: data.countryId ?? user.value.countryId,
    stateId: data.stateId ?? user.value.stateId,
    cityId: data.cityId ?? user.value.cityId,
    schoolId: data.schoolId ?? user.value.schoolId,
    board: data.board ?? user.value.board,
    grade: data.grade ?? user.value.grade,
    gender: data.gender ?? user.value.gender,
    avatar: data.avatar
      ? URL.createObjectURL(data.avatar)
      : user.value.avatar,
  }
  setUser(newUser)

  if (data.handle && data.handle !== previousHandle) {
    router.push(`/profile/${data.handle}`)
  }

  contentData.value = {
    ...contentData.value,
    firstName:
      data.firstName ?? contentData.value.firstName,
    lastName:
      data.lastName ?? contentData.value.lastName,
    avatar: data.avatar
      ? URL.createObjectURL(data.avatar)
      : contentData.value.avatar,
  }
}

const changeSkillsSuccessfully = (data: EditProfileDTO) => {
  if (!contentData.value)
    return
  contentData.value = {
    ...contentData.value,
    skills: data.skills!,
  }
}

const changeExperienceSuccessfully = (data: ExperienceDTO) => {
  if (!contentData.value)
    return
  contentData.value = {
    ...contentData.value,
    experiences: [...contentData.value.experiences, data],
  }
}

const editExperienceSuccessfully = (data: ExperienceDTO) => {
  if (!contentData.value)
    return

  contentData.value = {
    ...contentData.value,
    experiences: contentData.value.experiences.map(item =>
      item.id === data.id
        ? data
        : item,
    ),
  }
}

const editExperience = (experience: ExperienceDTO) => {
  selectedExperienceForEdit.value = experience
  showExperienceModal.value = true
}

const deleteExperience = (id: number) => {
  selectedExperienceForDelete.value = id.toString()
  showDeleteExperienceModal.value = true
}

const deleteExperienceSuccessfully = () => {
  if (!contentData.value)
    return

  contentData.value = {
    ...contentData.value,
    experiences: contentData.value.experiences.filter(
      item => item.id.toString() !== selectedExperienceForDelete.value,
    ),
  }

  showDeleteExperienceModal.value = false
  selectedExperienceForDelete.value = ''
}

const closeExperienceModal = (status: boolean) => {
  if (!status) {
    selectedExperienceForEdit.value = null
    showExperienceModal.value = false
  }
}
</script>

<style scoped>
.box-shadow-div{
  box-shadow: 0px 12px 30px 0px #1018280D;
}
</style>
