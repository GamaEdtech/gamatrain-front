<template>
  <div>
    <div class="d-flex info-itm ml-md-6">
      <div class="info-sign">
        <v-icon color="primary">
          mdi-web
        </v-icon>
      </div>
      <div class="info-data overflow-hidden">
        <a
          v-show="contentData.webSite && !generalDataEditMode.website"
          :href="normalizeURL(contentData.webSite)"
          target="_blank"
          class="blue--text overflow-hidden text-ellipsis flex-grow-1"
        >
          {{ contentData.webSite }}
        </a>
        <template v-if="contentData.webSite">
          <v-btn
            v-if="!generalDataEditMode.website"
            class="ml-2"
            icon
            color="blue-grey"
            variant="text"
            @click="handleEdit('website')"
          >
            <v-icon size="large">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-else>
          <span
            v-show="!(contentData.webSite || generalDataEditMode.website)"
            class="gtext-t4 primary-blue-500 align-self-center pointer"
            @click="handleEdit('website')"
          >
            Contribute
          </span>
        </template>
        <v-text-field
          v-if="generalDataEditMode.website"
          v-model="form.web"
          placeholder="Website"
          :rules="webUrlRule"
          variant="underlined"
        >
          <template #append-inner>
            <v-btn
              :loading="webSubmitLoader"
              color="success"
              variant="flat"
              size="x-small"
              icon
              @click="handleUpdate('website')"
            >
              <v-icon size="large">
                mdi-check
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="d-flex info-itm ml-md-6">
      <div class="info-sign">
        <v-icon color="primary">
          mdi-email
        </v-icon>
      </div>
      <div class="info-data">
        <a
          v-show="contentData.email && !generalDataEditMode.email"
          class="flex-grow-1"
          :href="`mailto:${contentData.email}`"
        >
          {{ contentData.email }}
        </a>
        <template v-if="contentData.email">
          <v-btn
            v-if="!generalDataEditMode.email"
            class="ml-2"
            icon
            color="blue-grey"
            variant="text"
            @click="handleEdit('email')"
          >
            <v-icon size="large">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-else>
          <span
            v-show="!(contentData.email || generalDataEditMode.email)"
            class="gtext-t4 primary-blue-500 align-self-center pointer"
            @click="handleEdit('email')"
          >
            Contribute
          </span>
        </template>
        <v-text-field
          v-if="generalDataEditMode.email"
          v-model="form.email"
          :rules="emailRule"
          placeholder="Email"
          variant="underlined"
        >
          <template #append-inner>
            <v-btn
              :loading="emailSubmitLoader"
              color="success"
              variant="flat"
              size="x-small"
              icon
              @click="handleUpdate('email')"
            >
              <v-icon size="large">
                mdi-check
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="d-flex info-itm ml-md-6">
      <div class="info-sign">
        <v-icon color="primary">
          mdi-phone
        </v-icon>
      </div>
      <div class="info-data">
        <a
          v-show="contentData.phoneNumber && !generalDataEditMode.phone1"
          class="flex-grow-1"
          :href="`tel: ${contentData.phoneNumber}`"
        >
          {{ contentData.phoneNumber }}
        </a>
        <template v-if="contentData.phoneNumber">
          <v-btn
            v-if="!generalDataEditMode.phone1"
            class="ml-2"
            icon
            color="blue-grey"
            variant="text"
            @click="handleEdit('phone')"
          >
            <v-icon size="large">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-else>
          <span
            v-show="!(contentData.phoneNumber || generalDataEditMode.phone1)"
            class="gtext-t4 primary-blue-500 align-self-center pointer"
            @click="handleEdit('phone')"
          >
            Contribute
          </span>
        </template>
        <v-text-field
          v-if="generalDataEditMode.phone1"
          v-model="form.phone"
          :rules="phoneRule"
          placeholder="Phone"
          variant="underlined"
        >
          <template #append-inner>
            <v-btn
              :loading="phoneSubmitLoader"
              color="success"
              variant="flat"
              size="x-small"
              icon
              @click="handleUpdate('phone')"
            >
              <v-icon size="large">
                mdi-check
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="d-flex info-itm ml-md-6">
      <div class="info-sign">
        <v-icon
          size="20"
          color="primary"
        >
          mdi-map-marker
        </v-icon>
      </div>
      <div class="info-data info-data-address">
        <span
          v-show="contentData.address && !generalDataEditMode.address"
          class="flex-grow-1"
        >{{ contentData.address }}</span>
        <template v-if="contentData.address">
          <v-btn
            v-if="!generalDataEditMode.address"
            class="ml-2"
            icon
            color="blue-grey"
            variant="text"
            @click="handleEdit('address')"
          >
            <v-icon size="large">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-else>
          <span
            v-show="!(contentData.address || generalDataEditMode.address)"
            class="gtext-t4 primary-blue-500 align-self-center pointer"
            @click="handleEdit('address')"
          >
            Contribute
          </span>
        </template>
        <v-text-field
          v-if="generalDataEditMode.address"
          v-model="form.address"
          placeholder="Enter address"
          :rules="addressRule"
          variant="underlined"
        >
          <template #append-inner>
            <v-btn
              :loading="addressSubmitLoader"
              color="success"
              variant="flat"
              size="x-small"
              icon
              @click="handleUpdate('address')"
            >
              <v-icon size="large">
                mdi-check
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, required: true },
})
const contentData = ref(props.content)
const emit = defineEmits(['edit', 'update'])
const nuxtApp = useNuxtApp()
const route = useRoute()
const generalDataEditMode = reactive({
  website: false,
  email: false,
  phone1: false,
  address: false,
})
const form = reactive({
  web: '',
  email: '',
  phone: '',
  address: '',
})
const webSubmitLoader = ref(false)
const emailSubmitLoader = ref(false)
const phoneSubmitLoader = ref(false)
const addressSubmitLoader = ref(false)
const webUrlRule = [
  v =>
    !v
    || /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
      v,
    )
    || 'Please enter a valid URL',
  v => !v || v.length <= 255 || 'URL must be less than 255 characters',
]
const emailRule = [
  v => !!v || 'Email is required',
  v =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    || 'Please enter a valid email address',
]
const phoneRule = [v => !!v || 'Phone number is required']
const addressRule = [v => !!v || 'Address is required']

function normalizeURL(url) {
  if (!url) return ''
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url
  }
  return url
}
function handleEdit(field) {
  if (field === 'website') {
    form.web = contentData.value.webSite || ''
    generalDataEditMode.website = true
  }
  else if (field === 'email') {
    form.email = contentData.value.email || ''
    generalDataEditMode.email = true
  }
  else if (field === 'phone') {
    form.phone = contentData.value.phoneNumber || ''
    generalDataEditMode.phone1 = true
  }
  else if (field === 'address') {
    form.address = contentData.value.address || ''
    generalDataEditMode.address = true
  }
  emit('edit', field)
}
function isValidUrl(url) {
  try {
    new URL(url)
    return /^https?:\/\//.test(url)
  }
  catch {
    return false
  }
}
function isValidEmail(email) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  catch {
    return false
  }
}
function isRequired(value) {
  try {
    return !!value.trim()
  }
  catch {
    return false
  }
}
function handleUpdate(value) {
  let formData = {}
  if (value == 'website') {
    if (!isValidUrl(form.web)) {
      nuxtApp.$toast?.error('Please enter a valid website URL')
      return
    }
    generalDataEditMode.website = false
    formData = { webSite: form.web ?? null }
  }
  if (value == 'email') {
    if (!isValidEmail(form.email)) {
      nuxtApp.$toast?.error('Please enter a valid Email')
      return
    }
    generalDataEditMode.email = false
    formData = { email: form.email ?? null }
  }
  if (value == 'phone') {
    if (!isRequired(form.phone)) {
      nuxtApp.$toast?.error('Please enter a valid Phone Number')
      return
    }
    generalDataEditMode.phone1 = false
    formData = { phoneNumber: form.phone ?? null }
  }
  if (value == 'address') {
    if (!isRequired(form.address)) {
      nuxtApp.$toast?.error(
        'Please enter a valid address (minimum 10 characters)',
      )
      return
    }
    generalDataEditMode.address = false
    formData = { address: form.address ?? null }
  }

  const loaderRef = {
    website: webSubmitLoader,
    email: emailSubmitLoader,
    phone: phoneSubmitLoader,
    address: addressSubmitLoader,
  }[value]
  if (loaderRef) loaderRef.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Your contribution has been successfully submitted',
        )
        switch (value) {
          case 'name':
            contentData.value.name = form.name
            break
          case 'website':
            contentData.value.webSite = form.web
            break
          case 'phone':
            contentData.value.phoneNumber = form.phone
            break
          case 'address':
            contentData.value.address = form.address
            break
          case 'email':
            contentData.value.email = form.email
            break
          default:
            break
        }

        emit('update', form.value)
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      console.log('err', err)

      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to contribute')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      form.web = null
      form.email = null
      form.phone = null
      form.address = null
      webSubmitLoader.value = false
      emailSubmitLoader.value = false
      phoneSubmitLoader.value = false
      addressSubmitLoader.value = false
    })
}
</script>

<style scoped>
.info-itm {
  margin-bottom: 0.8rem;

  .info-sign {
    width: 5.6rem;
    min-width: 5.6rem;
    height: 5.6rem;
    border-radius: 0.6rem;
    border: 1px solid var(--Primary-Yellow-Gama-50, #fff8ed);
    background: #fff;
    box-shadow: 2px 6px 24px 0px rgba(16, 24, 40, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-data {
    width: 100%;
    min-height: 5.6rem;
    max-height: 5.6rem;
    border-radius: 0.6rem;
    border: 1px solid var(--Primary-Yellow-Gama-50, #fff8ed);
    background: var(--White, #fff);
    box-shadow: 2px 6px 24px 0px rgba(16, 24, 40, 0.05);
    display: flex;
    justify-content: left;
    padding: 1.5rem 1.6rem 1.5rem 1.6rem;
    align-items: center;
    margin-left: 0.4rem;
  }

  .info-data-address {
    max-height: 12rem;
  }
}
</style>
