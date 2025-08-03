<template>
  <div class="topic_menu">
    <p class="font-weight-bold align-center">
      <v-icon color="teal">
        mdi-bookmark-multiple
      </v-icon>
      &nbsp;{{ lessonTree.title }}
    </p>
    <v-treeview
      :items="lessonTree.list.filter(x =>
        x.tutorials?.length > 0
        || x.chapters?.length > 0,
      )"
      active-class="selected_topic_itm"
      color="teal"
      open-on-click
      open-all
      transition
      :active="activeMenu"
      item-key="id"
      item-children="chapters"
    >
      <template #prepend="{ item }">
        <v-icon
          class="teal--text"
          small
        >
          {{ `mdi-${item.chapters ? 'circle' : 'circle-outline'}` }}
        </v-icon>
      </template>
      <template #label="{ item }">
        <!-- If tutorials length is one is a link -->
        <nuxt-link
          v-if="item.tutorials?.length === 1"
          :to="`/tutorial/${item.tutorials[0].id}/${$slugGenerator.convert(
            item.title,
          )}`"
          class="v-treeview-node__label"
        >
          {{ item.title }}
        </nuxt-link>
        <div v-else>
          {{ item.title }}
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script>
export default {
  name: 'TutorialMenuComponent',
  props: {
    lessonTree: {
      type: Object,
      required: false,
      validator(value) {
        return Object.prototype.hasOwnProperty.call(value || {}, 'title')
          && Object.prototype.hasOwnProperty.call(value || {}, 'list')
      },
      default: () => ({
        title: '',
        list: [],
      }),
    },
  },
  data() {
    return {
      openMenu: [],
      activeMenu: [],
      main_season_key: 1,
      syncMenuRoute: false,
      items: [
        {
          id: 1,
          name: 'Vuetify Human Resources',
          children: [
            {
              id: 2,
              name: 'Core team',
              children: [
                {
                  id: 201,
                  name: 'John',
                },
                {
                  id: 202,
                  name: 'Kael',
                },
                {
                  id: 203,
                  name: 'Nekosaur',
                },
                {
                  id: 204,
                  name: 'Jacek',
                },
                {
                  id: 205,
                  name: 'Andrew',
                },
              ],
            },
            {
              id: 3,
              name: 'Administrators',
              children: [
                {
                  id: 301,
                  name: 'Mike',
                },
                {
                  id: 302,
                  name: 'Hunt',
                },
              ],
            },
            {
              id: 4,
              name: 'Contributors',
              children: [
                {
                  id: 401,
                  name: 'Phlow',
                },
                {
                  id: 402,
                  name: 'Brandon',
                },
                {
                  id: 403,
                  name: 'Sean',
                },
              ],
            },
          ],
        },
      ],
      search: null,
      caseSensitive: false,
    }
  },
  mounted() {
    this.initOpenMenu()
  },
  methods: {
    openLink(id, title, tutorials) {
      if (tutorials.length === 1) {
        this.$router.push({
          path: `/tutorial/${tutorials[0].id}/${this.$slugGenerator.convert(title)}`,
        })
      }
    },
    initOpenMenu() {
      for (const lessonIndex in this.lessonTree.list) {
        for (const i in this.lessonTree.list[lessonIndex].chapters) {
          if (
            this.lessonTree.list[lessonIndex].chapters[i]
            && this.lessonTree.list[lessonIndex].chapters[i].tutorials[0]
            && this.lessonTree.list[lessonIndex].chapters[i].tutorials[0].id === this.$route.params.id
          ) {
            this.openMenu.push(this.lessonTree.list[lessonIndex].id)
            this.activeMenu.push(this.lessonTree.list[lessonIndex].chapters[i].id)
            break
          }
        }
      }
    },
  },
}
</script>

<style>
.v-stepper__content {
  border-left: 1px solid #e1e2e3;
}

.topic_menu .v-icon.v-icon.v-icon--link {
  display: none;
}

.topic_menu .selected_topic_itm {
  background: teal !important;
  color: #ffffff !important;
}
.topic_menu .selected_topic_itm i {
  color: #ffffff !important;
}
</style>
