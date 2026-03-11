<template>
  <div class="message-list" ref="listEl">
    <div
      v-for="msg in chat.messages"
      :key="msg.id"
      class="message"
      :class="{ mine: msg.sender_id === auth.userId }"
    >
      <span>{{ msg.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

const auth = useAuthStore()
const chat = useChatStore()
const listEl = ref<HTMLElement | null>(null)

watch(
  () => chat.messages.length,
  () => nextTick(() => listEl.value?.scrollTo(0, listEl.value.scrollHeight))
)
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.message {
  display: flex;
}
.message span {
  background: #e5e7eb;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  max-width: 70%;
  word-break: break-word;
}
.message.mine {
  justify-content: flex-end;
}
.message.mine span {
  background: #2563eb;
  color: white;
}
</style>
