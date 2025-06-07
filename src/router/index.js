// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Đường dẫn đúng đến các component trong src/layout/
import HelloWorld from '@/layout/HelloWorld.vue'
import LoginView  from '@/layout/LoginView.vue'
import RegisterView from '@/layout/RegisterView.vue'
import VerificationCode from '@/layout/VerificationCode.vue'
import ResetNewPassword from '@/layout/ResetNewPassword.vue'
import ResetPassword from '@/layout/ResetPassword.vue'
import ComMessage from '@/components/ComMessage.vue'

// Nếu bạn có thêm component khác (ví dụ HomeView.vue) hãy import ở đây.
// import HomeView from '@/layout/HomeView.vue'

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
    path: '/verificationCode',
    name: 'verificationCode',
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
    path: '/message',
    name: 'message',
    component: ComMessage
  },

  // Ví dụ nếu thêm HomeView:
  // {
  //   path: '/home',
  //   name: 'home',      S
  //   component: HomeView
  // }
]

const router = createRouter({
  history: createWebHistory(), // Dùng HTML5 history mode
  routes
})

export default router
