<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center ga-2">
      <v-text-field
        v-model="text"
        label="Member, email or school"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field"
        @keyup.enter="search"
        @click:clear="text = ''; search()"
      />
      <v-text-field
        v-model="schoolId"
        label="School id"
        type="number"
        density="compact"
        hide-details
        clearable
        rounded="pill"
        variant="outlined"
        class="filter-field filter-field--small"
        @keyup.enter="search"
        @click:clear="schoolId = ''; search()"
      />
      <v-btn
        rounded="pill"
        color="primary"
        flat
        height="40"
        @click="search"
      >
        Search
      </v-btn>
    </div>

    <!-- One chip per role with its count (of everything matching the search); a chip filters the list by that role. -->
    <div class="d-flex flex-wrap ga-2 mt-4">
      <v-chip
        :variant="role === null ? 'flat' : 'tonal'"
        color="primary"
        prepend-icon="md:groups_outlined"
        @click="pickRole(null)"
      >
        All {{ number(allCount) }}
      </v-chip>
      <v-chip
        v-for="item in ROLES"
        :key="item.name"
        :variant="role === item.name ? 'flat' : 'tonal'"
        :color="item.color"
        :prepend-icon="item.icon"
        @click="pickRole(item.name)"
      >
        {{ item.title }} {{ number(countOf(item.name)) }}
      </v-chip>
      <v-chip
        variant="text"
        prepend-icon="md:person_outlined"
      >
        {{ number(users) }} people · {{ number(schools) }} schools
      </v-chip>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="items"
      :page-count="Math.ceil(total / pageSize)"
      :total-count="total"
      :page-size-options="pageSizes"
      :loading="loading"
      item-label="Members"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    />
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader } from '@/types'

// What users said they are at a school (a school page's "I'm a teacher / student / parent..."). Admins only: names and emails.
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'School members' })

interface SchoolMemberRow {
  id: number
  userId: number
  firstName: string | null
  lastName: string | null
  userName: string | null
  email: string | null
  schoolId: number
  schoolName: string | null
  role: string | { name: string }
  showName: boolean
  creationDate: string
}

interface SchoolMemberList {
  total: number
  users: number
  schools: number
  roleCounts: { role: string | { name: string }, count: number }[]
  items: SchoolMemberRow[]
}

const ROLES = [
  { name: 'Teacher', title: 'Teachers', color: 'info', icon: 'md:school_outlined' },
  { name: 'Staff', title: 'Staff', color: 'secondary', icon: 'md:badge_outlined' },
  { name: 'Student', title: 'Students', color: 'success', icon: 'md:backpack_outlined' },
  { name: 'Parent', title: 'Parents', color: 'warning', icon: 'md:family_restroom' },
  { name: 'Alumni', title: 'Alumni', color: 'grey', icon: 'md:history_edu' },
]

const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
const number = (value: number) => value.toLocaleString('en-US')
// A role comes back as its name, or as an object with one.
const roleName = (role: SchoolMemberRow['role']) => (typeof role === 'string' ? role : role?.name ?? '')
const roleOf = (name: string) => ROLES.find(item => item.name === name)

const headers: DataTableHeader<SchoolMemberRow>[] = [
  { title: 'Since', key: 'creationDate', sortable: false, width: '10vw', type: 'date', dateFormat: 'DD/MM/YYYY HH:mm' },
  {
    title: 'Member',
    key: 'userName',
    sortable: false,
    width: '16vw',
    getText: item => [item.firstName, item.lastName].filter(Boolean).join(' ') || item.userName || `#${item.userId}`,
  },
  { title: 'Email', key: 'email', sortable: false, width: '16vw', emptyText: '-' },
  {
    title: 'School',
    key: 'schoolName',
    sortable: false,
    width: '22vw',
    type: 'link',
    target: '_blank',
    getText: item => item.schoolName || `#${item.schoolId}`,
    getTo: item => `/school/${item.schoolId}`,
  },
  {
    title: 'Role',
    key: 'role',
    sortable: false,
    width: '8vw',
    type: 'chip',
    getText: item => roleName(item.role),
    getChipColor: item => roleOf(roleName(item.role))?.color ?? 'grey',
  },
  { title: 'Named on page', key: 'showName', sortable: false, width: '8vw', getText: item => (item.showName ? 'Yes' : '-') },
]

const items = ref<SchoolMemberRow[]>([])
const total = ref(0)
const users = ref(0)
const schools = ref(0)
const roleCounts = ref<SchoolMemberList['roleCounts']>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }, { label: '100 Rows', value: 100 }]
const role = ref<string | null>(null)
const text = ref('')
const schoolId = ref('')

const countOf = (name: string) => roleCounts.value.find(item => roleName(item.role) === name)?.count ?? 0
const allCount = computed(() => roleCounts.value.reduce((sum, item) => sum + item.count, 0))

const fetch = async () => {
  loading.value = true
  try {
    const query: Record<string, string | number> = { page: page.value, pageSize: pageSize.value }
    if (role.value) query.role = role.value
    if (text.value) query.text = text.value
    if (schoolId.value) query.schoolId = schoolId.value
    const response = await useApiService.get<ApiResult<SchoolMemberList>>('/api/v2/admin/schools/members', query)
    if (response.succeeded && response.data) {
      items.value = response.data.items
      total.value = response.data.total
      users.value = response.data.users
      schools.value = response.data.schools
      roleCounts.value = response.data.roleCounts
    }
    else {
      handleApiResponseError(response)
    }
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    loading.value = false
  }
}

const search = async () => {
  page.value = 1
  await fetch()
}

const pickRole = async (name: string | null) => {
  role.value = name
  await search()
}

onMounted(fetch)
</script>

<style scoped>
.filter-field {
  min-width: 200px;
  max-width: 280px;
}

.filter-field--small {
  min-width: 140px;
  max-width: 160px;
}
</style>
