<template>
  <footer
    id="footer-container"
    class="w-100 d-flex align-center justify-center bg-grey100 pt-4"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
          class="d-flex flex-column align-center align-sm-start"
        >
          <nuxt-link
            to="/"
            aria-label="Home Link"
          >
            <img
              id="logo"
              alt="gamatrain"
              src="/images/gamatrain-logo-black.svg"
            >
          </nuxt-link>
          <span
            class="text-grey500 text-h5 font-weight-medium mt-4 text-center text-sm-start"
          >
            Our mission is to provide all training services to anyone and
            anywhere.
          </span>
          <div
            class="mt-4 d-flex justify-center justify-sm-start align-center ga-3"
          >
            <a
              v-for="item in socialMedias"
              :key="item.link"
              :href="item.link"
              target="_blank"
              class="pa-2 bg-primary50 rounded-lg d-flex align-center justify-center"
              :aria-label="item.alt"
            >
              <img
                :src="item.icon"
                :alt="item.alt"
                width="28"
                height="28"
                class="image-social"
              >
            </a>
          </div>
        </v-col>
        <v-col
          v-for="(item, i) in footerLinks"
          :key="i"
          sm="3"
          md="3"
          class="d-none d-sm-flex flex-column"
        >
          <div class="text-h4 text-grey900 font-weight-bold">
            {{ item.mainTitle }}
          </div>
          <nuxt-link
            v-for="link in item.subMenu"
            :key="link.link"
            :to="link.link"
            class="text-h5 text-grey700 font-weight-medium mt-2"
          >
            {{ link.title }}
          </nuxt-link>
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-row flex-nowrap align-center d-sm-none ga-2"
        >
          <v-divider
            class="w-30"
            color="grey700"
          />
          <span class="text-center text-no-wrap text-h6 font-weight-medium text-grey500">Learn&nbsp;&nbsp; &#x2022; &nbsp;&nbsp; Practice&nbsp;&nbsp; &#x2022;&nbsp;&nbsp;    Grow</span>
          <v-divider
            class="w-30"
            color="grey700"
          />
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-column d-sm-none ga-4"
        >
          <v-expansion-panels
            v-for="(item, i) in footerLinks"
            :key="i"
            class="footer-expansion-panels"
            focusable
            flat
            rounded="lg"
            height="30"
            :hover="false"
          >
            <v-expansion-panel>
              <template #title>
                <div class="w-100 d-flex align-center ga-2">
                  <v-avatar
                    color="primary50"
                    size="40"
                  >
                    <v-icon
                      color="primary"
                      size="26"
                    >
                      {{ item.icon }}
                    </v-icon>
                  </v-avatar>
                  <span class="text-h4 font-weight-bold text-grey900">
                    {{ item.mainTitle }}
                  </span>
                </div>
              </template>
              <template #text>
                <div class="d-flex flex-column w-100 pt-4 ga-2">
                  <nuxt-link
                    v-for="(link, index) in item.subMenu"
                    :key="link.link"
                    :to="link.link"
                    class="text-h5 text-grey700 font-weight-medium d-flex align-center justify-space-between flex-wrap"
                  >
                    {{ link.title }}
                    <v-icon>md:chevron_forward</v-icon>

                    <v-divider
                      v-if="index != item.subMenu.length - 1"
                      class="w-100 mt-2"
                      color="grey700"
                    /></nuxt-link>
                </div>
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col
          cols="12"
          class="d-flex flex-column ga-2 mt-6 mb-2"
        >
          <v-divider
            class="w-100"
            color="grey700"
          />
          <span class="text-center text-h6 font-weight-medium text-grey500">
            © {{ $dayjs().year() }} GamaEdtech. Licensed under
            <a
              href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html"
              target="_blank"
              rel="noopener noreferrer"
            >GPL-2.0+</a>.
          </span>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import xIcon from '@/assets/images/x-icon.svg'
import youtubeIcon from '@/assets/images/youtube-icon.svg'
import discordIcon from '@/assets/images/discord-icon.svg'
import tlgIcon from '@/assets/images/telegram-icon.svg'

const { $dayjs } = useNuxtApp()

const socialMedias = [
  {
    link: 'https://x.com/GamaEdtech',
    icon: xIcon,
    alt: 'x Account GamaEdtech',
  },
  {
    link: 'https://youtube.com/@GamaEdtech',
    icon: youtubeIcon,
    alt: 'youtube channel GamaEdtech',
  },
  {
    link: 'https://discord.gg/MwsHPu7yJx',
    icon: discordIcon,
    alt: 'discord channel GamaEdtech',
  },
  {
    link: 'https://t.me/gamaedtech',
    icon: tlgIcon,
    alt: 'telegram channel GamaEdtech',
  },
]

const footerLinks = [
  {
    mainTitle: 'We',
    icon: 'md:group_outlined',
    subMenu: [
      {
        title: 'About us',
        link: '/about-us',
      },
      {
        title: 'Contact us',
        link: '/contact-us',
      },
      {
        title: 'Terms',
        link: '/terms',
      },
      {
        title: 'GDPR',
        link: '/gdpr',
      },
      {
        title: 'FAQ',
        link: '/faq',
      },
      {
        title: 'Donate',
        link: '/donate',
      },
    ],
  },
  {
    mainTitle: 'Services',
    icon: 'md:deployed_code_outlined',
    subMenu: [
      {
        title: 'Paper',
        link: '/search?type=paper',
      },
      {
        title: 'School Finder',
        link: '/school',
      },
      {
        title: 'Exam',
        link: '/search?type=quizhub',
      },
    ],
  },
]
</script>

<style scoped>
.image-social{
  filter: brightness(0) saturate(100%) invert(75%) sepia(21%) saturate(4087%) hue-rotate(358deg) brightness(99%) contrast(106%);
}
.footer-expansion-panels :deep(.v-expansion-panel){
  border : 1px solid rgb(var(--v-theme-grey300))
}
.footer-expansion-panels :deep(.v-expansion-panel-title__icon .v-icon) {
  font-size: 30px;
}

.footer-expansion-panels :deep(.v-expansion-panel-title__overlay) {
  display: none;
}

.footer-expansion-panels :deep(.v-expansion-panel-title:hover) {
  background: transparent;
}
</style>
