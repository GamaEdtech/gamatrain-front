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
  <div class="ai-page">
    <!-- Header Section -->
    <v-container
      id="ai-page-header"
      fluid
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1">
                AI Assistant
              </h1>
              <p class="gama-text-subtitle2">
                Your Intelligent Learning Companion
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Chat Section -->
    <v-container class="ai-chat-container">
      <v-row>
        <v-col cols="12">
          <v-card
            class="chat-card"
            elevation="0"
          >
            <!-- Chat Header -->
            <v-card-title class="chat-header d-flex align-center justify-space-between pa-4">
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
                  <div class="gama-text-caption primary-gray-500">
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
              class="messages-area"
            >
              <!-- Welcome Screen -->
              <div
                v-if="messages.length === 0"
                class="welcome-screen"
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
                <p class="gama-text-body1 primary-gray-500 mb-6">
                  Ask me anything about your studies. I'm here to help!
                </p>

                <div class="quick-questions-section">
                  <p class="gama-text-caption primary-gray-400 mb-3 text-uppercase">
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
                        class="quick-question-btn text-none"
                        @click="selectQuickQuestion(q.text)"
                      >
                        <v-icon
                          start
                          :icon="q.icon"
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
                  :class="['message-row', message.role]"
                >
                  <div class="message-wrapper">
                    <v-avatar
                      :color="message.role === 'user' ? 'primary' : '#F2F4F7'"
                      size="36"
                      class="message-avatar"
                    >
                      <v-icon
                        :color="message.role === 'user' ? 'black' : 'primary'"
                        size="20"
                      >
                        {{ message.role === 'user' ? 'mdi-account' : 'mdi-robot-happy' }}
                      </v-icon>
                    </v-avatar>
                    <div class="message-content">
                      <div :class="['message-bubble', message.role]">
                        {{ message.content }}
                      </div>
                      <div class="message-time gama-text-caption primary-gray-400">
                        {{ formatTime(message.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Typing Indicator -->
                <div
                  v-if="loading"
                  class="message-row assistant"
                >
                  <div class="message-wrapper">
                    <v-avatar
                      color="#F2F4F7"
                      size="36"
                      class="message-avatar"
                    >
                      <v-icon
                        color="primary"
                        size="20"
                      >
                        mdi-robot-happy
                      </v-icon>
                    </v-avatar>
                    <div class="message-content">
                      <div class="message-bubble assistant typing-bubble">
                        <div class="typing-indicator">
                          <span />
                          <span />
                          <span />
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
            <v-card-actions class="input-section pa-4">
              <v-text-field
                v-model="currentQuestion"
                variant="outlined"
                density="comfortable"
                placeholder="Type your question here..."
                hide-details
                rounded
                :disabled="loading"
                class="chat-input"
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

          <p class="gama-text-caption primary-gray-400 text-center mt-3">
            Press Enter to send • Shift+Enter for new line
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.ai-page {
  background: #fff;
  min-height: 100vh;
}

/* Header */
#ai-page-header {
  height: 16rem;
  background: #24292f;
  position: relative;
}

#main-title-holder {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 6rem;
  text-align: center;
}

#main-title-holder .gama-text-h1 {
  color: #ffb600;
  margin-bottom: 0.8rem;
}

#main-title-holder .gama-text-subtitle2 {
  color: #ffb600 !important;
}

/* Chat Container */
.ai-chat-container {
  margin-top: -4rem;
  position: relative;
  z-index: 1;
  padding-bottom: 4rem;
}

.chat-card {
  border-radius: 1.6rem !important;
  border: 1px solid #e4e7ec;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.chat-header {
  background: #f9fafb;
}

/* Messages Area */
.messages-area {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  padding: 2rem;
  background: #fff;
}

/* Welcome Screen */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 350px;
  padding: 2rem;
}

.quick-questions-section {
  width: 100%;
  max-width: 600px;
}

.quick-question-btn {
  justify-content: flex-start !important;
  padding: 1.2rem 1.6rem !important;
  height: auto !important;
  font-size: 1.3rem !important;
  border-color: #e4e7ec !important;
  color: #344054 !important;
}

.quick-question-btn:hover {
  background: #f9fafb !important;
  border-color: #ffb600 !important;
}

/* Messages */
.message-row {
  display: flex;
  margin-bottom: 1.6rem;
  animation: fadeIn 0.3s ease-out;
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

.message-row.user {
  justify-content: flex-end;
}

.message-row.assistant {
  justify-content: flex-start;
}

.message-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 80%;
}

.message-row.user .message-wrapper {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-row.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 1.2rem 1.6rem;
  border-radius: 1.6rem;
  font-size: 1.4rem;
  line-height: 1.7;
  max-width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
}

.message-bubble.user {
  background: #ffb600;
  color: #24292f;
  border-bottom-right-radius: 0.4rem;
}

.message-bubble.assistant {
  background: #f2f4f7;
  color: #344054;
  border-bottom-left-radius: 0.4rem;
}

.message-time {
  margin-top: 0.4rem;
  padding: 0 0.4rem;
}

/* Typing Indicator */
.typing-bubble {
  padding: 1.2rem 1.8rem !important;
}

.typing-indicator {
  display: flex;
  gap: 0.4rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #98a2b3;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
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

/* Input Section */
.input-section {
  background: #f9fafb;
}

.chat-input {
  font-size: 1.4rem !important;
}

.chat-input :deep(.v-field) {
  background: #fff !important;
}

/* Scrollbar */
.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #cacdd3;
  border-radius: 3px;
}

/* Responsive */
@media only screen and (min-width: 600px) {
  #ai-page-header {
    height: 20rem;
  }

  #main-title-holder {
    top: 8rem;
  }
}

@media only screen and (min-width: 960px) {
  #ai-page-header {
    height: 24rem;
  }

  #main-title-holder {
    top: 10rem;
  }

  .messages-area {
    min-height: 450px;
    max-height: 550px;
  }
}
</style>
