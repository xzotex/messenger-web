import client from './client'

export async function login(login: string, password: string): Promise<string> {
  const { data } = await client.post('/login', { login, password })
  return data.token
}

export async function register(login: string, password: string): Promise<void> {
  await client.post('/register', { login, password })
}
