<template>
  <div class="w-100 h-100 d-flex flex-column align-start justify-start">
    <div class="w-100 d-flex flex-wrap align-center justify-space-between ga-2">
      <p class="text-body-2 text-grey600 ma-0 intro">
        A campaign gives new subscribers a discount on their first payment and shows its theme on the home page and the
        plans dialogs, between its dates. New campaigns start disabled: enable one once and it starts and stops by itself.
      </p>
      <v-btn
        color="primary"
        rounded="pill"
        prepend-icon="md:add"
        flat
        @click="openForm(null)"
      >
        New campaign
      </v-btn>
    </div>

    <common-data-table
      v-model:page="page"
      v-model:page-size="pageSize"
      :headers="headers"
      :items="items"
      :page-count="Math.ceil(total / pageSize)"
      :total-count="total"
      :page-size-options="pageSizes"
      :loading="loading"
      item-label="Campaigns"
      class="mt-4"
      @update:page="fetch"
      @update:page-size="search"
    />

    <!-- Create / edit. -->
    <v-dialog
      v-model="showForm"
      max-width="560"
    >
      <v-card
        rounded="xl"
        class="pa-4"
      >
        <v-card-title class="text-h6">
          {{ editing ? 'Edit campaign' : 'New campaign' }}
        </v-card-title>
        <v-card-text>
          <v-form
            ref="formRef"
            class="d-flex flex-column ga-3"
            @submit.prevent="save"
          >
            <v-text-field
              v-model="form.title"
              label="Title (shown to users)"
              placeholder="Black Friday"
              variant="outlined"
              counter="60"
              maxlength="60"
              :rules="[v => !!v?.trim() || 'Required']"
            />
            <v-select
              v-model="form.theme"
              :items="THEMES"
              item-title="title"
              item-value="value"
              label="Theme"
              variant="outlined"
            />
            <v-text-field
              v-model.number="form.discountPercent"
              label="Discount on the first payment (%)"
              type="number"
              min="1"
              max="90"
              variant="outlined"
              :rules="[v => (v >= 1 && v <= 90) || '1 to 90']"
            />
            <div class="d-flex flex-wrap ga-3">
              <common-date-time-field
                v-model="form.startsAt"
                label="Starts"
                :hint="timeZone"
                class="date-field"
                :rules="[(v: string) => !!v || 'Required']"
              />
              <common-date-time-field
                v-model="form.endsAt"
                label="Ends"
                :hint="timeZone"
                class="date-field"
                :rules="[(v: string) => !!v || 'Required', (v: string) => !form.startsAt || v > form.startsAt || 'After the start']"
              />
            </div>
            <v-switch
              v-model="form.repeatsYearly"
              color="primary"
              hide-details
              inset
              label="Repeat every year on the same days"
            />
            <v-textarea
              v-model="form.headline"
              label="Hero line (optional, the theme's own text when empty)"
              variant="outlined"
              rows="2"
              counter="200"
              maxlength="200"
            />
            <admin-common-two-factor-code-field
              v-if="needsCodeToSave"
              v-model="code"
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

    <!-- Enable (needs the authenticator code) / disable (the emergency stop) / delete. -->
    <v-dialog
      v-model="showConfirm"
      max-width="480"
    >
      <v-card
        rounded="xl"
        class="pa-4"
      >
        <v-card-title class="text-h6">
          {{ confirmTitle }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-grey700 mb-0">
            {{ confirmText }}
          </p>
          <admin-common-two-factor-code-field
            v-if="confirmAction === 'enable'"
            v-model="code"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showConfirm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            :color="confirmAction === 'enable' ? 'primary' : 'error'"
            variant="flat"
            :loading="saving"
            :disabled="confirmAction === 'enable' && !/^\d{6}$/.test(code)"
            @click="confirm"
          >
            {{ confirmButton }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { AdminCampaignDTO, ApiResult, CampaignTheme, DataTableHeader, ManageCampaignPayload } from '@/types'
import { CAMPAIGN_THEMES, campaignThemeName } from '@/constants'

// Sale campaigns (gamatrain-back api/v1/admin/campaigns, Admin only): create, edit, enable once with the authenticator
// code, disable at any time. See docs/business/campaigns.md in gamatrain-back.
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Campaigns' })

const BASE_URL = '/api/v2/admin/campaigns'
const THEMES = (Object.keys(CAMPAIGN_THEMES) as CampaignTheme[]).map(value => ({ value, title: value === 'Generic' ? 'Generic (any event)' : CAMPAIGN_THEMES[value].label }))
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
const { $toast } = useNuxtApp()

const formatDate = (value: string | null) => (value
  ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  : '-')

const statusOf = (item: AdminCampaignDTO) => {
  if (!item.isEnabled) return 'Disabled'
  if (item.isLive) return 'Live'
  return item.currentStartsAt ? 'Scheduled' : 'Ended'
}

const headers: DataTableHeader<AdminCampaignDTO>[] = [
  { title: 'Title', key: 'title', sortable: false, width: '14vw' },
  { title: 'Theme', key: 'theme', sortable: false, width: '8vw', getText: item => CAMPAIGN_THEMES[campaignThemeName(item.theme)].label },
  { title: 'Discount', key: 'discountPercent', sortable: false, width: '6vw', getText: item => `${item.discountPercent}%` },
  {
    title: 'Runs',
    key: 'currentStartsAt',
    sortable: false,
    width: '20vw',
    getText: item => (item.currentStartsAt
      ? `${formatDate(item.currentStartsAt)} → ${formatDate(item.currentEndsAt)}`
      : `${formatDate(item.startsAt)} → ${formatDate(item.endsAt)}`) + (item.repeatsYearly ? ' · every year' : ''),
  },
  {
    title: 'Status',
    key: 'isEnabled',
    sortable: false,
    width: '7vw',
    type: 'chip',
    getText: statusOf,
    getChipColor: item => ({ Live: 'success', Scheduled: 'info', Ended: 'grey', Disabled: 'grey' } as Record<string, string>)[statusOf(item)] ?? 'grey',
  },
  { title: 'Paid', key: 'paidPaymentCount', sortable: false, width: '5vw' },
  {
    title: 'Action',
    key: 'Action',
    sortable: false,
    width: '9vw',
    type: 'actions',
    actions: [
      { icon: 'md:edit', tooltip: 'Edit', onClick: item => openForm(item) },
      { icon: 'md:play_circle', tooltip: 'Enable', show: item => !item.isEnabled, onClick: item => openConfirm(item, 'enable') },
      { icon: 'md:stop_circle', tooltip: 'Disable', show: item => item.isEnabled, onClick: item => openConfirm(item, 'disable') },
      { icon: 'md:delete_outline', tooltip: 'Delete', show: item => item.paidPaymentCount === 0, onClick: item => openConfirm(item, 'delete') },
    ],
  },
]

const items = ref<AdminCampaignDTO[]>([])
const total = ref(0)
const loading = ref(false)
const saving = ref(false)
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [{ label: '20 Rows', value: 20 }, { label: '50 Rows', value: 50 }]

const fetch = async () => {
  loading.value = true
  try {
    const response = await useApiService.get<ApiResult<{ total: number, items: AdminCampaignDTO[] }>>(BASE_URL, { page: page.value, pageSize: pageSize.value })
    if (response.succeeded && response.data) {
      items.value = response.data.items
      total.value = response.data.total
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

const search = async () => {
  page.value = 1
  await fetch()
}

// ---- Create / edit ----
const toLocalInput = (iso: string) => {
  const date = new Date(iso)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

const emptyForm = () => ({ title: '', headline: '', theme: 'BlackFriday' as CampaignTheme, discountPercent: 30, startsAt: '', endsAt: '', repeatsYearly: false })
const showForm = ref(false)
const editing = ref<AdminCampaignDTO | null>(null)
const form = ref(emptyForm())
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const code = ref('')

const openForm = (item: AdminCampaignDTO | null) => {
  editing.value = item
  code.value = ''
  form.value = item
    ? {
        title: item.title,
        headline: item.headline ?? '',
        theme: campaignThemeName(item.theme),
        discountPercent: item.discountPercent,
        startsAt: toLocalInput(item.startsAt),
        endsAt: toLocalInput(item.endsAt),
        repeatsYearly: item.repeatsYearly,
      }
    : emptyForm()
  showForm.value = true
}

// Changing what an enabled campaign gives away needs the authenticator code, like enabling it.
const needsCodeToSave = computed(() => {
  const item = editing.value
  if (!item?.isEnabled) return false
  return item.discountPercent !== form.value.discountPercent
    || toLocalInput(item.startsAt) !== form.value.startsAt
    || toLocalInput(item.endsAt) !== form.value.endsAt
    || item.repeatsYearly !== form.value.repeatsYearly
})

const save = async () => {
  if (!(await formRef.value?.validate())?.valid) return
  saving.value = true
  try {
    const payload: ManageCampaignPayload = {
      title: form.value.title.trim(),
      headline: form.value.headline.trim() || null,
      theme: form.value.theme,
      discountPercent: Number(form.value.discountPercent),
      startsAt: new Date(form.value.startsAt).toISOString(),
      endsAt: new Date(form.value.endsAt).toISOString(),
      repeatsYearly: form.value.repeatsYearly,
      twoFactorCode: needsCodeToSave.value ? code.value : undefined,
    }
    const response = editing.value
      ? await useApiService.put<ApiResult<number>>(`${BASE_URL}/${editing.value.id}`, payload)
      : await useApiService.post<ApiResult<number>>(BASE_URL, payload)
    if (response.succeeded) {
      $toast.success(editing.value ? 'Saved.' : 'Created. Enable it when it\'s ready.')
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

// ---- Enable / disable / delete ----
type ConfirmAction = 'enable' | 'disable' | 'delete'
const showConfirm = ref(false)
const confirming = ref<AdminCampaignDTO | null>(null)
const confirmAction = ref<ConfirmAction>('enable')

const confirmTitle = computed(() => ({ enable: 'Enable this campaign?', disable: 'Disable this campaign?', delete: 'Delete this campaign?' })[confirmAction.value])
const confirmButton = computed(() => ({ enable: 'Enable', disable: 'Disable', delete: 'Delete' })[confirmAction.value])
const confirmText = computed(() => {
  const item = confirming.value
  if (!item) return ''
  switch (confirmAction.value) {
    case 'enable':
      return `"${item.title}" will give ${item.discountPercent}% off every new subscriber's first payment between its dates`
        + `${item.repeatsYearly ? ', every year' : ''}, and show its theme on the site. It starts and stops by itself.`
    case 'disable':
      return `"${item.title}" stops at once: no more discount and no theme.`
    default:
      return `"${item.title}" will be removed.`
  }
})

const openConfirm = (item: AdminCampaignDTO, action: ConfirmAction) => {
  confirming.value = item
  confirmAction.value = action
  code.value = ''
  showConfirm.value = true
}

const confirm = async () => {
  const item = confirming.value
  if (!item) return
  saving.value = true
  try {
    const response = confirmAction.value === 'delete'
      ? await useApiService.remove<ApiResult<boolean>>(`${BASE_URL}/${item.id}`)
      : await useApiService.put<ApiResult<boolean>>(`${BASE_URL}/${item.id}/enabled`, { enabled: confirmAction.value === 'enable', twoFactorCode: code.value || null })
    if (response.succeeded) {
      $toast.success(({ enable: 'Enabled.', disable: 'Disabled.', delete: 'Deleted.' })[confirmAction.value])
      showConfirm.value = false
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

.date-field {
  flex: 1 1 14rem;
}
</style>
