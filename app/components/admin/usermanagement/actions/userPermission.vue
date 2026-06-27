<template>
  <div class="w-100 d-flex flex-column pa-4">
    <div
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
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
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
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
        <div class="text-h6 text-grey700 ml-2">
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
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
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
    </div>
    <div class="w-100 d-flex justify-center align-center ga-1">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        width="140"
        class="text-h5 mt-8"
        :loading="loadingEditPermission"
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

const { loadingGetPermission, getPermission, editPermission, loadingEditPermission } = useUserManagerAdmin()

onMounted(async () => {
  const response = await getPermission(props.id)
  if (response.succeeded && response.data) {
    roles.value = (response.data as AdminPermissionDTO).roles
    systemClaims.value = (response.data as AdminPermissionDTO).systemClaims
  }
})

const save = async (id: string) => {
  await editPermission(roles.value, systemClaims.value, id)
}
</script>

<style scoped>
</style>
