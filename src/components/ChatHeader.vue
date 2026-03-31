<script setup lang="ts">
import type { User } from '@/entities/user'
import { initials, avatarColor } from '@/shared/lib/avatar'

defineProps<{
  user: User
  showMenu: boolean
}>()

defineEmits<{
  menu: []
  logout: []
}>()
</script>

<template>
  <div class="chat-header">
    <div class="chat-header-avatar" :style="{ background: avatarColor(user.login) }">
      {{ initials(user.login) }}
    </div>
    <div class="chat-header-info">
      <span class="chat-header-name">{{ user.login }}</span>
    </div>
    <div class="chat-header-actions">
      <button class="header-btn" title="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#6b7280" stroke-width="2" />
          <path d="M21 21L16.65 16.65" stroke="#6b7280" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <button class="header-btn" title="More" @click="$emit('menu')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.5" fill="#6b7280" />
          <circle cx="12" cy="12" r="1.5" fill="#6b7280" />
          <circle cx="12" cy="19" r="1.5" fill="#6b7280" />
        </svg>
      </button>
      <div v-if="showMenu" class="logout-dropdown">
        <button class="logout-btn" @click="$emit('logout')">Sign out</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  gap: 12px;
  flex-shrink: 0;
}

.chat-header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.chat-header-info {
  flex: 1;
}

.chat-header-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.chat-header-actions {
  display: flex;
  gap: 4px;
  position: relative;
}

.header-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.header-btn:hover {
  background: #f3f4f6;
}

.logout-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.logout-btn {
  display: block;
  width: 100%;
  padding: 10px 20px;
  font-size: 0.875rem;
  color: #374151;
  background: none;
  text-align: left;
  white-space: nowrap;
  transition: background 0.1s;
}

.logout-btn:hover {
  background: #f9fafb;
  color: #c0392b;
}
</style>
