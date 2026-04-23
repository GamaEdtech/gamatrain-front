<template>
  <v-dialog
    v-model="dialogModel"
    max-width="600"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <v-sheet
      class="rounded-lg mobile-style"
      @click="clickOnModal"
    >
      <v-tabs
        v-model="tab"
        fixed-tabs
        bg-color="grey-lighten-4"
      >
        <v-tab value="Edit">
          Edit
        </v-tab>
        <v-tab value="Password">
          Password
        </v-tab>
        <v-tab value="Token">
          Token
        </v-tab>
        <v-tab value="Permissions">
          Permissions
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-window v-model="tab">
        <v-window-item value="Edit">
          <admin-usermanagement-actions-user-detail-modal
            :id="id"
            @edit-user-success-full="editUserSuccessFull"
          />
        </v-window-item>

        <v-window-item value="Password">
          <admin-usermanagement-actions-reset-password
            :id="id"
            @reset-password-success-full="resetPasswordSuccessFull"
          />
        </v-window-item>

        <v-window-item value="Token">
          <admin-usermanagement-actions-user-token
            :id="id"
          />
        </v-window-item>
        <v-window-item value="Permissions">
          <admin-usermanagement-actions-user-permission
            :id="id"
          />
        </v-window-item>
      </v-window>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IMoreActionModal {
  showDialog: boolean
  id: string
}

const { mdAndUp } = useDisplay()
const tab = ref('Edit')

const props = defineProps<IMoreActionModal>()

const emit = defineEmits(['update:showDialog', 'refreshData'])
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}
const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const editUserSuccessFull = () => {
  emit('update:showDialog', false)
  emit('refreshData')
}

const resetPasswordSuccessFull = () => {
  emit('update:showDialog', false)
}
</script>

<style scoped>
.v-window-item {
  min-height: 400px;
}
.mobile-style {
  width : 100%
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
    height: 60% !important;
    min-height: 60% !important;
  }
}
</style>
