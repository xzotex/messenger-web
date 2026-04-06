import client from './client'
import type { Message } from '@/entities/message'
import type { Chat } from '@/entities/chat'

export type { Message }

export async function getMessages(chatId: string): Promise<Message[]> {
  const { data } = await client.get('/messages', { params: { chat_id: chatId } })
  return data
}

export async function createDirectChat(userId: string): Promise<string> {
  const { data } = await client.post('/chats/direct', { user_id: userId })
  return data.chat_id
}

export async function getChats(): Promise<Chat[]> {
  const { data } = await client.get('/chats')
  return data
}

export async function createGroupChat(name: string, userIds: string[]): Promise<string> {
  const { data } = await client.post('/chats/group', { name, user_ids: userIds })
  return data.chat_id
}
