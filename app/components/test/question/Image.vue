<template>
  <v-dialog max-width="1100">
    <template #activator="{ props: activatorProps }">
      <!-- .stop keeps the click from reaching a choice row, so enlarging never changes the answer -->
      <button
        v-bind="activatorProps"
        type="button"
        class="image-zoom-trigger"
        :aria-label="`Enlarge ${alt}`"
        @click.stop
      >
        <img
          :class="['question-image', `question-image--${variant}`]"
          :src="src"
          :alt="alt"
          loading="lazy"
        >
      </button>
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-actions class="justify-end pb-0">
          <v-btn
            icon="md:close"
            size="small"
            variant="text"
            aria-label="Close enlarged image"
            @click="isActive.value = false"
          />
        </v-card-actions>
        <v-card-text class="zoom-scroll pt-0">
          <img
            class="zoom-img"
            :src="src"
            :alt="alt"
          >
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  alt: string
  variant?: 'question' | 'option'
}>(), {
  variant: 'question',
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.image-zoom-trigger {
  display: block;
  max-width: min(100%, 720px);
  cursor: zoom-in;
}
/* Shown at their own size, never enlarged, and scaled down (keeping the aspect ratio) to fit a box.
   Options get a smaller box than the question. */
.question-image {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
}
.question-image--question {
  max-height: 420px;
}
.question-image--option {
  max-height: 240px;
}
/* Enlarged view: fills the dialog on wide screens; on phones it is twice the screen width and pans. */
.zoom-scroll {
  overflow: auto;
}
.zoom-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}
@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .zoom-img {
    width: 200%;
    max-height: none;
  }
}
</style>
