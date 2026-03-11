import client from './client'

export interface User {
  id: string
  login: string
  created_at: string
}

export async function getUsers(): Promise<User[]> {
  const { data } = await client.get('/users')
  return data
}
