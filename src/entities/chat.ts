export interface Chat {
  id: string
  type: 'direct' | 'group'
  name: string
  created_at: string
}
