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
    />
    <profile-skills class="box-shadow-div" />
    <profile-experience class="box-shadow-div" />
    <profile-register-content class="box-shadow-div" />
    <profile-education class="box-shadow-div" />

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

      console.log('response', response)
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
  {
    server: false,
  },
)

const isEditable = computed(() => {
  return user.value?.handle === route.params.id
})
console.log('data', contentData.value)

const showBioModal = ref(false)
const DEFAULT_BIO = 'I’m Growing with Gama 🚀'
const showPrivacyModal = ref(false)

const changeBioSuccessfully = (data: EditProfileDTO) => {
  if (!contentData.value)
    return
  // refresh data
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
</script>

<style scoped>
.box-shadow-div{
  box-shadow: 0px 12px 30px 0px #1018280D;
}
</style>
