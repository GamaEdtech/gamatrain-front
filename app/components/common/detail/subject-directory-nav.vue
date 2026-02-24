<template>
  <nuxt-link
    :to="`/subject-directory?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}`"
    class="w-100 rounded-lg d-flex align-center justify-start pa-1 pa-sm-3 ga-2 mt-2 subject-directory-alert"
  >
    <div>
      <div class="pt-4 pl-2 text-h5 font-weight-bold">
        {{ contentData?.lesson_title }} Subject directory
      </div>
      <div class="pl-2 pb-4">
        <v-icon size="25">md:files_outlined</v-icon>

        <span class="text-h6 text-sm-h5 font-weight-medium">
          All resources in one place
        </span>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup>
defineProps({
  contentData: Object,
})
</script>

<style scoped>
.subject-directory-alert {
  height: 64px;
  background-color: #e6f4ff;
  color: #0066cc;
}
</style>
