<template>
  <!-- A member sees how they're connected; anyone else is asked once, until they say "Not now" (30 days). -->
  <v-sheet
    v-if="isMember || (!dismissed && roles.length)"
    id="join-school"
    tag="section"
    rounded="lg"
    border
    class="join-school d-flex flex-column ga-3 pa-4"
    aria-labelledby="join-school-title"
  >
    <template v-if="isMember && !adding">
      <div class="d-flex align-center flex-wrap ga-2">
        <v-icon
          color="success"
          aria-hidden="true"
        >
          mdi-check-circle
        </v-icon>
        <h2
          id="join-school-title"
          class="section-title flex-grow-1"
        >
          You're at this school
        </h2>
      </div>
      <div class="d-flex flex-wrap align-center ga-2">
        <v-menu
          v-for="item in myRoles"
          :key="item.role"
          location="bottom start"
        >
          <template #activator="{ props: menu }">
            <v-chip
              v-bind="menu"
              color="success"
              variant="tonal"
              append-icon="mdi-chevron-down"
              class="font-weight-medium"
              :aria-label="`${schoolRoleLabel(item.role)}: options`"
            >
              {{ schoolRoleLabel(item.role) }}
            </v-chip>
          </template>
          <v-list density="compact">
            <v-list-item
              v-if="canShowName(item.role)"
              :prepend-icon="item.showName ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :title="item.showName ? 'Hide my name on this page' : 'Show my name on this page'"
              :disabled="busy"
              @click="setShowName(item.role, !item.showName)"
            />
            <v-list-item
              prepend-icon="mdi-logout"
              :title="`Leave as ${schoolRoleLabel(item.role).toLowerCase()}`"
              base-color="error"
              :disabled="busy"
              @click="leaveRole(item.role)"
            />
          </v-list>
        </v-menu>
        <v-btn
          v-if="otherRoles.length"
          variant="text"
          size="small"
          color="grey700"
          prepend-icon="mdi-plus"
          class="text-none"
          @click="adding = true"
        >
          Add a role
        </v-btn>
      </div>
      <p class="ma-0 join-school__hint text-grey600">
        {{ namedHint }}
      </p>
    </template>

    <template v-else>
      <div>
        <h2
          id="join-school-title"
          class="section-title"
        >
          {{ adding ? 'Add another role' : 'Are you at this school?' }}
        </h2>
        <p class="ma-0 mt-1 join-school__hint text-grey700">
          {{ adding ? 'A teacher here can also be a parent of a student, for example.' : 'Join it to show on this page and help keep its details right.' }}
        </p>
      </div>

      <v-chip-group
        v-model="picked"
        selected-class="join-school__role--picked"
        column
        aria-label="Your role at this school"
      >
        <v-chip
          v-for="role in availableRoles"
          :key="role.name"
          :value="role.name"
          variant="outlined"
          filter
          size="large"
          class="join-school__role font-weight-medium"
        >
          {{ schoolRoleLabel(role.name) }}
        </v-chip>
      </v-chip-group>

      <v-expand-transition>
        <div v-if="pickedRole && pickedRole.canShowName">
          <v-switch
            v-model="showName"
            color="primary"
            inset
            density="compact"
            hide-details
            label="Show my name on this school's page"
          />
          <p class="ma-0 join-school__hint text-grey600">
            Parents can then find you. This makes your profile public; you can hide your name any time.
          </p>
        </div>
        <p
          v-else-if="pickedRole"
          class="ma-0 join-school__hint text-grey600"
        >
          Students, parents and former students are counted on this page, never named.
        </p>
      </v-expand-transition>

      <div class="d-flex flex-wrap align-center ga-2">
        <v-btn
          color="secondary"
          variant="flat"
          rounded
          class="text-none gtext-t5"
          :disabled="!picked"
          :loading="busy"
          @click="submit"
        >
          {{ submitLabel }}
        </v-btn>
        <v-btn
          variant="text"
          color="grey700"
          class="text-none"
          @click="adding ? (adding = false) : dismiss()"
        >
          {{ adding ? 'Cancel' : 'Not now' }}
        </v-btn>
        <span
          v-if="!adding && total"
          class="ms-auto join-school__proof text-grey600"
        >{{ proof }}</span>
      </div>
    </template>
  </v-sheet>
</template>

<script setup lang="ts">
import type { SchoolMemberRole } from '@/types'

const props = defineProps<{ schoolId: number | string }>()

const { requireSignIn } = useContributeGate()
const { $toast } = useNuxtApp()
const { roles, people, myRoles, isMember, total, dismissed, loadRoles, loadMine, loadDismissed, dismiss, join, leave }
  = useSchoolMembers(() => props.schoolId)

const picked = ref<SchoolMemberRole | null>(null)
const showName = ref(true)
const adding = ref(false)
const busy = ref(false)

onMounted(() => {
  loadDismissed()
  loadRoles()
  loadMine()
})

const canShowName = (role: SchoolMemberRole) => !!roles.value.find(item => item.name === role)?.canShowName
const otherRoles = computed(() => roles.value.filter(role => !myRoles.value.some(item => item.role === role.name)))
const availableRoles = computed(() => (adding.value ? otherRoles.value : roles.value))
const pickedRole = computed(() => roles.value.find(role => role.name === picked.value) ?? null)
const submitLabel = computed(() => {
  if (!picked.value) return adding.value ? 'Add role' : 'Join'
  const role = schoolRoleLabel(picked.value).toLowerCase()
  return adding.value ? `Add as ${role}` : `Join as ${role}`
})

const proof = computed(() => {
  const counts = people.value?.counts ?? []
  const teachers = counts.filter(item => item.role === 'Teacher' || item.role === 'Staff').reduce((sum, item) => sum + item.count, 0)
  const others = total.value - teachers
  const parts = [teachers && `${teachers} ${teachers === 1 ? 'teacher' : 'teachers'}`, others && `${others} ${others === 1 ? 'other' : 'others'}`]
  return `${parts.filter(Boolean).join(' and ')} already joined`
})

const namedHint = computed(() => {
  const shown = myRoles.value.find(item => canShowName(item.role) && item.showName)
  if (shown) return 'Your name shows under People at this school while your profile is public.'
  if (myRoles.value.some(item => canShowName(item.role))) return 'You are counted here but your name is hidden.'
  return 'You are counted under People at this school. Students, parents and former students are never named.'
})

async function submit() {
  if (!picked.value || !requireSignIn()) return
  busy.value = true
  const role = picked.value
  const error = await join(role, showName.value)
  busy.value = false
  if (error) {
    $toast.error(error)
    return
  }
  $toast.success(`You joined as ${schoolRoleLabel(role).toLowerCase()}.`)
  picked.value = null
  adding.value = false
}

async function setShowName(role: SchoolMemberRole, value: boolean) {
  busy.value = true
  const error = await join(role, value)
  busy.value = false
  if (error) $toast.error(error)
  else $toast.success(value ? 'Your name now shows on this page.' : 'Your name is hidden on this page.')
}

async function leaveRole(role: SchoolMemberRole) {
  busy.value = true
  const error = await leave(role)
  busy.value = false
  if (error) $toast.error(error)
  else $toast.success(`You left this school as ${schoolRoleLabel(role).toLowerCase()}.`)
}

watch(adding, (value) => {
  if (value) picked.value = null
})
</script>

<style scoped>
.join-school {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.join-school__hint,
.join-school__proof {
  font-size: 13px;
  line-height: 1.5;
}

.join-school__role {
  border-color: rgb(var(--v-theme-borderSubtle));
}

.join-school__role--picked {
  border-color: rgb(var(--v-theme-grey800));
  color: rgb(var(--v-theme-grey900));
}
</style>
