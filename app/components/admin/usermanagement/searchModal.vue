<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-text-field
      v-model="searchFilter.firstName"
      label="First Name"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />
    <v-text-field
      v-model="searchFilter.lastName"
      label="Last Name"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />
    <v-text-field
      v-model="searchFilter.email"
      label="Email"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />
    <v-text-field
      v-model="searchFilter.referralId"
      label="Referral Id"
      rounded="lg"
      variant="outlined"
      color="primary"
      density="compact"
      class="mt-1"
    />

    <v-btn
      color="primary"
      rounded="xl"
      height="40"
      width="200"
      class="text-h5 mt-4 mx-auto"
      flat
      @click="startSearch"
    >
      Search
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface ISearchModal {
  data: {
    firstName: string
    lastName: string
    email: string
    referralId: string
  }
}

const props = defineProps<ISearchModal>()
const emit = defineEmits(['Search'])

const searchFilter = reactive({
  firstName: '',
  lastName: '',
  email: '',
  referralId: '',
})

const startSearch = () => {
  emit('Search', searchFilter)
}

onMounted(() => {
  searchFilter.firstName = props.data.firstName
  searchFilter.lastName = props.data.lastName
  searchFilter.email = props.data.email
  searchFilter.referralId = props.data.referralId
})
</script>

<style scoped>
</style>
