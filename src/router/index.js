// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import FriendList from '@/components/FriendList.vue'
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
import GroupForm from '@/components/GroupForm.vue'
import GroupEditModal from '@/components/GroupEditModal.vue'
import AdminPage from '@/components/AdminPage.vue'
import OtpPass from '@/layout/VerificationCodePassword.vue'

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
    path:'/otppass',
    name:'OtpPass',
    component: OtpPass
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
  {
    path :'/groupform',
    name:'GroupForm',
    component: GroupForm
  },
  {
    path :'/editgroup',
    name:'GroupEditModal',
    component: GroupEditModal
  },
  
   {
    path :'/admin',
    name:'AdminPage',
    component: AdminPage
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
