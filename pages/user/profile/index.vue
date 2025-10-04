<template>
  <v-container class="w-100 d-flex flex-column margin-top-handle">
    <v-row>
      <v-col cols="12">
        <v-file-input
          ref="avatarInputRef"
          v-model="userInformation.avatar"
          class="d-none"
          accept="image/png,image/webp,image/jpeg"
          @change="uploadAvatar"
        />

        <img
          v-if="userInformation.avatar"
          width="72"
          height="72"
          class="pointer rounded-pill"
          :src="userInformation.avatar"
          @click="changeUserAvatar"
        >
        <v-btn
          class="d-flex pointer rounded-pill"
          variant="outlined"
          size="x-large"
          icon
          density="default"
          @click="changeUserAvatar"
        >
          <v-icon size="36">
            md:person
          </v-icon>
        </v-btn>
        <div class="pa-3">
          <p
            class="text-h5 pointer"
            @click="changeUserAvatar"
          >
            <v-icon size="small">
              md:edit
            </v-icon>
            Edit
          </p>
          <span class="text-h5"> Help to pick profile pic </span>
        </div>
      </v-col>
    </v-row>
    <!-- <CommonCropperDialog
      v-model="showCropperDialog"
      :file-url="cropAvatarUrl"
      :stencil-props="stencilProps"
      @cropped-data="confirmCrop"
    /> -->
  </v-container>
</template>

<script setup lang="ts">
// const { $toast } = useNuxtApp()

const userInformation = ref({
  avatar: null,
})

const avatarInputRef = ref<HTMLInputElement | null>(null)
// const cropAvatarUrl = ref('')
// const showCropperDialog = ref(false)
// const stencilProps = { width: 180, height: 180, resizable: true }
const changeUserAvatar = () => {
  avatarInputRef.value?.click()
}
const uploadAvatar = () => {
  // const file = userInformation.value.avatar
  // if (file) {
  //   const maxSize = 5 * 1024 * 1024 // 5MB
  //   if (file.size > maxSize) {
  //     $toast.error('File size must be less than 5MB')
  //     return
  //   }
  //   cropAvatarUrl.value = URL.createObjectURL(file)
  //   showCropperDialog.value = true
  // }
}
// const confirmCrop = (url: Blob) => {
// avatarUrl.value = URL.createObjectURL(url)
// showCropperDialog.value = false
// }
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
}

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
  }
}
</style>
