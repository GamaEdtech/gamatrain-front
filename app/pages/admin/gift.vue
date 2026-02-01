<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const pass = ref('')
const giftList = ref([])
const { $toast } = useNuxtApp()

const giftData = async () => {
  try {
    const response = await useApiService.get('/api/admin/gift', {
      secret: pass.value,
    })

    giftList.value = response.data

    console.log(giftList.value)
  }
  catch (err) {
    $toast.error('Failed to fetch gift data. Please check the password and try again.')
    console.error('Error fetching gift data:', err)
  }
}

const qrModal = ref(false)
const selectedUrl = ref('')
const openQrModal = (url: string) => {
  selectedUrl.value = url
  qrModal.value = true
}
</script>

<template>
  <v-container>
    <div class="admin-gift-page">
      <h1>Gift Page</h1>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="pass"
            label="Enter Password"
            type="password"
            autocomplete="off"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            color="primary"
            size="large"
            :disabled="!pass"
            @click="giftData"
          >
            Fetch Gift Data
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Pass</th>
                <th>QR Code</th>
                <th>Receiver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(gift, key) in giftList"
                :key="gift._id"
              >
                <td>{{ key+1 }}</td>
                <td>{{ `https://gamatrain.com/airdrop/gift/${gift._id}` }}</td>
                <td>{{ gift.pass }}</td>
                <td>
                  <QrcodeVue
                    :value="`https://gamatrain.com/airdrop/gift/${gift._id}`"
                    @click="openQrModal(`https://gamatrain.com/airdrop/gift/${gift._id}`)"
                  />
                </td>
                <td>{{ gift.receiver || 'N/A' }}</td>
                <td>{{ gift.status }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </div>
    <v-dialog
      v-model="qrModal"
      max-width="max-content"
    >
      <v-card>
        <v-card-title>QR Code</v-card-title>
        <v-card-text>
          <QrcodeVue
            :value="selectedUrl"
            size="400"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="qrModal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
