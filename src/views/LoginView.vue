<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
        </svg>
      </div>
      <h1>Messenger</h1>
      <p class="subtitle">Sign in to your account</p>

      <div class="fields">
        <div class="field">
          <label>Login</label>
          <input v-model="loginVal" placeholder="Enter your login" autocomplete="username" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" autocomplete="current-password" />
        </div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="actions">
        <button class="btn-primary" @click="doLogin">Sign in</button>
        <button class="btn-secondary" @click="doRegister">Create account</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as apiLogin, register as apiRegister } from '../api/auth'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loginVal = ref('')
const password = ref('')
const error = ref('')

async function doLogin() {
  error.value = ''
  try {
    const token = await apiLogin(loginVal.value, password.value)
    auth.setToken(token)
    router.push('/chat')
  } catch {
    error.value = 'Invalid credentials'
  }
}

async function doRegister() {
  error.value = ''
  try {
    await apiRegister(loginVal.value, password.value)
    const token = await apiLogin(loginVal.value, password.value)
    auth.setToken(token)
    router.push('/chat')
  } catch {
    error.value = 'Registration failed. Login may already be taken.'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #131829;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: #1a2035;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.login-logo {
  width: 52px;
  height: 52px;
  background: #9b1c1c;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px;
}

.subtitle {
  font-size: 0.875rem;
  color: #5a6480;
  margin: 0 0 28px;
}

.fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #8892a4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input {
  padding: 11px 14px;
  background: #252e4b;
  border: 1px solid #2d3a56;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #e2e8f0;
  transition: border-color 0.15s;
}

input::placeholder {
  color: #3d4d6e;
}

input:focus {
  outline: none;
  border-color: #9b1c1c;
}

.error {
  width: 100%;
  font-size: 0.8rem;
  color: #f87171;
  margin: 8px 0 0;
  text-align: center;
}

.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #9b1c1c;
  color: white;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: #7f1d1d;
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: #252e4b;
  color: #8892a4;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #2d3a56;
  transition: background 0.15s, color 0.15s;
}

.btn-secondary:hover {
  background: #2d3a56;
  color: #c9d1e0;
}
</style>
