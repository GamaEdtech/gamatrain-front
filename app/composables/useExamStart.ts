/**
 * Starts a quiz from its details page. Starting needs an account: a guest gets the login dialog and then goes on
 * to the quiz once signed in. Used by the action card and by the mobile action bar, each with its own state.
 */
export const useExamStart = (examId: MaybeRefOrGetter<string | number>) => {
  const auth = useAuth()
  const router = useRouter()
  const route = useRoute()
  const { user } = useUser()

  const startExamAfterSignIn = ref(false)
  const startPath = () => `/exam/start/${toValue(examId)}`

  const startExam = () => {
    if (auth.isAuthenticated.value) {
      router.push(startPath())
      return
    }

    startExamAfterSignIn.value = true
    router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
  }

  watch(user, (value) => {
    if (!value || !startExamAfterSignIn.value) return

    startExamAfterSignIn.value = false
    router.push(startPath())
  })

  // Closed the dialog without signing in: a later sign-in from the header shouldn't jump into the quiz.
  watch(() => route.query.auth_form, (form) => {
    if (!form && !auth.isAuthenticated.value) startExamAfterSignIn.value = false
  })

  return { startExam }
}
