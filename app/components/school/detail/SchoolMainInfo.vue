<template>
  <v-sheet
    tag="section"
    border
    rounded="lg"
    class="contact-card d-flex flex-column ga-1 pa-4"
    aria-labelledby="contact-title"
  >
    <h2
      id="contact-title"
      class="section-title"
    >
      Contact
    </h2>

    <dl
      v-if="rows.length"
      class="rows"
    >
      <div
        v-for="row in rows"
        :key="row.key"
        class="row"
      >
        <dt>
          <v-icon
            size="20"
            aria-hidden="true"
          >
            {{ row.icon }}
          </v-icon>
          <span>{{ row.label }}</span>
        </dt>
        <dd>
          <form
            v-if="editing === row.key"
            class="edit-form"
            @submit.prevent="submit"
          >
            <template v-if="row.key === 'phone'">
              <div
                v-for="(_, index) in form.phones"
                :key="index"
                class="phone-input"
              >
                <v-text-field
                  v-model="form.phones[index]"
                  :label="`Phone ${form.phones.length > 1 ? index + 1 : ''}`"
                  variant="outlined"
                  density="compact"
                  type="tel"
                  :autofocus="index === 0"
                  hide-details
                />
                <v-btn
                  v-if="form.phones.length > 1"
                  icon
                  size="small"
                  variant="text"
                  :aria-label="`Remove phone ${index + 1}`"
                  @click="form.phones.splice(index, 1)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-btn
                v-if="form.phones.length < maxPhoneCount"
                variant="text"
                color="info"
                size="small"
                prepend-icon="mdi-plus"
                class="text-none gtext-t5 align-self-start px-1"
                @click="form.phones.push('')"
              >
                Add another number
              </v-btn>
            </template>
            <v-text-field
              v-else
              v-model="form[row.key]"
              :label="row.label"
              :type="row.key === 'email' ? 'email' : 'text'"
              variant="outlined"
              density="compact"
              autofocus
              hide-details
            />
            <div class="form-buttons">
              <v-btn
                type="submit"
                :loading="saving"
                color="primary"
                variant="flat"
                size="small"
                class="text-none gtext-t5"
              >
                Submit
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                class="text-none gtext-t5"
                @click="editing = null"
              >
                Cancel
              </v-btn>
            </div>
          </form>
          <template v-else>
            <div class="values">
              <template
                v-for="value in row.values"
                :key="value"
              >
                <a
                  v-if="row.href?.(value)"
                  :href="row.href(value)"
                  :target="row.key === 'website' ? '_blank' : undefined"
                  :rel="row.key === 'website' ? 'noopener nofollow' : undefined"
                >{{ value }}</a>
                <span v-else>{{ value }}</span>
              </template>
            </div>
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="grey500"
              :aria-label="`Edit ${row.label.toLowerCase()}`"
              @click="startEdit(row.key)"
            >
              <v-icon size="18">
                mdi-pencil-outline
              </v-icon>
            </v-btn>
          </template>
        </dd>
      </div>
    </dl>

    <v-btn
      variant="text"
      color="grey500"
      size="small"
      prepend-icon="mdi-flag-outline"
      class="text-none gtext-t5 align-self-start px-1 mt-1"
      @click="emit('report')"
    >
      Report a problem with this page
    </v-btn>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, required: true },
})
const emit = defineEmits(['update', 'report'])
const nuxtApp = useNuxtApp()
const route = useRoute()
const { requireSignIn } = useContributeGate()

const maxPhoneCount = 3
const editing = ref(null)
const saving = ref(false)
const form = reactive({ website: '', email: '', address: '', phones: [''] })

const phones = computed(() =>
  (props.content.phoneNumber || '').split('/').map(p => p.trim()).filter(Boolean))

// Only details the school has are listed; a missing one is added from the "Fill in the gaps" card, which
// opens its row here. A website that isn't a URL ("government") is shown as text, not as a broken link.
const rows = computed(() => [
  { key: 'phone', label: 'Phone', icon: 'mdi-phone-outline', values: phones.value, href: v => `tel:${v}` },
  { key: 'website', label: 'Website', icon: 'mdi-web', values: props.content.webSite ? [props.content.webSite] : [], href: schoolWebsiteUrl },
  { key: 'email', label: 'Email', icon: 'mdi-email-outline', values: props.content.email ? [props.content.email] : [], href: v => `mailto:${v}` },
  { key: 'address', label: 'Address', icon: 'mdi-map-marker-outline', values: props.content.address ? [props.content.address] : [] },
].filter(row => row.values.length || editing.value === row.key))

function startEdit(field) {
  if (!requireSignIn()) return
  form.website = props.content.webSite || ''
  form.email = props.content.email || ''
  form.address = props.content.address || ''
  form.phones = phones.value.length ? [...phones.value] : ['']
  editing.value = field
}

const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Builds the contribution body and the matching field on the school, or returns an error message.
function buildPayload(field) {
  if (field === 'website') {
    const value = form.website.trim()
    if (value && !urlPattern.test(value)) return { error: 'Please enter a valid website URL' }
    return { body: { webSite: value || null }, update: { webSite: value } }
  }
  if (field === 'email') {
    const value = form.email.trim()
    if (value && !emailPattern.test(value)) return { error: 'Please enter a valid Email' }
    return { body: { email: value || null }, update: { email: value } }
  }
  if (field === 'phone') {
    const value = form.phones.map(p => p.trim()).filter(Boolean).join('/')
    return { body: { phoneNumber: value || null }, update: { phoneNumber: value } }
  }
  const value = form.address.trim()
  return { body: { address: value || null }, update: { address: value } }
}

function submit() {
  const { body, update, error } = buildPayload(editing.value)
  if (error) {
    nuxtApp.$toast?.error(error)
    return
  }
  saving.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, body)
    .then((response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success('Thank you! Your contribution has been submitted and is pending review.')
        emit('update', update)
        editing.value = null
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to contribute')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      saving.value = false
    })
}

defineExpose({ startEdit })
</script>

<style scoped>
.contact-card {
  border-color: rgb(var(--v-theme-grey200)) !important;
}

.rows {
  margin: 0;
}

.row {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 10px 0;
  border-bottom: 1px solid rgb(var(--v-theme-grey100));
}

.row:last-child {
  border-bottom: 0;
}

dt {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  font-size: 14px;
  color: rgb(var(--v-theme-grey500));
}

dt :deep(.v-icon) {
  color: rgb(var(--v-theme-grey400));
}

dd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4px;
  min-height: 28px;
  margin: 0;
  font-size: 14px;
  color: rgb(var(--v-theme-grey800));
}

.values {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding-top: 4px;
  overflow-wrap: anywhere;
}

.values a {
  color: rgb(var(--v-theme-info));
  text-decoration: none;
}

.values a:hover,
.values a:focus-visible {
  text-decoration: underline;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.phone-input {
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-buttons {
  display: flex;
  gap: 4px;
}
</style>
