<script setup lang="ts">
/**
 * Gamatrain AI Chat Page
 * An AI chat interface matching the project design system
 */

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'AI Assistant',
  description: 'Chat with Gamatrain AI Assistant for educational help and guidance',
  ogTitle: 'AI Assistant | Gamatrain',
})

const { generate, loading, error } = useGamatrainAI()

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const currentQuestion = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// Sample quick questions
const quickQuestions = [
  { icon: 'mdi-head-question', text: 'What is artificial intelligence?' },
  { icon: 'mdi-brain', text: 'Explain machine learning' },
  { icon: 'mdi-compare', text: 'Difference between AI and ML?' },
  { icon: 'mdi-rocket-launch', text: 'Future of AI in education?' },
]

// Auto-scroll to bottom when new messages arrive
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

async function sendMessage() {
  if (!currentQuestion.value.trim() || loading.value) return

  const question = currentQuestion.value
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: question,
    timestamp: new Date(),
  }

  messages.value.push(userMessage)
  currentQuestion.value = ''

  try {
    const answer = await generate(question, {
      systemPrompt: 'You are Gamatrain AI, an educational assistant. Be helpful, concise, and accurate. Respond in English.',
    })

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
    }

    messages.value.push(assistantMessage)
  }
  catch (err) {
    console.error('Error getting response:', err)
  }
}

function selectQuickQuestion(question: string) {
  currentQuestion.value = question
  sendMessage()
}

function clearChat() {
  messages.value = []
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="bg-white min-h-screen">
    <!-- Header Section -->
    <v-container
      fluid
      class="bg-surface-variant position-relative d-flex align-center justify-center"
      style="height: 24rem; background-color: #24292f !important;"
    >
      <div class="text-center pt-10">
        <h1 class="gama-text-h1 text-primary">
          AI Assistant
        </h1>
        <p class="gama-text-subtitle2 text-primary mb-8 mt-3">
          Your Intelligent Learning Companion
        </p>
      </div>
    </v-container>

    <!-- Chat Section -->
    <v-container class="position-relative z-10 pb-16 mt-n16">
      <v-row>
        <v-col cols="12">
          <v-card
            class="mx-auto overflow-hidden border"
            elevation="0"
            rounded="xl"
            max-width="900"
            border
            color="white"
          >
            <!-- Chat Header -->
            <v-card-title class="d-flex align-center justify-space-between pa-4 bg-grey-lighten-4">
              <div class="d-flex align-center">
                <v-avatar
                  color="primary"
                  size="40"
                  class="mr-3"
                >
                  <v-icon color="black">
                    mdi-robot-happy
                  </v-icon>
                </v-avatar>
                <div>
                  <span class="gama-text-h6">Gamatrain AI</span>
                  <div class="gama-text-caption text-grey-1">
                    Online • Ready to help
                  </div>
                </div>
              </div>
              <v-btn
                variant="outlined"
                size="small"
                rounded
                :disabled="loading || messages.length === 0"
                @click="clearChat"
              >
                <v-icon
                  start
                  size="18"
                >
                  mdi-refresh
                </v-icon>
                New Chat
              </v-btn>
            </v-card-title>

            <v-divider />

            <!-- Messages Area -->
            <div
              ref="messagesContainer"
              class=" pa-4 md-pa-8 d-flex flex-column overflow-y-auto bg-white"
              style="min-height: 450px; max-height: 550px;"
            >
              <!-- Welcome Screen -->
              <div
                v-if="messages.length === 0"
                class="d-flex flex-column align-center justify-center text-center h-100 py-2"
              >
                <v-icon
                  size="64"
                  color="primary"
                  class="mb-4"
                >
                  mdi-robot-happy-outline
                </v-icon>
                <h2 class="gama-text-h4 mb-2">
                  Hello! I'm Gamatrain AI
                </h2>
                <p class="gama-text-body1 text-grey-darken-1 mb-6 text-center">
                  Ask me anything about your studies. I'm here to help!
                </p>

                <div
                  class="w-100"
                  style="max-width: 600px;"
                >
                  <p class="gama-text-caption text-grey-darken-1 mb-3 text-uppercase">
                    Suggested Questions
                  </p>
                  <v-row justify="center">
                    <v-col
                      v-for="q in quickQuestions"
                      :key="q.text"
                      cols="12"
                      sm="6"
                    >
                      <v-btn
                        variant="outlined"
                        rounded
                        block
                        size="2x-large"
                        class="px-4 py-3 font-size-12 justify-start hover: border-color: #E3E5EA;"
                        style="border-color: #E3E5EA;"
                        color="grey-darken-3"
                        @click="selectQuickQuestion(q.text)"
                      >
                        <v-icon
                          size="20"
                          :icon="q.icon"
                          class="mr-2"

                        />
                        {{ q.text }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <!-- Messages List -->
              <template v-else>
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="d-flex mb-6 animate-fade-in"
                  :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="d-flex gap-4"
                    :class="message.role === 'user' ? 'flex-row-reverse' : ''"
                    style="max-width: 80%; gap: 1rem;"
                  >
                    <v-avatar
                      :color="message.role === 'user' ? 'primary' : 'grey-lighten-4'"
                      size="36"
                      class="flex-shrink-0"
                    >
                      <v-icon
                        :color="message.role === 'user' ? 'black' : 'primary'"
                        size="20"
                      >
                        {{ message.role === 'user' ? 'mdi-account' : 'mdi-robot-happy' }}
                      </v-icon>
                    </v-avatar>
                    <div
                      class="d-flex flex-column"
                      :class="message.role === 'user' ? 'align-end' : ''"
                    >
                      <div
                        class="px-4 py-3"
                        :class="[
                          message.role === 'user'
                            ? 'userMessage'
                            : 'AiMessage',
                        ]"
                        style="line-height: 1.7; white-space: pre-wrap; word-break: break-word;"
                      >
                        {{ message.content }}
                      </div>
                      <div class="mt-1 px-1 gama-text-caption text-grey-lighten-1">
                        {{ formatTime(message.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Typing Indicator -->
                <div
                  v-if="loading"
                  class="d-flex justify-start mb-6 animate-fade-in"
                >
                  <div
                    class="d-flex gap-4"
                    style="gap: 1rem;"
                  >
                    <v-avatar
                      color="grey-lighten-4"
                      size="36"
                      class="flex-shrink-0"
                    >
                      <v-icon
                        color="primary"
                        size="20"
                      >
                        mdi-robot-happy
                      </v-icon>
                    </v-avatar>
                    <div>
                      <div class="bg-grey-lighten-4 pa-4 rounded-xl rounded-bs-2">
                        <div
                          class="d-flex align-center gap-1"
                          style="gap: 0.4rem;"
                        >
                          <span class="typing-dot" />
                          <span
                            class="typing-dot"
                            style="animation-delay: 0.2s"
                          />
                          <span
                            class="typing-dot"
                            style="animation-delay: 0.4s"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error Alert -->
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mx-4 my-2"
                  closable
                >
                  {{ error }}
                </v-alert>
              </template>
            </div>

            <v-divider />

            <!-- Input Area -->
            <v-card-actions class="bg-grey-lighten-5 pa-4">
              <v-text-field
                v-model="currentQuestion"
                variant="outlined"
                density="comfortable"
                placeholder="Type your question here..."
                hide-details
                rounded
                :disabled="loading"
                class="bg-white"
                @keydown="handleKeydown"
              >
                <template #append-inner>
                  <v-btn
                    icon
                    variant="flat"
                    color="primary"
                    size="small"
                    :disabled="!currentQuestion.trim() || loading"
                    :loading="loading"
                    @click="sendMessage"
                  >
                    <v-icon color="black">
                      mdi-send
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-card-actions>
          </v-card>

          <p class="gama-text-caption text-grey-lighten-1 text-center mt-3">
            Press Enter to send • Shift+Enter for new line
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.text-primary {
  color: #ffb600 !important;
}

/* Animations that are hard to do with utility classes only */
.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #98a2b3;
  animation: typing 1.4s ease-in-out infinite;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.userMessage{
    border-radius: 1.7rem;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.7;
    max-width: 100%;
    padding: 1rem 0.5rem;
    white-space: pre-wrap;
    word-break: break-word;
    background: #ffb600;
    border-bottom-right-radius: .4rem;
    color: #24292f;
}
.AiMessage{
  border-radius: 1.6rem;
    font-size: 1.4rem;
    line-height: 1.7;
    max-width: 100%;
    padding: 1.2rem 1.6rem;
    white-space: pre-wrap;
    word-break: break-word;
    background: #f2f4f7;
    border-bottom-left-radius: .4rem;
    color: #344054;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
