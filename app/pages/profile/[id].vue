<template>
  <v-container
    v-if="contentData"
    class="d-flex flex-column ga-2 mt-16"
  >
    <profile-header
      :data="contentData"
      :is-editable="isEditable"
      :visibility="user?.profileVisibility"
    />
    <profile-skills class="box-shadow-div" />
    <profile-experience class="box-shadow-div" />
    <profile-register-content class="box-shadow-div" />
    <profile-education class="box-shadow-div" />
  </v-container>
</template>

<script setup lang="ts">
import type {
  ApiResult,
  AppError,
  ProfileDTO,
} from '@/types'

const route = useRoute()
const router = useRouter()
const { getItemById } = useProfile()
const { user } = useUser()

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
</script>

<style scoped>
.box-shadow-div{
  box-shadow: 0px 12px 30px 0px #1018280D;
}
</style>
