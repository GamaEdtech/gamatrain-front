<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-text-field
      v-model="searchFilter.firstName"
      label="First Name"
      rounded="lg"
      variant="outlined"
      density="compact"
      class="mt-1"
    />
    <v-text-field
      v-model="searchFilter.lastName"
      label="Last Name"
      rounded="lg"
      variant="outlined"
      density="compact"
      class="mt-1"
    />
    <v-text-field
      v-model="searchFilter.email"
      label="Email"
      rounded="lg"
      variant="outlined"
      density="compact"
      class="mt-1"
    />
    <v-text-field
      v-model="searchFilter.referralId"
      label="Referral Id"
      rounded="lg"
      variant="outlined"
      density="compact"
      class="mt-1"
    />
    <v-select
      v-model="searchFilter.role"
      :items="roleList"
      label="Role"
      rounded="lg"
      variant="outlined"
      density="compact"
      class="mt-1"
    />

    <v-btn
      color="primary"
      rounded="xl"
      height="40"
      width="200"
      class="text-body-1 mt-4 mx-auto"
      flat
      @click="startSearch"
    >
      Search
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilterUser } from '@/types'

interface ISearchModal {
  data: SearchFilterUser
}

const roleList: { value: SearchFilterUser['role'], title: string }[] = [
  { value: '', title: 'All roles' },
  { value: 'Teacher', title: 'Teacher' },
  { value: 'Student', title: 'Student' },
  { value: 'Admin', title: 'Admin' },
  { value: 'Advisor', title: 'Advisor' },
  { value: 'Finance', title: 'Finance' },
]

const props = defineProps<ISearchModal>()
const emit = defineEmits(['Search'])

const searchFilter = reactive<SearchFilterUser>({
  firstName: '',
  lastName: '',
  email: '',
  referralId: '',
  role: '',
})

const startSearch = () => {
  emit('Search', searchFilter)
}

onMounted(() => {
  searchFilter.firstName = props.data.firstName
  searchFilter.lastName = props.data.lastName
  searchFilter.email = props.data.email
  searchFilter.referralId = props.data.referralId
  searchFilter.role = props.data.role
})
</script>

<style scoped>
</style>
