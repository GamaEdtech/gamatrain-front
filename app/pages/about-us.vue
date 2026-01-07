<template>
  <div class="w-100 d-flex flex-column align-start justify-center">
    <div
      class="w-100 d-flex flex-column align-center justify-end justify-md-center pb-4 position-relative top-section-div ga-2"
    >
      <div class="blur-div w-100 h-100 position-absolute top-0 left-0" />
      <h1 class="text-primary text-h2 text-sm-h1 font-weight-bold set-z-index">
        About Us
      </h1>
      <h2 class="text-primary text-h5 set-z-index text-center px-2">
        Learning Together, Earning Together Building a Brighter Future
      </h2>
    </div>

    <v-container
      class="w-100 d-flex flex-column justify-start align-center pt-12"
    >
      <div class="w-100 d-flex flex-column justify-start align-center">
        <h1 class="text-black text-h3 text-sm-h3 font-weight-black">
          GamaTrain
        </h1>
        <h2 class="primary-gray-500 text-h4 set-z-index text-start px-2 mt-4">
          Welcome to GamaTrain, the EdTech startup revolutionizing education.
          Our platform offers innovative services like sample exams, online
          tests, tutoring, and more, enhancing the learning experience for
          teachers and students. Join us to shape the future of education!
        </h2>

        <div
          class="w-100 d-flex align-center justify-center position-relative image-map-div"
        >
          <img
            src="/images/about-us-header.svg"
            alt="Map"
            class="map-img"
          >
          <ClientOnly>
            <DotLottieVue
              src="/images/about-us-header.json"
              autoplay
              :loop="true"
              class="map-img position-absolute"
            />
          </ClientOnly>
        </div>
      </div>

      <div
        ref="ourVisionSectionRef"
        class="w-100 d-flex flex-column justify-start align-center"
      >
        <h1 class="text-black text-h3 text-sm-h3 font-weight-black">
          Our Vision
        </h1>
        <h2 class="primary-gray-500 text-h4 set-z-index text-start px-2 mt-4">
          At GamaTrain, our vision is to revolutionize the world of education by
          providing innovative solutions that empower both students and
          teachers. As we move toward the future, we are committed to offering
          new services that leverage the latest technology and trends. Some of
          the exciting new services we are working on include:
        </h2>

        <div
          class="w-100 d-flex flex-row flex-sm-column align-strech align-sm-center justify-center position-relative mt-16"
        >
          <div
            class="container-line-guid d-flex align-start justify-start align-sm-center justify-sm-start mb-0 mb-sm-8 position-relative"
          >
            <div
              ref="lineRef"
              :class="`line-div mb-8 ${lineAnimated ? `animate-line` : ``}`"
            />
            <ClientOnly>
              <DotLottieVue
                v-if="showFirst"
                src="/images/about-vision-step.json"
                autoplay
                :loop="false"
                class="target-lottie first-target"
              />
            </ClientOnly>
            <ClientOnly>
              <DotLottieVue
                v-if="showSecond"
                src="/images/about-vision-step.json"
                autoplay
                :loop="false"
                class="target-lottie second-target"
              />
            </ClientOnly>
            <ClientOnly>
              <DotLottieVue
                v-if="showThird"
                src="/images/about-vision-step.json"
                autoplay
                :loop="false"
                class="target-lottie third-target"
              />
            </ClientOnly>
          </div>
          <div
            class="d-flex flex-column flex-sm-row justify-space-between align-start ga-4 ga-sm-0 container-cards"
          >
            <div
              :class="`d-flex flex-column align-start justify-start ga-2 card-step ${
                showFirst ? `show-card` : ``
              }`"
            >
              <span class="text-black font-weight-bold text-h4">Customized Learning Paths Using AI</span>
              <span class="primary-gray-600 text-h6">We understand that every student has their own unique learning
                style and preferences. That's why we're working on integrating
                AI into our platform to offer personalized learning paths that
                adapt to each student's needs. With customized learning paths,
                students can learn at their own pace and in a way that works
                best for them.</span>
            </div>
            <div
              :class="`d-flex flex-column align-start justify-start ga-2 card-step ${
                showSecond ? `show-card` : ``
              }`"
            >
              <span class="text-black font-weight-bold text-h4">Moving Towards Green Economy</span>
              <span class="primary-gray-600 text-h6">We recognize the importance of environmental sustainability and
                the role education plays in creating a better future. We are
                committed to promoting a green economy by offering courses that
                educate students about sustainability, eco-friendly practices,
                and environmental stewardship. By doing so, we hope to inspire a
                generation of students who are passionate about creating a
                better world.</span>
            </div>
            <div
              :class="`d-flex flex-column align-start justify-start ga-2 card-step ${
                showThird ? `show-card` : ``
              }`"
            >
              <span class="text-black font-weight-bold text-h4">Decentralized Content Quality Moderation</span>
              <span class="primary-gray-600 text-h6">We believe that quality education is paramount, and that's why
                we are developing a decentralized content quality moderation
                system. This system will allow our users to participate in
                moderating the quality of the content on our platform, ensuring
                that it remains accurate, relevant, and up-to-date. By
                decentralizing content quality moderation, we can provide a more
                transparent and collaborative platform that empowers our
                users.</span>
            </div>
          </div>
        </div>
      </div>
    </v-container>

    <div
      class="w-100 mt-4 slider-div d-flex flex-column align-center justify-center"
    >
      <h1 class="text-primary text-h3 font-weight-black mb-4">
        Our Commitment
      </h1>
      <div class="mx-auto w-100 max-width-slider">
        <v-carousel
          v-model="currentSlide"
          :show-arrows="false"
          hide-delimiters
          hide-delimiter-background
          height="200"
        >
          <v-carousel-item
            v-for="(slide, i) in slidesData"
            :key="i"
          >
            <div class="d-flex flex-column align-center justify-center ga-4">
              <v-icon
                size="40"
                color="primary"
              >
                {{ slide.icon }}
              </v-icon>
              <span class="text-primary text-h4 font-weight-bold">{{
                slide.title
              }}</span>
              <span class="text-primary text-h6 px-2">{{
                slide.description
              }}</span>
            </div>
          </v-carousel-item>
        </v-carousel>
        <v-slide-group
          v-model="currentSlide"
          class="mt-4"
          center-active
          mandatory
        >
          <v-slide-group-item
            v-for="(item, i) in slidesData"
            :key="item.id"
            v-slot="{ isSelected, toggle }"
          >
            <v-btn
              :color="isSelected ? 'primary' : 'transparent'"
              :width="isSelected ? `60` : `40`"
              :height="isSelected ? `60` : `40`"
              flat
              rounded="lg"
              class="my-auto mx-2"
              @click="
                () => {
                  toggle();
                  changeSlider(i);
                }
              "
            >
              <v-icon
                size="40"
                :color="isSelected ? '#24292f' : 'primary'"
              >
                {{
                  item.icon
                }}
              </v-icon>
            </v-btn>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </div>

    <v-container
      class="w-100 d-flex flex-column justify-start align-center mt-4"
    >
      <v-row>
        <v-col
          cols="12"
          class="d-flex justify-center mb-8"
        >
          <h2 class="text-black text-h3 font-weight-black">
            Our Services
          </h2>
        </v-col>
        <v-col
          v-for="(item, index) in services"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <nuxt-link
            :to="`${item.link}`"
            class="text-black text-h4 font-weight-black"
          >
            <span :class="`text-primary ${item.icon}`" />
            {{ item.title }}
          </nuxt-link>
        </v-col>

        <v-col
          cols="12"
          class="d-flex justify-center flex-column mt-6"
        >
          <p class="primary-gray-600 text-h4">
            Welcome to GamaTrain, the EdTech startup revolutionizing education.
            Our platform offers innovative services like sample exams, online
            tests, tutoring, and more, enhancing the learning experience for
            teachers and students. Join us to shape the future of education!
          </p>

          <v-btn
            to="/services"
            color="primary"
            rounded="pill"
            width="250"
            flat
            class="text-h5 font-weight-bold mx-auto mt-4"
          >
            All services
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="mt-12">
        <h2 class="text-black text-h3 font-weight-black w-100 text-center">
          Join Us
        </h2>
        <p class="primary-gray-600 text-h4 mt-4">
          Join Us and become part of the GamaTrain community! We're always
          looking for talented individuals who are passionate about EdTech and
          want to make a positive impact in the world of education.
        </p>
      </v-row>
    </v-container>

    <div
      class="w-100 mt-8 bg-primary py-16 px-2 d-flex flex-column align-center justify-center"
    >
      <h1 class="text-black text-center text-h4 font-weight-black mb-4">
        Check out our current job openings and apply today!
      </h1>
      <v-btn
        color="black"
        rounded="pill"
        width="250"
        flat
        class="text-btn text-h5 font-weight-bold mx-auto mt-4"
        href="mailto:contact@gamatrain.com"
      >
        Contact Us
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

useHead({
  titleTemplate: '%s',
  title:
    'About GamaTrain | Meet the Team Dedicated to Transforming K12 Education',

  meta: [
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content:
        'About GamaTrain | Meet the Team Dedicated to Transforming K12 Education',
    },
    {
      hid: 'og:title',
      name: 'og:title',
      content:
        'About GamaTrain | Meet the Team Dedicated to Transforming K12 Education',
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
        'Embark on an educational journey with GamaTrain\'s exceptional team of K12 experts, passionate about empowering students through innovative learning solutions.',
    },
    {
      hid: 'og:description',
      name: 'og:description',
      content:
        'Embark on an educational journey with GamaTrain\'s exceptional team of K12 experts, passionate about empowering students through innovative learning solutions.',
    },
  ],
})

const ourVisionSectionRef = ref(null)
const showFirst = ref(false)
const showSecond = ref(false)
const showThird = ref(false)
const lineAnimated = ref(false)
const lineRef = ref(null)
const startAnimation = async () => {
  showFirst.value = false
  showSecond.value = false
  showThird.value = false
  lineAnimated.value = false

  showFirst.value = true

  await wait(1500)

  lineAnimated.value = true
  lineRef.value.style.setProperty('--progress', '50%')
  lineRef.value.style.setProperty('--extra', '510px')
  await wait(2000)

  showSecond.value = true

  await wait(1500)

  lineRef.value.style.setProperty('--progress', '100%')
  lineRef.value.style.setProperty('--extra', '240px')
  await wait(2000)

  showThird.value = true
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

let hasAnimated = false
let scrollTimeout = null

const checkSectionInView = () => {
  if (!ourVisionSectionRef.value || hasAnimated) return

  const rect = ourVisionSectionRef.value.getBoundingClientRect()
  const windowHeight
    = window.innerHeight || document.documentElement.clientHeight

  const inView
    = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.3

  if (inView && !hasAnimated) {
    hasAnimated = true
    startAnimation()
  }
}

const handleScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(checkSectionInView, 100)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkSectionInView()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})

const slidesData = ref([
  {
    id: 1,
    title: 'Innovation',
    icon: 'md:wb_incandescent',
    description:
      'We are dedicated to innovation and are constantly exploring new ways to enhance the learning experience. We use the latest technology and teaching methods to create engaging and interactive content that keeps our users motivated and excited about learning.',
  },
  {
    id: 2,
    title: 'Accessibility',
    icon: 'md:beach_access',
    description:
      'We are committed to providing our services to as many people as possible, regardless of their location, financial situation, or background. Our platform is designed to be accessible and affordable, allowing anyone to access high-quality education.',
  },
  {
    id: 3,
    title: 'Quality',
    icon: 'md:star',
    description:
      'We strive to provide the highest quality of education to our users by working with experienced educators and experts to create our content. We constantly review and update our content to ensure that it is accurate, relevant, and up-to-date.',
  },
  {
    id: 4,
    title: 'Support',
    icon: 'md:headset_mic',
    description:
      'We are committed to providing our users with the support they need to succeed in their education. Our customer support team is available 24/7 to answer any questions or concerns that our users may have.',
  },
  {
    id: 5,
    title: 'Community',
    icon: 'md:groups',
    description:
      'We believe that education is a collaborative process and that learning is enhanced when students and educators work together. We are committed to creating a supportive and inclusive community that encourages collaboration and communication between our users.',
  },
  {
    id: 6,
    title: 'Digital Transformation',
    icon: 'md:memory',
    description:
      'In today\'s digital age, traditional learning falls short. At GamaTrain, we\'re dedicated to enhancing education through technology. Our intuitive platform is accessible on various devices, providing a flexible and dynamic learning experience that adapts to individual preferences.',
  },
])

const currentSlide = ref(0)
const changeSlider = (index) => {
  currentSlide.value = index
}

const services = [
  {
    icon: 'icon-multimedia',
    link: '/search?type=multimedia',
    title: 'Multimedia',
  },
  {
    icon: 'icon-paper',
    link: '/search?type=paper',
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
    link: '/search?type=forum',
    title: 'Q&A',
  },
  {
    icon: 'icon-exam',
    link: '/search?type=quizhub',
    title: 'Exam',
  },
]
</script>

<style scoped>
.top-section-div {
  height: 20rem;
  background-image: url("/images/about-header-xs.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100vw 100vh;
}
.blur-div {
  backdrop-filter: blur(7.5px);
  background: #24292f66;
}
.set-z-index {
  z-index: 2;
}
.map-img {
  height: 300px;
  width: 300px;
}

.container-line-guid {
  width: 10%;
  min-height: 100%;
}
.container-cards {
  width: 90%;
}
.line-div {
  width: 3px;
  height: 0;
  background-color: #999;
  transition: width 2s linear, height 2s linear, background-color 1s ease;
  height: calc(100% - (var(--extra, 820px)));
}
.animate-line {
  background-color: #ffb600;
}
.card-step {
  width: 100%;
  height: 260px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease, transform 1s ease;
}

.show-card {
  opacity: 1;
  transform: translateY(0);
}

.target-lottie {
  width: 60px;
  height: 60px;
  position: absolute;
}
.first-target {
  left: -27px;
  top: -20px;
}
.second-target {
  top: 276px;
  left: -27px;
}
.third-target {
  top: 540px;
  left: -27px;
}

.slider-div {
  height: 440px;
  background-color: #24292f;
}
.max-width-slider {
  max-width: 500px;
}
.text-btn {
  color: #ffb600 !important;
}

@media (min-width: 960px) {
  .top-section-div {
    height: 25rem;
  }
}

@media (min-width: 600px) {
  .map-img {
    height: 400px;
    width: 500px;
  }
  .container-line-guid {
    width: 75%;
  }
  .container-cards {
    width: 100%;
  }
  .card-step {
    width: 30%;
  }
  .line-div {
    width: 0%;
    height: 6px;
    background-color: #999;
    transition: width 2s linear, height 2s linear, background-color 1s ease;
    width: var(--progress, 0%);
  }
  .animate-line {
    background-color: #ffb600;
  }
  .first-target {
    left: -50px;
    top: -50px;
  }
  .second-target {
    left: calc(50% - 50px);
    top: -50px;
  }
  .third-target {
    left: calc(100% - 50px);
    top: -50px;
  }
  .target-lottie {
    width: 100px;
    height: 100px;
    position: absolute;
  }
}
</style>
