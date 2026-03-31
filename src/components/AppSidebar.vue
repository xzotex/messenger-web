<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { initials, avatarColor } from '@/shared/lib/avatar'

const auth = useAuthStore()
</script>

<template>
  <div class="icon-nav">
    <div class="icon-nav-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          fill="white"
        />
      </svg>
    </div>

    <div class="icon-nav-items">
      <div class="icon-nav-item active" title="Чаты">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="icon-nav-item" title="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
          <path
            d="M21 21L16.65 16.65"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div class="icon-nav-item" title="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div
      class="icon-nav-avatar"
      :style="{ background: avatarColor(auth.login ?? '') }"
      :title="auth.login ?? ''"
    >
      {{ initials(auth.login ?? '') }}
    </div>
  </div>
</template>

<style scoped>
.icon-nav {
  width: 62px;
  background: #0f1322;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  flex-shrink: 0;
}

.icon-nav-logo {
  width: 38px;
  height: 38px;
  background: #c0392b;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.icon-nav-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.icon-nav-item {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6480;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.icon-nav-item:hover {
  background: #1e2540;
  color: #a0aec0;
}

.icon-nav-item.active {
  background: #1e2540;
  color: #ffffff;
}

.icon-nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
