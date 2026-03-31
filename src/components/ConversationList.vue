<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import type { User } from '@/entities/user'
import { initials, avatarColor } from '@/shared/lib/avatar'

defineEmits<{ select: [user: User] }>()

const auth = useAuthStore()
const chat = useChatStore()

const filteredUsers = computed(() => chat.users.filter((u) => u.id !== auth.userId))
</script>

<template>
  <div class="conv-list">
    <div class="conv-header">
      <h2>Чаты</h2>
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tab {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #8892a4;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
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
</style>
