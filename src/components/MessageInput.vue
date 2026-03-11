<template>
  <div class="input-area">
    <input
      v-model="text"
      placeholder="Type a message..."
      @keydown.enter="send"
    />
    <button @click="send">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { wsService } from '../services/ws'
import { useChatStore } from '../stores/chat'

const chat = useChatStore()
const text = ref('')

function send() {
  if (!text.value.trim() || !chat.activeUser) return
  wsService.send(chat.activeUser.id, text.value.trim())
  text.value = ''
}
</script>

<style scoped>
.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}
input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}
button {
  padding: 0.6rem 1.2rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
