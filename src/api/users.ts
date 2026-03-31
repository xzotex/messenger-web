import client from './client'
import type { User } from '@/entities/user'

export type { User }

export async function getUsers(): Promise<User[]> {
  const { data } = await client.get('/users')
  return data
}

export async function searchUsers(q: string): Promise<User[]> {
  const { data } = await client.get('/users/search', { params: { q } })
  return data
}
