<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { initials, avatarColor } from '@/shared/lib/avatar'
import { formatTime } from '@/shared/lib/format'

const auth = useAuthStore()
const chat = useChatStore()
const listEl = ref<HTMLElement | null>(null)

const senderMap = computed(() => Object.fromEntries(chat.users.map((u) => [u.id, u.login])))

function senderLogin(senderId: string): string {
  return senderMap.value[senderId] ?? senderId.slice(0, 6)
}

watch(
  () => chat.messages.length,
  () => nextTick(() => listEl.value?.scrollTo(0, listEl.value.scrollHeight))
)
</script>

<template>
  <div ref="listEl" class="message-list">
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
