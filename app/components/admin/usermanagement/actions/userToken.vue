<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Token
        </div>
        <v-textarea
          v-model="tokenInfo.token"
          rounded="lg"
          density="compact"
          placeholder="Token"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          readonly
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetToken"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-textarea>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Expiration Time
        </div>
        <v-text-field
          v-model="tokenInfo.expirationTime"
          rounded="lg"
          density="compact"
          placeholder="Expiration Time"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          readonly
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetToken"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="w-100 d-flex justify-center align-center ga-1">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        width="140"
        class="text-h5 mt-8"
        :loading="loadingGenerateToken"
        flat
        @click="generateToken(id)"
      >
        Generate
      </v-btn>
      <v-btn
        color="error"
        rounded="xl"
        variant="outlined"
        height="40"
        width="140"
        class="text-h5 mt-8"
        :loading="loadingDeleteToken"
        flat
        @click="deleteToken(id)"
      >
        Delete
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IUserToken {
  id: string
}

const props = defineProps<IUserToken>()

const { loadingGetToken, loadingDeleteToken, loadingGenerateToken, getToken, deleteToken, generateToken, tokenInfo } = useUserManagerAdmin()

onMounted(async () => {
  await getToken(props.id)
})
</script>

<style scoped>
</style>
