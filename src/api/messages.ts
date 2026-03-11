import client from './client'

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  text: string
  created_at: string
}

export async function getMessages(userId: string): Promise<Message[]> {
  const { data } = await client.get('/messages', { params: { user_id: userId } })
  return data
}
