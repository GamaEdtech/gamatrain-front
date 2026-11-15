<template>
  <v-card
    flat
    rounded="lg"
    border
    class="pa-4 pa-sm-6 my-schools"
    tag="section"
    aria-labelledby="my-schools-title"
  >
    <div class="d-flex flex-wrap justify-space-between align-center ga-2">
      <h2
        id="my-schools-title"
        class="text-h6 font-weight-bold text-grey900"
      >
        My schools
      </h2>
      <v-btn
        to="/school"
        variant="tonal"
        color="secondary"
        class="text-none"
        prepend-icon="mdi-magnify"
      >
        Join a school
      </v-btn>
    </div>
    <p class="ma-0 mt-1 text-body-2 text-grey600">
      Schools you teach or work at, study at, studied at, or your children go to. Joining saves straight away, and joining
      as a teacher, student or parent also sets that on your account.
    </p>

    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line@2"
      class="mt-2"
    />

    <v-list
      v-else-if="schools.length"
      class="pa-0 mt-3"
      bg-color="transparent"
    >
      <v-list-item
        v-for="school in schools"
        :key="school.schoolId"
        class="px-0 py-3 my-schools__row"
      >
        <v-list-item-title class="text-wrap">
          <nuxt-link
            :to="`/school/${school.schoolId}`"
            class="font-weight-bold text-grey900 text-decoration-none my-schools__name"
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
            {{ schoolRoleLabel(item.role) }}<template v-if="item.showName">
              · Named on the school page
            </template>
          </v-chip>
        </div>

        <template #append>
          <v-menu location="bottom end">
            <template #activator="{ props: menu }">
              <v-btn
                v-bind="menu"
                variant="text"
                color="grey700"
                class="text-none"
                append-icon="mdi-chevron-down"
                :disabled="busy"
                :aria-label="`Leave ${school.schoolName || 'this school'}`"
              >
                Leave
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item
                v-for="item in school.roles"
                :key="item.role"
                :title="`Leave as ${schoolRoleLabel(item.role).toLowerCase()}`"
                @click="confirmLeave(school.schoolId, school.schoolName, item.role)"
              />
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
    </v-list>

    <p
      v-else
      class="ma-0 mt-3 text-body-2 text-grey700"
    >
      You haven't joined a school yet. Find yours, open its page and tap Join.
    </p>

    <v-dialog
      v-model="leaving.open"
      max-width="420"
    >
      <v-card
        rounded="lg"
        class="pa-2"
      >
        <v-card-title class="text-h6 text-wrap">
          Leave {{ leaving.schoolName || 'this school' }}?
        </v-card-title>
        <v-card-text class="text-body-1">
          You'll no longer be listed there as {{ leaving.role ? schoolRoleLabel(leaving.role).toLowerCase() : '' }}. You can
          join again at any time. Your account keeps its role.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="text-none"
            @click="leaving.open = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            class="text-none"
            :loading="busy"
            @click="leaveRole"
          >
            Leave
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import type { SchoolMemberRole } from '@/types'

// The school id is only used for the per-school state, not here; any value works.
const { mine, loadMine, leave } = useSchoolMembers(0)
const { $toast } = useNuxtApp()

const loading = ref(true)
const busy = ref(false)
const leaving = reactive<{ open: boolean, schoolId: number, schoolName: string | null, role: SchoolMemberRole | null }>({
  open: false,
  schoolId: 0,
  schoolName: null,
  role: null,
})

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

function confirmLeave(schoolId: number, schoolName: string | null, role: SchoolMemberRole) {
  Object.assign(leaving, { open: true, schoolId, schoolName, role })
}

async function leaveRole() {
  if (!leaving.role) return
  busy.value = true
  const error = await leave(leaving.role, leaving.schoolId)
  busy.value = false
  leaving.open = false
  if (error) $toast.error(error)
  else $toast.success(`You left ${leaving.schoolName || 'the school'} as ${schoolRoleLabel(leaving.role).toLowerCase()}.`)
}
</script>

<style scoped>
.my-schools {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.my-schools__row + .my-schools__row {
  border-top: 1px solid rgb(var(--v-theme-borderSubtle));
}

.my-schools__name:hover,
.my-schools__name:focus-visible {
  text-decoration: underline !important;
}
</style>
