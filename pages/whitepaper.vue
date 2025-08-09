<template>
  <div class="main">
    <v-container
      id="whitepaper-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1">
                White Paper
              </h1>
              <p class="gama-text-subtitle2">
                GET into School: Gamified, Decentralized, Unlimited
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="whitepaper-data-container">
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
            id="whitepaper-navigation"
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

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch as _watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

// SEO
useHead({
  title: 'White Paper | GamaTrain',
  meta: [
    {
      name: 'description',
      content:
        'GamaEdTech White Paper - GET into School: Gamified, Decentralized, Unlimited',
    },
    {
      name: 'keywords',
      content:
        'GamaEdTech, white paper, blockchain education, GET token, NFT education, gamified learning',
    },
  ],
})

useSeoMeta({
  ogTitle: 'GamaEdTech White Paper - GET into School',
  ogDescription:
    'Explore GamaTrain\'s comprehensive White Paper detailing our innovative approach to revolutionizing education technology',
  ogImage: '/images/gamatrain-logo.png',
  ogUrl: '/whitepaper',
  twitterTitle: 'GamaEdTech White Paper - GET into School',
  twitterDescription:
    'Learn about our gamified, decentralized educational platform powered by blockchain technology',
  twitterImage: '/images/gamatrain-logo.png',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon-dark.ico',
    },
  ],
})

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const activeSection = ref(null)
const isClient = ref(false)
const observer = ref(null)
const isScrolling = ref(false)
const scrollTimeout = ref(null)

// Define whitepaper sections with content
const whitepaperSection = ref([
  {
    id: 'abstract',
    title: 'Abstract',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'In today\'s rapidly evolving world, traditional education systems are struggling to meet the demands of modern learners, practical skill development, and equitable access to quality education. GamaEdTech is an innovative solution that leverages cutting-edge technologies—including blockchain, NFTs, gamified learning, and its native digital currency GET—to redefine how education is delivered from elementary to high school levels.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'At GamaEdTech, learning is no longer constrained by location, time, or age. Learners across the globe can engage in a flexible, online educational environment designed around skill-based level-ups rather than rigid grade structures. Each completed level awards a unique blockchain-based NFT, culminating in a final diploma NFT upon mastering all required skills.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'The GET token powers the financial backbone of the platform, enabling seamless transactions, rewarding contributors, and incentivizing engagement within the Gama ecosystem.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'More than just a tech-driven platform, GamaEdTech is a commitment to global educational equity—bringing accessible, engaging, and skill-oriented learning to everyone, everywhere.'
      + '</p>',
  },
  {
    id: 'vision',
    title: 'Our Vision',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'We envision a world where high-quality, skill-based, and flexible education is accessible to every learner—regardless of their geography, socioeconomic background, or local infrastructure.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech aims to revolutionize global education by replacing outdated, rigid school systems with a learner-centered platform powered by blockchain, NFTs, and gamified experiences.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'In our vision, a child in a remote village will have the same opportunity to learn, grow, and earn recognized credentials as a student in a major city. By shifting the focus from passive learning to active skill mastery, and from rigid grades to dynamic level-ups, we will foster a new generation of creative, capable, and self-directed learners.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'Ultimately, we strive to become a globally recognized education ecosystem where diplomas on the blockchain are trusted and respected by universities and employers worldwide—and where learning is no longer a privilege, but a universal right.'
      + '</p>',
  },
  {
    id: 'introduction',
    title: 'Introduction to GamaEdTech',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech is a decentralized educational ecosystem designed to transform how learners engage with academic and practical content from elementary through high school. Built on the Solana blockchain, GamaEdTech integrates gamified learning, story-based content, blockchain-based certification, and AI-enhanced assessments into a cohesive, learner-driven platform.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'Our platform offers a flexible and modular learning experience, where students are not confined by traditional grade levels or academic years. Instead, they progress by mastering skills and completing learning missions, much like leveling up in a game. Each level-up is recorded via a non-fungible token (NFT) on the blockchain, ensuring transparent and tamper-proof academic credentials.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech is also a creator-powered platform. Teachers, content creators, and developers can collaborate to design gamified lessons, story-based simulations, and real-life skill challenges. These contributions are rewarded with GET tokens, ensuring a sustainable and incentivized content ecosystem.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'Through open-source development and a global community of educators and learners, GamaEdTech is committed to bridging educational gaps, removing structural inequalities, and building a truly borderless learning environment where progress is earned, not prescribed.'
      + '</p>',
  },
  {
    id: 'problems',
    title: 'Problems with Traditional Education',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'Despite global advancements in technology and access to information, traditional education systems remain outdated, rigid, and often inequitable. Several core issues continue to limit their effectiveness and accessibility:'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📌 One-size-fits-all structure</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Traditional systems follow a standardized curriculum and timeline, failing to accommodate the diverse learning speeds, interests, and needs of individual students. Fast learners get bored; slower learners fall behind.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📌 Location-based limitations</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Educational quality often depends on geographic location. Students in remote or underserved areas frequently lack access to qualified teachers, modern facilities, or comprehensive curricula.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📌 Passive learning models</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Most schools rely on lecture-based instruction and memorization. These methods rarely develop critical thinking, creativity, or practical skills—abilities that are essential for success in today\'s world.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📌 Lack of real-world skill focus</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Traditional systems prioritize theoretical knowledge over hands-on experience. As a result, many graduates struggle to apply what they\'ve learned in real-life contexts or job markets.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📌 Rigid grade structures</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Age-based grade levels don\'t accurately reflect skill proficiency. A student\'s true capabilities can be masked or misjudged by this outdated system.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📌 Limited credential verification</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Academic records are centralized, prone to forgery, and often inaccessible to employers or institutions without manual verification.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech directly addresses each of these challenges by providing a decentralized, gamified, and skill-based alternative to traditional schooling.'
      + '</p>',
  },
  {
    id: 'solution',
    title: 'Gama\'s Solution',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech is designed as a forward-thinking response to the limitations of traditional education. By leveraging the power of blockchain, gamification, and open-source collaboration, Gama introduces a flexible, inclusive, and skill-oriented learning model that works for everyone — everywhere.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎮 Gamified Learning Experience</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Gama transforms learning into an engaging journey. Instead of textbooks and tests, students participate in interactive missions, story-driven lessons, and practical challenges that feel more like games than schoolwork — while still developing real academic and life skills.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>⏫ Skill-Based Progression</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Learners advance not by age or academic year, but by leveling up as they master new skills. Each level-up represents a meaningful milestone and is recorded as an NFT on the blockchain — forming a verifiable, digital academic identity.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🌍 Global Accessibility</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech is location-independent. Learners can join from anywhere, anytime. All they need is an internet connection and the motivation to grow. No more barriers due to geography, infrastructure, or political limitations.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🔗 Blockchain for Trust & Transparency</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'All certifications, achievements, and transactions are recorded on the Solana blockchain — making academic progress tamper-proof, transferable, and easily verified by institutions or employers worldwide.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧠 Community-Driven Content Creation</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Teachers, developers, and educational creators form the backbone of the Gama content ecosystem. They can contribute new educational games, lessons, or skill modules — and earn GET tokens as a reward for their impact.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🔄 Continuous Assessment</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Instead of traditional exams, learners are evaluated throughout their journey, with real-time feedback integrated into learning missions. Smart assessments ensure mastery, not memorization.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🤝 A Decentralized Educational Economy</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Using the GET token, all educational transactions — from accessing premium content to rewarding teachers — are handled in a transparent and decentralized manner, reducing costs and empowering contributors.'
      + '</p>',
  },
  {
    id: 'learning-system',
    title: 'Learning System in Gama',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'The GamaEdTech learning system is built to be flexible, personalized, and skill-focused, designed for learners of all ages and backgrounds. It breaks away from rigid academic calendars and standardized methods, offering a dynamic educational experience that mirrors the logic of game design and real-life progression.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧩 Modular Learning Paths</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Education in Gama is divided into modular learning units, each focusing on a specific skill, concept, or area of knowledge. These modules are often presented in the form of interactive challenges or story-based missions that keep learners engaged and motivated.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🕹️ Story-Based and Game-Like Experiences</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Gama uses gamification techniques and storytelling to create immersive educational experiences. Lessons are designed as missions within a larger storyline where learners play an active role, making decisions, solving problems, and earning rewards along the way.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📈 Level-Up Instead of Grade Levels</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Instead of advancing by school years, learners "level up" by mastering new skills. Each level corresponds to a verified competency and is marked by the issuance of an NFT certificate on the blockchain. A full learning journey consists of 12 levels, and each level represents a significant educational milestone.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📲 Mobile and Web Access</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'The entire system is accessible via web and mobile platforms, allowing students to learn anytime, anywhere. Whether on a laptop or smartphone, Gama ensures that learning adapts to the learner, not the other way around.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>👨‍🏫 Instructor and AI Collaboration</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Each module may be guided by human instructors, AI tutors, or a combination of both. Smart algorithms analyze learner progress in real-time and adjust content difficulty accordingly, ensuring a truly personalized experience.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧪 Continuous Evaluation</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Learners are assessed through in-game tasks, simulations, and real-time challenges instead of traditional exams. Their performance is continuously monitored, and feedback is provided instantly, encouraging growth over grades.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🌐 Open Ecosystem for Learning Resources</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Gama encourages open contribution from educators, developers, and creatives. New modules can be submitted, reviewed, and added to the platform, allowing the system to evolve constantly with the latest knowledge, skills, and learning approaches.'
      + '</p>',
  },
  {
    id: 'blockchain-nft',
    title: 'Blockchain & NFT Integration',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'At the heart of GamaEdTech lies a deep commitment to transparency, decentralization, and learner ownership—powered by blockchain technology and non-fungible tokens (NFTs).'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📜 Immutable Academic Records</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Each time a learner completes a level or earns a certification, it is recorded on the blockchain as an NFT-backed credential. These NFTs serve as tamper-proof proof-of-learning, verifiable by anyone, anywhere, without relying on a central authority.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎓 NFT-Based Diplomas and Skill Badges</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'As learners progress through the 12 educational levels in Gama, they receive NFT badges that represent specific achievements or skills. Upon completing Level 12, they are awarded a graduation NFT diploma, which can be used to apply for jobs, internships, or higher education programs—even outside the Gama ecosystem.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🔐 Ownership and Portability</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Unlike traditional education records stored in siloed databases, Gama\'s blockchain credentials are owned by the learners themselves. These NFTs can be stored in their personal crypto wallets, granting them full control and portability across platforms and institutions.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🔄 Tokenized Transactions</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'All financial interactions within the Gama ecosystem—from paying for courses to rewarding content creators and educators—are conducted using the GET token. Blockchain ensures that these transactions are fast, secure, and transparent.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🌍 Global Trust Layer</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'By anchoring educational credentials and transactions on a public blockchain, Gama introduces a universal layer of trust that transcends borders. Learners from any part of the world can prove their qualifications and engage with global education and employment markets confidently.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🤝 Integration with Open Systems</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Gama\'s blockchain infrastructure is designed to be interoperable with other platforms and protocols. Over time, learners may be able to link their Gama profile with other educational or professional networks, creating a comprehensive digital identity built on merit and achievement.'
      + '</p>',
  },
  {
    id: 'level-up-model',
    title: 'Level-Up Model and Assessment',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech replaces the outdated, rigid structure of grade-based education with a gamified, skill-driven level-up system that mirrors modern digital experiences and empowers learners to progress at their own pace.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧩 From Grades to Levels</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Instead of traditional school grades (like Grade 1 to Grade 12), Gama introduces 12 dynamic learning levels. Each level represents a meaningful advancement in a learner\'s theoretical knowledge and practical skillset. Progression is not bound by age or academic year but by actual mastery.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎯 Personalized Progression</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Learners "level up" when they complete skill-based challenges, project-driven tasks, and interactive learning modules. Each learner follows a personalized learning path, allowing them to spend more time on difficult topics and accelerate through subjects they master quickly.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧠 Embedded Assessments</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Assessment is not a separate phase but an integrated part of the learning journey. Through embedded quizzes, interactive missions, and scenario-based problem-solving, learners are continuously evaluated in real-time.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🏆 NFT Certification for Each Level</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'At the completion of each level, the learner receives a unique NFT certificate, stored on the blockchain. This NFT acts as a verifiable badge of skill that they can showcase or share with future employers and academic institutions.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧪 Final Skill Evaluation</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Before leveling up, learners must pass a "Level Mastery Test", designed using advanced test integrity technologies to prevent cheating and ensure true competence. These evaluations can include AI-proctored exams, video submissions, and peer-reviewed projects.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🔄 Feedback and Retry Mechanism</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'If a learner doesn\'t succeed in their first attempt, they are given clear feedback and the opportunity to revisit materials and try again. This promotes growth mindset and reduces the pressure of one-shot exams.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>💬 Peer & Community Review</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'In higher levels, assessments may include community-based evaluations, where peers and mentors assess real-world projects, fostering collaboration, responsibility, and deeper learning.'
      + '</p>',
  },
  {
    id: 'get-token',
    title: 'Use Case of the GET Token',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'The GET Token is the lifeblood of the GamaEdTech ecosystem. As a native digital currency on the Solana blockchain, it enables a decentralized, transparent, and efficient economy that powers every aspect of the Gama learning experience.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🛒 1. Payment for Courses and Content</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Learners use GET tokens to enroll in courses, unlock gamified lessons, access premium content, and upgrade their learning experience. This creates a direct value loop between the learner and the platform.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧑‍🏫 2. Rewards for Educators and Content Creators</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Teachers, curriculum designers, and developers who create interactive lessons, gamified challenges, and assessment tools receive GET tokens as compensation. This ensures fair incentives and encourages community-driven content creation.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎨 3. Crowdsourced Content Funding</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Educators can propose new content or modules, and the community can vote and fund those proposals using GET tokens. This DAO-style governance drives innovation from the grassroots level.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧩 4. Microtransactions in the Learning Experience</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Learners may spend GET tokens for additional attempts at a test, custom avatars, unlocking side quests, or receiving extra mentorship hours, enhancing personalization and fun.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎓 5. Certification Fees</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Upon completing each level, learners receive an NFT certificate minted on the blockchain, with minting fees paid in GET tokens. These certificates are permanent and verifiable records of their achievement.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🤝 6. Community Engagement and Incentives</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Active users — such as community moderators, top forum contributors, or testers of new features — can earn GET tokens for their efforts. This builds an engaged and self-sustaining user base.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📈 7. Governance & Voting</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Holders of GET tokens can vote on platform upgrades, content priorities, and fund allocation. This decentralized governance ensures that the platform evolves in alignment with its users\' needs.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>💼 8. Partnership Transactions</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Institutions or partners integrating Gama into their educational systems can pay licensing or white-labeling fees using GET tokens. This drives broader adoption and liquidity.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'By integrating GET tokens into every layer of the GamaEdTech platform, we are not only creating a sustainable digital economy but also ensuring value returns directly to those who contribute to the ecosystem\'s growth.'
      + '</p>',
  },
  {
    id: 'tokenomics',
    title: 'Tokenomics of GET',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'The total supply of GET Token is fixed at 10 billion (10,000,000,000 GET), deployed on the Solana blockchain to ensure high-speed, low-fee transactions and scalability. The tokenomics structure is designed to balance long-term project sustainability, community growth, investor trust, and ecosystem incentives.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🔹 Total Supply: 10,000,000,000 GET</strong></p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>📦 Allocation Breakdown</strong></p>'
      + '<table style=\'width:100%; border-collapse: collapse; margin-bottom: 20px;\'>'
      + '<tr style=\'background-color: #f4f4f4;\'><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Category</th><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Allocation</th><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Lock & Vesting Details</th></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>🔒 Liquidity Pool</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>10%</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>Permanently locked (LP tokens burned)</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>💼 Private & Strategic Investors</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>10%</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>Vested over 6 years with a 1-year cliff (0% release in Year 1)</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>👥 Community (Development and Rewards)</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>60%</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>Unlocked over 6 years (1B tokens per year for a total of 6 years)</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>🧑‍🏫 Founders</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>20%</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>Locked for 6 years, released gradually starting Year 3</td></tr>'
      + '</table>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>⏳ Vesting Schedule Summary</strong></p>'
      + '<table style=\'width:100%; border-collapse: collapse; margin-bottom: 20px;\'>'
      + '<tr style=\'background-color: #f4f4f4;\'><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Year</th><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Investors</th><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Community (Development and Rewards)</th><th style=\'padding: 10px; text-align: left; border: 1px solid #ddd;\'>Founders</th></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>Y1</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>Locked</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>1B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>Y2</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0.2B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>1B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>Y3</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0.2B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>1B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>Y4</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0.2B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>1B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>~1.3B</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>Y5</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0.2B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>1B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>~0.3B</td></tr>'
      + '<tr><td style=\'padding: 10px; border: 1px solid #ddd;\'>Y6</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>0.2B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>1B</td><td style=\'padding: 10px; border: 1px solid #ddd;\'>~0.3B</td></tr>'
      + '</table>'
      + '<p class=\'gama-text-body1\'>This process will continue via buybacks and be locked on December 30th at year-end.</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>💡 Key Token Principles</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- <strong>Deflation-Friendly:</strong> No inflation beyond the original 10B supply. Burn mechanisms may be added by community vote.<br>'
      + '- <strong>Locked Liquidity = Trust:</strong> With liquidity permanently locked, GET becomes more secure and attractive to exchanges and investors.<br>'
      + '- <strong>Gradual Unlocking:</strong> Prevents token dumps and aligns all stakeholders for the long term.<br>'
      + '- <strong>Community Ownership:</strong> The largest share is for educators, developers, and learners contributing to the platform.'
      + '</p>',
  },
  {
    id: 'roadmap',
    title: 'Development Roadmap',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'The roadmap for GamaEdTech outlines a multi-phase journey from infrastructure setup to global adoption. Each phase is designed to build upon the previous, ensuring a stable, scalable, and community-driven evolution of the platform.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>✅ Phase 1: Foundation & Token Launch (Q1–Q2 2025)</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Ideation and team formation<br>'
      + '- Core platform architecture design<br>'
      + '- Launch of $GET Token on Solana blockchain<br>'
      + '- Liquidity pool creation and permanent locking<br>'
      + '- Private investor onboarding and legal structuring<br>'
      + '- Initial community formation (early educators, developers)'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🚀 Phase 2: Platform MVP & Community Growth (Q3–Q4 2025)</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- MVP release of GamaEdTech platform<br>'
      + '- Open-source publishing of core codebase<br>'
      + '- Launch of early gamified learning modules<br>'
      + '- First cohort of teachers and content creators onboarded<br>'
      + '- Community NFT issuance begins (for achievements & levels)<br>'
      + '- Awareness campaigns and educational events<br>'
      + '- Release of governance framework draft'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🌱 Phase 3: Expansion & Adoption (2026)</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Full version of the GamaEdTech platform<br>'
      + '- Mobile app launch (iOS and Android)<br>'
      + '- Strategic partnerships with schools and educational NGOs<br>'
      + '- Global community scaling (focus on underserved regions)<br>'
      + '- DAO governance trial implementation<br>'
      + '- Launch of educator/reviewer incentive program using GET<br>'
      + '- Rollout of additional Level-Up content & assessments'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🌐 Phase 4: Ecosystem Scaling (2027)</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Cross-border educational certification support<br>'
      + '- Integration with external learning and testing platforms<br>'
      + '- GET staking mechanism for governance and content moderation<br>'
      + '- Start of multi-language expansion (Arabic, Spanish, etc.)<br>'
      + '- AI-driven adaptive learning integration'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎓 Phase 5: Global Recognition & Decentralization (2028 and Beyond)</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Official recognition of GamaEdTech diplomas by partner universities<br>'
      + '- Fully decentralized platform managed by DAO<br>'
      + '- Large-scale onboarding of learners from 100+ countries<br>'
      + '- Expansion of GET token use in educational finance systems<br>'
      + '- Research collaborations with global educational institutions<br>'
      + '- Hosting of annual "Gama Summit" for open-source education leaders'
      + '</p>',
  },
  {
    id: 'team',
    title: 'Team',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech is built by a diverse team of educators, technologists, blockchain experts, and open-source contributors. We are united by a shared mission: to revolutionize global education by making it gamified, accessible, and equitable through blockchain technology.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>Founders & Core Team</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- <strong>Educational Experts:</strong> Former teachers, curriculum designers, and education reform advocates with a deep understanding of learning needs across age groups.<br>'
      + '- <strong>Developers & Blockchain Engineers:</strong> Experienced Solana-based smart contract developers, front-end/full-stack engineers, and security auditors.<br>'
      + '- <strong>Gamification Designers:</strong> Game developers and behavioral experts focused on crafting engaging learning experiences.<br>'
      + '- <strong>Product & Strategy Leads:</strong> Professionals with a track record of scaling edtech platforms and managing distributed, community-driven products.<br>'
      + '- <strong>Legal & Compliance Advisors:</strong> Ensuring our framework complies with educational, data, and crypto regulations internationally.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>Community Contributors</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Educators, students, and open-source contributors from around the world help develop, localize, and improve the platform.<br>'
      + '- Content creators, animators, and scenario writers fuel the gamified learning ecosystem.<br>'
      + '- DAO participants shape governance and decision-making for the platform\'s future.'
      + '</p>',
  },
  {
    id: 'funding',
    title: 'Funding & Capital Allocation',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'Our funding strategy is designed to support long-term sustainability while aligning stakeholder interests transparently.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>Initial Capital Structure</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Total Supply of GET Token: 10 billion<br>'
      + '- Valuation at Launch: ~$200,000 USD<br>'
      + '- Liquidity Pool: 10% (1 billion GET) permanently locked<br>'
      + '- Founders: 20% (2 billion GET), locked for 6 years<br>'
      + '- Investors Allocation: 10% (1 billion GET), locked for 6 years<br>'
      + '- Community (Development and Reward) Allocation: 60% (6 billion GET), vested at 1 billion per year for 6 years. This process will continue via buybacks and be locked on December 30th at year-end.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>Funding Sources</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- Private Round: Strategic investors aligned with educational impact<br>'
      + '- Grants: Applications for blockchain, open-source, and education-focused grants<br>'
      + '- Platform Revenue: the platform uses a gamified system where users can earn or lose $GET. Progressing through the game requires spending $GET, and obtaining certificates also incurs a $GET cost. Additional revenue is generated through sources such as Google Ads and advertisements on the YouTube channel. All revenue is funneled through a buyback mechanism and shared among token holders.<br>'
      + '- Token Utility: As demand for GET grows through usage, value cycles back into the ecosystem'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>Use of Funds</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '- 30% Product Development & Engineering<br>'
      + '- 25% Content Production (educational games, videos, assessments)<br>'
      + '- 15% Marketing & Community Building<br>'
      + '- 15% Operational & Legal Costs<br>'
      + '- 10% Strategic Partnerships & Onboarding<br>'
      + '- 5% Reserve for contingencies and future needs'
      + '</p>',
  },
  {
    id: 'equity',
    title: 'Commitment to Educational Equity',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'At GamaEdTech, our foundational belief is that education is a human right—not a privilege. We are committed to creating a global learning ecosystem that removes the systemic barriers often present in traditional education systems, such as geographic isolation, socioeconomic limitations, and outdated pedagogical models.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🌍 Accessibility for All</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + '<strong>Anytime, Anywhere Learning:</strong> Our platform is web-based and device-agnostic, allowing learners from remote or underserved areas to access high-quality educational content 24/7.<br>'
      + '<strong>Multilingual Support:</strong> Gama will progressively support multiple languages, ensuring inclusivity for non-English-speaking communities.<br>'
      + '<strong>Offline Access Plans:</strong> We are developing light versions of our platform that can function in low-bandwidth environments or via periodic synchronization.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🧠 Personalized, Non-Linear Learning</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Instead of forcing all learners through the same standardized curriculum, Gama enables flexible, level-based progression. Students "level up" based on skills mastered, not based on age or location.<br><br>'
      + 'This creates a fairer educational environment where learners from disadvantaged backgrounds can progress at their own pace and overcome gaps caused by traditional schooling methods.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>💡 Open Content & Open Source</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech supports a community-driven, open-source development model to build the platform collaboratively and transparently.<br><br>'
      + 'Educators and developers from any region can contribute to or localize educational content and tools, ensuring cultural relevance and inclusiveness.<br><br>'
      + 'We also plan to incentivize contributions via GET tokens, creating opportunities for teachers and content creators in underserved regions to earn income by participating in the ecosystem.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🎓 Equal Recognition via Blockchain</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Each learner earns verifiable educational credentials (NFTs) upon completing learning levels, regardless of where they are in the world.<br><br>'
      + 'These NFTs act as decentralized, tamper-proof diplomas that allow students to pursue higher education or employment based on merit—not based on institutional prestige or geography.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'><strong>🤖 AI-Powered Assistance</strong></p>'
      + '<p class=\'gama-text-body1\'>'
      + 'Gama will leverage AI to provide tailored support for students with learning difficulties, neurodivergent needs, or other educational challenges, helping close the achievement gap.'
      + '</p>',
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    describe:
      '<p class=\'gama-text-body1\'>'
      + 'GamaEdTech represents more than just an educational platform—it embodies a fundamental shift in how we approach learning in the digital age. By combining blockchain\'s transparency and security with gamification\'s engagement and motivation, we\'re creating a truly borderless, equitable education system that empowers learners worldwide.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'The rigid structures of traditional education are giving way to the flexibility, personalization, and skill-focus of Gama\'s level-up approach. Through our NFT-based certification system, learners build a verifiable portfolio of skills that transcends geographic and institutional boundaries.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'The GET token creates a sustainable economic model that fairly rewards all ecosystem participants while ensuring that quality education remains accessible to learners everywhere. With every token exchanged, we strengthen the bonds between learners, teachers, and content creators.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'As we progress along our roadmap, we invite educators, developers, investors, and learners to join us in building this revolutionary approach to education. Together, we can ensure that quality learning is not a privilege for the few, but a fundamental right for all.'
      + '</p>'
      + '<br>'
      + '<p class=\'gama-text-body1\'>'
      + 'The future of education is not found within classroom walls or bound by geographic borders—it exists in the limitless potential of decentralized, gamified, and skill-based learning. With GamaEdTech, that future begins today.'
      + '</p>',
  },
])

onMounted(() => {
  isClient.value = true

  // Set initial active section
  activeSection.value = whitepaperSection.value[0].id

  // Initialize intersection observer
  initializeObserver()

  // Handle initial hash if present
  if (route.hash) {
    const targetId = route.hash.replace('#', '')
    if (whitepaperSection.value.find(item => item.id === targetId)) {
      activeSection.value = targetId
      nextTick(() => {
        scrollToSection(targetId, false)
      })
    }
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})

const initializeObserver = () => {
  const options = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Only trigger when section is in the top 30% of viewport
    threshold: 0,
  }

  observer.value = new IntersectionObserver((entries) => {
    if (isScrolling.value) return // Don't update during programmatic scrolling

    // Find the section that's most visible
    let mostVisibleEntry = null
    let maxRatio = 0

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio
        mostVisibleEntry = entry
      }
    })

    if (mostVisibleEntry) {
      const sectionId = mostVisibleEntry.target.id
      if (sectionId && sectionId !== activeSection.value) {
        activeSection.value = sectionId
        updateHash(sectionId)
      }
    }
  }, options)

  // Observe all sections
  nextTick(() => {
    whitepaperSection.value.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.value.observe(element)
      }
    })
  })
}

const updateHash = (sectionId) => {
  // Update route hash without causing scroll
  if (route.hash !== `#${sectionId}`) {
    router.replace({
      path: route.path,
      hash: `#${sectionId}`,
    })
  }
}

const scrollToSection = (sectionId, smooth = true) => {
  isScrolling.value = true
  activeSection.value = sectionId

  const element = document.getElementById(sectionId)
  if (element) {
    const headerOffset = 100 // Adjust based on your fixed header height
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: smooth ? 'smooth' : 'auto',
    })

    updateHash(sectionId)
  }

  // Reset scrolling flag after animation
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  scrollTimeout.value = setTimeout(
    () => {
      isScrolling.value = false
    },
    smooth ? 1000 : 100,
  )
}

const isItemActive = (item) => {
  if (!isClient.value) return false
  return activeSection.value === item.id
}

// Computed property to filter sections based on search
const filteredSections = computed(() => {
  if (!searchQuery.value) return whitepaperSection.value

  const query = searchQuery.value.toLowerCase()
  return whitepaperSection.value.filter(
    section =>
      section.title.toLowerCase().includes(query)
      || section.describe.toLowerCase().includes(query),
  )
})

// Computed property for filtered navigation items
const filteredItems = computed(() => {
  return filteredSections.value
})

// Methods
const _smoothScroll = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.section-anchor {
  padding-top: 8rem;
  margin-top: -8rem;
}

.section-spacer {
  height: 4rem;
}

#whitepaper-page-header {
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

#whitepaper-data-container {
  margin-bottom: 1.5rem;

  .v-text-field {
    width: 42.8rem;
    min-height: auto;
    height: 4rem !important;
    border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;
    margin: 1.6rem auto 1.6rem auto;

    .v-input__control > .v-field {
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
    .v-card {
      .gama-text-h4 {
        text-align: center;
        margin-bottom: 4.8rem;
      }
    }

    #whitepaper-navigation {
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
  #whitepaper-page-header {
    height: 26rem;

    #main-title-holder {
      top: 11.5rem;

      .gama-text-h1 {
        margin-bottom: 0.8rem;
      }
    }
  }

  #whitepaper-data-container {
    margin-bottom: 1.5rem;

    .v-text-field {
      width: 42.8rem;
      min-height: auto;
      height: 4rem !important;
      margin: 1.6rem auto 1.6rem auto;

      .v-input__control > .v-field {
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
      .v-card {
        .gama-text-h4 {
          text-align: center;
          margin-bottom: 4.8rem;
        }
      }

      #whitepaper-navigation {
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
  #whitepaper-page-header {
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

  #whitepaper-data-container {
    margin-bottom: 1.5rem;

    .v-text-field {
      width: 42.8rem;
      min-height: auto;
      height: 4rem !important;
      border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;
      margin: 1.6rem auto 1.6rem auto;

      .v-input__control > .v-field {
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
      .v-card {
        .gama-text-h4 {
          text-align: center;
          margin-bottom: 4.8rem;
        }
      }

      #whitepaper-navigation {
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
