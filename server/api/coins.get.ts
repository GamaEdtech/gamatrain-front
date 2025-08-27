export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const data = await $fetch(`/api/v2/game/coins`, {
    headers: {
      'x-secret-key': config.coinGameSecretKey,
    },
  })
  return data
})
