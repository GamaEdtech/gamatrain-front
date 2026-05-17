<template>
  <div class="main">
    <v-container
      id="terms-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1">
                GDPR
              </h1>
              <p class="gama-text-subtitle2">
                Effective Date: {{ effectiveDate }}
                ,
                Last Updated: {{ lastUpdated }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="terms-data-container">
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-center">
            <div
              class="w-100 w-sm-auto d-flex gap-4 justify-center align-center"
            >
              <v-text-field
                v-model="searchQuery"
                rounded="s-pill"
                variant="outlined"
                color="#ffb600"
                icon-color=""
                label="Search"
              />
              <div class="pt-4 h-100">
                <v-btn
                  height="100%"
                  dense
                  color="#FFB300"
                  class="text-white search"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row id="list-rows">
        <v-col
          cols="12"
          md="3"
        >
          <v-card
            id="terms-navigation"
            class="mx-auto"
          >
            <v-list height="100%">
              <v-list-item
                v-for="(item, index) in filteredItems"
                :key="index"
                active-class="active-title"
                :active="isItemActive(item)"
                :value="item"
                style="cursor: pointer"
                @click="scrollToSection(item.id)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="9"
        >
          <v-card
            flat
            class="mx-auto"
          >
            <v-card-text>
              <div
                v-for="(item, index) in filteredItems"
                :key="index"
              >
                <div
                  :id="item.id"
                  class="section-anchor"
                />
                <h2 class="gama-text-h4">
                  {{ item.title }}
                </h2>
                <div v-html="item.describe" />
                <div class="section-spacer" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  auth: false,

  data() {
    return {
      searchQuery: '',
      activeSection: null,
      currentHash: '',
      isClient: false,
      observer: null,
      isScrolling: false,
      scrollTimeout: null,
      effectiveDate: '2025-05-17',
      lastUpdated: '2026-05-17',
      gdprSection: [
        {
          id: 'introduction',
          title: 'Introduction',
          describe: '<p class=\'gama-text-body1\'>Welcome to GamaTrain ("we," "us," or "our"). We are committed to protecting your personal data and respecting your privacy. This GDPR Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services (the "Service"). GamaTrain operates as a repository of sample exam questions and scientific tests for various levels of education. We act as a Data Controller for your personal information under the General Data Protection Regulation (GDPR) (EU) 2016/679.</p>',
        },
        {
          id: 'legal-basis',
          title: 'Legal Basis for Processing (GDPR Article 6)',
          describe: '<p class=\'gama-text-body1\'>We only process your data when we have a legal basis to do so. We rely on the following legal bases:</p><ul class=\'gama-text-body1\'><li><strong>Contractual Necessity:</strong> To provide our services, such as creating an account, managing your profile, and allowing you to access or upload exams.</li><li><strong>Legitimate Interests:</strong> To improve our platform, ensure security, prevent fraud, and market relevant educational content.</li><li><strong>Legal Obligation:</strong> To comply with tax, anti-fraud, or legal requests from authorities.</li><li><strong>Consent:</strong> For sending marketing emails or non-essential cookies (where required).</li></ul>',
        },
        {
          id: 'what-data-we-collect',
          title: 'What Data We Collect',
          describe: '<p class=\'gama-text-body1\'>We collect the following categories of personal data:</p><ul class=\'gama-text-body1\'><li><strong>Identity Data:</strong> Full name, username, and profile image.</li><li><strong>Contact Data:</strong> Email address, phone number, and physical address (if provided during registration).</li><li><strong>Professional Data:</strong> If you register as a teacher or educational institution, we collect your qualifications and institutional details to verify advertising capabilities.</li><li><strong>Technical Data:</strong> IP address, browser type, login times, and usage statistics collected via cookies.</li><li><strong>Content Data:</strong> The exams, questions, and scientific tests you upload or search for within the system.</li></ul>',
        },
        {
          id: 'how-we-use-your-data',
          title: 'How We Use Your Data',
          describe: '<p class=\'gama-text-body1\'>We use your data to:</p><ul class=\'gama-text-body1\'><li>Register you as a user and manage your profile.</li><li>Provide the exam repository and scientific test search functions.</li><li>Allow teachers to publish exams and receive authorship credit.</li><li>Respond to customer support requests.</li><li>Monitor website security and detect violations of our Terms.</li><li>Send administrative emails regarding updates or rule changes.</li></ul>',
        },
        {
          id: 'cookies',
          title: 'Cookies and Tracking Technologies',
          describe: '<p class=\'gama-text-body1\'>GamaTrain uses cookies to enhance user experience. You can manage your cookie preferences through your browser settings. For detailed information, please see our Cookie Policy.</p>',
        },
        {
          id: 'data-subject-rights',
          title: 'Data Subject Rights (Your Rights)',
          describe: '<p class=\'gama-text-body1\'>Under GDPR, if you are located in the European Economic Area (EEA), you have the following rights:</p><ul class=\'gama-text-body1\'><li><strong>Right to Access:</strong> You can request a copy of the data we hold about you.</li><li><strong>Right to Rectification:</strong> You can correct inaccurate or incomplete data.</li><li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You can request deletion of your profile and data, subject to our legal obligations to retain transaction records.</li><li><strong>Right to Restrict Processing:</strong> You can ask us to stop processing your data in certain circumstances.</li><li><strong>Right to Data Portability:</strong> You can request a machine-readable copy of your data.</li><li><strong>Right to Object:</strong> You can object to processing based on legitimate interests (e.g., marketing).</li></ul><p class=\'gama-text-body1\'>To exercise these rights, please contact us at: privacy@gamatrain.com</p>',
        },
        {
          id: 'data-retention',
          title: 'Data Retention',
          describe: '<p class=\'gama-text-body1\'>We will retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy.</p><ul class=\'gama-text-body1\'><li><strong>Account Data:</strong> Retained until you delete your account or after a period of inactivity defined by local law.</li><li><strong>Exam Content:</strong> Retained as long as you remain a registered teacher, or as required by our content repository guidelines.</li></ul>',
        },
        {
          id: 'data-security',
          title: 'Data Security',
          describe: '<p class=\'gama-text-body1\'>We implement appropriate technical and organizational measures to protect your data. However, please note that while we make maximum efforts to verify accuracy, we cannot guarantee 100% security of data transmitted to our site.</p>',
        },
        {
          id: 'international-transfers',
          title: 'International Transfers',
          describe: '<p class=\'gama-text-body1\'>GamaTrain is hosted in Poland. If you are accessing the site from outside Poland, your data will be transferred to our servers in Poland. For users within the European Economic Area (EEA), your data remains within the EEA as Poland is an EU member state. We ensure that all data transfers are governed by appropriate safeguards, including Standard Contractual Clauses (SCCs) where applicable, to provide adequate protection for your data.</p>' },
        {
          id: 'childrens-privacy',
          title: 'Children\'s Privacy',
          describe: '<p class=\'gama-text-body1\'>GamaTrain is an EdTech platform used by K-12 students. We require parental consent for children under the age of 16 (or the applicable age of digital consent in your country). If we discover we have collected data from a child without verification of parental consent, we will delete that information immediately.</p>',
        },
        {
          id: 'third-party-links',
          title: 'Third-Party Links',
          describe: '<p class=\'gama-text-body1\'>Our website may contain links to external sites. We are not responsible for the privacy practices of other sites.</p>',
        },
        {
          id: 'changes-to-this-policy',
          title: 'Changes to This Policy',
          describe: '<p class=\'gama-text-body1\'>We may update this policy periodically. We will notify you of material changes via email or a notice on our website.</p>',
        },
        {
          id: 'contact-us',
          title: 'Contact Us (Data Protection Officer)',
          describe: '<p class=\'gama-text-body1\'>For any questions regarding this GDPR policy or to file a complaint with a supervisory authority, please contact us at:</p><p class=\'gama-text-body1\'><strong>GamaTrain Data Protection Team</strong><br />Email: <a href="mailto:privacy@gamatrain.com">privacy@gamatrain.com<a><br />Address: Al. Wojska polskiego 14, Piastów, Poland</p>',
        },
      ],

    }
  },
  head() {
    return {
      titleTemplate: '%s',
      title: 'GDPR',

      meta: [
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: 'GDPR',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'GDPR',
        },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          content: 'GamaTrain',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Ensure a smooth and secure learning experience by reviewing GamaTrain\'s Terms and Conditions, outlining our commitment to user privacy and responsible platform usage.',
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            'Ensure a smooth and secure learning experience by reviewing GamaTrain\'s Terms and Conditions, outlining our commitment to user privacy and responsible platform usage.',
        },
      ],
    }
  },

  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.gdprSection
      }
      const query = this.searchQuery.toLowerCase()
      return this.gdprSection.filter(
        item =>
          item.title.toLowerCase().includes(query)
          || item.describe.toLowerCase().includes(query),
      )
    },
  },

  watch: {
    '$route.hash': {
      handler(newHash) {
        if (this.isClient && !this.isScrolling) {
          const targetId = newHash.replace('#', '')
          if (
            targetId
            && this.gdprSection.find(item => item.id === targetId)
          ) {
            this.activeSection = targetId
          }
        }
      },
      immediate: false,
    },
  },

  mounted() {
    this.isClient = true

    // Set initial active section
    this.activeSection = this.gdprSection[0].id

    // Initialize intersection observer
    // this.initializeObserver()

    // Handle initial hash if present
    if (this.$route.hash) {
      const targetId = this.$route.hash.replace('#', '')
      if (this.gdprSection.find(item => item.id === targetId)) {
        this.activeSection = targetId
        this.$nextTick(() => {
          this.scrollToSection(targetId, false)
        })
      }
    }
  },

  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  },

  methods: {
    // initializeObserver() {
    //   const options = {
    //     root: null,
    //     rootMargin: '-20% 0px -70% 0px', // Only trigger when section is in the top 30% of viewport
    //     threshold: 0,
    //   }

    //   this.observer = new IntersectionObserver((entries) => {
    //     if (this.isScrolling) return // Don't update during programmatic scrolling

    //     // Find the section that's most visible
    //     let mostVisibleEntry = null
    //     let maxRatio = 0

    //     entries.forEach((entry) => {
    //       if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
    //         maxRatio = entry.intersectionRatio
    //         mostVisibleEntry = entry
    //       }
    //     })

    //     if (mostVisibleEntry) {
    //       const sectionId = mostVisibleEntry.target.id
    //       if (sectionId && sectionId !== this.activeSection) {
    //         this.activeSection = sectionId
    //         this.updateHash(sectionId)
    //       }
    //     }
    //   }, options)

    //   // Observe all sections
    //   this.$nextTick(() => {
    //     this.gdprSection.forEach((section) => {
    //       const element = document.getElementById(section.id)
    //       if (element) {
    //         this.observer.observe(element)
    //       }
    //     })
    //   })
    // },

    updateHash(sectionId) {
      // Update route hash without causing scroll
      if (this.$route.hash !== `#${sectionId}`) {
        this.$router.replace({
          path: this.$route.path,
          hash: `#${sectionId}`,
        })
      }
    },

    scrollToSection(sectionId, smooth = true) {
      this.isScrolling = true
      this.activeSection = sectionId

      const element = document.getElementById(sectionId)
      if (element) {
        const headerOffset = 100 // Adjust based on your fixed header height
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition
          = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: smooth ? 'smooth' : 'auto',
        })

        this.updateHash(sectionId)
      }

      // Reset scrolling flag after animation
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }
      this.scrollTimeout = setTimeout(
        () => {
          this.isScrolling = false
        },
        smooth ? 1000 : 100,
      )
    },

    isItemActive(item) {
      if (!this.isClient) return false
      return this.activeSection === item.id
    },
  },
}
</script>

<style scoped>
.section-anchor {
  padding-top: 8rem;
  margin-top: -8rem;
}

.section-spacer {
  height: 4rem;
}

#terms-page-header {
  height: 20rem;
  background: #24292f;
  position: relative;

  #main-title-holder {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 9.7rem;
    text-align: center;

    .gama-text-h1 {
      color: #ffb600;
      margin-bottom: 0.8rem;
    }

    .gama-text-subtitle2 {
      color: #ffb600 !important;
    }
  }
}

.main {
  :deep(.v-list-item-title) {
    font-size: 2.5rem;
    font-weight: 500 !important;
  }

  :deep(.v-list-item-title) {
    padding: 2rem 2rem;
  }

  :deep(.v-list-item) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  :deep(.v-list-item):hover {
    background-color: #bdbdbd86;
  }

  :deep(.v-list),
  :deep(.v-list-item__overlay) {
    background-color: #f4f4f4 !important;
  }

  :deep(.search) {
    border-radius: 7px 50px 50px 7px;
    margin-left: 1rem;
    font-size: larger;
  }

  :deep(.v-label) {
    font-size: medium !important;
  }
}

.active-title:hover {
  background-color: transparent !important;
}

#terms-data-container {
  margin-bottom: 1.5rem;

  .v-text-field {
    width: 42.8rem;
    min-height: auto;
    height: 4rem !important;
    border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;
    margin: 1.6rem auto 1.6rem auto;

    .v-input__control > .v-input__slot {
      min-height: auto;
      height: 4rem !important;

      &:before {
        border-style: none;
      }
    }

    .v-input__append-outer {
      margin: 0 0 0 0.8rem !important;

      .v-btn {
        min-width: auto;
        width: 3.9rem !important;
        height: 3.9rem;
        border-radius: 0.4rem 3.8rem 3.8rem 0.4rem;

        .v-icon {
          color: #000;
          font-size: 2.2rem;
        }
      }
    }
  }

  #list-rows {
    .v-card {
      .gama-text-h4 {
        text-align: center;
        margin-bottom: 4.8rem;
      }
    }

    #terms-navigation {
      height: 18.5rem;
      overflow-y: hidden !important;

      .v-navigation-drawer {
        background: rgba(36, 41, 47, 0.05);

        .v-list-item {
          padding: 1.6rem;

          .v-list-item__title {
            color: #24292f;
            font-family: Inter;
            font-size: 2rem;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
        }
      }

      .active-title::before {
        content: "";
        display: block;
        width: 0.4rem;
        height: 100%;
        border-radius: 0.4rem;
        background: #ffb600;
        opacity: 1;
      }
    }
  }
}

@media only screen and (min-width: 600px) {
  #terms-page-header {
    height: 26rem;

    #main-title-holder {
      top: 11.5rem;

      .gama-text-h1 {
        margin-bottom: 0.8rem;
      }
    }
  }

  #terms-data-container {
    margin-bottom: 1.5rem;

    .v-text-field {
      width: 42.8rem;
      min-height: auto;
      height: 4rem !important;
      margin: 1.6rem auto 1.6rem auto;

      .v-input__control > .v-input__slot {
        min-height: auto;
        height: 4rem !important;

        &:before {
          border-style: none;
        }
      }

      .v-input__append-outer {
        margin: 0 0 0 0.8rem !important;

        .v-btn {
          min-width: auto;
          width: 3.9rem !important;
          height: 3.9rem;
          border-radius: 0.4rem 3.8rem 3.8rem 0.4rem;

          .v-icon {
            color: #000;
            font-size: 2.2rem;
          }
        }
      }
    }

    #list-rows {
      .v-card {
        .gama-text-h4 {
          text-align: center;
          margin-bottom: 4.8rem;
        }
      }

      #terms-navigation {
        height: 20rem;

        .v-navigation-drawer {
          .v-list-item {
            padding: 1.6rem;

            .v-list-item__title {
              color: #24292f;
              font-family: Inter;
              font-size: 2.4rem;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
          }

          .active-title::before {
            content: "";
            display: block;
            width: 0.4rem;
            height: 100%;
            border-radius: 0.4rem;
            background: #ffb600;
            opacity: 1;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 960px) {
  #terms-page-header {
    height: 34rem;
    background: #24292f;
    position: relative;

    #main-title-holder {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 14.6rem;
      text-align: center;

      .gama-text-h1 {
        color: #ffb600;
        margin-bottom: 1.6rem;
      }

      .gama-text-subtitle2 {
        color: #ffb600 !important;
      }
    }
  }

  #terms-data-container {
    margin-bottom: 1.5rem;

    .v-text-field {
      width: 42.8rem;
      min-height: auto;
      height: 4rem !important;
      border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;
      margin: 1.6rem auto 1.6rem auto;

      .v-input__control > .v-input__slot {
        min-height: auto;
        height: 4rem !important;

        &:before {
          border-style: none;
        }
      }

      .v-input__append-outer {
        margin: 0 0 0 0.8rem !important;

        .v-btn {
          min-width: auto;
          width: 3.9rem !important;
          height: 3.9rem;
          border-radius: 0.4rem 3.8rem 3.8rem 0.4rem;

          .v-icon {
            color: #000;
            font-size: 2.2rem;
          }
        }
      }
    }

    #list-rows {
      .v-card {
        .gama-text-h4 {
          text-align: center;
          margin-bottom: 4.8rem;
        }
      }

      #terms-navigation {
        position: sticky;
        top: 10rem;
        height: 64.2rem;

        .v-navigation-drawer {
          .v-list-item {
            padding: 2.4rem;

            .v-list-item__title {
              color: #24292f;
              font-family: Inter;
              font-size: 2.4rem;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
          }

          .active-title::before {
            content: "";
            display: block;
            width: 0.8rem;
            height: 100%;
            border-radius: 0.4rem;
            background: #ffb600;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
