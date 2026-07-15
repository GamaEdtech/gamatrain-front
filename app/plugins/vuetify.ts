import '@mdi/font/css/materialdesignicons.css'
import { VStepperVertical } from 'vuetify/labs/VStepperVertical'
// Import from Vuetify components
import { VSlideGroup } from 'vuetify/components'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { mdSymbols } from '../utils/iconsets/mdSymbols'
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
              grey900: '#24292F',
              grey800: '#1D2939',
              grey700: '#344054',
              grey600: '#475467',
              grey500: '#667085',
              grey400: '#98A2B3',
              grey300: '#D0D5DD',
              grey200: '#E4E7EC',
              grey100: '#f2f4f7',
              grey50: '#F9FAFB',
              grey25: '#FCFCFD',
              primary100: '#fff4bc',
              primary50: '#FFF2D1',
              lightError: '#F04438',
              greenLight700: '#02B719',
              greenLight500: '#12B76A',
              greenLight25: '#F9FFF5',
              blue50: '#EFF8FF',
              blueGray300: '#9EA5D1',
              warning300: '#FEC84B',
              warning500: '#F79009',
              success300: '#6CE9A6',
              success500: '#12B76A',
              white: '#FFFFFF',
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
              grey900: '#24292F',
              grey800: '#1D2939',
              grey700: '#344054',
              grey600: '#475467',
              grey500: '#667085',
              grey400: '#98A2B3',
              grey300: '#D0D5DD',
              grey200: '#E4E7EC',
              grey100: '#f2f4f7',
              grey50: '#F9FAFB',
              grey25: '#FCFCFD',
              primary100: '#fff4bc',
              primary50: '#FFF2D1',
              lightError: '#F04438',
              greenLight700: '#02B719',
              greenLight500: '#12B76A',
              greenLight25: '#F9FFF5',
              blue50: '#EFF8FF',
              blueGray300: '#9EA5D1',
              warning300: '#FEC84B',
              warning500: '#F79009',
              success300: '#6CE9A6',
              success500: '#12B76A',
              white: '#FFFFFF',
            },
          },
        },
      },
      icons: {
        defaultSet: 'mdi',
        aliases: {
          ...mdiAliases,
        },
        sets: {
          mdi,
          md: mdSymbols,
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
