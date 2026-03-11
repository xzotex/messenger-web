<template>
  <div class="login-wrap">
    <div class="login-box">
      <h1>Messenger</h1>
      <input v-model="loginVal" placeholder="Login" />
      <input v-model="password" type="password" placeholder="Password" />
      <p v-if="error" class="error">{{ error }}</p>
      <div class="btns">
        <button @click="doLogin">Sign in</button>
        <button @click="doRegister" class="secondary">Register</button>
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
.login-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f2f5;
}
.login-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}
.btns { display: flex; gap: 0.5rem; }
button {
  flex: 1;
  padding: 0.65rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
button.secondary { background: #6b7280; }
.error { color: #dc2626; font-size: 0.875rem; margin: 0; }
</style>
