import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { getUsers } from '@/api/users'
import { getMessages, createDirectChat, getChats, createGroupChat } from '@/api/messages'
import { wsService } from '@/services/ws'
import type { User } from '@/entities/user'
import type { Chat } from '@/entities/chat'
import type { Message } from '@/entities/message'

export function useChat() {
  const auth = useAuthStore()
  const chat = useChatStore()

  async function init() {
    const [users, chats] = await Promise.all([getUsers(), getChats()])
    chat.setUsers(users)
    chat.setGroups(chats.filter((c) => c.type === 'group'))

    wsService.connect(auth.token!)
    wsService.onMessage(async (msg) => {
      if (chat.activeChatId && msg.chat_id === chat.activeChatId) {
        chat.addMessage({
          id: Date.now().toString(),
          chat_id: msg.chat_id,
          sender_id: msg.from,
          text: msg.text,
          created_at: new Date().toISOString(),
        } as Message)
      }

      // Если отправитель не в списке контактов — обновляем список
      const known = chat.users.find((u) => u.id === msg.from)
      if (!known && msg.from !== auth.userId) {
        const users = await getUsers()
        chat.setUsers(users)
      }
    })
  }

  async function selectUser(user: User) {
    const chatId = await createDirectChat(user.id)
    chat.setActiveUser(user, chatId)
    const msgs = await getMessages(chatId)
    chat.setMessages(msgs ?? [])
  }

  async function selectGroup(group: Chat) {
    chat.setActiveGroup(group)
    const msgs = await getMessages(group.id)
    chat.setMessages(msgs ?? [])
  }

  async function createGroup(name: string, userIds: string[]) {
    const chatId = await createGroupChat(name, userIds)
    const group: Chat = { id: chatId, type: 'group', name, created_at: new Date().toISOString() }
    chat.setGroups([...chat.groups, group])
    await selectGroup(group)
  }

  function disconnect() {
    wsService.disconnect()
  }

  return { init, selectUser, selectGroup, createGroup, disconnect }
}
