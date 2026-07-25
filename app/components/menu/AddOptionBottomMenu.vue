<template>
  <div class="w-100 d-flex align-center justify-center flex-column mt-4">
    <div class="w-100 d-flex flex-wrap justify-center ga-2 container-card">
      <nuxt-link
        v-for="item in addOptions"
        :key="item.title"
        :to="item.path"
        :aria-label="`${item.title} — ${item.typeFile}`"
        class="card-add-option d-flex flex-column align-center justify-center text-center ga-1 rounded-xl"
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
        <span class="card-option-title w-100 text-center text-grey700 text-h6 font-weight-bold mt-1">{{ item.title }}</span>

        <span class="text-center text-subtitle-2 font-weight-bold text-grey500 px-2 rounded-pill bg-grey100 chip-type-file">
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
        <span class="text-subtitle-1 font-weight-bold text-grey700">Turn your expertise into reputation and income</span>
        <span class="text-subtitle-2 font-weight-medium text-grey400">Publish educational content to boost your score and earn from sales.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const emit = defineEmits(['close'])

interface AddOption {
  path: string
  title: string
  typeFile: string
  icon?: string
  iconMd?: string
}

const addOptions: AddOption[] = [
  {
    path: '/user/paper/create',
    title: 'Worksheet',
    iconMd: 'md:description_outlined',
    typeFile: 'PDF · DOCX',
  },
  {
    path: '/user/paper/create',
    title: 'Predicted Paper',
    icon: 'icon-paper',
    typeFile: 'PDF · DOCX',
  },
  {
    path: '/user/paper/create',
    title: 'Study Guide',
    iconMd: 'md:menu_book',
    typeFile: 'PDF · DOCX',
  },
  {
    path: '/user/paper/create',
    title: 'Topical Questions',
    iconMd: 'md:quiz_outlined',
    typeFile: 'PDF · DOCX',
  },
  {
    path: '/user/multimedia/create',
    title: 'Video',
    iconMd: 'md:videocam',
    typeFile: 'MP4',
  },
  {
    path: '/user/multimedia/create',
    title: 'Presentation',
    iconMd: 'md:slideshow',
    typeFile: 'PPTX',
  },
  {
    path: '/school/add',
    title: 'School',
    icon: 'icon-school',
    typeFile: 'INFO',
  },
  {
    path: '/user/question/create',
    title: 'Q&A',
    icon: 'icon-q-a',
    typeFile: 'TEXT',
  },
  {
    path: '/user/blogs/create',
    title: 'Blogs',
    iconMd: 'md:art_track',
    typeFile: 'HTML',
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
  height : 112px;
  padding-top: 8px;
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

@media only screen and (max-width: 599.98px) {
  .card-option-title {
    padding-inline: 8px;
    font-size: calc(1.25rem - 1px) !important;
    line-height: 1.25rem;
  }
}

@media only screen and (min-width: 960px) {
  .container-card {
    max-width: 480px;
  }

  .card-add-option {
    max-width: 144px;
  }

  .card-option-title {
    padding-inline: 8px;
  }
}
</style>
