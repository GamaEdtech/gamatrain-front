<template>
  <section aria-labelledby="exam-faq-title">
    <h2
      id="exam-faq-title"
      class="gama-text-h4 text-brandNavy mb-4"
    >
      Questions about this quiz
    </h2>
    <v-card
      rounded="xl"
      border
      elevation="0"
    >
      <v-expansion-panels
        v-model="openPanel"
        variant="accordion"
        flat
      >
        <v-expansion-panel
          v-for="(item, index) in items"
          :key="index"
          :value="index"
        >
          <v-expansion-panel-title class="text-h5 font-weight-bold text-brandNavy">
            {{ item.question }}
          </v-expansion-panel-title>
          <v-expansion-panel-text class="text-h5 text-grey600">
            {{ item.answer }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import type { ExamDetaiDTO, ExamExportPriceDTO } from '@/types'

const props = defineProps<{
  exam: ExamDetaiDTO
  prices: ExamExportPriceDTO[]
}>()

const openPanel = ref(0)

// Every answer is built from this quiz's own data, so it is never a generic text.
const items = computed(() => {
  const exam = props.exam
  const questions = Number(exam.tests_num) || 0
  const topics = (exam.topics ?? []).map(topic => topic.title?.trim()).filter(Boolean).join(', ')
  const pdf = props.prices.find(price => price.fileType === 'Pdf')
  const onlinePrice = exam.price?.participation?.price ?? 0

  const pdfAnswer = [
    `A print-ready paper with ${questions ? `all ${questions} questions` : 'every question'}${topics ? ` on ${topics}` : ''}, and an answer key at the end.`,
    pdf && !pdf.purchased ? `It costs ${pdf.points} Gems, and you can download it again later for free.` : 'You can download it again later for free.',
  ].join(' ')

  const minutes = Number(exam.azmoon_time) || 0
  const level = ({ 1: 'easy', 2: 'medium', 3: 'hard' } as Record<number, string>)[Number(exam.level)]
  const lengthAnswer = [
    questions ? `${questions} questions` : 'A set of questions',
    minutes ? `, with ${minutes} minutes to answer them online` : '',
    level ? `. Its difficulty is ${level}` : '',
    '.',
  ].join('')

  // Only questions this quiz answers in its own way: the same text on every exam page reads as boilerplate.
  const list = [
    { question: 'How many questions are there, and how long does it take?', answer: lengthAnswer },
    { question: 'What do I get when I download the PDF?', answer: pdfAnswer },
  ]

  if (exam.price?.participation) {
    list.push({
      question: 'Is the online quiz free?',
      answer: onlinePrice
        ? `Taking this quiz online costs ${onlinePrice} Gems. Sign in to save your result.`
        : 'Yes. Taking this quiz online is free. Sign in to save your result.',
    })
  }

  return list
})
</script>
