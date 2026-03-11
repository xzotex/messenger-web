<template>
  <div class="conv-list">
    <div class="conv-header">
      <h2>Conversations</h2>
    </div>

    <div class="conv-tabs">
      <span class="tab active">All Active</span>
      <span class="tab">Archive</span>
      <span class="tab">Personal</span>
    </div>

    <div class="conv-items">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="conv-item"
        :class="{ active: chat.activeUser?.id === user.id }"
        @click="$emit('select', user)"
      >
        <div class="conv-avatar" :style="{ background: avatarColor(user.login) }">
          {{ initials(user.login) }}
        </div>
        <div class="conv-info">
          <div class="conv-top">
            <span class="conv-name">{{ user.login }}</span>
            <span class="conv-date">{{ chat.activeUser?.id === user.id ? 'Now' : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import type { User } from '../api/users'

defineEmits<{ select: [user: User] }>()

const auth = useAuthStore()
const chat = useChatStore()

const filteredUsers = computed(() =>
  chat.users.filter((u) => u.id !== auth.userId)
)

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

function avatarColor(name: string): string {
  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22', '#2980b9', '#16a085']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
  return colors[hash % colors.length]
}
</script>

<style scoped>
.conv-list {
  width: 280px;
  flex-shrink: 0;
  background: #1a2035;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conv-header {
  padding: 20px 18px 8px;
}

.conv-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.conv-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.tab {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #8892a4;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.tab:hover {
  color: #c9d1e0;
}

.tab.active {
  background: #252e4b;
  color: #ffffff;
}

.conv-items {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.conv-items::-webkit-scrollbar {
  width: 4px;
}
.conv-items::-webkit-scrollbar-track {
  background: transparent;
}
.conv-items::-webkit-scrollbar-thumb {
  background: #2d3a56;
  border-radius: 2px;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin: 2px 6px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.conv-item:hover {
  background: #222b45;
}

.conv-item.active {
  background: #252e4b;
}

.conv-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.conv-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-date {
  font-size: 0.7rem;
  color: #5a6480;
  flex-shrink: 0;
  margin-left: 8px;
}

.conv-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-preview {
  font-size: 0.75rem;
  color: #5a6480;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.conv-dot.blue {
  background: #3b82f6;
}

.conv-dot.green {
  background: #22c55e;
}
</style>
