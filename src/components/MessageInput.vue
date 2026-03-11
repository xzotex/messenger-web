<template>
  <div class="input-area">
    <div class="input-tools">
      <button class="tool-btn" title="Attach file">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00876 15.16 2.00876C16.2209 2.00876 17.2394 2.42975 17.99 3.18C18.7402 3.93063 19.1612 4.94905 19.1612 6.01C19.1612 7.07095 18.7402 8.08937 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9962 7.995 17.9962C7.46427 17.9962 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99382 16.5257 5.99382 15.995C5.99382 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="tool-btn" title="Emoji">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#9ca3af" stroke-width="2"/>
          <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
          <circle cx="9" cy="10" r="1" fill="#9ca3af"/>
          <circle cx="15" cy="10" r="1" fill="#9ca3af"/>
        </svg>
      </button>
    </div>

    <input
      v-model="text"
      class="msg-input"
      placeholder="Start Typing..."
      @keydown.enter="send"
    />

    <button class="send-btn" :disabled="!text.trim()" @click="send">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
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
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #ffffff;
  flex-shrink: 0;
}

.input-tools {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.tool-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.tool-btn:hover {
  background: #f3f4f6;
}

.msg-input {
  flex: 1;
  height: 38px;
  padding: 0 14px;
  border-radius: 20px;
  background: #f7f8fa;
  border: 1px solid #eaecf0;
  font-size: 0.875rem;
  color: #374151;
  transition: border-color 0.15s;
}

.msg-input:focus {
  border-color: #d1d5db;
  background: #fff;
}

.msg-input::placeholder {
  color: #b0b8c8;
}

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #9b1c1c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, opacity 0.15s;
}

.send-btn:hover:not(:disabled) {
  background: #7f1d1d;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
