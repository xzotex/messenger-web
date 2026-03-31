<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { useChat } from '@/composables/useChat'
import AppSidebar from '@/components/AppSidebar.vue'
import ConversationList from '@/components/ConversationList.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import MessageList from '@/components/MessageList.vue'
import MessageInput from '@/components/MessageInput.vue'
import type { User } from '@/entities/user'

const chat = useChatStore()
const auth = useAuthStore()
const router = useRouter()
const showLogout = ref(false)
const { init, selectUser: chatSelectUser, disconnect } = useChat()

function doLogout() {
  disconnect()
  auth.logout()
  router.push('/')
}

async function selectUser(user: User) {
  showLogout.value = false
  await chatSelectUser(user)
}

onMounted(init)
</script>

<template>
  <div class="chat-layout">
    <AppSidebar />
    <ConversationList @select="selectUser" />

    <div class="chat-panel">
      <div v-if="!chat.activeUser" class="chat-empty">
        <div class="chat-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              stroke="#d1d5db"
              stroke-width="1.5"
            />
          </svg>
        </div>
        <p>Select a conversation to start chatting</p>
      </div>

      <template v-else>
        <ChatHeader
          :user="chat.activeUser"
          :show-menu="showLogout"
          @menu="showLogout = !showLogout"
          @logout="doLogout"
        />
        <MessageList />
        <MessageInput />
      </template>
    </div>
  </div>
</template>

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
  background: #131829;
  overflow: hidden;
}

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
</style>
