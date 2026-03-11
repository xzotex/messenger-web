<template>
  <div class="user-list">
    <div class="header">
      <span>{{ auth.login }}</span>
      <button @click="doLogout">Exit</button>
    </div>
    <div
      v-for="user in filteredUsers"
      :key="user.id"
      class="user-item"
      :class="{ active: chat.activeUser?.id === user.id }"
      @click="$emit('select', user)"
    >
      {{ user.login }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import { wsService } from '../services/ws'
import type { User } from '../api/users'

defineEmits<{ select: [user: User] }>()

const auth = useAuthStore()
const chat = useChatStore()
const router = useRouter()

const filteredUsers = computed(() =>
  chat.users.filter((u) => u.id !== auth.userId)
)

function doLogout() {
  wsService.disconnect()
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.user-list {
  width: 220px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}
.header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}
.header button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
}
.user-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  margin: 0.25rem 0.5rem;
}
.user-item:hover { background: #e5e7eb; }
.user-item.active { background: #dbeafe; color: #1d4ed8; font-weight: 600; }
</style>
