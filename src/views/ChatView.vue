<template>
  <div class="chat-layout">
    <!-- Icon navigation -->
    <div class="icon-nav">
      <div class="icon-nav-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
        </svg>
      </div>

      <div class="icon-nav-items">
        <div class="icon-nav-item active" title="Conversations">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="icon-nav-item" title="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="icon-nav-item" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div
        class="icon-nav-avatar"
        :style="{ background: avatarColor(auth.login ?? '') }"
        :title="auth.login ?? ''"
      >
        {{ initials(auth.login ?? '') }}
      </div>
    </div>

    <!-- Conversation list -->
    <UserList @select="selectUser" />

    <!-- Chat panel -->
    <div class="chat-panel">
      <div v-if="!chat.activeUser" class="chat-empty">
        <div class="chat-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="#d1d5db" stroke-width="1.5"/>
          </svg>
        </div>
        <p>Select a conversation to start chatting</p>
      </div>

      <template v-else>
        <div class="chat-header">
          <div
            class="chat-header-avatar"
            :style="{ background: avatarColor(chat.activeUser.login) }"
          >
            {{ initials(chat.activeUser.login) }}
          </div>
          <div class="chat-header-info">
            <span class="chat-header-name">{{ chat.activeUser.login }}</span>
          </div>
          <div class="chat-header-actions">
            <button class="header-btn" title="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#6b7280" stroke-width="2"/>
                <path d="M21 21L16.65 16.65" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="header-btn" title="More" @click="showLogout = !showLogout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="#6b7280"/>
                <circle cx="12" cy="12" r="1.5" fill="#6b7280"/>
                <circle cx="12" cy="19" r="1.5" fill="#6b7280"/>
              </svg>
            </button>
            <div v-if="showLogout" class="logout-dropdown">
              <button class="logout-btn" @click="doLogout">Sign out</button>
            </div>
          </div>
        </div>

        <MessageList />
        <MessageInput />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserList from '../components/UserList.vue'
import MessageList from '../components/MessageList.vue'
import MessageInput from '../components/MessageInput.vue'
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'
import { getUsers } from '../api/users'
import { getMessages } from '../api/messages'
import { wsService } from '../services/ws'
import type { User } from '../api/users'
import type { Message } from '../api/messages'

const chat = useChatStore()
const auth = useAuthStore()
const router = useRouter()
const showLogout = ref(false)

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

function avatarColor(name: string): string {
  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22', '#2980b9', '#16a085']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
  return colors[hash % colors.length]
}

function doLogout() {
  wsService.disconnect()
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  const users = await getUsers()
  chat.setUsers(users)

  wsService.connect(auth.token!)
  wsService.onMessage((msg) => {
    if (
      chat.activeUser &&
      (msg.from === chat.activeUser.id || msg.to === chat.activeUser.id)
    ) {
      chat.addMessage({
        id: Date.now().toString(),
        sender_id: msg.from,
        receiver_id: msg.to,
        text: msg.text,
        created_at: new Date().toISOString(),
      } as Message)
    }
  })
})

async function selectUser(user: User) {
  chat.setActiveUser(user)
  const msgs = await getMessages(user.id)
  chat.setMessages(msgs ?? [])
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
  background: #131829;
  overflow: hidden;
}

/* Icon navigation */
.icon-nav {
  width: 62px;
  background: #0f1322;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  flex-shrink: 0;
}

.icon-nav-logo {
  width: 38px;
  height: 38px;
  background: #c0392b;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.icon-nav-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.icon-nav-item {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6480;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.icon-nav-item:hover {
  background: #1e2540;
  color: #a0aec0;
}

.icon-nav-item.active {
  background: #1e2540;
  color: #ffffff;
}

.icon-nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
}

/* Chat panel */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  position: relative;
}

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #9ca3af;
}

.chat-empty p {
  font-size: 0.95rem;
}

/* Chat header */
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
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
