<template>
  <div>
    <v-row>
      <v-col
        cols="6"
        class="text-left"
      >
        <span class="text-h4 teal--text">
          <v-icon color="teal">
            mdi-credit-card-plus-outline
          </v-icon>
          Top Up Wallet
        </span>
      </v-col>
      <v-col
        cols="6"
        class="text-right"
      >
        <span class="text-h4 teal--text">
          Credit: ${{ $auth.user.credit }}
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
            class="px-0 px-sm-4 px-md-4 text-center"
          >
            <v-radio-group
              id="select_charge_package"
              v-model="selected_pack"
            >
              <v-row>
                <v-col
                  v-for="(item, index) in package_list"
                  :key="index"
                  cols="6"
                  md="3"
                >
                  <v-radio
                    color="primary"
                    :value="item.price"
                    active-class="active_radio"
                  >
                    <template #label>
                      <v-card
                        :color="item.color"
                        class="radio_card "
                      >
                        <v-card-text class="text-center">
                          <p class="text-h3">
                            ${{ item.price }}
                          </p>
                          <p class="py-2 text-h5">
                            <span>+</span>
                            <v-icon small>
                              mdi-gift
                            </v-icon>
                          </p>
                          <p class="text-h4">
                            {{ item.gift }}%
                          </p>
                        </v-card-text>
                      </v-card>
                    </template>
                  </v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>

        <!-- Some notice -->
        <v-row>
          <v-col cols="12">
            <ul id="credit-notice">
              <li>
                Packages
                <span class="blue--text">
                  without expiration date
                </span>
              </li>
              <li>Payment through all Credit card and Paypal</li>
            </ul>
          </v-col>
        </v-row>
        <!-- End some notice -->

        <!-- Payment gateway logo -->
        <v-row v-show="selected_pack">
          <v-col
            cols="12"
            class="text-center"
          >
            <p
              v-show="selected_pack && !selected_gateway"
              class="font-weight-bold green--text"
            >
              Now select payment gateway:
            </p>
          </v-col>
          <v-col
            id="payment-logo-list"
            cols="12"
            class="d-flex justify-center align-center px-0 px-md-2"
          >
            <v-radio-group
              v-model="selected_gateway"
              row
            >
              <v-radio
                v-for="(item, index) in gateway_list"
                :key="index"
                color="primary"
                :value="item.title"
                active-class="active_radio"
              >
                <template #label>
                  <div id="logo_holder">
                    <v-img :src="require(`assets/images/credit-card/${item.img}`)" />
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>

          <v-col
            v-show="selected_gateway"
            cols="12"
            class="text-center"
          >
            <p class="font-weight-bold green--text blink">
              Connecting to the gateway...
            </p>
          </v-col>
        </v-row>

        <!-- End payment gateway logo -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ChargeWallet',
  layout: 'dashboard_layout',
  data() {
    return {
      package_list: [
        {
          price: 6.9,
          gift: 0,
          color: '#fff',
        },
        {
          price: 9.9,
          gift: 10,
          color: '#cc7357',
        },
        {
          price: 19.9,
          gift: 12,
          color: '#e6e5e5',
        },
        {
          price: 49.9,
          gift: 22,
          color: '#CEB320',
        },
      ],
      selected_pack: '',

      gateway_list: [
        { title: 'Visa card', img: 'visa.png' },
        { title: 'Master card', img: 'master.png' },
        { title: 'Paypal', img: 'paypal.png' },
      ],
      selected_gateway: '',
    }
  },
  head() {
    return {
      title: 'Top Up Wallet',
    }
  },
}
</script>

<style>

</style>
