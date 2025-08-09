<template>
  <v-container>
    <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
    <form @submit.prevent="updateInfo()">
      <v-row class="mt-8">
        <v-col cols="12">
          <p class="text-h4 text-md-h3">
            Personal info
          </p>
          <v-divider class="my-4" />
          <p class="text-h5 text-md-h4">
            So that we can remember you more easily :)
          </p>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <!-- <validation-provider
              v-slot="{ errors }"
              name="first_name"
              rules="required"
            > -->
          <v-text-field
            v-model="info.first_name"
            dense
            label="First name"
            :error-messages="errors"
            outlined
          />
          <!-- </validation-provider> -->
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <!-- <validation-provider
              v-slot="{ errors }"
              name="last_name"
              rules="required"
            > -->
          <v-text-field
            v-model="info.last_name"
            dense
            label="Last name"
            :error-messages="errors"
            outlined
          />
          <!-- </validation-provider> -->
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <!-- <validation-provider
              v-slot="{ errors }"
              name="sex"
              rules="required"
            > -->
          <v-select
            v-model="info.sex"
            dense
            :items="sex_list"
            label="Gender"
            item-text="title"
            item-value="id"
            :error-messages="errors"
            outlined
          />
          <!-- </validation-provider> -->
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-btn
            type="submit"
            block
            :loading="update_loading"
            :disabled="invalid"
            outlined
            class="green--text"
          >
            Update
          </v-btn>
        </v-col>
      </v-row>
    </form>
    <!-- </validation-observer> -->
  </v-container>
</template>

<script>
// import { ValidationProvider, ValidationObserver } from "vee-validate";
import querystring from 'querystring'

export default {
  name: 'UserInfo',
  layout: 'dashboard_layout',
  role: 'user_type',
  // components: {
  //   ValidationObserver,
  //   ValidationProvider,
  // },
  data() {
    return {
      info: {
        first_name: this.$auth.user?.first_name,
        last_name: this.$auth.user.last_name,
        sex: this.$auth.user.sex,
      },
      sex_list: [
        { id: 1, title: 'Male' },
        { id: 2, title: 'Female' },
      ],
      update_loading: false,
    }
  },
  methods: {
    updateInfo() {
      this.update_loading = true

      this.$fetch
        .$post('/api/v1/users/info', querystring.stringify(this.info))
        .then((_response) => {
          const updatedData = {
            avatar: this.$auth.user.avatar,
            credit: this.$auth.user.credit,
            email: this.$auth.user.email,
            first_name: this.info.first_name,
            last_name: this.info.last_name,
            group_id: this.$auth.user.group_id,
            phone: this.$auth.user.phone,
            sex: this.info.sex.toString(),
          }
          // Update current user data
          this.$auth.setUser(updatedData)

          this.$router.push({
            path: '/user',
          })
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message)
        })
        .finally(() => {
          this.update_loading = false
        })
    },
  },
}
</script>

<style scoped></style>
