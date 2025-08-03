<template>
  <div
    id="footer-container"
    class="mt-4"
  >
    <v-footer>
      <v-container
        id="footer"
        class="px-0"
      >
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="6"
            class="text-center text-sm-left"
          >
            <nuxt-link to="/">
              <img
                id="logo"
                alt="gamatrain"
                src="/images/gamatrain-logo-black.svg"
              >
            </nuxt-link>
            <div
              id="short-describe"
              class="gama-text-body2"
            >
              Our mission is to provide all training services to anyone and
              anywhere.
            </div>
            <div class="mt-4">
              <a
                href="https://x.com/GamaEdtech"
                target="_blank"
                class="v-btn"
              >
                <v-icon>mdi-twitter</v-icon>
              </a>
              <a
                href="https://youtube.com/@GamaEdtech"
                target="_blank"
                class="v-btn"
              >
                <v-icon> mdi-youtube </v-icon>
              </a>
            </div>
          </v-col>
          <v-col
            v-for="(item, i) in footerLinks"
            :key="i"
            sm="3"
            md="3"
            class="d-none d-sm-block"
          >
            <div class="link-title gama-text-button">
              {{ item.mainTitle }}
            </div>
            <nuxt-link
              v-for="link in item.subMenu"
              :key="link.link"
              :to="link.link"
              class="footer-link gama-text-body2"
            >
              {{ link.title }}
            </nuxt-link>
          </v-col>

          <v-col
            cols="12"
            class="d-block d-sm-none"
          >
            <v-expansion-panels
              id="mobile-footer-panels"
              focusable
              flat
            >
              <v-expansion-panel
                v-for="(item, i) in footerLinks"
                :key="i"
                style="border-bottom: 0.5px solid #424a53"
              >
                <v-expansion-panel-title class="link-title gama-text-button">
                  {{ item.mainTitle }}
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pt-4">
                  <nuxt-link
                    v-for="link in item.subMenu"
                    :key="link.link"
                    :to="link.link"
                    class="footer-link gama-text-body2"
                  >
                    {{ link.title }}
                  </nuxt-link>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
    <v-container
      id="footer-copy-right"
      fluid
    >
      <v-row>
        <v-col
          cols="12"
          class="pt-3 pb-1 text-center px-0"
        >
          <span class="describe gama-text-overline">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      footerLinks: [
        {
          mainTitle: 'We',
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
              title: 'FAQ',
              link: '/faq',
            },
          ],
        },
        {
          mainTitle: 'Services',
          subMenu: [
            {
              title: 'Paper',
              link: '/search?type=test',
            },
            {
              title: 'School Finder',
              link: '/school',
            },
            {
              title: 'Exam',
              link: '/search?type=azmoon',
            },
            {
              title: '$GET Token',
              link: '/get-token',
            },
          ],
        },
      ],
    }
  },
}
</script>

<style>
#footer {
  margin-top: 4rem;
  padding-bottom: 5.2rem;

  #logo {
    width: 10.5996rem;
    height: 3.2rem;
    margin-bottom: 1.5rem;
  }

  #short-describe {
    color: #6e7781;
    margin-bottom: 1.2rem;
  }

  .v-btn {
    background-color: #ffb600;
    height: 2rem !important;
    width: 2rem !important;
    border-radius: 0.3125rem;
    margin: 0.1rem;

    .v-icon {
      font-size: 1.5rem;
      color: #fff;
    }
  }

  .link-title {
    color: #424a53;
    margin-bottom: 1rem;
  }

  .footer-link {
    display: block;
    text-decoration: none;
    margin-bottom: 1rem;
    color: #6e7781;
  }
}

#footer-copy-right {
  background: #24292f;
  padding-bottom: 0;

  .describe {
    color: #fff;
  }
}
</style>
