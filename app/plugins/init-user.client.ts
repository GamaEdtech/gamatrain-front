export default defineNuxtPlugin(async () => {
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
