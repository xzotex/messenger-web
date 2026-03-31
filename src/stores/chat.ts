import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/entities/user'
import type { Message } from '@/entities/message'

export const useChatStore = defineStore('chat', () => {
  const users = ref<User[]>([])
  const activeUser = ref<User | null>(null)
  const activeChatId = ref<string | null>(null)
  const messages = ref<Message[]>([])

  function setUsers(list: User[]) {
    users.value = list
  }

  function setActiveUser(user: User, chatId: string) {
    activeUser.value = user
    activeChatId.value = chatId
    messages.value = []
  }

  function setMessages(list: Message[]) {
    messages.value = list
  }

  function addMessage(msg: Message) {
    messages.value.push(msg)
  }

  return {
    users,
    activeUser,
    activeChatId,
    messages,
    setUsers,
    setActiveUser,
    setMessages,
    addMessage,
  }
})
