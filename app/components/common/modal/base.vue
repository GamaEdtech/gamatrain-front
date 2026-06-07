<template>
  <v-dialog
    v-model="dialogModel"
    max-width="400"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column bg-white pa-6 rounded-xl overflow-y-auto mobile-style"
      @click="clickOnModal"
    >
      <v-row>
        <v-col cols="6">
          <span class="text-h3">{{ title }}</span>
        </v-col>
        <v-col
          cols="6"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            class="ml-4"
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:cancel
          </v-icon>
        </v-col>
      </v-row>

      <v-row>
        <slot />
      </v-row>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IModalBase {
  title: string
  showDialog?: boolean
}

const props = withDefaults(defineProps<IModalBase>(), {
  showDialog: false,
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
