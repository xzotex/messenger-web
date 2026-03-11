import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    {
      path: '/chat',
      component: ChatView,
      beforeEnter: () => {
        if (!localStorage.getItem('token')) return '/'
      },
    },
  ],
})

export default router
