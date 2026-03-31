import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { getUsers } from '@/api/users'
import { getMessages, createDirectChat } from '@/api/messages'
import { wsService } from '@/services/ws'
import type { User } from '@/entities/user'
import type { Message } from '@/entities/message'

export function useChat() {
  const auth = useAuthStore()
  const chat = useChatStore()

  async function init() {
    const users = await getUsers()
    chat.setUsers(users)

    wsService.connect(auth.token!)
    wsService.onMessage((msg) => {
      if (chat.activeChatId && msg.chat_id === chat.activeChatId) {
        chat.addMessage({
          id: Date.now().toString(),
          chat_id: msg.chat_id,
          sender_id: msg.from,
          text: msg.text,
          created_at: new Date().toISOString(),
        } as Message)
      }
    })
  }

  async function selectUser(user: User) {
    const chatId = await createDirectChat(user.id)
    chat.setActiveUser(user, chatId)
    const msgs = await getMessages(chatId)
    chat.setMessages(msgs ?? [])
  }

  function disconnect() {
    wsService.disconnect()
  }

  return { init, selectUser, disconnect }
}
