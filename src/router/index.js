// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Đường dẫn đúng đến các component trong src/layout/
import HelloWorld from '@/layout/HelloWorld.vue'
import LoginView  from '@/layout/LoginView.vue'
import RegisterView from '@/layout/RegisterView.vue'
import VerificationCode from '@/layout/VerificationCode.vue'
import ResetNewPassword from '@/layout/ResetNewPassword.vue'
import ResetPassword from '@/layout/ResetPassword.vue'
import FriendRequestPage from '@/components/FriendRequestPage.vue'


const routes = [
  {
    path: '/',
    name: 'hello',
    component: HelloWorld
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },

  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
   {
    path: '/verification-code',
    name: 'verification-code',
    component: VerificationCode
  },
  {
    path: '/resetnewpassword',
    name: 'resetnewpassword',
    component: ResetNewPassword
  },


  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword
  },
  {
    path: '/friend',
    name: 'FriendRequestPage',
    component: FriendRequestPage
  },

]

const router = createRouter({
  history: createWebHistory(), // Dùng HTML5 history mode
  routes
})

export default router
