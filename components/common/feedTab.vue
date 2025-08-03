<template v-slot:extension>
  <div>
    <!--  Start: feed box  -->
    <section class="feed-box d-none d-md-flex">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
            sm="4"
          >
            <footer-feed-box :feed="latestList.multimedia" />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="4"
          >
            <footer-feed-box :feed="latestList.question" />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="4"
          >
            <!--            <latest-news/> -->
            <footer-feed-box :feed="latestList.paper" />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!--  End: Feed box  -->

    <div class="d-md-none d-flex flex-column feed-tab">
      <v-tabs
        v-model="tabs"
        centered
      >
        <v-tabs-slider color="green" />

        <v-tab
          v-for="(item, index) in items"
          :key="index"
          class="feed-tab-title"
        >
          <span
            :class="
              'd-flex align-center me-2 icon icong-'
                + item.icon
                + ' icon'
                + item.class
            "
          />
          {{ item.title }}
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="tabs"
        class="feed-card ma-4"
      >
        <v-tab-item>
          <footer-feed-box :feed="latestList.multimedia" />
        </v-tab-item>
        <v-tab-item>
          <footer-feed-box :feed="latestList.question" />
        </v-tab-item>
        <v-tab-item>
          <!--          <latest-news/> -->
          <footer-feed-box :feed="latestList.paper" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import _FooterFeedBox from '@/components/common/footer-feed-box'
import _LatestNews from '@/components/common/latest-news'
import _question from '~/pages/user/question/index.vue'

export default {
  name: 'FeedTab',
  components: {
    // Remove LatestNews since it's not used
  },
  data() {
    return {
      tabs: null,
      items: [
        {
          icon: 'learnfiles',
          class: 'learning',
          title: 'Latest Multimedia',
          link: '/search?type=learnfiles',
        },
        {
          icon: 'qa',
          class: 'question',
          title: 'Latest Q&A',
          link: '/search?type=question',
        },
        {
          icon: 'test',
          class: 'test',
          title: 'Latest Papers',
          link: '/',
        },
      ],

      latestList: {
        multimedia: {
          class: 'learning',
          header: 'Latest Multimedia',
          icon: 'learnfiles',
          main_link: 'multimedia',
          contentItemList: [],
          more_link: '/search?type=learnfiles',
          add_link: '/user/multimedia/create',
          add_link_color: '#27ae60',
          add_link_title: 'Add a multimedia',
        },
        paper: {
          class: 'test',
          header: 'Latest Papers',
          icon: 'test',
          main_link: 'papers',
          contentItemList: [],
          more_link: '/search?type=test',
          add_link: '/user/paper/create',
          add_link_color: '#01579b',
          add_link_title: 'Add a paper',
        },
        question: {
          class: 'question',
          header: 'Latest Q&A',
          icon: 'qa',
          main_link: 'qa',
          contentItemList: [],
          more_link: '/search?type=question',
          add_link: '/user/question/create',
          add_link_color: '#bf360c',
          add_link_title: 'Add a question',
        },
      },
    }
  },
  mounted() {
    this.loadLatestList('multimedia')
    this.loadLatestList('question')
    this.loadLatestList('paper')
  },
  methods: {
    loadLatestList(type) {
      let api = '/api/v1/home/files'
      if (type == 'question') api = '/api/v1/home/questions'
      else if (type == 'paper') api = '/api/v1/home/tests'

      this.$fetch
        .$get(api)
        .then((response) => {
          if (type == 'multimedia')
            this.latestList.multimedia.contentItemList = response.data
          else if (type == 'paper')
            this.latestList.paper.contentItemList = response.data
          else if (type == 'question')
            this.latestList.question.contentItemList = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
