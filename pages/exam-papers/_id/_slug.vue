<template>
  <div class="test-details-content">
    <!-- Start : Category -->
    <category />
    <!-- End:Category -->

    <!--  Start: breadcrumb  -->
    <section>
      <v-container class="py-0">
        <div class="mt-0 py-0 header-path">
          <breadcrumb :breads="breads" />
        </div>
      </v-container>
    </section>
    <!--  End: breadcrumb  -->

    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <div class="detail mt-md-8">
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <!-- Show gallery of preview and book first page -->
              <preview-gallery ref="preview_gallery" />
              <!-- Show gallery of preview and book first page -->
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="d-flex align-center justify-space-between header">
                    <h1 class="detail-title">
                      {{ contentData.title }}
                    </h1>
                  </div>
                  <div class="description-holder my-4">
                    <!-- Topics -->
                    <p>
                      <i class="fa-solid fa-list ml-1 icon" />
                      Topics:
                    </p>
                    <ul>
                      <li
                        v-for="(item, index) in contentData.topics"
                        :key="index"
                      >
                        {{ item.title }}
                      </li>
                    </ul>
                    <!-- End topics -->

                    <!-- Question number -->
                    <p class="mt-1">
                      <i class="fa-solid fa-question ml-1 icon" />
                      Questions: {{ contentData.tests_num }}
                    </p>
                    <!-- End question number -->

                    <!-- Difficulty level -->
                    <p class="mt-1">
                      <i
                        class="fa-solid fa-temperature-three-quarters ml-1 icon"
                      />
                      Difficulty level: {{ contentData.level }}
                    </p>
                    <!-- End difficulty level -->

                    <!-- Start date -->
                    <p class="mt-1">
                      <i class="fa-solid fa-circle-play" />
                      Start:
                      {{
                        contentData.start_date ? contentData.start_date : "-"
                      }}
                    </p>
                    <!-- End start date -->

                    <!-- End date -->
                    <p class="mt-1">
                      <i class="fa-solid fa-circle-stop" />
                      End:
                      {{ contentData.end_date ? contentData.end_date : "-" }}
                    </p>
                    <!-- End end date -->

                    <!-- Duration -->
                    <p class="mt-1">
                      <i class="fa-solid fa-clock" />
                      End: {{ contentData.azmoon_time }} minutes
                    </p>
                    <!-- End duration -->
                  </div>

                  <div class="label-holder">
                    <v-chip
                      link
                      class="mr-1"
                    >
                      <nuxt-link
                        :to="`/search?type=azmoon&section=${contentData.section}`"
                      >
                        {{ contentData.section_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="mr-1"
                    >
                      <nuxt-link
                        :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`"
                      >
                        {{ contentData.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="ma-1"
                    >
                      <nuxt-link
                        :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                      >
                        {{ contentData.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip class="ma-1">
                      {{ contentData.edu_month_title }}
                    </v-chip>
                  </div>
                </div>
              </div>
              <!--   Download Btn and Description  -->
              <div class="text-center download-sec">
                <div class="d-none d-md-block mb-4">
                  <p v-if="!$auth.loggedIn">
                    <span class="mdi mdi-bell icon" />
                    <span
                      class="login"
                      @click="openAuthDialog('login')"
                    >Login</span>
                    <span
                      class="register"
                      @click="openAuthDialog('register')"
                    >
                      (register)
                    </span>
                    to download and charge your wallet.
                  </p>
                  <span v-else>
                    Your wallet charge is ${{ $auth.user.credit }}
                  </span>
                  <nuxt-link
                    v-if="$auth.loggedIn"
                    class="blue--text"
                    to="/user/charge-wallet"
                  >(Top Up Wallet)</nuxt-link>
                </div>
                <div class="font-weight-bold answer">
                  <span class="mdi mdi-checkbox-marked icon" />
                  <span>
                    The key answer sheet is at the end of the exam file.</span>
                </div>
              </div>
              <!--   fileCopyRight  -->
              <div class="d-none d-md-block text-center file-copy-right">
                <p class="">
                  It is forbidden to republish the contents in cyber space.
                </p>
              </div>
            </v-col>
            <v-col md="3">
              <v-card
                flat
                class="content_main_info"
              >
                <v-row class="align-center">
                  <v-col cols="3">
                    <v-img
                      :src="contentData.avatar"
                      alt=""
                      class="d-inline-block"
                      cover
                      height="48"
                      width="48"
                    />
                  </v-col>
                  <v-col
                    cols="9"
                    class="pl-0"
                  >
                    <p class="creator_title">
                      {{ contentData.first_name }} {{ contentData.last_name }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider class="my-2" />
                <v-row>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <i class="fa-solid fa-folder mr-1 icon" />
                    File type: {{ contentData.azmoon_type_title }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <i class="fa-solid fa-eye mr-1 icon" />
                    Viewed: Unknown
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <i class="fa-solid fa-calendar-alt mr-1 icon" />
                    Last update: {{ $timeAgo.calc(contentData.up_date) }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <i class="fa-solid fa-bug mr-1 icon" />
                    Crash report
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <!-- Dialog for share -->
                    <v-dialog
                      transition="dialog-top-transition"
                      class="share_dialog"
                      max-width="600"
                    >
                      <template #activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                        >
                          <i class="fa-solid fa-share-alt mr-1 icon" />
                          Share
                        </span>
                      </template>
                      <template #default="dialog">
                        <v-card>
                          <v-toolbar color="default">
                            Share
                          </v-toolbar>
                          <v-card-text class="mt-5">
                            <p class="mb-3">
                              Share this content:
                            </p>
                            <v-row>
                              <v-col cols="12">
                                <v-btn
                                  outlined
                                  block
                                  @click="copyUrl"
                                >
                                  <i class="fa-solid fa-copy mr-1 icon" />
                                  &nbsp;
                                  {{ copy_btn }}
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  target="_blank"
                                  block
                                  color="#25d366"
                                  class="text-white"
                                  @click="shareSocial('whatsapp')"
                                >
                                  <i class="fab fa-whatsapp mr-1 icon" />
                                  WhatsApp
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  block
                                  color="#00acee"
                                  class="text-white"
                                  @click="shareSocial('telegram')"
                                >
                                  <i
                                    class="fab fa-telegram-plane mr-1 icon"
                                  />
                                  Telegram
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn
                              text
                              @click="dialog.value = false"
                            >
                              close
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                </v-row>

                <div class="text-center mt-2">
                  <v-rating
                    v-model="rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    hover
                  />
                </div>
                <v-divider class="d-none d-md-block" />

                <v-row class="mt-1 d-none d-md-block">
                  <v-col
                    v-for="(item, key) in contentData.price"
                    :key="key"
                    cols="12"
                    class="pb-0"
                  >
                    <v-btn
                      v-if="key === 'participation'"
                      block
                      color="success"
                    >
                      Start | {{ item.price > 0 ? "$" + item.price : "Free" }}
                    </v-btn>
                    <v-btn
                      v-else-if="key === 'word'"
                      block
                      color="primary"
                    >
                      Download WORD file |
                      {{ item.price > 0 ? "$" + item.price : "Free" }}
                    </v-btn>
                    <v-btn
                      v-else-if="key === 'pdf'"
                      block
                      color="error"
                    >
                      Download PDF file |
                      {{ item.price > 0 ? "$" + item.price : "Free" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <v-row>
                <v-col
                  cols="12"
                  class="text-center"
                >
                  <p class="mt-2">
                    <i class="fa-solid fa-exclamation-circle mr-1 icon" />
                    Republishing is prohibited in cyber space.
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- Mobile order section -->
    <v-card class="order-btn-holder d-block d-md-none">
      <v-card-text class="pb-0">
        <v-row class="px-10 text-center">
          <v-col
            v-for="(item, key) in contentData.price"
            :key="key"
            cols="12"
            class="pb-1 pt-0"
          >
            <v-btn
              v-if="key === 'participation'"
              block
              color="success"
            >
              Start | {{ item.price > 0 ? "$" + item.price : "Free" }}
            </v-btn>
            <v-btn
              v-else-if="key === 'word'"
              block
              color="primary"
            >
              Download WORD file |
              {{ item.price > 0 ? "$" + item.price : "Free" }}
            </v-btn>
            <v-btn
              v-else-if="key === 'pdf'"
              block
              color="error"
            >
              Download PDF file |
              {{ item.price > 0 ? "$" + item.price : "Free" }}
            </v-btn>
          </v-col>

          <v-col cols="12">
            <div class="mb-4">
              <p v-if="!$auth.loggedIn">
                <span class="mdi mdi-bell icon" />
                <span
                  class="login blue--text"
                  @click="openAuthDialog('login')"
                >Login</span>
                <span
                  class="register blue--text"
                  @click="openAuthDialog('register')"
                >
                  (register)
                </span>
                <span>to download and charge.</span>
              </p>
              <span v-else>
                Your wallet charge is ${{ $auth.user.credit }}
                <nuxt-link
                  v-if="$auth.loggedIn"
                  class="blue--text"
                  to="/user/charge-wallet"
                >(Top Up Wallet)</nuxt-link>
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- End mobile order section -->

    <!--  End: detail  -->

    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <!--  Start: Course Card  -->
          <!--          <section> -->
          <!--            <div class="d-flex  align-center course-card box"> -->
          <!--              <div class="right"> -->
          <!--                <v-row> -->
          <!--                  <v-col cols="2"> -->
          <!--                    <nuxt-link to=""> -->
          <!--                      <img height="98" width="98" :src="require(`~/assets/images/teacher1.png`)" alt=""/> -->
          <!--                    </nuxt-link> -->
          <!--                  </v-col> -->
          <!--                  <v-col cols="10"> -->
          <!--                    <div class="description ml-4"> -->
          <!--                      <div> -->
          <!--                        <nuxt-link to=""> -->
          <!--                          <h2 class="course-title">PowerPoint of the complete educational course, date (3) of the 12th -->
          <!--                            grade of the second secondary-theoretical period</h2> -->
          <!--                        </nuxt-link> -->
          <!--                      </div> -->
          <!--                      <v-row> -->
          <!--                        <v-col cols="10"> -->
          <!--                          <div> -->
          <!--                            <nuxt-link to="" class="teacher"> -->
          <!--                              <i class="fa-solid fa-user icon"></i> -->
          <!--                              <span>Lecturer: Shamsi Shabani</span> -->
          <!--                            </nuxt-link> -->
          <!--                          </div> -->
          <!--                          <div> -->
          <!--                            <p class="duration"> -->
          <!--                              <i class="fa-solid fa-clock icon"></i> -->
          <!--                              <span>Course duration: 942 slides (13 files)</span> -->
          <!--                            </p> -->
          <!--                          </div> -->
          <!--                        </v-col> -->
          <!--                        <v-col cols="2"> -->
          <!--                          <nuxt-link to="" class="teal&#45;&#45;text"> -->
          <!--                            <strong> -->
          <!--                              View -->
          <!--                            </strong> -->
          <!--                          </nuxt-link> -->
          <!--                        </v-col> -->
          <!--                      </v-row> -->
          <!--                    </div> -->
          <!--                  </v-col> -->
          <!--                </v-row> -->
          <!--              </div> -->

          <!--            </div> -->
          <!--          </section> -->
          <!--  End: Course Card  -->
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <!--  Start:  Azmoon test album card   -->
          <!--          <section> -->
          <!--            <div class="d-flex align-center album-card box"> -->
          <!--              <div class="right"> -->
          <!--                <v-row> -->
          <!--                  <v-col cols="2"> -->
          <!--                    <nuxt-link to=""> -->
          <!--                      <img :src="require(`~/assets/images/poster1.jpg`)" alt="" class="poster-img"/> -->
          <!--                    </nuxt-link> -->
          <!--                  </v-col> -->
          <!--                  <v-col cols="10"> -->
          <!--                    <div class="description ml-2"> -->
          <!--                      <nuxt-link to=""> -->
          <!--                        <h2 class="course-title">Exam test bank album, date (3) twelfth of the second term of -->
          <!--                          high school-theoretical</h2> -->
          <!--                      </nuxt-link> -->

          <!--                      <v-row> -->
          <!--                        <v-col cols="10"> -->
          <!--                          <div class="num"> -->
          <!--                            <i class="fa-solid fa-list-ol icon"></i> -->
          <!--                            <span>Number of tests: 1399</span> -->
          <!--                          </div> -->
          <!--                          <div class="level"> -->
          <!--                            <i class="fa-solid fa-superscript icon"></i> -->
          <!--                            <span>Difficulty: Easy</span> -->
          <!--                          </div> -->
          <!--                        </v-col> -->
          <!--                        <v-col cols="2"> -->
          <!--                          <nuxt-link to="" class="teal&#45;&#45;text"> -->
          <!--                            <strong> -->
          <!--                              View -->
          <!--                            </strong> -->
          <!--                          </nuxt-link> -->
          <!--                        </v-col> -->
          <!--                      </v-row> -->
          <!--                    </div> -->
          <!--                  </v-col> -->
          <!--                </v-row> -->
          <!--              </div> -->

          <!--            </div> -->
          <!--          </section> -->
          <!--  End:  Azmoon test album card   -->
        </v-col>
      </v-row>
    </v-container>

    <!-- Start : Sample Test -->
    <!--    <related-content/> -->
    <!-- End : Sample test -->
    <!-- Start: Feed -->
    <section class="feed">
      <!--      <v-container class="pa-4 pa-md-12 pt-10"> -->
      <!--        <v-row> -->
      <!--          <v-col cols="12" md="6"> -->
      <!--            <latest-training-content/> -->
      <!--          </v-col> -->

      <!--          <v-col cols="12" md="6" class="related-ask-test py-0 d-flex flex-column justify-space-between"> -->
      <!--            <related-qa/> -->

      <!--            <related-online-exam/> -->
      <!--          </v-col> -->

      <!--        </v-row> -->
      <!--      </v-container> -->
    </section>
    <!-- End: Feed -->
  </div>
</template>

<script>
// Removed unused imports

export default {
  name: 'ExamPaperDetails',
  auth: false,
  components: {
    // Remove unused components
  },
  async asyncData({ params, $axios }) {
    // This could also be an action dispatch
    const content = await $axios.$get(`/api/v1/exams/${params.id}`)

    let contentData = []

    // Check data exist
    if (content.status === 1) {
      contentData = content.data
    }

    return { contentData }
  },

  data: () => ({
    sell_btn: true,
    rating: 4.5,
    contentData: [],
    breads: [
      {
        text: 'Online exam',
        disabled: false,
        href: '/search?type=azmoon',
      },
    ],
    detail: {
      poster: 'poster1.jpg',
      linkPoster: '',
      title:
        'A collection of 120 test questions for lessons 6 to 9 on (3) 12th',
      rate: 5,
      previewImage: 'test1.png',
      labels: [
        'History (3)',
        'Twelfth',
        'Second Secondary',
        'Literature',
        'Kermanshah',
        'District 2',
        'Shohadai Parvin',
        'Farvardin',
        '2019',
      ],
    },
    model: null,
    sampleTestList: [
      {
        type: 'azmoon',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
      {
        type: 'azmoon',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
      {
        type: 'azmoon',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
      {
        type: '',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Mehran Zangeneh',
        ownerImg: 'teacher2.png',
      },
      {
        type: '',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
      {
        type: '',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
      {
        type: '',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
      {
        type: '',
        img: 'test2.png',
        description:
          'The series of tests of the twelfth history book Lessons 1 to 12',
        pages: '222',
        owner: 'Gama management team',
        ownerImg: 'gamaadmin.png',
      },
    ],
    relatedList: [
      {
        class: 'learning',
        header: 'Related educational content',
        icon: 'learnfiles',
        description: ' File های پاورپوینت، ویدئو، صوتی، متنی و ...',
        contentItemList: [
          {
            title:
              'Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature',
            link: '',
          },
          {
            title:
              'Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)',
            link: '',
          },
          {
            title:
              'Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation',
            link: '',
          },
        ],
      },
      {
        class: 'question',
        header: 'Related Q&As',
        icon: 'qa',
        description: 'Ask questions or answer other people\'s questions...',
        contentItemList: [
          {
            title:
              'Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature',
            link: '',
          },
          {
            title:
              'Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)',
            link: '',
          },
          {
            title:
              'Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation',
            link: '',
          },
        ],
      },
      {
        class: 'blog',
        header: 'Related textbooks',
        icon: 'blog',
        contentItemList: [
          {
            title:
              'Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature',
            link: '',
          },
          {
            title:
              'Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)',
            link: '',
          },
          {
            title:
              'Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation',
            link: '',
          },
        ],
      },
      {
        class: 'azmoon',
        header: 'Related online tests',
        icon: 'azmoon',
        contentItemList: [
          {
            title:
              'Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature',
            link: '',
          },
          {
            title:
              'Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)',
            link: '',
          },
          {
            title:
              'Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation',
            link: '',
          },
        ],
      },
    ],

    copy_btn: 'Copy',
  }),
  mounted() {
    // Init gallery image
    if (this.contentData) {
      // this.$refs.preview_gallery.images.push('https://gama.ir/uploads/lessonsPic/lPic_e9d076b6bd2bdea6f16da58513e7f471.jpg');
      this.$refs.preview_gallery.images.push(this.contentData.thumb_pic_url)
      this.$refs.preview_gallery.carouselVal = 1

      // Update help link data
      this.$refs.preview_gallery.help_link_data = {
        state: this.contentData.state,
        section: this.contentData.section,
        base: this.contentData.base,
        course: this.contentData.course,
        lesson: this.contentData.lesson,
      }
    }

    this.initBreadCrumb()
  },
  methods: {
    initBreadCrumb() {
      this.breads.push(
        {
          text: this.contentData.section_title,
          disabled: false,
          href: `/search?type=azmoon&section=${this.contentData.section}`,
        },
        {
          text: this.contentData.base_title,
          disabled: false,
          href: `/search?type=azmoon&section=${this.contentData.section}&base=${this.contentData.base}`,
        },
        {
          text: this.contentData.lesson_title,
          disabled: false,
          href: `/search?type=azmoon&section=${this.contentData.section}&base=${this.contentData.base}&lesson=${this.contentData.lesson}`,
        },
      )
    },
    openAuthDialog(val) {
      this.$router.push({ query: { auth_form: val } })
    },

    // Social section
    copyUrl() {
      navigator.clipboard.writeText(window.location.href)
      this.copy_btn = 'Copied'
    },
    shareSocial(social_name) {
      if (social_name == 'whatsapp')
        window.open(
          `https://api.whatsapp.com/send?text=${window.location.href}`,
        )
      else if (social_name == 'telegram')
        window.open(
          `https://telegram.me/share/url?url=${window.location.href}&text=${this.contentData.title}`,
        )
    },
  },
}
</script>

<style>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.order-btn-holder {
  /*position: -webkit-sticky!important;*/
  position: fixed !important;
  bottom: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}
</style>
