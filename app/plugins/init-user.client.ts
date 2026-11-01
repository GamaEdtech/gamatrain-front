export default defineNuxtPlugin(async (nuxtApp) => {
  // Hydration is done: the signed-in UI (useAuth's isAuthenticatedUi) can show now.
  const appHydrated = useState('appHydrated', () => false)
  nuxtApp.hook('app:suspense:resolve', () => {
    appHydrated.value = true
  })

  const { isAuthenticated } = useAuth()
  const { getProfile, setUser } = useUser()

  // global client state
  const hasFetched = useState('hasFetchedUser', () => false)

  if (!isAuthenticated.value) return

  // prevent duplicate calls
  if (hasFetched.value) return

  const result = await getProfile()

  if (result.data) {
    setUser(result.data.data)
    hasFetched.value = true
  }
})
