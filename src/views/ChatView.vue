<template>
  <div class="chat-layout">
    <UserList @select="selectUser" />
    <div class="chat-panel">
      <div v-if="!chat.activeUser" class="placeholder">
        Select a user to start chatting
      </div>
      <template v-else>
        <div class="chat-header">{{ chat.activeUser.login }}</div>
        <MessageList />
        <MessageInput />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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
  chat.setMessages(msgs)
}
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
}
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-header {
  padding: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}
.placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
</style>
