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
      lastUpdated: '2026-06-06',
      gdprSection: [
        {
          id: 'introduction',
          title: 'Introduction',
          describe: '<p class=\'gama-text-body1\'>Welcome to GamaTrain ("we," "us," or "our"). We are committed to protecting your personal data and respecting your privacy. This GDPR Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services (the "Service"). GamaTrain operates as a repository of sample exam questions and scientific tests for various levels of education. We act as a Data Controller for your personal information under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>',
        },
        {
          id: 'legal-basis',
          title: 'Legal Basis for Processing (UK GDPR Article 6)',
          describe: '<p class=\'gama-text-body1\'>We only process your data when we have a valid legal basis under UK GDPR. We rely on the following legal bases:</p><ul class=\'gama-text-body1\'><li><strong>Contractual Necessity:</strong> To provide our services, such as creating an account, managing your profile, and allowing you to access or upload exams.</li><li><strong>Legitimate Interests:</strong> To improve our platform, ensure security, prevent fraud, and provide relevant educational content. Where we rely on legitimate interests, we ensure that your rights and freedoms are not overridden and you may object at any time.</li><li><strong>Legal Obligation:</strong> To comply with tax, anti-fraud, or legal requests from authorities.</li><li><strong>Consent:</strong> For sending marketing emails or using non-essential cookies where required by law.</li></ul>',
        },
        {
          id: 'what-data-we-collect',
          title: 'What Data We Collect',
          describe: '<p class=\'gama-text-body1\'>We collect the following categories of personal data:</p><ul class=\'gama-text-body1\'><li><strong>Identity Data:</strong> Full name, username, and profile image.</li><li><strong>Contact Data:</strong> Email address, and phone number (if provided during registration).</li><li><strong>Professional Data:</strong> If you register as a teacher or educational institution, we may collect qualifications and institutional details to verify your account and services.</li><li><strong>Technical Data:</strong> IP address, browser type, login times, and usage statistics collected via cookies and analytics tools.</li><li><strong>Content Data:</strong> Exams, questions, and other educational content you upload or interact with on the platform.</li></ul>',
        },
        {
          id: 'how-we-use-your-data',
          title: 'How We Use Your Data',
          describe: '<p class=\'gama-text-body1\'>We use your data to:</p><ul class=\'gama-text-body1\'><li>Register and manage your account.</li><li>Provide access to the exam repository and learning features.</li><li>Enable teachers to publish content and receive attribution.</li><li>Respond to customer support requests.</li><li>Maintain platform security and prevent misuse.</li><li>Send important service-related updates and notifications.</li></ul>',
        },
        {
          id: 'cookies',
          title: 'Cookies and Tracking Technologies',
          describe: '<p class=\'gama-text-body1\'>We use cookies and similar technologies to improve user experience and analyze platform usage. You can manage or disable cookies in your browser settings. For more details, please refer to our Cookie Policy.</p>',
        },
        {
          id: 'data-subject-rights',
          title: 'Your Rights Under UK GDPR',
          describe: '<p class=\'gama-text-body1\'>If you are located in the United Kingdom or the European Economic Area, you have the following rights under data protection law:</p><ul class=\'gama-text-body1\'><li><strong>Right of Access:</strong> Request a copy of your personal data.</li><li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data.</li><li><strong>Right to Erasure:</strong> Request deletion of your data, subject to legal retention requirements.</li><li><strong>Right to Restrict Processing:</strong> Request limitation of how your data is used.</li><li><strong>Right to Data Portability:</strong> Receive your data in a structured format.</li><li><strong>Right to Object:</strong> Object to processing based on legitimate interests, including marketing.</li></ul><p class=\'gama-text-body1\'>To exercise your rights, contact us at: privacy@gamatrain.com</p>',
        },
        {
          id: 'data-retention',
          title: 'Data Retention',
          describe: '<p class=\'gama-text-body1\'>We retain personal data only for as long as necessary for the purposes for which it was collected.</p><ul class=\'gama-text-body1\'><li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion for legal compliance.</li><li><strong>Usage & Technical Data:</strong> Typically retained for a limited period (e.g. 30–90 days) unless required for security or legal purposes.</li><li><strong>Content Data:</strong> Retained until deleted by the user or account closure, unless required for legal or platform integrity reasons.</li></ul>',
        },
        {
          id: 'data-security',
          title: 'Data Security',
          describe: '<p class=\'gama-text-body1\'>We implement appropriate technical and organisational measures to protect your personal data. No method of transmission or storage is completely secure; however, we work to ensure your data is protected against unauthorised access, loss, or misuse.</p>',
        },
        {
          id: 'international-transfers',
          title: 'International Transfers',
          describe: '<p class=\'gama-text-body1\'>GamaTrain is hosted in the United Kingdom. If you access the Service from outside the UK, your data may be transferred to and processed in the UK. The UK is recognised by the European Commission as providing an adequate level of data protection for personal data transferred from the European Economic Area (EEA). Where required, we use appropriate safeguards such as Standard Contractual Clauses (SCCs) for transfers outside the UK/EEA.</p>',
        },
        {
          id: 'childrens-privacy',
          title: 'Children\'s Privacy',
          describe: '<p class=\'gama-text-body1\'>GamaTrain is an EdTech platform used by students. We require parental consent where required by applicable law (for example, under 13 in the UK, or under 16 in certain EU countries). If we become aware that we have collected personal data from a child without valid consent, we will delete it promptly.</p>',
        },
        {
          id: 'third-party-links',
          title: 'Third-Party Links',
          describe: '<p class=\'gama-text-body1\'>Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites.</p>',
        },
        {
          id: 'changes-to-this-policy',
          title: 'Changes to This Policy',
          describe: '<p class=\'gama-text-body1\'>We may update this policy from time to time. Significant changes will be communicated via email or a notice on our website.</p>',
        },
        {
          id: 'contact-us',
          title: 'Contact Us (Data Protection)',
          describe: '<p class=\'gama-text-body1\'>If you have any questions about this policy or wish to exercise your rights, please contact us:</p><p class=\'gama-text-body1\'><strong>GamaTrain Data Protection Team</strong><br />Email: <a href="mailto:privacy@gamatrain.com">privacy@gamatrain.com</a><br />Address: Office 19394, 182-184 High Street North, London, England, E6 2JA</p>',
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
