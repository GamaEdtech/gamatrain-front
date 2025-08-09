<!-- in refactor proccess -->
<template>
  <!-- Crash report dialog -->
  <v-dialog
    v-model="dialog"
    max-width="800"
  >
    <v-card title="Crash report">
      <v-form
        ref="form"
        v-model="isValid"
        @submit.prevent="sendReport"
      >
        <v-card-text>
          <v-radio-group
            v-model="form.report_type"
            label="Issue type"
            :rules="reportTypeRules"
            required
          >
            <v-radio
              v-for="(type, index) in report_type_list"
              :key="index"
              :label="type.label"
              :value="type.value"
            />
          </v-radio-group>

          <v-textarea
            v-model="form.message"
            label="Description"
            variant="outlined"
            :rules="messageRules"
            hint="You must enter at least 25 characters"
            persistent-hint
            required
            counter="500"
            rows="4"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="dialog = false"
          >
            Discard
          </v-btn>

          <v-btn
            color="green-darken-1"
            variant="outlined"
            :disabled="!isValid"
            :loading="loading"
            type="submit"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <!-- End crash report dialog -->
</template>

<script>
export default {
  name: 'CrashReport',
  props: {
    reportTypeList: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      isValid: false,
      form: {
        id: this.$route.params.id,
        type: '',
        report_type: '',
        message: '',
      },
      reportTypeRules: [v => !!v || 'Please select an issue type'],
      messageRules: [
        v => !!v || 'Description is required',
        v =>
          (v && v.length >= 25) || 'Description must be at least 25 characters',
        v =>
          (v && v.length <= 500)
          || 'Description must be less than 500 characters',
      ],
    }
  },
  methods: {
    async sendReport() {
      const isValid = await this.$refs.form.validate()

      if (!isValid) return

      this.loading = true
      // Arrange to form data
      const formData = new FormData()
      for (const key in this.form) {
        formData.append(key, this.form[key])
      }

      try {
        await $fetch('/api/v1/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.urlencodeFormData(formData),
        })

        this.$toast.success('Report sent successfully')
        this.dialog = false
        this.$refs.form.reset()
      }
      catch (err) {
        if (err.response?.status == 403)
          this.$router.push({ query: { auth_form: 'login' } })
        else if (err.response?.status == 400)
          this.$toast.error(err.response.data.message)
      }
      finally {
        this.loading = false
      }
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

<style scoped>
.v-radio-group {
  margin-bottom: 20px;
}
</style>
