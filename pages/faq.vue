<template>
  <div>
    <v-container
      id="faq-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1">
                FAQ’s
              </h1>
              <p class="gama-text-subtitle2">
                Frequently Asked Questions
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="faq-data-container">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="searchQuery"
            class="rounded-ts pr-0"
            density="compact"
            variant="outlined"
            hide-details
            rounded
            label="Search"
          >
            <template #append>
              <v-btn
                dense
                color="#FFB300"
                class="text-white"
              >
                <v-icon color="black">
                  mdi-magnify
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row id="list-rows">
        <v-col cols="12">
          <v-expansion-panels
            v-model="activeFaq"
            flat
            accordion
          >
            <v-expansion-panel
              v-for="(item, i) in filteredItems"
              :key="i"
            >
              <v-expansion-panel-title
                :expand-icon="item.isExpanded ? 'mdi-minus' : 'mdi-plus'"
                @click="togglePanel(i)"
              >
                <span class="gama-text-button">{{ item.question }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  class="gama-text-body2"
                  v-html="item.answer"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeFaq: null,
      searchQuery: '',
      faqList: [
        {
          isExpanded: false,
          question: 'What is GamaTrain?',
          answer:
            '<p>The GamaTrain website has been designed to provide a comprehensive platform for collecting and presenting a collection of educational content. In this website, teachers can share their designed sample exam questions and educational content with students, schools, and other colleagues. The services of this system are mainly free, aiming to support the knowledge of teachers and promote educational equity across the world. However, to encourage active participation in content creation, students and schools interested in premium membership can choose to pay a nominal annual fee.</p>',
        },
        {
          isExpanded: false,
          question: 'What are your offers for teachers?',
          answer:
            '<p> Teachers at all educational levels can join the GamaTrain platform by providing basic information(such as username, password, email, and phone number).Once registered, teachers will have access to a dedicated dashboard that offers various features.</p><ul><li><strong>Test Registration:</strong> Teachers can register their own exams, including sample questions, many forms of exams, scientific competitions, and multiple-choice tests.</li>'
            + '<li><strong>Announcements:</strong> Teachers can post educational announcements for their students.</li>'
            + '<li><strong>Advertisements:</strong> Teachers can advertise their educational services.</li>'
            + '<li><strong>Uploading Content:</strong> Teachers can upload educational materials in various formats, including'
            + '   videos,'
            + ' PowerPoint presentations, PDFs, and images.</li>'
            + '<li><strong>Profile Completion:</strong> Teachers can add additional information to their profiles.</li>'
            + '<li><strong>Exam Ratings:</strong> Each exam submitted by a teacher receives ratings from site users, including'
            + 'judges, schools,'
            + 'students, and download counts.</li>'
            + '<li><strong>Individual Page:</strong> Teachers can share their dedicated page on the GamaTrain website with'
            + 'their students and'
            + 'colleagues.'
            + '</li>'
            + '<li><strong>Festival Participation:</strong> Teacher\'s annual scores determine eligibility for the annual'
            + 'GamaTrain Teacher'
            + 'Awards.'
            + '</li>'
            + '</ul>',
        },
        {
          isExpanded: false,
          question: 'What are your offers for schools?',
          answer:
            '<p>Technology experts, educators, and school administrators at all educational levels can become GamaTrain members. Once registered, schools gain access to a dedicated website that fulfills many virtual school needs and provides a diverse set of benefits for various subjects.</p>',
        },
        {
          isExpanded: false,
          question: 'What are your offers for students?',
          answer:
            '<p>GamaTrain member students can:</p>'
            + '<ul>'
            + '<li>Rate site exams</li>'
            + '<li>Download sample questions for free</li>'
            + '<li>View the profiles of their favorite teachers or preferred school pages</li>'
            + '<li>With a premium one-year membership in each grade level, they gain unlimited access to exam downloads and'
            + 'their answers.</li>'
            + '</ul> ',
        },
        {
          isExpanded: false,
          question: 'How to access GamaTrain services?',
          answer:
            '<p>Many of the GamaTrain website\'s features, including membership, downloading sample questions, test registration, and announcements, are available for free to all visitors. Teachers and schools can join the membership, gaining access to various educational tools and services based on their selected membership type. To create a personal page on the GamaTrain website, you can easily follow the registration process on the website. Anyone familiar with the internet or a school\'s IT specialist can assist you with this.</p>',
        },
        {
          isExpanded: false,
          question: 'How to join the GamaTrain website?',
          answer:
            '<ul style=\'list-style-type:none\'>'
            + '<li><strong>Step 1:</strong> Choose the type of membership you need, such teacher or student. If you require'
            + 'membership in more than one user category, you need to register separately for each.</li>'
            + '<li><strong>Step 2:</strong> Fill out the required information form.</li>'
            + '<li><strong>Step 3:</strong> After completing the registration form, an activation link will be sent to your'
            + 'email. Click on the link to activate your membership.</li>'
            + '<li><strong>Step 4:</strong> Once activated, you can complete your profile information and start using the'
            + 'features of website.</li>'
            + '<li><strong>Step 5:</strong> Depending on the membership type, schools and stu</li>'
            + '</ul>',
        },
        {
          isExpanded: false,
          question: 'What are features for various users?',
          answer:
            '<p>Users are classified into five categories:</p>'
            + '<ul  style=\'list-style-type:none\'>'
            + '<li><strong>Judges:</strong> Evaluators who assess exams.</li>'
            + '<li><strong>Schools:</strong> School administrators, IT consultants, and school staff can complete their school profiles, post'
            + 'announcements, and access question banks.</li>'
            + '<li><strong>Teachers:</strong> Teachers can register questions, share educational announcements, and upload teaching materials.'
            + '</li>'
            + '<li><strong>Students:</strong> Students can access exam downloads and unlimited question banks with premium membership.</li>'
            + '<li><strong>Guests:</strong> Visitors have access to various free site features.</li>'
            + '</ul>',
        },
        {
          isExpanded: false,
          question: 'Do I have to register to use services?',
          answer:
            '<p>No, many of the site features are available for free to all visitors, even without registration.</p>',
        },
        {
          isExpanded: false,
          question: 'How many exams can I submit?',
          answer:
            '<p>There is no limitation on the number of exams a teacher can submit.</p>',
        },
        {
          isExpanded: false,
          question: 'Can a user register multiple times?',
          answer:
            '<p>Yes, membership is based on email addresses, so you can register with different email addresses.</p>',
        },
        {
          isExpanded: false,
          question: 'What are your special offerings ?',
          answer:
            '<p>The GamaTrain website offers a dedicated server with high speed and bandwidth, making your sample questions accessible to users without the need for external links. Additionally, by joining the site, you engage in healthy academic competition and can earn reasonable income from your educational activities.</p>',
        },
        {
          isExpanded: false,
          question: 'How can I pay the membership fee?',
          answer:
            '<p>The premium membership fee can be paid online through the PayPal payment gateway soon, which supports various bank cards and ensures high security.</p>',
        },
      ],
    }
  },
  head() {
    return {
      titleTemplate: '%s',
      title: 'GamaTrain FAQ: Your Comprehensive Guide to Our Learning Platform',

      meta: [
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content:
            'GamaTrain FAQ: Your Comprehensive Guide to Our Learning Platform',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content:
            'GamaTrain FAQ: Your Comprehensive Guide to Our Learning Platform',
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
            'Find answers to your frequently asked questions about GamaTrain, covering topics from account management to learning resources and exam preparation.',
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            'Find answers to your frequently asked questions about GamaTrain, covering topics from account management to learning resources and exam preparation.',
        },
      ],
    }
  },
  auth: false,
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.faqList
      }
      const query = this.searchQuery.toLowerCase()
      return this.faqList.filter(item =>
        item.question.toLowerCase().includes(query),
      )
    },
  },
  watch: {
    searchQuery(_val) {
      this.activeFaq = null
      this.filteredItems.forEach((panel, _i) => {
        panel.isExpanded = false
      })
    },
  },
  methods: {
    togglePanel(index) {
      this.filteredItems.forEach((panel, _i) => {
        if (_i === index) {
          panel.isExpanded = !panel.isExpanded
        }
        else {
          panel.isExpanded = false
        }
      })
    },
  },
}
</script>

<style>
#faq-page-header {
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

#faq-data-container {
  margin-bottom: 1.5rem;
  .v-field {
    width: 42.8rem;
    min-height: auto;
    height: 4rem !important;
    border-radius: 3.8rem 0.4rem 0.4rem 3.8rem !important;

    margin: 1.6rem auto 1.6rem auto;
  }
  .v-text-field {
    .v-input__control > .v-input__slot {
      min-height: auto;
      height: 4rem !important;

      &:before {
        border-style: none;
      }
    }

    .v-input__append {
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
    .v-expansion-panel-title {
      padding: 1.55rem 0 1.55rem 0;
      border-bottom: 1px solid rgba(36, 41, 47, 0.1);

      .gama-text-button {
        font-weight: 600;
        font-size: 1.8rem;
      }
    }

    .v-expansion-panel-text__wrap {
      padding: 2.4rem 0 0 0;

      .gama-text-body2 {
        line-height: 2.2rem;

        > p {
          font-size: 1.6rem !important;
        }

        > ul {
          font-size: 1.6rem;
          margin-top: 1rem;

          > li {
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 600px) {
  #faq-page-header {
    height: 26rem;

    #main-title-holder {
      top: 11.5rem;

      .gama-text-h1 {
        margin-bottom: 0.8rem;
      }
    }
  }

  #faq-data-container {
    .v-text-field {
      width: 42.8rem;
      margin: 1.6rem auto 1.6rem auto;

      .v-input__control > .v-input__slot:before {
        border-color: #ffb600;
        height: 0.1rem;
      }

      .v-icon {
        color: #ffb600;
      }
    }

    #list-rows {
      width: 90%;
      margin: auto;

      .v-expansion-panel-title {
        padding: 1.9rem 0 1.9rem 0;
        border-bottom: 1px solid rgba(36, 41, 47, 0.1);

        .gama-text-button {
          font-weight: 600;
          font-size: 1.8rem;
        }
      }

      .v-expansion-panel-text__wrap {
        padding: 2.4rem 0 0 0;

        .gama-text-body2 {
          line-height: 2.2rem;

          > p {
            font-size: 1.6rem;
          }

          > ul {
            font-size: 1.6rem;
            margin-top: 1rem;

            > li {
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 960px) {
  #faq-page-header {
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

  #faq-data-container {
    margin-bottom: 4.8rem;

    .v-text-field {
      width: 42.8rem;
      margin: 2.4rem auto 8.1rem auto;

      .v-input__control > .v-input__slot:before {
        border-color: #ffb600;
        height: 0.1rem;
      }

      .v-icon {
        color: #ffb600;
      }
    }

    #list-rows {
      .v-expansion-panel-title {
        padding: 2.5rem 0 2.5rem 0;
      }

      .v-expansion-panel-text__wrap {
        padding: 2.4rem 0 0 0;
      }
    }
  }
}
</style>
