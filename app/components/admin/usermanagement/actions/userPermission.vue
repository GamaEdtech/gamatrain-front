<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-caption font-weight-medium text-grey700 ml-2">
          Role
        </div>
        <v-select
          v-model="roles"
          :items="roleList"
          rounded="lg"
          density="compact"
          placeholder="Role"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          class="w-100"
          multiple
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetPermission"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-select>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-caption font-weight-medium text-grey700 ml-2">
          System Claim
        </div>
        <v-select
          v-model="systemClaims"
          :items="systemClaimList"
          rounded="lg"
          density="compact"
          placeholder="Claim"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          class="w-100"
          multiple
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetPermission"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-select>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-2">
        <div class="text-caption font-weight-medium text-grey700 ml-2">
          Admin access
        </div>
        <span class="text-caption text-grey400 ml-2">
          Lets this user use only the ticked admin actions, without the Admin role.
        </span>
        <div
          v-if="!loadingGetPermission && !groups.length"
          class="text-body-2 text-grey600 ml-2 mt-1"
        >
          No admin actions can be granted.
        </div>
        <div
          v-for="group in groups"
          :key="group.title"
          class="w-100 mt-2"
        >
          <div class="text-body-1 font-weight-bold text-grey700 ml-2">
            {{ group.title }}
          </div>
          <v-checkbox
            v-for="endpoint in group.endpoints"
            :key="endpoint.value"
            v-model="permissions"
            :value="endpoint.value"
            :label="endpoint.text"
            density="compact"
            color="primary"
            hide-details
          />
        </div>
      </div>

      <admin-common-two-factor-code-field
        v-model="code"
        :disabled="loadingEditPermission"
      />
    </div>
    <div class="w-100 d-flex justify-center align-center ga-1">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        width="140"
        class="text-body-1 mt-8"
        :loading="loadingEditPermission"
        :disabled="!/^\d{6}$/.test(code)"
        flat
        @click="save(id)"
      >
        Save
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import type {
  AdminPermissionDTO,
  AdminPermissionNode,
  Role,
  SystemClaims,
} from '@/types'

interface IUserPermission {
  id: string
}

const props = defineProps<IUserPermission>()
const roles = shallowRef<Role[]>([])
const roleList = ['Admin', 'Teacher', 'Student', 'Advisor', 'Finance']

const systemClaims = shallowRef<SystemClaims[]>([])
const systemClaimList = ['AutoConfirmSchoolContribution', 'AutoConfirmSchoolImage', 'AutoConfirmSchoolComment', 'AutoConfirmPost', 'AutoConfirmRemoveSchoolImage', 'AutoConfirmPostComment']

// Endpoint grants. The backend lists only the endpoints a grant can open (area -> controller -> endpoint) and replaces
// the user's whole list on save, so every ticked value is sent back, not just the changes.
const tree = shallowRef<AdminPermissionNode[]>([])
const permissions = ref<string[]>([])
const code = ref('')

const groups = computed(() => tree.value.flatMap(area => (area.items ?? []).map(controller => ({
  title: [area.text, controller.text].filter(Boolean).join(' / '),
  endpoints: (controller.items ?? [])
    .filter(endpoint => endpoint.value)
    .map(endpoint => ({ value: endpoint.value as string, text: endpoint.text || (endpoint.value as string) })),
})).filter(group => group.endpoints.length)))

const { loadingGetPermission, getPermission, editPermission, loadingEditPermission } = useUserManagerAdmin()

onMounted(async () => {
  const response = await getPermission(props.id)
  if (response.succeeded && response.data) {
    const data = response.data as AdminPermissionDTO
    roles.value = data.roles
    systemClaims.value = data.systemClaims
    tree.value = data.permissions ?? []
    permissions.value = tree.value
      .flatMap(area => area.items ?? [])
      .flatMap(controller => controller.items ?? [])
      .filter(endpoint => endpoint.hasPermission && endpoint.value)
      .map(endpoint => endpoint.value as string)
  }
})

const save = async (id: string) => {
  await editPermission(roles.value, systemClaims.value, permissions.value, code.value, id)
  // A code works once (and a wrong one can't be retried), so it is always cleared.
  code.value = ''
}
</script>

<style scoped>
</style>
