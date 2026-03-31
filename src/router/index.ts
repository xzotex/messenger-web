import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import ChatView from '@/views/ChatView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    {
      path: '/chat',
      component: ChatView,
      beforeEnter: () => {
        const auth = useAuthStore()
        if (!auth.token) return '/'
      },
    },
  ],
})

export default router
