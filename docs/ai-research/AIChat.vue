<script setup lang="ts">
/**
 * Gamatrain AI Chat Component Example
 *
 * A complete, production-ready chat interface for educational Q&A
 * using the Gamatrain LLM system.
 */

const { askQuestion, loading, error } = useGamatrainAI()

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const currentQuestion = ref('')
const educationLevel = ref<'beginner' | 'intermediate' | 'advanced'>('intermediate')

// Sample quick questions
const quickQuestions = [
  'What is machine learning?',
  'Explain neural networks simply',
  'What are the types of AI?',
  'How does deep learning work?',
]

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
    const answer = await askQuestion(question, {
      level: educationLevel.value,
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
</script>

<template>
  <div class="gamatrain-ai-chat">
    <!-- Header -->
    <div class="chat-header">
      <h2 class="text-xl font-bold">
        🤖 Gamatrain AI Assistant
      </h2>
      <div class="header-controls">
        <select
          v-model="educationLevel"
          class="level-selector"
        >
          <option value="beginner">
            Beginner
          </option>
          <option value="intermediate">
            Intermediate
          </option>
          <option value="advanced">
            Advanced
          </option>
        </select>
        <button
          class="btn-clear"
          :disabled="loading"
          @click="clearChat"
        >
          Clear Chat
        </button>
      </div>
    </div>

    <!-- Quick Questions (show when no messages) -->
    <div
      v-if="messages.length === 0"
      class="quick-questions"
    >
      <p class="text-gray-600 mb-3">
        Try asking:
      </p>
      <div class="grid gap-2">
        <button
          v-for="question in quickQuestions"
          :key="question"
          class="quick-question-btn"
          @click="selectQuickQuestion(question)"
        >
          {{ question }}
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div class="messages-container">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', `message-${message.role}`]"
      >
        <div class="message-avatar">
          {{ message.role === 'user' ? '👤' : '🤖' }}
        </div>
        <div class="message-content">
          <div class="message-text">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ message.timestamp.toLocaleTimeString() }}
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div
        v-if="loading"
        class="message message-assistant"
      >
        <div class="message-avatar">
          🤖
        </div>
        <div class="message-content">
          <div class="loading-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div
        v-if="error"
        class="error-message"
      >
        ⚠️ Error: {{ error }}
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input-container">
      <textarea
        v-model="currentQuestion"
        placeholder="Ask a question about your course..."
        class="chat-input"
        rows="3"
        :disabled="loading"
        @keydown.enter.prevent="sendMessage"
      />
      <button
        :disabled="!currentQuestion.trim() || loading"
        class="btn-send"
        @click="sendMessage"
      >
        {{ loading ? 'Thinking...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.gamatrain-ai-chat {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.level-selector {
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.level-selector option {
  background: #667eea;
}

.btn-clear {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Quick Questions */
.quick-questions {
  padding: 2rem;
}

.quick-question-btn {
  padding: 0.75rem 1rem;
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-question-btn:hover {
  background: #f9fafb;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9fafb;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 85%;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f4f6;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.message-user .message-avatar {
  background: #667eea;
}

.message-content {
  flex: 1;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-user .message-text {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-text {
  background: white;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
  padding: 0 0.25rem;
}

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Error message */
.error-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
}

/* Input */
.chat-input-container {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.btn-send {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-send:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-send:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
