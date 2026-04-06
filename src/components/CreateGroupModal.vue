<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/entities/user'
import { searchUsers } from '@/api/users'
import { useAuthStore } from '@/stores/auth'
import { initials, avatarColor } from '@/shared/lib/avatar'

const emit = defineEmits<{
  create: [name: string, userIds: string[]]
  close: []
}>()

const auth = useAuthStore()

const groupName = ref('')
const searchQuery = ref('')
const searchResults = ref<User[]>([])
const selected = ref<User[]>([])

watch(searchQuery, async (q) => {
  if (q.trim().length < 1) {
    searchResults.value = []
    return
  }
  const results = await searchUsers(q.trim())
  searchResults.value = results.filter((u) => u.id !== auth.userId)
})

function toggleUser(user: User) {
  const idx = selected.value.findIndex((u) => u.id === user.id)
  if (idx === -1) {
    selected.value.push(user)
  } else {
    selected.value.splice(idx, 1)
  }
}

function isSelected(user: User) {
  return selected.value.some((u) => u.id === user.id)
}

function submit() {
  if (!groupName.value.trim()) return
  emit('create', groupName.value.trim(), selected.value.map((u) => u.id))
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">Новая группа</span>
        <button class="modal-close" @click="$emit('close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <input
          v-model="groupName"
          class="modal-input"
          placeholder="Название группы"
          @keydown.enter="submit"
        />

        <input
          v-model="searchQuery"
          class="modal-input"
          placeholder="Найти участников..."
        />

        <div v-if="selected.length" class="selected-chips">
          <div v-for="user in selected" :key="user.id" class="chip">
            <span>{{ user.login }}</span>
            <button class="chip-remove" @click="toggleUser(user)">×</button>
          </div>
        </div>

        <div v-if="searchResults.length" class="search-results">
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="result-item"
            :class="{ selected: isSelected(user) }"
            @click="toggleUser(user)"
          >
            <div class="result-avatar" :style="{ background: avatarColor(user.login) }">
              {{ initials(user.login) }}
            </div>
            <span class="result-name">{{ user.login }}</span>
            <div class="result-check" :class="{ checked: isSelected(user) }">
              <svg v-if="isSelected(user)" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Отмена</button>
        <button class="btn-create" :disabled="!groupName.trim()" @click="submit">
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: #1a2035;
  border-radius: 14px;
  width: 360px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 12px;
}

.modal-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
}

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: none;
  color: #5a6480;
  transition: background 0.15s, color 0.15s;
}

.modal-close:hover {
  background: #252e4b;
  color: #e2e8f0;
}

.modal-body {
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: #2d3a56; border-radius: 2px; }

.modal-input {
  width: 100%;
  padding: 9px 12px;
  background: #252e4b;
  border: 1px solid #2d3a56;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.modal-input::placeholder { color: #3d4d6e; }
.modal-input:focus { border-color: #7c3aed; }

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #2c254b;
  border-radius: 20px;
  font-size: 0.78rem;
  color: #c4b5fd;
}

.chip-remove {
  background: none;
  color: #7c6aad;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}

.chip-remove:hover { color: #e2e8f0; }

.search-results {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.result-item:hover { background: #252e4b; }
.result-item.selected { background: #2c254b; }

.result-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.result-name {
  flex: 1;
  font-size: 0.85rem;
  color: #e2e8f0;
}

.result-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #2d3a56;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
}

.result-check.checked {
  background: #7c3aed;
  border-color: #7c3aed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 18px 18px;
}

.btn-cancel {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #8892a4;
  background: none;
  transition: color 0.15s;
}

.btn-cancel:hover { color: #e2e8f0; }

.btn-create {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #7c3aed;
  color: white;
  transition: background 0.15s;
}

.btn-create:hover:not(:disabled) { background: #6d28d9; }
.btn-create:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
