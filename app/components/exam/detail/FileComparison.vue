<template>
  <section aria-labelledby="exam-file-comparison-title">
    <h2
      id="exam-file-comparison-title"
      class="gama-text-h4 text-brandNavy"
    >
      Which file do you need?
    </h2>
    <p class="text-h5 text-grey500 mt-1 mb-4">
      Buy one, two or all three.
    </p>

    <v-card
      rounded="xl"
      border
      elevation="0"
    >
      <v-table class="comparison text-h5">
        <thead>
          <tr>
            <th />
            <th
              v-for="format in examExportFormats"
              :key="format.fileType"
              class="text-center text-h5 font-weight-heavy"
              :class="`text-${format.color}`"
            >
              {{ format.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-grey700">
              Best for
            </td>
            <td class="text-center">
              Printing
            </td>
            <td class="text-center">
              Editing
            </td>
            <td class="text-center">
              Teaching in class
            </td>
          </tr>
          <tr
            v-for="row in featureRows"
            :key="row.label"
          >
            <td class="text-grey700">
              {{ row.label }}
            </td>
            <td
              v-for="(included, index) in row.formats"
              :key="index"
              class="text-center"
            >
              <v-icon
                v-if="included"
                color="success500"
                size="18"
                :aria-label="`${row.label}: yes`"
              >
                md:check
              </v-icon>
              <span
                v-else
                class="text-grey300"
                :aria-label="`${row.label}: no`"
              >—</span>
            </td>
          </tr>
          <tr
            v-if="prices.length"
            class="bg-softGold"
          >
            <td class="font-weight-heavy text-brandNavy">
              Price
            </td>
            <td
              v-for="format in examExportFormats"
              :key="format.fileType"
              class="text-center font-weight-heavy text-brandNavy"
            >
              {{ priceLabel(format.fileType) }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import type { ExamExportFileType, ExamExportPriceDTO } from '@/types'

const props = defineProps<{
  prices: ExamExportPriceDTO[]
}>()

// What each generated file can do, in the same PDF / Word / PowerPoint order as examExportFormats.
const featureRows = [
  { label: 'Answers included', formats: [true, true, true] },
  { label: 'Edit questions', formats: [false, true, true] },
  { label: 'Editable equations', formats: [false, true, true] },
  { label: 'One question per slide', formats: [false, false, true] },
]

const priceLabel = (fileType: ExamExportFileType) => {
  const price = props.prices.find(item => item.fileType === fileType)
  if (!price) return '—'
  return price.purchased ? 'Owned' : `${price.points} Gems`
}
</script>

<style scoped>
.comparison :deep(th),
.comparison :deep(td) {
  height: 52px !important;
}
</style>
