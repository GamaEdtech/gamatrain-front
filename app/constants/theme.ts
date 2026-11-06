export type ThemeName = 'light' | 'dark'

// Cookie that keeps the visitor's theme choice, read on the server so the
// first paint already uses it.
export const THEME_COOKIE_NAME = 'theme'

// Vuetify theme palettes. Token names describe a role on the light theme
// (grey700 = body text, grey100 = soft background), so the dark theme keeps
// each role and flips the value. `white` stays white in both themes because
// it is also used as text on coloured surfaces.

export const LIGHT_THEME_COLORS = {
  // Brand
  // Yellow is for filled surfaces only (buttons, highlights): any yellow is
  // about 1.8:1 on white, so it can't carry text there.
  'primary': '#FFB300',
  // Text on yellow: brand navy, 8:1.
  'on-primary': '#1E2A44',
  // Same-hue amber for yellow text, icons and outlines on white (5.2:1).
  'primaryStrong': '#946200',
  'primary100': '#FFF4BC',
  'primary50': '#FFF2D1',
  'brandNavy': '#1E2A44',
  'softGold': '#FFF8E1',
  // Navy is the structural brand colour (opposite yellow on the colour wheel).
  'secondary': '#1E2A44',
  'on-secondary': '#FFFFFF',
  // White on these fills in the light theme; the dark theme lightens the fills, so it needs dark text.
  'on-lightError': '#FFFFFF',
  'on-blue500': '#FFFFFF',
  'on-teal500': '#FFFFFF',
  'on-generalSearchQuiz': '#FFFFFF',

  // Status
  'error': '#B00020',
  'errorStrong': '#C93C37',
  'lightError': '#F04438',
  // Link / info blue, 6:1 on white.
  'info': '#175CD3',
  'success': '#4CAF50',
  'success300': '#6CE9A6',
  'success500': '#12B76A',
  'warning': '#FB8C00',
  'warning300': '#FEC84B',
  'warning400': '#FDB022',
  'warning500': '#F79009',

  // Neutrals: high numbers are text, low numbers are backgrounds
  'grey900': '#24292F',
  'grey800': '#1D2939',
  'grey700': '#344054',
  'grey600': '#475467',
  'grey500': '#667085',
  'grey400': '#98A2B3',
  'grey300': '#D0D5DD',
  'grey200': '#E4E7EC',
  'grey100': '#F2F4F7',
  'grey50': '#F9FAFB',
  'grey25': '#FCFCFD',
  'white': '#FFFFFF',

  // Surfaces and borders
  'surfaceSecondary': '#F7F8FA',
  'surfaceTertiary': '#EEF1F5',
  'borderSubtle': '#D8DEE8',
  'borderSkeleton': '#DCDDE5',
  'borderStrong': '#B8C1CF',
  'shadowNeutral': '#424A53',
  // Bars that stay dark in both themes (mobile bottom nav), and their muted text.
  'inverseSurface': '#344054',
  'onInverseSurfaceMuted': '#98A2B3',
  'onInverseSurfaceSubtle': '#D0D5DD',
  // Banners and headers that are dark in both themes (page headers, sliders, stats).
  'inverseSurfaceStrong': '#24292F',

  // Accents
  'greenLight700': '#02B719',
  'greenLight500': '#12B76A',
  'greenLight25': '#F9FFF5',
  'teal500': '#008080',
  'blue50': '#EFF8FF',
  'blue500': '#2E90FA',
  'blueGray300': '#9EA5D1',

  // Search service colours
  'generalSearchPaper': '#01C8C8',
  'generalSearchPaperActive': '#BBE9BD',
  'generalSearchStudyMaterialsActive': '#B3E9BA',
  'generalSearchQuiz': '#7B61FF',
  'generalSearchQuizActive': '#D8D0FF',
  // QuizHub purple as a fill behind white text (generalSearchQuiz is the text/icon purple).
  'quizFill': '#6E52F5',

  // Subscription plan card header tints
  'planTintBlue': '#E7EEFB',
  'planTintPurple': '#F1E6F6',
  'planTintGold': '#F7F1E1',
  'generalSearchTutorialActive': '#C0DEFF',
  'generalSearchTeacher': '#7F56D9',
  'generalSearchTeacherActive': '#C7B5EE',
  'generalSearchSchool': '#A15801',
  'generalSearchSchoolActive': '#E3CDB3',
  'generalSearchBlog': '#FF9400',
  'generalSearchBlogActive': '#FFDFB3',
} as const

// Every text colour here is at least 4.5:1 on `surface`. Tokens not listed
// fall back to the light value.
const DARK_THEME_OVERRIDES: Partial<Record<keyof typeof LIGHT_THEME_COLORS | 'background' | 'surface' | 'on-surface' | 'on-background' | 'on-error' | 'on-info' | 'on-success' | 'on-warning', string>> = {
  'background': '#0C111D',
  'surface': '#161B26',

  // Brand
  'primaryStrong': '#FEC84B',
  // Filled navy stays a navy pill on the dark page, lighter so it stands out.
  'secondary': '#33446A',
  'primary100': '#3A2C08',
  'primary50': '#2A2007',
  'brandNavy': '#C3CEE5',
  'softGold': '#2A2210',

  // Status
  'error': '#F97066',
  'errorStrong': '#FDA29B',
  'lightError': '#F97066',
  'info': '#53B1FD',
  'success': '#47CD89',
  'success500': '#47CD89',
  'warning': '#FDA14B',
  // These fills are light here, so white text on them is under 3:1.
  'on-error': '#0C111D',
  'on-lightError': '#0C111D',
  'on-info': '#0C111D',
  'on-success': '#0C111D',
  'on-warning': '#0C111D',
  'on-blue500': '#0C111D',
  'on-teal500': '#0C111D',
  'on-generalSearchQuiz': '#0C111D',

  // Neutrals, flipped
  'grey900': '#F5F5F6',
  'grey800': '#ECECED',
  'grey700': '#CECFD2',
  'grey600': '#94969C',
  'grey500': '#85888E',
  'grey400': '#80838B',
  'grey300': '#333741',
  'grey200': '#1F242F',
  'grey100': '#161B26',
  'grey50': '#0C111D',
  'grey25': '#0A0D12',

  // Surfaces and borders
  'surfaceSecondary': '#121722',
  'surfaceTertiary': '#1F242F',
  'borderSubtle': '#333741',
  'borderSkeleton': '#2B303B',
  'borderStrong': '#61646C',
  'shadowNeutral': '#000000',
  'inverseSurface': '#1F242F',
  'onInverseSurfaceMuted': '#94969C',
  'onInverseSurfaceSubtle': '#CECFD2',

  // Accents
  'greenLight700': '#47CD89',
  'greenLight500': '#47CD89',
  'greenLight25': '#0B1F14',
  'teal500': '#2ED3B7',
  'blue50': '#102A43',
  'blue500': '#53B1FD',

  // Search service colours
  'generalSearchPaperActive': '#123D33',
  'generalSearchStudyMaterialsActive': '#14402A',
  'generalSearchQuiz': '#9B8AFB',
  'generalSearchQuizActive': '#2B2363',
  'quizFill': '#5B45D6',
  'planTintBlue': '#1B2740',
  'planTintPurple': '#2A1F38',
  'planTintGold': '#2E2716',
  'generalSearchTutorialActive': '#13304F',
  'generalSearchTeacher': '#A48AFB',
  'generalSearchTeacherActive': '#2E2259',
  'generalSearchSchool': '#E79A4A',
  'generalSearchSchoolActive': '#3D2A15',
  'generalSearchBlogActive': '#3F2A0D',
}

export const DARK_THEME_COLORS = {
  ...LIGHT_THEME_COLORS,
  ...DARK_THEME_OVERRIDES,
}
