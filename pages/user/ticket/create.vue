<template>
  <v-row>
    <v-col
      cols="12"
      class="px-0 px-sm-2"
    >
      <v-row>
        <v-col
          cols="12"
          class="pl-5 text-h4 teal--text"
        >
          <span class="fa-solid fa-envelope" />
          <span> New message </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card
              flat
              class="mt-3"
            >
              <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
              <form @submit.prevent="submitContent">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-autocomplete
                      v-model="form.type"
                      dense
                      :items="subject_list"
                      :error-messages="errors"
                      item-text="title"
                      item-value="id"
                      label="Subject"
                      outlined
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <!-- <validation-provider
                        v-slot="{ errors }"
                        name="title"
                        rules="required|min:3"
                      > -->
                    <v-text-field
                      v-model="form.title"
                      dense
                      :error-messages="errors"
                      label="Title"
                      outlined
                    />
                    <!-- </validation-provider> -->
                  </v-col>

                  <v-col
                    cols="12"
                    md="12"
                  >
                    <!-- <validation-provider
                        v-slot="{ errors }"
                        name="text"
                        rules="required|min:10"
                      > -->
                    <v-textarea
                      v-model="form.message"
                      dense
                      :error-messages="errors"
                      label="Message text"
                      outlined
                    />
                    <!-- </validation-provider> -->
                    <nuxt-link to="/formula-help">
                      <strong class="pointer teal--text text-h6">
                        <span class="fa-solid fa-link" />
                        Formula writing guide
                      </strong>
                    </nuxt-link>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <!-- <validation-provider
                        v-slot="{ validate, errors }"
                        rules="mimes:image/png,image/jpg,image/jpeg,image/gif,video/mp4,audio/mp3,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats,officedocument.presentationml.presentation"
                        ref="file_provider"
                        name="file"
                      > -->
                    <v-file-input
                      v-model="file"
                      dense
                      :error-messages="errors"
                      label="Attach file"
                      accept=".jpg,.jpeg,.png,.gif,.docx,.pptx,.pdf,.mp4,.mp3"
                      :prepend-icon="null"
                      color="red"
                      prepend-inner-icon="mdi-file"
                      append-icon="mdi-folder-open"
                      outlined
                      @change="uploadFile('file', $event), validate"
                    />
                    <!-- </validation-provider> -->
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    class="pb-0"
                  >
                    <v-btn
                      type="submit"
                      lg
                      color="success"
                      :loading="loading.form"
                      :disabled="invalid"
                      block
                    >
                      Submit
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-btn
                      lg
                      outlined
                      color="error"
                      to="/user/ticket"
                      block
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
              <!-- </validation-observer> -->
            </v-card>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// import { ValidationObserver, ValidationProvider } from "vee-validate";
// import TopicSelector from '@/components/form/topic-selector'

export default {
  name: 'CreateTicket',
  components: {
    // Remove TopicSelector since it's not used
  },
  layout: 'dashboard_layout',
  data() {
    return {
      form: {
        title: '',
        message: '',
        type: '',
        ticket_type: 8818,
        file: '',
      },
      file: null,
      subject_list: [],

      // Handle loading object
      loading: {
        file: false, // Upload file
        form: false, // Submit multimedia form
      },
    }
  },
  head() {
    return {
      title: 'Ticket submission form',
    }
  },
  mounted() {
    this.getTypeList('ticket_type')
  },
  methods: {
    getTypeList(type, _parent = '') {
      const params = {
        type: type,
      }

      this.$fetch
        .$get('/api/v1/types/list', {
          params,
        })
        .then((res) => {
          this.subject_list = res.data
        })
        .catch((err) => {
          this.$toast.error(err)
        })
    },

    submitContent() {
      this.loading.form = true
      // Arrange to form data
      const formData = new FormData()
      for (const key in this.form) {
        formData.append(key, this.form[key])
      }

      this.$fetch
        .$post('/api/v1/tickets', this.urlencodeFormData(formData), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((_response) => {
          this.$toast.success('Submit successfully')
          this.$router.push({
            path: '/user/ticket',
          })
        })
        .catch((err) => {
          if (err.response.status == 403)
            this.$router.push({ query: { auth_form: 'login' } })
          else if (err.response.status == 400)
            this.$toast.error(err.response.data.message)
        })
        .finally(() => {
          this.loading.form = false
        })
    },

    async uploadFile(file_name, value) {
      if (!value) return

      const { valid } = await this.$refs.file_provider.validate(value)

      if (valid) {
        this.loading.file = true
        if (!value)
          // Check empty request
          return
        const formData = new FormData()
        formData.append('file', value)

        this.$fetch
          .$post('/api/v1/upload', formData, {
            headers: {
              'accept': '*/*',
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            this.form.file = response.data[0].file.name
          })
          .catch((_err) => {
            this.$toast.error('An error occurred')
          })
          .finally(() => {
            this.loading.file = false
          })
      }

      console.log('Pass4')

      // }
    },

    // Convert form data from multipart to urlencode
    urlencodeFormData(fd) {
      let s = ''

      for (const pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
          s
            += (s ? '&' : '') + this.encode(pair[0]) + '=' + this.encode(pair[1])
        }
      }
      return s
    },
    encode(s) {
      return encodeURIComponent(s).replace(/%20/g, '+')
    },
    // End convert form data from multipart to urlencode
  },
}
</script>

<style>
.submission-notice {
  line-height: 2rem;
  background-color: #ffefe5 !important;
}

.submission-notice .v-alert__icon.v-icon {
  color: white !important;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: #ff6600;
}

.notice_item {
  font-size: 1.4rem;
  line-height: 2.2rem;
  list-style-type: none;
  color: black;
  padding-left: 0 !important;
}

.notice_item li {
  margin-bottom: 1rem;
}

.notice_item li:before {
  font-family: "Font Awesome 5 Free";
  font-size: 2rem;
  color: #ffc700ff;
  content: "\f0a4";
  font-weight: 900;
}

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
