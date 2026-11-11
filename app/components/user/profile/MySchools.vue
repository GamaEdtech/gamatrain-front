<template>
  <v-card
    flat
    rounded="lg"
    border
    class="pa-4 my-schools"
    tag="section"
    aria-labelledby="my-schools-title"
  >
    <h2
      id="my-schools-title"
      class="text-h6 font-weight-bold text-grey900"
    >
      My schools
    </h2>
    <p class="ma-0 mt-1 my-schools__hint text-grey600">
      Schools you teach or work at, study at, studied at, or your children go to. Joining as a teacher, student or parent
      also sets that on your account.
    </p>

    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line@2"
      class="mt-2"
    />

    <v-list
      v-else-if="schools.length"
      class="pa-0 mt-2"
      bg-color="transparent"
    >
      <v-list-item
        v-for="school in schools"
        :key="school.schoolId"
        class="px-0 my-schools__row"
      >
        <v-list-item-title>
          <nuxt-link
            :to="`/school/${school.schoolId}`"
            class="font-weight-medium text-grey900 text-decoration-none"
          >
            {{ school.schoolName || `School ${school.schoolId}` }}
          </nuxt-link>
        </v-list-item-title>
        <div class="d-flex flex-wrap ga-2 mt-2">
          <v-chip
            v-for="item in school.roles"
            :key="item.role"
            size="small"
            variant="tonal"
            color="grey800"
          >
            {{ schoolRoleLabel(item.role) }}
            <v-icon
              v-if="item.showName"
              end
              size="14"
              aria-label="Your name shows on the school's page"
            >
              mdi-eye-outline
            </v-icon>
            <v-btn
              icon="mdi-close"
              size="20"
              variant="text"
              class="ms-1 me-n2"
              :disabled="busy"
              :aria-label="`Leave ${school.schoolName || 'this school'} as ${schoolRoleLabel(item.role).toLowerCase()}`"
              @click="leaveRole(school.schoolId, item.role)"
            />
          </v-chip>
        </div>
      </v-list-item>
    </v-list>

    <div
      v-else
      class="d-flex flex-wrap align-center ga-3 mt-3"
    >
      <span class="text-grey700">You haven't joined a school yet.</span>
    </div>

    <v-btn
      to="/school"
      variant="text"
      color="info"
      prepend-icon="mdi-magnify"
      class="text-none mt-2 px-1"
    >
      Find your school and tap Join
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import type { SchoolMemberRole } from '@/types'

// The school id is only used for the per-school state, not here; any value works.
const { mine, loadMine, leave } = useSchoolMembers(0)
const { $toast } = useNuxtApp()

const loading = ref(true)
const busy = ref(false)

onMounted(async () => {
  await loadMine(true).catch(() => {})
  loading.value = false
})

/** One row per school, with every role the user holds there. */
const schools = computed(() => {
  const bySchool = new Map<number, { schoolId: number, schoolName: string | null, roles: { role: SchoolMemberRole, showName: boolean }[] }>()
  for (const item of mine.value) {
    const row = bySchool.get(item.schoolId) ?? { schoolId: item.schoolId, schoolName: item.schoolName, roles: [] }
    row.roles.push({ role: item.role, showName: item.showName })
    bySchool.set(item.schoolId, row)
  }
  return [...bySchool.values()]
})

async function leaveRole(schoolId: number, role: SchoolMemberRole) {
  busy.value = true
  const error = await leave(role, schoolId)
  busy.value = false
  if (error) $toast.error(error)
  else $toast.success(`You left as ${schoolRoleLabel(role).toLowerCase()}.`)
}
</script>

<style scoped>
.my-schools {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.my-schools__hint {
  font-size: 14px;
  line-height: 1.5;
}

.my-schools__row + .my-schools__row {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}
</style>
