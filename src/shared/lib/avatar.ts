const AVATAR_COLORS = [
  '#e74c3c',
  '#3498db',
  '#9b59b6',
  '#f39c12',
  '#1abc9c',
  '#e67e22',
  '#2980b9',
  '#16a085',
]

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

export function avatarColor(name: string): string {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]!
}
