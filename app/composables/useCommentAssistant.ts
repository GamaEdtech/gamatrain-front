import type { ApiResult } from '@/types'

/** An AI draft of a school comment, named like the fields of a school comment. Ratings are 1 to 5. */
export interface SchoolAiCommentDraft {
  comment: string
  classesQualityRate: number
  educationRate: number
  itTrainingRate: number
  safetyAndHappinessRate: number
  behaviorRate: number
  tuitionRatioRate: number
  facilitiesRate: number
  artisticActivitiesRate: number
}

// The prompt and the AI provider's key live in the backend: it builds the draft from the school's own data,
// for signed-in users only. Here we just ask for a draft of a school by its id.
export const useCommentAssistant = () => {
  const loading = ref(false)

  const getDescriptionFromAi = async (schoolId: string | number): Promise<SchoolAiCommentDraft | undefined> => {
    const nuxtApp = useNuxtApp()
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated.value) {
      nuxtApp.$toast?.error('Login required to proceed.')
      router.push({ query: { auth_form: 'login' } })
      return
    }

    loading.value = true
    try {
      const response = await useApiService.post<ApiResult<SchoolAiCommentDraft>>(`/api/v2/schools/${schoolId}/comments/ai-draft`)
      if (!response.succeeded || !response.data) throw new Error(response.errors?.[0]?.message || 'No AI draft')
      return response.data
    }
    catch (err) {
      nuxtApp.$toast?.error('Error: Failed to get AI response.')
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    getDescriptionFromAi,
  }
}
