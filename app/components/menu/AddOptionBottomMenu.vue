<template>
  <div class="w-100 d-flex align-center justify-center flex-column mt-4">
    <div class="w-100 d-flex flex-wrap justify-center ga-1 container-card">
      <nuxt-link
        v-for="(item, index) in addOptions"
        :key="index"
        :to="item.path"
        class="card-add-option mt-1 d-flex flex-column align-center justify-center ga-1 rounded-xl"
      >
        <div class="icon-div rounded-lg pa-2 d-flex align-center justify-center bg-primary100">
          <span
            v-if="item.icon"
            class="icon-add text-grey700"
            :class="item.icon"
          />
          <v-icon
            v-if="item.iconMd"
            color="grey700"
            size="20"
          >
            {{ item.iconMd }}
          </v-icon>
        </div>
        <span class="text-grey700 text-h6 font-weight-bold mt-1">{{ item.title }}</span>

        <span class="text-subtitle-2 font-weight-bold text-grey500 px-2 rounded-pill bg-grey100 mt-1 chip-type-file">
          {{ item.typeFile }}
        </span>
      </nuxt-link>
    </div>

    <div class="w-100 bg-primary50 rounded-lg pa-2 d-flex align-center justify-start ga-2 info-card mt-4">
      <div class="pa-2 rounded-lg bg-primary d-flex align-center justify-center">
        <v-icon
          color="grey700"
          size="16"
        >
          md:star
        </v-icon>
      </div>
      <div class="d-flex flex-column align-start justify-start ">
        <span class="text-subtitle-1 font-weight-bold text-grey700">Earn points and income</span>
        <span class="text-subtitle-2 font-weight-medium text-grey400">Publishing useful educational content rewards you with Gamatrain points and can generate income.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const emit = defineEmits(['close'])

const addOptions = [
  {
    path: '/user/paper/create',
    title: 'Past Paper',
    icon: 'icon-paper',
    typeFile: 'PDF - DOCX',
  },
  {
    path: '/user/question/create',
    title: 'Q & A',
    icon: 'icon-q-a',
    typeFile: 'TEXT',
  },
  {
    path: '/user/multimedia/create',
    title: 'Multimedia',
    icon: 'icon-multimedia',
    typeFile: 'MP4 - PPTX',
  },
  {
    path: '/user/blogs/create',
    title: 'Blogs',
    iconMd: 'md:art_track',
    typeFile: 'HTML',
  },
  {
    path: '/school/add',
    title: 'Schools',
    icon: 'icon-school',
    typeFile: 'INFO',
  },

]

watch(
  () => route.fullPath,
  () => {
    emit('close')
  },
)
</script>

<style scoped>
.container-card{
  max-width : 370px
}
.card-add-option{
  width : 30%;
  max-width : 120px;
  height : 120px;
  border : 1px solid rgb(var(--v-theme-grey200));
  transition: 0.3s;
  text-decoration: none;
}
.card-add-option:hover{
  transform: translateY(-6px);
  border : 1px solid rgb(var(--v-theme-primary))
}
.icon-add{
  font-size: 20px;
}
.chip-type-file{
  border : 1px solid rgb(var(--v-theme-grey200));
}
.info-card{
  max-width : 320px;
  border : 1px solid rgb(var(--v-theme-primary100))
}
</style>
