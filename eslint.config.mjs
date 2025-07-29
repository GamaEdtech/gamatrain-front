import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
})
  .override('nuxt/stylistic', {
    rules: {
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
    },
  })
  .override('nuxt/rules', {
    rules: {
      'vue/no-v-html': 'off',
    },
  })
  // Custom rule to check file path case sensitivity
  .append({
    name: 'file-path-case-sensitivity',
    files: ['**/*.vue', '**/*.js', '**/*.ts'],
    rules: {
      // This will be handled by a custom script instead of ESLint
      // as ESLint doesn't have built-in file path validation
    },
  })
