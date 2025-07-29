<template>
  <div>
    <v-card class="ticket_list">
      <v-card-text>
        <!-- Message list -->
        <v-row
          align="center"
          class="spacer"
          no-gutters
        >
          <v-col
            cols="2"
            sm="2"
            md="1"
            class="text-center avatar_container"
          >
            <v-avatar
              size="54px"
              class="pa-4 msg_avatar"
            >
              <img
                v-if="message.avatar"
                alt="Avatar"
                :src="message.avatar"
              >
            </v-avatar>
            <div class="status_sign" />
          </v-col>
          <v-col
            cols="5"
            sm="6"
            md="5"
          >
            <p>
              <NuxtLink :to="`/direct/${message.username}`">
                <strong
                  class="text-h6"
                  v-html="message.name"
                />
              </NuxtLink>
            </p>
          </v-col>

          <v-col
            class="text-right"
            cols="5"
            md="6"
          >
            <v-btn
              color="teal"
              variant="outlined"
              size="small"
            >
              Class reserve
            </v-btn>
            <v-btn
              icon
              color="red"
              size="small"
              @click="blackListDialog = true"
            >
              <v-icon>mdi-account-cancel</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Message box -->
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="12"
            class="pa-0"
          >
            <div>
              <v-card
                id="scroll-target"
                flat
              >
                <v-card-title> Sadeq Naderi </v-card-title>
                <v-card-text
                  style="max-height: 400px"
                  class="overflow-y-auto overflow-x-hidden px-0 px-md-2"
                >
                  <v-row
                    ref="scrollWrapper"
                    v-scroll:#scroll-target="onScroll"
                    align="center"
                    justify="center"
                  >
                    <v-col
                      cols="12"
                      class="px-0 px-md-2"
                    >
                      <v-timeline density="compact">
                        <v-timeline-item
                          color="teal"
                          dot-color="teal"
                          size="small"
                        >
                          <v-card color="teal">
                            <v-card-text class="text-white text-h6">
                              Hi how are you>
                            </v-card-text>
                            <v-card-actions class="text-white">
                              2022 Jul
                            </v-card-actions>
                          </v-card>
                        </v-timeline-item>
                        <v-timeline-item size="small">
                          <v-card>
                            <v-card-text class="text-h6">
                              Thanks. fine u?
                            </v-card-text>
                            <v-card-actions> 2022 Oct </v-card-actions>
                          </v-card>
                        </v-timeline-item>
                      </v-timeline>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>

            <div>
              <v-text-field
                v-model="messageToSend"
                class="mt-3 mb-1"
                placeholder="Type your message and press enter"
                hide-details
                :loading="submitLoading"
                variant="outlined"
                @keydown.enter="submitMessage"
              >
                <template #prepend-inner>
                  <v-btn
                    icon
                    @click="emojiBox = !emojiBox"
                  >
                    <v-icon class="search-icon pb-2">
                      mdi-emoticon
                    </v-icon>
                  </v-btn>
                </template>
                <template #append>
                  <v-btn
                    icon
                    @click="sendMsg"
                  >
                    <v-icon
                      class="search-icon pb-2"
                      color="blue"
                    >
                      mdi-send-outline
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <!-- <v-emoji-picker v-show="emojiBox" @select="selectEmoji" /> -->
              <ClientOnly>
                <EmojiPicker
                  v-show="emojiBox"
                  disable-skin-tones
                  display-recent
                  style="margin: 0 0"
                  :native="true"
                  @select="selectEmoji"
                />
              </ClientOnly>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Black list dialog -->
    <v-dialog
      v-model="blackListDialog"
      max-width="340"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to add to black list {{ message.name }}?
        </v-card-title>
        <v-card-actions>
          <v-row>
            <v-col cols="6">
              <v-btn
                color="red"
                block
                variant="outlined"
                @click="blackListDialog = false"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="red"
                class="text-white"
                block
                @click="blackListDialog = false"
              >
                Block
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import 'vue3-emoji-picker/css'

const EmojiPicker = defineAsyncComponent(() =>
  import('vue3-emoji-picker').then(EmojiPicker => EmojiPicker),
)

definePageMeta({
  layout: 'dashboard-layout',
})

const message = ref({
  avatar: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
  name: 'John Leider',
  title: 'Welcome to Gama!',
  color: 'teal',
  username: '@john',
})

const messageToSend = ref('')
const submitLoading = ref(false)
const emojiBox = ref(false)
const blackListDialog = ref(false)
const offsetTop = ref(0)

const onScroll = (e) => {
  offsetTop.value = e.target.scrollTop
}

const selectEmoji = (emoji) => {
  messageToSend.value += emoji.i
}

const sendMsg = () => {
  emojiBox.value = false
  const toast = useNuxtApp().$toast
  toast.success('Hi')
}

const submitMessage = () => {
  sendMsg()
}
</script>

<style scoped>
.msg_avatar {
  border: 2px solid red;
}

.avatar_container {
  position: relative;
}

.status_sign {
  position: absolute;
  content: "";
  width: 10px;
  right: 10px;
  bottom: 2px;
  border-radius: 10px;
  height: 10px;
  background-color: red;
}
</style>
