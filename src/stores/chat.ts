import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/entities/user'
import type { Message } from '@/entities/message'
import type { Chat } from '@/entities/chat'

export const useChatStore = defineStore('chat', () => {
  const users = ref<User[]>([])
  const groups = ref<Chat[]>([])
  const activeUser = ref<User | null>(null)
  const activeGroup = ref<Chat | null>(null)
  const activeChatId = ref<string | null>(null)
  const messages = ref<Message[]>([])

  function setUsers(list: User[]) {
    users.value = list
  }

  function setGroups(list: Chat[]) {
    groups.value = list
  }

  function setActiveUser(user: User, chatId: string) {
    activeUser.value = user
    activeGroup.value = null
    activeChatId.value = chatId
    messages.value = []
  }

  function setActiveGroup(group: Chat) {
    activeGroup.value = group
    activeUser.value = null
    activeChatId.value = group.id
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
    groups,
    activeUser,
    activeGroup,
    activeChatId,
    messages,
    setUsers,
    setGroups,
    setActiveUser,
    setActiveGroup,
    setMessages,
    addMessage,
  }
})
