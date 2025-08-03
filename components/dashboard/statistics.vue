<template>
  <v-card
    color="#F8FAFB"
    class="mt-3 dashboard-statistic"
    flat
  >
    <v-card-text class="px-0 px-sm-6 px-md-2">
      <v-row class="text-center">
        <v-col
          md="2"
          class="d-none d-md-block"
        />
        <v-col
          cols="12"
          md="8"
        >
          <v-row>
            <v-col
              :cols="userType === '5' ? 3 : 4"
              class="d-md-flex"
            >
              <div
                class="mt-4 mr-2"
                color="#D4F4EE"
                fab
                x-large
              >
                <i
                  class="fa-solid fa-wallet"
                  style="color: #00d2ae"
                />
              </div>
              <div class="pa-3">
                <p class="text-h6">
                  Wallet
                </p>
                <p class="text-h5">
                  <strong> ${{ formatNumber(user?.credit) }} </strong>
                </p>
              </div>
            </v-col>
            <v-col
              :cols="userType === '5' ? 3 : 4"
              class="d-md-flex"
            >
              <div
                class="mt-4 mr-2"
                color="rgba(142, 11, 228, 0.1)"
                fab
                x-large
              >
                <i
                  class="fa-regular fa-envelope"
                  style="color: #8e0be4"
                />
              </div>
              <NuxtLink
                to="/user/ticket"
                class="pa-3"
              >
                <p class="text-h6">Msg</p>
                <p class="text-h5">
                  <strong>
                    {{ userInfo?.unreadMessages?.total || 0 }}
                  </strong>
                </p>
              </NuxtLink>
            </v-col>
            <v-col
              :cols="userType === '5' ? 3 : 4"
              class="d-md-flex"
            >
              <div
                class="mt-4 mr-2"
                color="rgba(218, 222, 255, 1)"
                fab
                x-large
              >
                <i
                  class="fa-regular fa-star"
                  style="color: #0b62e4"
                />
              </div>
              <div class="pa-3">
                <p class="text-h6">
                  Score
                </p>
                <p class="text-h5">
                  <strong>
                    {{ userInfo?.user?.score || 0 }}
                  </strong>
                </p>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          md="2"
          class="d-none d-md-block"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const _props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
})

const { user } = useUser()
const userType = computed(() => user.value?.group_id)
const { formatNumber } = useFormatNumber()
</script>

<style scoped>
.dashboard-statistic i {
  font-size: 30px;
}
</style>
