import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import { VStepperVertical } from 'vuetify/labs/VStepperVertical'
// Import from Vuetify components
import { VSlideGroup } from 'vuetify/components'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as mdAliases, md } from 'vuetify/iconsets/md'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(
  (app: { vueApp: { use: (plugin: unknown) => void } }) => {
    const vuetify = createVuetify({
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#FFB300',
              secondary: '#03DAC6',
              error: '#B00020',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
          dark: {
            colors: {
              surface: '#FFFFFF',
              primary: '#FFB300',
              secondary: '#03DAC6',
              error: '#B00020',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
        },
      },
      icons: {
        defaultSet: 'mdi',
        aliases: {
          ...mdiAliases,
          ...mdAliases,
        },
        sets: {
          mdi,
          md,
        },
      },
      components: {
        VStepperVertical,
        VSlideGroup,
      },
    })
    app.vueApp.use(vuetify)
  },
)
