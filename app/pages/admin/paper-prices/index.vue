<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center justify-space-between ga-2">
      <p class="text-body-2 text-grey600 ma-0 intro">
        The base price of each past paper file type. A file's price is
        <strong>base × √pages × referee score factor ÷ 10 × the paper's multiplier</strong>, rounded to ten. A file type
        with no row here is free. Changes show on paper pages within 5 minutes; files people already bought stay theirs.
      </p>
      <v-btn
        color="primary"
        rounded="pill"
        prepend-icon="md:add"
        flat
        @click="openForm(null)"
      >
        New price
      </v-btn>
    </div>

    <common-data-table
      :headers="headers"
      :items="items"
      :page-size="items.length || 10"
      :total-count="items.length"
      :loading="loading"
      :show-pagination="false"
      item-label="Prices"
      class="mt-4"
    />

    <!-- Create / edit. -->
    <v-dialog
      v-model="showForm"
      max-width="480"
    >
      <v-card
        rounded="xl"
        class="pa-4"
      >
        <v-card-title class="text-h6">
          {{ editing ? 'Edit price' : 'New price' }}
        </v-card-title>
        <v-card-text>
          <v-form
            ref="formRef"
            class="d-flex flex-column ga-3"
            @submit.prevent="save"
          >
            <v-text-field
              v-model="form.extensions"
              label="File extensions"
              placeholder="doc,docx"
              hint="Comma-separated. Each extension can have one price only."
              persistent-hint
              variant="outlined"
              maxlength="50"
              :rules="[extensionsRule]"
            />
            <v-text-field
              v-model.number="form.basePrice"
              label="Base price"
              type="number"
              min="0"
              :max="MAX_BASE_PRICE"
              hint="0 makes these files free."
              persistent-hint
              variant="outlined"
              :rules="[basePriceRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showForm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete. -->
    <v-dialog
      v-model="showDelete"
      max-width="440"
    >
      <v-card
        rounded="xl"
        class="pa-4"
      >
        <v-card-title class="text-h6">
          Delete this price?
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-grey700 mb-0">
            Every paper's <strong>{{ deleting?.extensions }}</strong> files become free to download.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showDelete = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="saving"
            @click="remove"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { AdminPaperFilePriceDTO, ApiResult, DataTableHeader, ManagePaperFilePricePayload } from '@/types'

// The past paper base price list (gamatrain-back api/v1/admin/pastpaperfileprices, Admin only, never delegable: it sets
// what every paper costs). See docs/business/past-papers.md, "Prices", in gamatrain-back.
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Paper prices' })

const BASE_URL = '/api/v2/admin/pastpaperfileprices'
const MAX_BASE_PRICE = 100000

const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
const { $toast } = useNuxtApp()

const formatDate = (value: string) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

const headers: DataTableHeader<AdminPaperFilePriceDTO>[] = [
  { title: 'File types', key: 'extensions', sortable: false, width: '20vw', getText: item => item.extensions.split(',').map(t => `.${t}`).join('  ') },
  { title: 'Base price', key: 'basePrice', sortable: false, width: '10vw', getText: item => (item.basePrice === 0 ? 'Free' : item.basePrice.toLocaleString()) },
  { title: 'Last changed', key: 'syncDate', sortable: false, width: '14vw', getText: item => formatDate(item.syncDate) },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '8vw',
    type: 'actions',
    actions: [
      { icon: 'md:edit', tooltip: 'Edit', onClick: item => openForm(item) },
      { icon: 'md:delete_outline', tooltip: 'Delete', onClick: item => openDelete(item) },
    ],
  },
]

const items = ref<AdminPaperFilePriceDTO[]>([])
const loading = ref(false)
const saving = ref(false)

const fetch = async () => {
  loading.value = true
  try {
    const response = await useApiService.get<ApiResult<AdminPaperFilePriceDTO[]>>(BASE_URL)
    if (response.succeeded && response.data) {
      items.value = response.data
    }
    else {
      handleApiResponseError(response)
    }
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    loading.value = false
  }
}

// ---- Create / edit ----
// The same rules the server checks: letters and digits, up to 10 each, 50 in all; it also lower-cases and drops dots.
const extensionsRule = (value: string) => {
  const parts = (value ?? '').split(',').map(t => t.trim().replace(/^\.+/, '')).filter(Boolean)
  if (parts.length === 0) return 'Required'
  if (parts.some(t => !/^[a-z0-9]{1,10}$/i.test(t))) return 'Letters and digits only, e.g. pdf or doc,docx'
  return true
}
const basePriceRule = (value: number | string) => {
  const number = Number(value)
  return (value !== '' && Number.isInteger(number) && number >= 0 && number <= MAX_BASE_PRICE) || `A whole number from 0 to ${MAX_BASE_PRICE}`
}

const showForm = ref(false)
const editing = ref<AdminPaperFilePriceDTO | null>(null)
const form = ref<{ extensions: string, basePrice: number | string }>({ extensions: '', basePrice: '' })
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const openForm = (item: AdminPaperFilePriceDTO | null) => {
  editing.value = item
  form.value = item ? { extensions: item.extensions, basePrice: item.basePrice } : { extensions: '', basePrice: '' }
  showForm.value = true
}

const save = async () => {
  if (!(await formRef.value?.validate())?.valid) return
  saving.value = true
  try {
    const payload: ManagePaperFilePricePayload = {
      extensions: form.value.extensions.trim(),
      basePrice: Number(form.value.basePrice),
    }
    const response = editing.value
      ? await useApiService.put<ApiResult<number>>(`${BASE_URL}/${editing.value.id}`, payload)
      : await useApiService.post<ApiResult<number>>(BASE_URL, payload)
    if (response.succeeded) {
      $toast.success(editing.value ? 'Saved.' : 'Added.')
      showForm.value = false
      await fetch()
    }
    else {
      handleApiResponseError(response)
    }
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    saving.value = false
  }
}

// ---- Delete ----
const showDelete = ref(false)
const deleting = ref<AdminPaperFilePriceDTO | null>(null)

const openDelete = (item: AdminPaperFilePriceDTO) => {
  deleting.value = item
  showDelete.value = true
}

const remove = async () => {
  const item = deleting.value
  if (!item) return
  saving.value = true
  try {
    const response = await useApiService.remove<ApiResult<boolean>>(`${BASE_URL}/${item.id}`)
    if (response.succeeded) {
      $toast.success('Deleted.')
      showDelete.value = false
      await fetch()
    }
    else {
      handleApiResponseError(response)
    }
  }
  catch (err: unknown) {
    handleApiCatchError(err)
  }
  finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>

<style scoped>
.intro {
  max-width: 46rem;
}
</style>
