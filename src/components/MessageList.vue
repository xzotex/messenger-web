<template>
  <div class="message-list" ref="listEl">
    <template v-if="chat.messages.length === 0">
      <div class="empty-chat">
        <p>No messages yet. Say hello!</p>
      </div>
    </template>

    <template v-else>
      <div
        v-for="msg in chat.messages"
        :key="msg.id"
        class="message-row"
        :class="{ mine: msg.sender_id === auth.userId }"
      >
        <div
          v-if="msg.sender_id !== auth.userId"
          class="msg-avatar"
          :style="{ background: avatarColor(senderLogin(msg.sender_id)) }"
        >
          {{ initials(senderLogin(msg.sender_id)) }}
        </div>

        <div class="msg-body">
          <div class="bubble">{{ msg.text }}</div>
          <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

const auth = useAuthStore()
const chat = useChatStore()
const listEl = ref<HTMLElement | null>(null)

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

function avatarColor(name: string): string {
  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22', '#2980b9', '#16a085']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
  return colors[hash % colors.length]!
}

function senderLogin(senderId: string): string {
  const user = chat.users.find(u => u.id === senderId)
  return user ? user.login : senderId.slice(0, 6)
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

watch(
  () => chat.messages.length,
  () => nextTick(() => listEl.value?.scrollTo(0, listEl.value.scrollHeight))
)
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
}

.message-list::-webkit-scrollbar {
  width: 4px;
}
.message-list::-webkit-scrollbar-track {
  background: transparent;
}
.message-list::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

/* Message rows */
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 70%;
}

.message-row.mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
}

.msg-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.message-row.mine .msg-body {
  align-items: flex-end;
}

.bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
  background: #f1f3f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

.message-row.mine .bubble {
  background: #9b1c1c;
  color: #ffffff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 4px;
}

.msg-time {
  font-size: 0.7rem;
  color: #9ca3af;
  padding: 0 4px;
}
</style>
