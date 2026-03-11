import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../api/users'
import type { Message } from '../api/messages'

export const useChatStore = defineStore('chat', () => {
  const users = ref<User[]>([])
  const activeUser = ref<User | null>(null)
  const messages = ref<Message[]>([])

  function setUsers(list: User[]) {
    users.value = list
  }

  function setActiveUser(user: User) {
    activeUser.value = user
    messages.value = []
  }

  function setMessages(list: Message[]) {
    messages.value = list
  }

  function addMessage(msg: Message) {
    messages.value.push(msg)
  }

  return { users, activeUser, messages, setUsers, setActiveUser, setMessages, addMessage }
})
