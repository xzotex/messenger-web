import client from './client'
import type { Message } from '@/entities/message'

export type { Message }

export async function getMessages(chatId: string): Promise<Message[]> {
  const { data } = await client.get('/messages', { params: { chat_id: chatId } })
  return data
}

export async function createDirectChat(userId: string): Promise<string> {
  const { data } = await client.post('/chats/direct', { user_id: userId })
  return data.chat_id
}
