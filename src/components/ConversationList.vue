<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import type { User } from '@/entities/user'
import type { Chat } from '@/entities/chat'
import { initials, avatarColor } from '@/shared/lib/avatar'
import { searchUsers } from '@/api/users'

const emit = defineEmits<{
  select: [user: User]
  selectGroup: [group: Chat]
  openCreateGroup: []
}>()

const auth = useAuthStore()
const chat = useChatStore()

const searchQuery = ref('')
const searchResults = ref<User[]>([])

const filteredUsers = computed(() => chat.users.filter((u) => u.id !== auth.userId))

watch(searchQuery, async (q) => {
  if (q.trim().length < 1) {
    searchResults.value = []
    return
  }
  const results = await searchUsers(q.trim())
  searchResults.value = results.filter((u) => u.id !== auth.userId)
})

function selectUser(user: User) {
  searchQuery.value = ''
  emit('select', user)
}
</script>

<template>
  <div class="conv-list">
    <div class="conv-header">
      <h2>Чаты</h2>
      <button class="new-group-btn" title="Создать группу" @click="$emit('openCreateGroup')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div class="search-bar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="search-icon">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
        <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input v-model="searchQuery" placeholder="Найти пользователя..." class="search-input" />
    </div>

    <template v-if="searchQuery.trim()">
      <div class="conv-items">
        <div v-if="searchResults.length === 0" class="search-empty">Никого не найдено</div>
        <div
          v-for="user in searchResults"
          :key="user.id"
          class="conv-item"
          @click="selectUser(user)"
        >
          <div class="conv-avatar" :style="{ background: avatarColor(user.login) }">
            {{ initials(user.login) }}
          </div>
          <div class="conv-info">
            <span class="conv-name">{{ user.login }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
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
          @click="emit('select', user)"
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

        <template v-if="chat.groups.length">
          <div class="section-label">Группы</div>
          <div
            v-for="group in chat.groups"
            :key="group.id"
            class="conv-item"
            :class="{ active: chat.activeGroup?.id === group.id }"
            @click="emit('selectGroup', group)"
          >
            <div class="conv-avatar group-avatar" :style="{ background: avatarColor(group.name) }">
              {{ initials(group.name) }}
            </div>
            <div class="conv-info">
              <div class="conv-top">
                <span class="conv-name">{{ group.name }}</span>
              </div>
              <span class="conv-subtitle">группа</span>
            </div>
          </div>
        </template>
      </div>
    </template>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px 8px;
}

.conv-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.new-group-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #252e4b;
  color: #8892a4;
  transition: background 0.15s, color 0.15s;
}

.new-group-btn:hover {
  background: #7c3aed;
  color: white;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 10px;
  padding: 7px 12px;
  background: #252e4b;
  border-radius: 8px;
  border: 1px solid #2d3a56;
}

.search-icon {
  color: #5a6480;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.8rem;
  color: #e2e8f0;
}

.search-input::placeholder {
  color: #3d4d6e;
}

.search-empty {
  padding: 16px;
  font-size: 0.8rem;
  color: #5a6480;
  text-align: center;
}

.conv-tabs {
  display: flex;
  gap: 4px;
  padding: 0 12px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
  background: #2c254b;
  color: #ffffff;
}

.conv-items {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.conv-items::-webkit-scrollbar { width: 4px; }
.conv-items::-webkit-scrollbar-track { background: transparent; }
.conv-items::-webkit-scrollbar-thumb { background: #2d3a56; border-radius: 2px; }

.section-label {
  padding: 10px 20px 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #3d4d6e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.conv-item:hover { background: #403285; }
.conv-item.active { background: #403285; }

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

.group-avatar {
  border-radius: 10px;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.conv-subtitle {
  font-size: 0.72rem;
  color: #5a6480;
}
</style>
