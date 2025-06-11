// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// import Home from '@/components/ComHome.vue'
import FriendList from '@/components/FriendList.vue'
// Đường dẫn đúng đến các component trong src/layout/
import LoginView  from '@/layout/LoginView.vue'
import RegisterView from '@/layout/RegisterView.vue'
import VerificationCode from '@/layout/VerificationCode.vue'
import ResetNewPassword from '@/layout/ResetNewPassword.vue'
import ResetPassword from '@/layout/ResetPassword.vue'
import ComMessage from '@/components/ComMessage.vue'
import FriendRequestPage from '@/components/FriendRequestPage.vue'


import AddFriend from '@/components/AddFriend.vue'
import MessageNewDetail from '@/components/MessageNewDetail.vue'

import InvitationSent from '@/components/InvitationSent.vue'
import FriendSuggest from '@/components/FriendSuggest.vue'
import GroupManagement from '@/components/GroupManagement.vue'

const routes = [
  {
    path:'/friendlist',
    name: 'FriendList',
    component: FriendList
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
    path: '/friend',
    name: 'FriendRequestPage',
    component: FriendRequestPage
  },
  {
    path: '/message',
    name: 'message',
    component: ComMessage
  },
  {
    path: '/addfriend',
    name: 'AddFriend',
    component: AddFriend
  },
  {
    path: '/messagenew',
    name: 'MessageNewDetail',
    component: MessageNewDetail
  },
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path :'/FriendSuggest',
    name:'FriendSuggest',
    component: FriendSuggest
  },
  {
    path:'/InvitationSent',
    name:'InvitationSent',
    component:InvitationSent
  },
  {
    path :'/groupnew',
    name:'GroupManagement',
    component: GroupManagement
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
