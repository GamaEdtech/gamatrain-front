<template>
  <v-dialog
    v-model="dialogModel"
    :max-width="maxWidth"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column bg-white rounded-xl overflow-y-auto mobile-style"
      :class="variant === 'publish' ? 'modal-panel--publish py-6 px-4 pa-sm-6 pa-md-8' : 'py-6 px-3 px-sm-6'"
      @click="clickOnModal"
    >
      <div
        class="modal-header w-100 d-flex align-center justify-space-between"
        :class="{ 'ga-4 ga-sm-6 pb-2': variant === 'publish' }"
      >
        <div class="d-flex flex-column align-start justify-start ga-1">
          <span class="modal-title text-h5 text-sm-h3 font-weight-bold text-grey700">{{ title }}</span>
          <span
            v-if="subtitle"
            class="text-subtitle-1 text-sm-h6 font-weight-medium text-grey400"
          >{{ subtitle }}</span>
        </div>
        <v-icon
          :class="variant === 'publish' ? 'modal-close--publish ml-2 ml-sm-4' : 'ml-4'"
          size="x-large"
          :color="variant === 'publish' ? undefined : 'grey300'"
          aria-label="Close dialog"
          @click="closeModal"
        >
          md:cancel
        </v-icon>
      </div>

      <div class="modal-body w-100 d-flex">
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
  variant?: 'default' | 'publish'
}

const props = withDefaults(defineProps<IModalBase>(), {
  showDialog: false,
  maxWidth: 400,
  subtitle: '',
  variant: 'default',
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

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.mobile-style{
  max-height: 90%;
}
.modal-title {
  line-height: 1.3 !important;
  padding-bottom: 2px;
}

.modal-panel--publish {
  max-height: min(90vh, 860px);
  color: rgb(var(--v-theme-brandNavy));
  background: rgb(var(--v-theme-grey25)) !important;
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 20px !important;
  box-shadow: 0 24px 64px rgba(var(--v-theme-brandNavy), 0.18);
}

.modal-panel--publish .modal-title {
  color: rgb(var(--v-theme-brandNavy)) !important;
  font-size: clamp(22px, 2.5vw, 28px) !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
}

.modal-panel--publish .modal-header span:not(.modal-title) {
  max-width: 520px;
  color: rgb(var(--v-theme-grey500)) !important;
  font-size: clamp(13px, 1.6vw, 15px) !important;
  line-height: 1.5 !important;
}

.modal-panel--publish .modal-close--publish {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  color: rgb(var(--v-theme-brandNavy)) !important;
  background: rgb(var(--v-theme-surfaceSecondary));
  border: 1px solid rgb(var(--v-theme-borderSubtle));
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.modal-panel--publish .modal-close--publish:hover {
  background: rgb(var(--v-theme-surfaceTertiary));
  border-color: rgb(var(--v-theme-borderStrong));
}

.modal-panel--publish .modal-close--publish:active {
  transform: scale(.96);
}

.modal-panel--publish .modal-close--publish:focus-visible {
  outline: 3px solid rgba(var(--v-theme-primary), 0.3);
  outline-offset: 2px;
}

@media #{map.get(vuetify.$display-breakpoints, 'sm')} {
  .modal-panel--publish {
    max-width: 680px;
    margin-inline: auto;
    left: 0;
    right: 0;
  }
}

@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .modal-panel--publish {
    max-height: 92vh;
    padding-bottom: max(20px, env(safe-area-inset-bottom)) !important;
  }

  .modal-panel--publish .modal-close--publish {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-panel--publish .modal-close--publish {
    transition: none;
  }
}
@media #{map.get(vuetify.$display-breakpoints, 'sm-and-down')} {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
