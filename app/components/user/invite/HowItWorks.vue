<template>
  <div class="w-100 d-flex flex-column ga-3">
    <h3 class="text-h4 font-weight-bold text-grey700">
      How it works
    </h3>
    <v-row class="ma-0">
      <v-col
        v-for="(step, index) in steps"
        :key="step.title"
        cols="12"
        md="4"
        class="pa-1 pa-md-2"
      >
        <div class="step-card h-100 bg-grey100 rounded-lg pa-4 d-flex flex-column ga-2">
          <div class="d-flex align-center ga-3">
            <span class="step-number d-flex align-center justify-center text-h5 font-weight-bold">{{ index + 1 }}</span>
            <span class="text-h5 font-weight-bold text-grey700">{{ step.title }}</span>
          </div>
          <span class="text-h6 text-grey600">{{ step.text }}</span>
        </div>
      </v-col>
    </v-row>

    <v-expansion-panels
      variant="accordion"
      class="mt-2"
    >
      <v-expansion-panel
        v-for="item in faq"
        :key="item.question"
        elevation="0"
        class="border-b"
      >
        <v-expansion-panel-title class="text-h5 font-weight-medium text-grey700">
          {{ item.question }}
        </v-expansion-panel-title>
        <v-expansion-panel-text class="text-h6 text-grey600">
          {{ item.answer }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Join',
    text: 'Join once and your rate is locked for life, whatever happens to the program rate later.',
  },
  {
    title: 'Share your link',
    text: 'Copy an invite link to any page: the home page, a past paper or a blog post. Send it to your students and classes.',
  },
  {
    title: 'Earn',
    text: 'When someone who signed up through your link subscribes, renews or upgrades, your share is added to your commission balance.',
  },
]

const faq = [
  {
    question: 'Who counts as my invitee?',
    answer: 'Anyone who opens your link and creates a new Gamatrain account within 30 days, even if they browse other pages first. If they opened another teacher\'s link before yours, the first link counts. People who already had an account aren\'t counted.',
  },
  {
    question: 'What do I earn on?',
    answer: 'Every paid subscription payment your invitees make: their first subscription, every renewal and every paid upgrade, for as long as they stay subscribed.',
  },
  {
    question: 'When do I see my earnings?',
    answer: 'Usually within 15 minutes of the payment. They appear on this page and on your Commission page.',
  },
  {
    question: 'How do I get paid?',
    answer: 'Invite earnings are added to the same balance as your content commission. Request a payout from the Commission page once you reach the minimum payout amount.',
  },
]
</script>

<style scoped>
.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-grey900));
  flex-shrink: 0;
}
</style>
