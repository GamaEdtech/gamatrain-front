<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        class="text-left"
      >
        <span class="text-h4 teal--text">
          <v-icon color="teal">
            mdi-account-cog-outline
          </v-icon>
          Settings
        </span>
      </v-col>
    </v-row>
    <v-card
      id="charge-wallet"
      class="mt-3 pb-10"
    >
      <v-card-text class="px-sm-8 px-md-4">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-switch
              v-model="push_notice"
              color="teal"
              label="Receive notifications (Push notifications)"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-switch
              v-model="direct_msg"
              color="teal"
              label="Receive direct message"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'UserSetting',
  layout: 'dashboard_layout',
  data() {
    return {
      push_notice: false,
      direct_msg: true,
    }
  },
  head() {
    return {
      title: 'Settings',
    }
  },
  methods: {

  },
}
</script>

<style>

</style>
