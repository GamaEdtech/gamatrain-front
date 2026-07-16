<template>
  <v-dialog
    v-model="dialogModel"
    :max-width="maxWidth"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column bg-white pa-6 rounded-xl overflow-y-auto mobile-style"
      @click="clickOnModal"
    >
      <div class="w-100 d-flex align-center justify-space-between">
        <div class="d-flex flex-column align-start justify-start ga-1">
          <span class="modal-title text-h5 text-sm-h3 font-weight-bold text-grey700">{{ title }}</span>
          <span
            v-if="subtitle"
            class="text-subtitle-1 text-sm-h6 font-weight-medium text-grey400"
          >{{ subtitle }}</span>
        </div>
        <v-icon
          class="ml-4"
          size="x-large"
          color="grey300"
          @click="closeModal"
        >
          md:cancel
        </v-icon>
      </div>

      <div class="w-100 d-flex">
        <slot />
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IModalBase {
  title: string
  subtitle?: string
  showDialog?: boolean
  maxWidth?: number
}

const props = withDefaults(defineProps<IModalBase>(), {
  showDialog: false,
  maxWidth: 400,
  subtitle: '',
})

const { mdAndUp } = useDisplay()

const emit = defineEmits(['update:showDialog'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event: MouseEvent) => {
  event.stopPropagation()
}
</script>

<style>
.mobile-style{
  max-height: 90%;
}
.modal-title {
  line-height: 1.3 !important;
  padding-bottom: 2px;
}
.ck ol, .ck ul{
  padding-left : 24px !important;
}
.ck.ck-balloon-panel{
  z-index: 2400 !important;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
