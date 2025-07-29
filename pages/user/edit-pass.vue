<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        class="text-left"
      >
        <span class="text-h4 teal--text">
          <v-icon color="teal"> mdi-key </v-icon>
          Change Password
        </span>
      </v-col>
    </v-row>
    <v-card class="mt-3 pb-10">
      <v-card-title>
        <p class="text-h5 text-md-h5">
          To edit the password, please enter the previous password and the new
          password
        </p>
      </v-card-title>
      <v-card-text>
        <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
        <form @submit.prevent="updatePass()">
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <!-- <validation-provider -->
              v-slot="{ errors }" name="oldpass" rules="required|min:4" >
              <v-text-field
                v-model="info.oldpass"
                :append-icon="show_oldpass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_oldpass ? 'text' : 'password'"
                dense
                label="Current password"
                :error-messages="errors"
                outlined
                @click:append="show_oldpass = !show_oldpass"
              />
              <!-- </validation-provider> -->
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <!-- <validation-provider -->
              v-slot="{ errors }" name="newpass" rules="required|min:4" >
              <v-text-field
                v-model="info.newpass"
                :append-icon="show_newpass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_newpass ? 'text' : 'password'"
                dense
                label="New password"
                :error-messages="errors"
                outlined
                @click:append="show_newpass = !show_newpass"
              />
              <!-- </validation-provider> -->
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <!-- <validation-provider
                  v-slot="{ errors }"
                  name="repeat_newpass"
                  rules="required|min:4|confirmed:newpass"
                > -->
              <v-text-field
                v-model="info.repeat_newpass"
                :append-icon="show_repeat_newpass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_repeat_newpass ? 'text' : 'password'"
                dense
                label="Repeat new password"
                :error-messages="errors"
                outlined
                @click:append="show_repeat_newpass = !show_repeat_newpass"
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// import { ValidationProvider, ValidationObserver } from "vee-validate";
import querystring from 'querystring'

export default {
  name: 'ChangePass',
  layout: 'dashboard_layout',
  // components: {
  //   ValidationObserver,
  //   ValidationProvider,
  // },
  data() {
    return {
      info: {
        oldpass: '',
        newpass: '',
        repeat_newpass: '',
      },
      update_loading: false,

      show_oldpass: false,
      show_newpass: false,
      show_repeat_newpass: false,
    }
  },
  head() {
    return {
      title: 'Change Password',
    }
  },
  role: 'user_type',
  methods: {
    updatePass() {
      this.update_loading = true

      this.$fetch
        .$put('/api/v1/users/password', querystring.stringify(this.info))
        .then((_response) => {
          this.$toast.success('Changed successfully')
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
