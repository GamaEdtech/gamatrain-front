<template>
  <div id="about-us-page">
    <v-container
      id="about-page-header"
      fluid
    >
      <div class="overlay" />

      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1">
                About Us
              </h1>
              <p class="gama-text-subtitle2">
                Learning Together, Earning Together Building a Brighter Future
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="about-introduce-container">
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">
            GamaTrain
          </h2>
          <p class="gama-text-body1">
            Welcome to GamaTrain, the EdTech startup revolutionizing education.
            Our platform offers innovative services like sample exams, online
            tests, tutoring, and more, enhancing the learning experience for
            teachers and students. Join us to shape the future of education!
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container id="about-map-container">
      <v-card
        id="map-card"
        flat
      >
        <v-row>
          <v-col cols="12">
            <LottieAnimation
              id="map-holder"
              :animation-data="mapAnimation"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-container id="about-vision-container">
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">
            Our Vision
          </h2>
          <p class="gama-text-body1">
            At GamaTrain, our vision is to revolutionize the world of education
            by providing innovative solutions that empower both students and
            teachers. As we move toward the future, we are committed to offering
            new services that leverage the latest technology and trends. Some of
            the exciting new services we are working on include:
          </p>
        </v-col>
        <v-col
          cols="12"
          class="d-none d-md-block"
        >
          <div
            id="step-container"
            class="d-none d-md-block"
          >
            <div
              ref="stepProgressBar"
              class="step-progress-bar"
            />
            <LottieAnimation
              v-if="enableStep1"
              id="step1"
              :animation-data="stepAnimation"
              :end-time="stepEndTime"
              :loop-status="false"
            />
            <LottieAnimation
              v-if="enableStep2"
              id="step2"
              :animation-data="stepAnimation"
              :end-time="stepEndTime"
              :loop-status="false"
            />
            <LottieAnimation
              v-if="enableStep3"
              id="step3"
              :animation-data="stepAnimation"
              :end-time="stepEndTime"
              :loop-status="false"
            />
          </div>
        </v-col>

        <div class="d-none d-md-flex">
          <v-col
            cols="12"
            md="4"
          >
            <v-slide-x-transition v-if="enableStep1Txt">
              <div class="vision-step">
                <h3 class="gama-text-h5">
                  Customized Learning Paths Using AI
                </h3>
                <p class="gama-text-body2">
                  We understand that every student has their own unique learning
                  style and preferences. That's why we're working on integrating
                  AI into our platform to offer personalized learning paths that
                  adapt to each student's needs. With customized learning paths,
                  students can learn at their own pace and in a way that works
                  best for them.
                </p>
              </div>
            </v-slide-x-transition>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-slide-x-transition v-if="enableStep2Txt">
              <div class="vision-step">
                <h3 class="gama-text-h5">
                  Moving Towards Green Economy
                </h3>
                <p class="gama-text-body2">
                  We recognize the importance of environmental sustainability
                  and the role education plays in creating a better future. We
                  are committed to promoting a green economy by offering courses
                  that educate students about sustainability, eco-friendly
                  practices, and environmental stewardship. By doing so, we hope
                  to inspire a generation of students who are passionate about
                  creating a better world.
                </p>
              </div>
            </v-slide-x-transition>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-slide-x-transition v-if="enableStep3Txt">
              <div class="vision-step">
                <h3 class="gama-text-h5">
                  Decentralized Content Quality Moderation
                </h3>
                <p class="gama-text-body2">
                  We believe that quality education is paramount, and that's why
                  we are developing a decentralized content quality moderation
                  system. This system will allow our users to participate in
                  moderating the quality of the content on our platform,
                  ensuring that it remains accurate, relevant, and up-to-date.
                  By decentralizing content quality moderation, we can provide a
                  more transparent and collaborative platform that empowers our
                  users.
                </p>
              </div>
            </v-slide-x-transition>
          </v-col>
        </div>

        <v-col
          cols="2"
          class="d-md-none px-0"
        >
          <div id="step-container-mobile">
            <div
              ref="mobileStepProgressBar"
              class="step-progress-bar"
            />
            <LottieAnimation
              v-if="enableStep1"
              id="step1"
              :animation-data="stepAnimation"
              :end-time="stepEndTime"
              :loop-status="false"
            />
            <LottieAnimation
              v-if="enableStep2"
              id="step2"
              :animation-data="stepAnimation"
              :end-time="stepEndTime"
              :loop-status="false"
            />
            <LottieAnimation
              v-if="enableStep3"
              id="step3"
              :animation-data="stepAnimation"
              :end-time="stepEndTime"
              :loop-status="false"
            />
          </div>
        </v-col>
        <v-col
          cols="10"
          class="pa-0 d-md-none"
        >
          <v-col
            cols="12"
            md="4"
            class="step-holder"
          >
            <v-slide-x-transition v-if="enableStep1Txt">
              <div>
                <h3 class="gama-text-h5">
                  Customized Learning Paths Using AI
                </h3>
                <p class="gama-text-body2">
                  We understand that every student has their own unique learning
                  style and preferences. That's why we're working on integrating
                  AI into our platform to offer personalized learning paths that
                  adapt to each student's needs. With customized learning paths,
                  students can learn at their own pace and in a way that works
                  best for them.
                </p>
              </div>
            </v-slide-x-transition>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="step-holder"
          >
            <v-slide-x-transition v-if="enableStep2Txt">
              <div>
                <h3 class="gama-text-h5">
                  Moving Towards Green Economy
                </h3>
                <p class="gama-text-body2">
                  We recognize the importance of environmental sustainability
                  and the role education plays in creating a better future. We
                  are committed to promoting a green economy by offering courses
                  that educate students about sustainability, eco-friendly
                  practices, and environmental stewardship. By doing so, we hope
                  to inspire a generation of students who are passionate about
                  creating a better world.
                </p>
              </div>
            </v-slide-x-transition>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="step-holder"
          >
            <v-slide-x-transition v-if="enableStep3Txt">
              <div>
                <h3 class="gama-text-h5">
                  Decentralized Content Quality Moderation
                </h3>
                <p class="gama-text-body2">
                  We believe that quality education is paramount, and that's why
                  we are developing a decentralized content quality moderation
                  system. This system will allow our users to participate in
                  moderating the quality of the content on our platform,
                  ensuring that it remains accurate, relevant, and up-to-date.
                  By decentralizing content quality moderation, we can provide a
                  more transparent and collaborative platform that empowers our
                  users.
                </p>
              </div>
            </v-slide-x-transition>
          </v-col>
        </v-col>
      </v-row>
    </v-container>

    <v-container
      id="about-commitment-container"
      fluid
    >
      <v-container>
        <h2 class="gama-text-h4">
          Our Commitment
        </h2>

        <v-card flat>
          <v-tabs v-model="activeCommitment">
            <v-tab
              v-for="(item, index) in commitmentList"
              :key="index"
              :value="'tab-' + index"
            >
              <v-card
                id="commitment-card"
                flat
              >
                <v-card-text>
                  <v-icon>mdi-{{ item.icon }}</v-icon>
                  <h3 class="gama-text-h5">
                    {{ item.title }}
                  </h3>
                  <p class="gama-text-subtitle2">
                    {{ item.describe }}
                  </p>
                </v-card-text>
              </v-card>
            </v-tab>
          </v-tabs>

          <v-tabs
            v-model="activeCommitment"
            background-color="#24292F"
            centered
            icons-and-text
          >
            <v-tab
              v-for="(item, index) in commitmentList"
              :key="index"
              :href="`#tab-${index}`"
            >
              <v-icon>mdi-{{ item.icon }}</v-icon>
            </v-tab>
          </v-tabs>
        </v-card>
      </v-container>
    </v-container>

    <v-container id="about-our-service">
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">
            Our Services
          </h2>
        </v-col>
        <v-col
          v-for="(item, index) in serviceList"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <nuxt-link
            :to="`${item.link}`"
            class="gama-text-h6"
          >
            <span :class="`service-icon ${item.icon}`" />
            {{ item.title }}
          </nuxt-link>
        </v-col>

        <v-col cols="12">
          <p class="gama-text-body1">
            Welcome to GamaTrain, the EdTech startup revolutionizing education.
            Our platform offers innovative services like sample exams, online
            tests, tutoring, and more, enhancing the learning experience for
            teachers and students. Join us to shape the future of education!
          </p>

          <v-btn to="/services">
            All services
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container id="about-our-team-container">
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">
            Our Team
          </h2>
          <p class="gama-text-body1">
            We are proud of our team's dedication and expertise, and we are
            confident that their contributions will be instrumental in helping
            GamaTrain achieve its vision of becoming a leading EdTech company in
            the global market.
          </p>

          <v-sheet class="mx-auto">
            <div class="d-flex memberSliderContainer">
              <div
                v-for="(member, index) in sliceTeamMember"
                :key="index"
                @click="slideClicked(index)"
              >
                <v-card
                  flat
                  class="ma-2 pointer"
                >
                  <v-img
                    :class="memberSlideClass(index)"
                    :alt="member.fullName"
                    :src="`/images/member/${member.avatar}`"
                  />
                </v-card>
              </div>
            </div>
            <v-row id="active-user-data">
              <v-col cols="12">
                <h5 class="gama-text-h5">
                  {{ teamMembers[activeMember + tmpShowMemeber].fullName }}
                </h5>
                <p class="gama-text-subtitle1">
                  {{ teamMembers[activeMember + tmpShowMemeber].role }}
                </p>
                <p class="gama-text-body1">
                  {{ teamMembers[activeMember + tmpShowMemeber].bio }}
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <v-container id="about-join-us">
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">
            Join Us
          </h2>
          <p class="gama-text-body1">
            Join Us and become part of the GamaTrain community! We're always
            looking for talented individuals who are passionate about EdTech and
            want to make a positive impact in the world of education.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container
      id="about-find-job"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <p class="gama-text-h6">
              Check out our current job openings and apply today!
            </p>
            <v-btn href="mailto:contact@gamatrain.com">
              Contact Us
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import mapAnimation from '../public/images/about-us-header.json' // Adjust the path
import stepAnimation from '../public/images/about-vision-step.json' // Adjust the path
import LottieAnimation from '~/components/common/lottie-animation.vue'

export default {
  components: { LottieAnimation },

  data() {
    return {
      mapAnimation,
      stepAnimation,
      stepEndTime: 30, // Set the desired end time in seconds

      enableStep1: false,
      enableStep1Txt: false,

      enableStep2: false,
      enableStep2Txt: false,

      enableStep3: false,
      enableStep3Txt: false,

      teamMembers: [
        {
          id: 1,
          fullName: 'Mohammad Salehi',
          avatar: 'mohammad-salehi.jpeg',
          role: 'DevOps Engineer',
          bio:
            'Sadegh Salehi is a dedicated and passionate DevOps engineer at GamaTrain startup. With over ten years of experience in system administration and DevOps engineering he joined the team and immediately set to work optimizing performance by setting up a robust Database Cluster. His commitment to finding the best solutions, rather than the easiest ones, shines through in his work.'
            + 'One notable achievement was overcoming the challenge of handling millions of records and aggregating them for every student\'s new exam. Through efficient communication and teamwork, Sadegh and his colleagues implemented a groundbreaking solution: a privately implemented binary tree database.'
            + 'As a valuable member of the company, Sadegh continues to contribute during peak times, such as student exam periods, where the team handles millions of requests. His dedication and problem-solving skills make him an integral part of the GamaTrain startup\'s success.',
        },
        {
          id: 2,
          fullName: 'Fahim Kavian',
          avatar: 'fahim-kavian.jpeg',
          role: 'UI/UX Director',
          bio:
            'Fahim Kavian, as the UI/UX Director at GamaTrain, brings a wealth of valuable experience to the team. Her diverse background in UI, Motion, Visual, 3D, and Logo Design from freelancing and past roles enables her to tackle design challenges from multiple angles. Fahim\'s track record of enhancing user experiences and increasing user satisfaction, as seen in her work at Wallebi and Kartak, demonstrates her ability to drive results.'
            + 'Additionally, Fahim\'s proficiency in simplifying complex registration processes and implementing gamification strategies that boost user engagement make her an asset in optimizing GamaTrain\'s user interfaces. Her history of effectively improving speed and reliability in digital processes, as evidenced by her contributions to the crypto wallet industry, aligns perfectly with GamaTrain\'s goals of providing efficient and user-friendly solutions. Fahim Kavian\'s past experiences make her a key player in elevating GamaTrain\'s UI/UX to new heights.',
        },
        {
          id: 3,
          fullName: 'Ali Poorbazargan',
          avatar: 'ali-poorbazargan.png',
          role: 'CTO',
          bio: 'With over 7 years of experience in full-stack web development, Ali has been the technical leader of Gama.ir and has been instrumental in designing and developing all aspects of the software, from infrastructure to the final products and user experiences. His expertise and leadership skills help the company stay ahead of the curve in the ever-evolving EdTech industry.',
        },
        {
          id: 4,
          fullName: 'Ramin Naderi',
          avatar: 'ramin-naderi.png',
          role: 'Co-founder & CEO',
          bio: 'As the co-founder and CEO of Gama.ir, Ramin brings a wealth of experience in software development, team management, problem-solving, and business management to GamaTrain. His deep understanding of the EdTech industry and the market has been instrumental in identifying opportunities for expansion and driving the company\'s success over the past ten years.',
        },
        {
          id: 5,
          fullName: 'Mehdi Zare',
          avatar: 'mehdi-zare.png',
          role: 'Marketing Manager',
          bio: 'Marketing Manager: With over seven years of expertise in marketing research, marketing strategy, content strategy, and business development, Mehdi is an experienced marketing manager who has previously worked for well-known Iranian startups and brands. His contributions enable GAMATrain to understand the market dynamics, identify growth opportunities, and develop effective marketing campaigns to improve user experience. He is committed to helping the company grow and achieve long-term success.',
        },
        {
          id: 6,
          fullName: 'Sadeq Naderi',
          avatar: 'sadeq-naderi.png',
          role: 'FrontEnd Developer',
          bio: 'Frontend Developer dedicated to crafting immersive and user-centric web applications. His expertise lies in harnessing a diverse array of frontend technologies, allowing him to consistently deliver polished, intuitive, and captivating user experiences that resonate with audiences. Always in pursuit of excellence, he strives to search for and implement the best strategies or techniques that elevate the quality of web applications. His commitment to continuous improvement drives him to explore innovative solutions that enhance user engagement and satisfaction.',
        },
        {
          id: 7,
          fullName: 'Amin Naderi',
          avatar: 'avatar.svg',
          role: 'Support',
          bio: '',
        },
      ],
      activeMember: 2,
      tmpShowMemeber: 1,
      intervalId: null,

      activeCommitment: 'tab-2',
      commitmentList: [
        {
          icon: 'white-balance-incandescent',
          title: 'Innovation',
          describe:
            'We are dedicated to innovation and are constantly exploring new ways to enhance the learning experience. We use the latest technology and teaching methods to create engaging and interactive content that keeps our users motivated and excited about learning.',
        },
        {
          icon: 'umbrella-beach',
          title: 'Accessibility',
          describe:
            'We are committed to providing our services to as many people as possible, regardless of their location, financial situation, or background. Our platform is designed to be accessible and affordable, allowing anyone to access high-quality education.',
        },
        {
          icon: 'star',
          title: 'Quality',
          describe:
            'We strive to provide the highest quality of education to our users by working with experienced educators and experts to create our content. We constantly review and update our content to ensure that it is accurate, relevant, and up-to-date.',
        },
        {
          icon: 'headset',
          title: 'Support',
          describe:
            'We are committed to providing our users with the support they need to succeed in their education. Our customer support team is available 24/7 to answer any questions or concerns that our users may have.',
        },
        {
          icon: 'account-multiple',
          title: 'Community',
          describe:
            'We believe that education is a collaborative process and that learning is enhanced when students and educators work together. We are committed to creating a supportive and inclusive community that encourages collaboration and communication between our users.',
        },
        {
          icon: 'memory',
          title: 'Digital Transformation',
          describe:
            'In today\'s digital age, traditional learning falls short. At GamaTrain, we\'re dedicated to enhancing education through technology. Our intuitive platform is accessible on various devices, providing a flexible and dynamic learning experience that adapts to individual preferences.',
        },
      ],

      serviceList: [
        {
          icon: 'icon-multimedia',
          link: '/search?type=learnfiles',
          title: 'Multimedia',
        },
        {
          icon: 'icon-paper',
          link: '/search?type=test',
          title: 'Paper',
        },
        {
          icon: 'icon-school',
          link: '/school-service',
          title: 'School finder',
        },
        {
          icon: 'icon-teacher',
          link: '/services',
          title: 'Teacher',
        },
        {
          icon: 'icon-q-a',
          link: '/search?type=question',
          title: 'Q&A',
        },
        {
          icon: 'icon-exam',
          link: '/search?type=azmoon',
          title: 'Exam',
        },
      ],
      screenWidth: 600,
    }
  },
  computed: {
    sliceTeamMember() {
      return this.screenWidth < 960
        ? this.teamMembers.slice(2, 5)
        : this.teamMembers.slice(1, 6)
    },
  },
  watch: {
    screenWidth: {
      immediate: true,
      handler(width) {
        if (width < 960) {
          this.activeMember = 1
          this.tmpShowMemeber = 2
        }
        else {
          this.activeMember = 2
          this.tmpShowMemeber = 1
        }
      },
    },
  },
  // auth: false,
  // head() {
  //   return {
  //     titleTemplate: "%s",
  //     title:
  //       "About GamaTrain | Meet the Team Dedicated to Transforming K12 Education",

  //     meta: [
  //       {
  //         hid: "apple-mobile-web-app-title",
  //         name: "apple-mobile-web-app-title",
  //         content:
  //           "About GamaTrain | Meet the Team Dedicated to Transforming K12 Education",
  //       },
  //       {
  //         hid: "og:title",
  //         name: "og:title",
  //         content:
  //           "About GamaTrain | Meet the Team Dedicated to Transforming K12 Education",
  //       },
  //       {
  //         hid: "og:site_name",
  //         name: "og:site_name",
  //         content: "GamaTrain",
  //       },
  //       {
  //         hid: "description",
  //         name: "description",
  //         content:
  //           "Embark on an educational journey with GamaTrain's exceptional team of K12 experts, passionate about empowering students through innovative learning solutions.",
  //       },
  //       {
  //         hid: "og:description",
  //         name: "og:description",
  //         content:
  //           "Embark on an educational journey with GamaTrain's exceptional team of K12 experts, passionate about empowering students through innovative learning solutions.",
  //       },
  //     ],
  //   };
  // },
  mounted() {
    // Initialize the Intersection Observer
    this.initIntersectionObserver()
    this.screenWidth = window.innerWidth
  },
  methods: {
    startAnimation(step) {
      // Toggle a class on the element to trigger the CSS animation
      if (step == 1) {
        if (!this.$refs.stepProgressBar.classList.contains('animateStep1')) {
          this.$refs.stepProgressBar.classList.add('animateStep1')
        }
        if (
          !this.$refs.mobileStepProgressBar.classList.contains('animateStep1')
        ) {
          this.$refs.mobileStepProgressBar.classList.add('animateStep1')
        }
      }
      else {
        if (!this.$refs.stepProgressBar.classList.contains('animateStep2')) {
          this.$refs.stepProgressBar.classList.add('animateStep2')
        }

        if (
          !this.$refs.mobileStepProgressBar.classList.contains('animateStep2')
        ) {
          this.$refs.mobileStepProgressBar.classList.add('animateStep2')
        }
      }
    },

    initIntersectionObserver() {
      const options = {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin
        threshold: 0.5, // Trigger when 50% of the element is visible
      }

      const observer = new IntersectionObserver(
        this.handleIntersection,
        options,
      )

      if (window.innerWidth > 960) observer.observe(this.$refs.stepProgressBar)
      else observer.observe(this.$refs.mobileStepProgressBar)
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Display the alert message when the div is in view

          this.enableStep1 = true
          this.enableStep1Txt = true
          setTimeout(() => {
            this.startAnimation(1)
          }, 1000)
          setTimeout(() => {
            this.enableStep2 = true
            this.enableStep2Txt = true
          }, 4000)
          setTimeout(() => {
            this.startAnimation(2)
          }, 5000)
          setTimeout(() => {
            this.enableStep3 = true
            this.enableStep3Txt = true
          }, 8000)
        }
      })
    },
    memberSlideClass(index) {
      if (index == this.activeMember) return 'active-slide'
      else if (
        index == this.activeMember - 1
        || index == parseInt(this.activeMember) + parseInt(1)
      )
        return 'adjacent-slide'
      else if (
        index == this.activeMember - 2
        || index == parseInt(this.activeMember) + parseInt(2)
      )
        return 'subsequent-slide'
      else if (
        index == this.activeMember - 3
        || index == parseInt(this.activeMember) + parseInt(3)
      )
        return 'after-subsequent-slide'
      else if (
        index == this.activeMember - 4
        || index == parseInt(this.activeMember) + parseInt(4)
      )
        return 'after-after-subsequent-slide'
    },
    slideClicked(index) {
      const deltaIndex = this.activeMember - index
      if (deltaIndex > 0) {
        for (let i = 0; i < deltaIndex; i++) {
          setTimeout(() => {
            const pop_data = this.teamMembers.pop()
            this.teamMembers.unshift(pop_data)
          }, 100 * i + 1)
        }
      }
      else if (deltaIndex < 0) {
        for (let i = 0; i > deltaIndex; i--) {
          setTimeout(() => {
            const splice_data = this.teamMembers.splice(0, 1)
            this.teamMembers.push(...splice_data)
          }, 100 * Math.abs(i) + 1)
        }
      }
    },
  },
}
</script>

<style>
@keyframes step1ProgressAnimation {
  0% {
    width: 0;
  }

  100% {
    width: 50%;
    background-color: #000;
  }
}

@keyframes step2ProgressAnimation {
  0% {
    width: 50%;
    background-color: #ffb600;
  }

  100% {
    width: 100%;
    background-color: #000;
  }
}

@keyframes step1MobileProgressAnimation {
  0% {
    height: 0;
  }

  100% {
    height: 50%;
    background-color: #000;
  }
}

@keyframes step2MobileProgressAnimation {
  0% {
    height: 50%;
    background-color: #ffb600;
  }

  100% {
    height: 100%;
    background-color: #000;
  }
}

#about-page-header {
  height: 20rem;
  background-image: url("/images/about-header-xs.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100vw 100vh;
  position: relative;

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    background: rgba(36, 41, 47, 0.4);
    backdrop-filter: blur(7.5px);
  }

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
      width: 80%;
      margin: auto auto;
      color: #ffb600 !important;
    }
  }
}

#about-introduce-container {
  text-align: center;
  padding-top: 6.4rem;
  padding-bottom: 2.7rem;

  .gama-text-h4 {
    color: #24292f;
    margin-bottom: 2.4rem;
  }

  .gama-text-body1 {
    color: rgba(36, 41, 47, 0.8);
    text-align: left;
  }
}

#about-map-container {
  #map-card {
    background-color: transparent;
    background-image: url("/images/about-us-header.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 27.6rem 15.8rem;
    height: 20rem;
    position: relative;
    display: grid;
    place-items: center;

    .lottie-container {
      width: 30rem !important;
      height: 20.8rem !important;
    }
  }
}

#about-vision-container {
  text-align: center;
  padding-top: 6.2rem;
  padding-bottom: 3.1rem;

  .gama-text-h4 {
    color: #24292f;
    margin-bottom: 2.4rem;
  }

  .gama-text-body1 {
    color: rgba(36, 41, 47, 0.8);
    text-align: left;
    margin-bottom: 4.8rem;
  }

  .step-holder {
    height: 21rem !important;
    padding: 0 0 6rem 0;
  }

  #step-container-mobile {
    height: 42rem;
    width: 0.2rem;
    position: relative;
    margin: auto auto;

    .step-progress-bar {
      width: 100%;
      height: 0;
      background-color: #ffb600;
    }

    .lottie-container {
      width: 8.8rem !important;
      height: 8.8rem !important;
    }

    #step1 {
      position: absolute;
      top: -3rem;
      left: -4rem;
      margin: auto auto;
    }

    #step2 {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -4rem;
      margin: auto;
    }

    #step3 {
      position: absolute;
      left: -4rem;
      bottom: -3rem;
      margin: auto;
    }
  }

  .animateStep1 {
    animation: step1MobileProgressAnimation 3s linear forwards;
  }

  .animateStep2 {
    animation: step2MobileProgressAnimation 3s linear forwards;
  }

  .gama-text-h5 {
    font-size: 2rem !important;
    margin-bottom: 1.6rem;
  }

  .gama-text-body2 {
    text-align: left;
    color: #24292f !important;
  }
}

#about-commitment-container {
  background: #24292f;
  min-height: 44.1rem;
  text-align: center;
  padding-top: 4.8rem;

  .gama-text-h4 {
    color: #ffb600 !important;
    margin-bottom: 4.8rem;
  }

  .v-card {
    background-color: transparent !important;
    height: 20.4rem;

    .v-tabs-items {
      background-color: transparent !important;

      #commitment-card {
        margin: auto;
        margin-bottom: 2rem;

        .v-icon {
          color: #ffb600;
          font-size: 4.8rem;
          margin-bottom: 1.6rem;
        }

        .gama-text-h5 {
          color: #ffb600;
          margin-bottom: 2.4rem;
        }

        .gama-text-subtitle2 {
          color: #ffb600;
          text-align: left;
          margin-bottom: 4.8rem;
        }
      }
    }

    .v-tabs {
      max-height: 4.8rem !important;

      .v-icon {
        font-size: 3.2rem;
        color: #ffb600;
      }

      .v-tab {
        min-width: 4.8rem;
        min-height: 4.8rem !important;
        width: 4.8rem !important;
        height: 4.8rem !important;
      }

      .v-tab--active {
        background-color: #ffb600;
        border-radius: 0.4rem;

        .v-icon {
          font-size: 2.4rem;
          color: #24292f;
        }
      }

      .v-tabs-slider-wrapper {
        display: none !important;
      }
    }
  }
}

#about-our-service {
  margin-top: 5rem;
  margin-bottom: 2.5rem;
  text-align: center;

  .gama-text-h4 {
    text-align: center;
    margin-bottom: 5.1rem;
  }

  .gama-text-h6 {
    display: block;
    position: relative;
    padding-left: 3.2rem;
    text-align: left;
    margin-bottom: 1.6rem;

    .service-icon {
      display: block;
      position: absolute;
      left: 0;
      top: -0.1rem;
      color: #ffb600 !important;
      font-size: 2.4rem;
    }
  }

  .gama-text-body1 {
    text-align: left;
    margin-bottom: 2.4rem;
  }

  .v-btn {
    height: 3.6rem;
    padding: 0rem 1.6rem;
    justify-content: center;
    border-radius: 3rem;
    background: #ffb600;
    margin: auto auto;

    .v-btn__content {
      color: #24292f;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 600;
    }
  }
}

#about-our-team-container {
  text-align: center;
  overflow-x: hidden;
  padding-top: 6.8rem;
  padding-bottom: 6.8rem;

  .gama-text-h4 {
    color: #24292f;
    margin-bottom: 4.8rem;
  }

  .gama-text-body1 {
    color: rgba(36, 41, 47, 0.8);
    text-align: left;
    margin-bottom: 2.4rem;
  }

  .memberSliderContainer {
    max-width: 80rem;
    margin: 0 auto;
  }

  .active-slide {
    border-radius: 0.6rem;
    width: 14rem;
    height: 16rem;
  }

  .adjacent-slide {
    border-radius: 0.6rem;
    width: 10rem;
    height: 11.4rem;
    margin-top: 3rem !important;
  }

  .subsequent-slide {
    border-radius: 0.6rem;
    width: 8.5495rem;
    height: 9rem;
    margin-top: 6rem !important;
  }

  .after-subsequent-slide {
    border-radius: 0.6rem;
    width: 6.5495rem;
    height: 6rem;
    margin-top: 8rem !important;
  }

  .after-after-subsequent-slide {
    border-radius: 0.6rem;
    width: 4.5495rem;
    height: 6rem;
    margin-top: 9rem !important;
  }

  #active-user-data {
    margin-top: 2.4rem;
    text-align: center;

    .gama-text-h5 {
      margin-bottom: 2.4rem;
    }

    .gama-text-subtitle1 {
      margin-bottom: 1.6rem;
    }
  }
}

#about-join-us {
  padding-top: 2.4rem !important;
  padding-bottom: 2.4rem !important;

  .gama-text-h4 {
    text-align: center;
    margin-bottom: 4.8rem;
  }

  .gama-text-body1 {
    color: rgba(36, 41, 47, 0.8);
  }
}

#about-find-job {
  background: #ffb600;
  padding: 2.4rem;
  text-align: center;

  .gama-text-h6 {
    margin-bottom: 2.4rem;
  }

  .v-btn {
    height: 2.8rem;
    padding: 0rem 1.245rem;
    justify-content: center;
    border-radius: 3rem;
    background: #24292f;
    margin-bottom: 2.4rem;

    .v-btn__content {
      text-transform: none;
      color: #ffb600;
      font-size: 1.8rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
}

@media only screen and (min-width: 600px) {
  #about-page-header {
    height: 20rem;
    background-image: url("/images/about-header-xs.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100vw 100vh;
    position: relative;

    .overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 100%;
      background: rgba(36, 41, 47, 0.4);
      backdrop-filter: blur(7.5px);
    }

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
        width: 80%;
        margin: auto auto;
        color: #ffb600 !important;
      }
    }
  }

  #about-introduce-container {
    text-align: center;
    padding-top: 6.4rem;
    padding-bottom: 2.7rem;

    .gama-text-h4 {
      color: #24292f;
      margin-bottom: 2.4rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
      text-align: left;
    }
  }

  #about-map-container {
    #map-card {
      background-color: transparent;
      background-image: url("/images/about-us-header.svg");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 27.6rem 15.8rem;
      height: 20rem;
      position: relative;
      display: grid;
      place-items: center;

      .lottie-container {
        width: 30rem !important;
        height: 20.8rem !important;
      }
    }
  }

  #about-vision-container {
    text-align: center;
    padding-top: 6.2rem;
    padding-bottom: 3.1rem;

    .gama-text-h4 {
      color: #24292f;
      margin-bottom: 2.4rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
      text-align: left;
      margin-bottom: 4.8rem;
    }

    .step-holder {
      height: 21rem !important;
      padding: 0 0 6rem 0;
    }

    #step-container-mobile {
      height: 42rem;
      width: 0.4rem;
      position: relative;
      margin: auto auto;

      .step-progress-bar {
        width: 100%;
        height: 0;
        background-color: #ffb600;
      }

      .lottie-container {
        width: 8.8rem !important;
        height: 8.8rem !important;
      }

      #step1 {
        position: absolute;
        top: -3rem;
        left: -4rem;
        margin: auto auto;
      }

      #step2 {
        position: absolute;
        top: 0;
        bottom: 0;
        left: -4.2rem;
        margin: auto;
      }

      #step3 {
        position: absolute;
        left: -4.2rem;
        bottom: -3rem;
        margin: auto;
      }
    }

    .animateStep1 {
      animation: step1MobileProgressAnimation 3s linear forwards;
    }

    .animateStep2 {
      animation: step2MobileProgressAnimation 3s linear forwards;
    }

    .gama-text-h5 {
      font-size: 2rem !important;
      margin-bottom: 1.6rem;
    }

    .gama-text-body2 {
      text-align: left;
      color: #24292f !important;
    }
  }

  #about-commitment-container {
    background: #24292f;
    min-height: 47rem;
    text-align: center;
    padding-top: 3.6rem;
    padding-bottom: 4.8rem;

    .gama-text-h4 {
      color: #ffb600 !important;
      margin-bottom: 3.2rem;
    }

    .v-card {
      background-color: transparent !important;
      height: 22.4rem;

      .v-tabs-items {
        background-color: transparent !important;

        #commitment-card {
          margin: auto;

          .v-icon {
            color: #ffb600;
            font-size: 4.8rem;
            margin-bottom: 1.6rem;
          }

          .gama-text-h5 {
            color: #ffb600;
            margin-bottom: 2.4rem;
          }

          .gama-text-subtitle2 {
            color: #ffb600;
            text-align: left;
            margin: auto;
            max-width: 51.2rem;
          }
        }
      }

      .v-tabs {
        max-height: 4.8rem !important;
        margin-top: 2.4rem;

        .v-icon {
          font-size: 3.2rem;
          color: #ffb600;
        }

        .v-tab {
          min-width: 4.8rem;
          min-height: 4.8rem !important;
          width: 4.8rem !important;
          height: 4.8rem !important;
        }

        .v-tab--active {
          background-color: #ffb600;
          border-radius: 0.4rem;

          .v-icon {
            font-size: 2.4rem;
            color: #24292f;
          }
        }

        .v-tabs-slider-wrapper {
          display: none !important;
        }
      }
    }
  }

  #about-our-service {
    margin-top: 5rem;
    margin-bottom: 2.5rem;
    text-align: center;

    .gama-text-h4 {
      text-align: center;
      margin-bottom: 5.1rem;
    }

    .gama-text-h6 {
      display: block;
      position: relative;
      padding-left: 3.2rem;
      text-align: left;
      margin-bottom: 1.6rem;

      .service-icon {
        display: block;
        position: absolute;
        left: 0;
        top: -0.1rem;
        color: #ffb600 !important;
        font-size: 2.4rem;
      }
    }

    .gama-text-body1 {
      text-align: left;
      margin-bottom: 2.4rem;
    }

    .v-btn {
      height: 3.6rem;
      padding: 0rem 1.6rem;
      justify-content: center;
      border-radius: 3rem;
      background: #ffb600;
      margin: auto auto;

      .v-btn__content {
        color: #24292f;
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 600;
      }
    }
  }

  #about-our-team-container {
    text-align: center;
    overflow-x: hidden;
    padding-top: 6.8rem;
    padding-bottom: 6.8rem;

    .gama-text-h4 {
      color: #24292f;
      margin-bottom: 4.8rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
      text-align: left;
      margin-bottom: 2.4rem;
    }

    .memberSliderContainer {
      max-width: 50rem;
      margin: 0 auto;
    }

    .active-slide {
      border-radius: 0.6rem;
      width: 17.5rem;
      height: 20rem;
    }

    .adjacent-slide {
      border-radius: 0.6rem;
      width: 14rem;
      height: 16rem;
      margin-top: 3rem !important;
    }

    .subsequent-slide {
      border-radius: 0.6rem;
      width: 10rem;
      height: 12rem;
      margin-top: 6rem !important;
    }

    .after-subsequent-slide {
      border-radius: 0.6rem;
      width: 6.5495rem;
      height: 6rem;
      margin-top: 8rem !important;
    }

    .after-after-subsequent-slide {
      border-radius: 0.6rem;
      width: 4.5495rem;
      height: 6rem;
      margin-top: 9rem !important;
    }

    #active-user-data {
      margin-top: 2.4rem;
      text-align: center;

      .gama-text-h5 {
        margin-bottom: 2.4rem;
      }

      .gama-text-subtitle1 {
        margin-bottom: 1.6rem;
      }
    }
  }

  #about-join-us {
    padding-top: 5rem !important;
    padding-bottom: 5rem !important;

    .gama-text-h4 {
      text-align: center;
      margin-bottom: 4.8rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
    }
  }

  #about-find-job {
    background: #ffb600;
    padding: 4.8rem;
    text-align: center;

    .gama-text-h6 {
      margin-bottom: 2.4rem;
    }

    .v-btn {
      height: 2.8rem;
      padding: 0rem 1.245rem;
      justify-content: center;
      border-radius: 3rem;
      background: #24292f;
      margin-bottom: 2.4rem;

      .v-btn__content {
        color: #ffb600;
        font-size: 1.8rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
}

@media only screen and (min-width: 960px) {
  #about-page-header {
    height: 34rem;
    background-image: url("/images/about-header.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100vw 100vh;
    position: relative;

    .overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 100%;
      background: rgba(36, 41, 47, 0.4);
      backdrop-filter: blur(7.5px);
    }

    #main-title-holder {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 11rem;
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

  #about-map-container {
    #map-card {
      background-color: transparent;
      background-image: url("/images/about-us-header.svg");
      background-repeat: no-repeat;
      background-position: center bottom;
      background-size: 43rem 23rem;
      height: 30rem;
      position: relative;
      display: grid;
      place-items: center;

      .lottie-container {
        width: 40rem !important;
        height: 38rem !important;
      }
    }
  }

  #about-introduce-container {
    text-align: center;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .gama-text-h4 {
      color: #24292f;
      margin-bottom: 4.8rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
      text-align: left;
    }
  }

  #about-vision-container {
    text-align: center;
    min-height: 88.2rem;
    padding-top: 13.6rem;
    padding-bottom: 13.6rem;

    .gama-text-h4 {
      color: #24292f;
      margin-bottom: 4.8rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
      text-align: left;
      margin-bottom: 4.8rem;
    }

    #step-container {
      height: 0.5rem;
      width: 75%;
      margin: auto auto 2.4rem auto;
      position: relative;

      .step-progress-bar {
        width: 0;
        height: 100%;
        background-color: #ffb600;
      }

      .lottie-container {
        width: 10rem !important;
        height: 10rem !important;
      }

      #step1 {
        position: absolute;
        left: -4rem;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      #step2 {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      #step3 {
        position: absolute;
        right: -4rem;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }

    .animateStep1 {
      animation: step1ProgressAnimation 3s linear forwards;
    }

    .animateStep2 {
      animation: step2ProgressAnimation 3s linear forwards;
    }

    .gama-text-h5 {
      margin-bottom: 2.4rem;
    }

    .gama-text-body2 {
      text-align: left;
      color: #24292f !important;
    }
  }

  #about-commitment-container {
    background: #24292f;
    min-height: 50.8rem;
    text-align: center;
    padding-top: 5.2rem;
    padding-bottom: 5.2rem;

    .gama-text-h4 {
      color: #ffb600 !important;
      margin-bottom: 4.8rem;
    }

    .v-card {
      background-color: transparent !important;
      height: 21.4rem;

      .v-tabs-items {
        background-color: transparent !important;

        #commitment-card {
          width: 80%;
          margin: auto;

          .v-icon {
            color: #ffb600;
            font-size: 6.4rem;
            margin-bottom: 1.6rem;
          }

          .gama-text-h5 {
            color: #ffb600;
            margin-bottom: 2.4rem;
          }

          .gama-text-subtitle2 {
            color: #ffb600;
            text-align: left;
            max-width: 57.8rem;
            margin: auto;
          }
        }
      }

      .v-tabs {
        margin-top: 2.8rem;
        .v-icon {
          font-size: 3.2rem;
          color: #ffb600;
        }

        .v-tab {
          min-width: 6.4rem;
          min-height: 6.4rem !important;
          width: 6.4rem !important;
          height: 6.4rem !important;
        }

        .v-tab--active {
          background-color: #ffb600;
          border-radius: 0.4rem;

          .v-icon {
            font-size: 4.8rem;
            color: #24292f;
          }
        }

        .v-tabs-slider-wrapper {
          display: none !important;
        }
      }
    }
  }

  #about-our-service {
    margin-top: 5rem;
    margin-bottom: 2.5rem;
    text-align: center;

    .gama-text-h4 {
      text-align: center;
      margin-bottom: 6rem;
    }

    .gama-text-h6 {
      display: block;
      position: relative;
      padding-left: 5.6rem;
      text-align: left;
      margin-bottom: 7.2rem;

      .service-icon {
        display: block;
        position: absolute;
        left: 0;
        top: -1rem;
        color: #ffb600 !important;
        font-size: 4.8rem;
      }
    }

    .gama-text-body1 {
      text-align: left;
      margin-bottom: 2.4rem;
    }

    .v-btn {
      height: 3.6rem;
      padding: 0rem 1.6rem;
      justify-content: center;
      border-radius: 3rem;
      background: #ffb600;
      margin: auto auto;

      .v-btn__content {
        color: #24292f;
        font-size: 1.8rem;
        font-style: normal;
        font-weight: 600;
      }
    }
  }

  #about-our-team-container {
    text-align: center;
    padding-top: 6.8rem;
    padding-bottom: 6.8rem;

    .gama-text-h4 {
      color: #24292f;
      margin-bottom: 4.8rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
      text-align: left;
      margin-bottom: 2.4rem;
    }

    .memberSliderContainer {
      max-width: 80rem;
      margin: 0 auto;
    }

    .active-slide {
      border-radius: 0.6rem;
      width: 21rem;
      height: 24rem;
    }

    .adjacent-slide {
      border-radius: 0.6rem;
      width: 16rem;
      height: 18.2rem;
      margin-top: 3rem !important;
    }

    .subsequent-slide {
      border-radius: 0.6rem;
      width: 10.5495rem;
      height: 12rem;
      margin-top: 6rem !important;
    }

    .after-subsequent-slide {
      border-radius: 0.6rem;
      width: 6.5495rem;
      height: 8rem;
      margin-top: 8rem !important;
    }

    .after-after-subsequent-slide {
      border-radius: 0.6rem;
      width: 4.5495rem;
      height: 6rem;
      margin-top: 9rem !important;
    }

    #active-user-data {
      margin-top: 2.4rem;
      text-align: center;

      .gama-text-h5 {
        margin-bottom: 2.4rem;
      }

      .gama-text-subtitle1 {
        margin-bottom: 1.6rem;
      }
    }
  }

  #about-join-us {
    padding-top: 5rem !important;
    padding-bottom: 5rem !important;

    .gama-text-h4 {
      text-align: center;
      margin-bottom: 4.8rem;
    }

    .gama-text-body1 {
      color: rgba(36, 41, 47, 0.8);
    }
  }

  #about-find-job {
    background: #ffb600;
    padding: 4.8rem;
    text-align: center;

    .gama-text-h6 {
      margin-bottom: 2.4rem;
    }

    .v-btn {
      height: 3.6rem;
      padding: 0rem 1.6rem;
      border-radius: 2rem;
      margin-bottom: 2.4rem;

      .v-btn__content {
        color: #ffb600;
        font-size: 1.8rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
}
</style>
