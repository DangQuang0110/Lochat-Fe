<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- Notification -->
      <transition-group name="fade" tag="div" class="notification-container">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="['notification', notification.type]"
        >
          {{ notification.message }}
        </div>
      </transition-group>

      <img src="@/assets/lgo.png" alt="" class="logo" />
      <p>Gặp sự cố khi đăng nhập?</p>
      <p>Nhập email đã liên kết để đăng nhập vào tài khoản.</p>

      <div class="form-wrapper">
        <div class="input-group">
          <input
            v-model="contact"
            type="email"
            placeholder="Nhập email"
            @blur="validateEmail"
            :class="{ 'error-input': emailError }"
          />
          <p v-if="emailError" class="error-message">
            {{ emailError }}
          </p>
        </div>

        <button class="btn" @click="sendLink">Gửi mã OTP</button>
      </div>

      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendOTP } from '@/service/otpService'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

const router = useRouter()
const contact = ref('')
const emailError = ref('')
const notifications = ref([])

const validateEmail = () => {
  const email = contact.value.trim()
  if (!email) {
    emailError.value = 'Vui lòng nhập email!'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = 'Email không đúng định dạng!'
    return false
  }
  emailError.value = ''
  return true
}

const sendLink = async () => {
  if (!validateEmail()) return

  try {
    // ✅ Truyền đúng kiểu chuỗi email, không phải object
    await sendOTP(contact.value.trim())

    // Lưu localStorage như cũ
    localStorage.setItem('reset_email', contact.value.trim())
    localStorage.setItem('reset_flow', 'true')

    Toastify({
      text: `📧 Mã OTP đã được gửi tới: ${contact.value.trim()}`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#3498DB",
    }).showToast()

    setTimeout(() => {
      router.push('/otppass')
    }, 1000)

  } catch (err) {
    const msg = err?.response?.data?.message || 'Gửi OTP thất bại!'
    Toastify({
      text: `❌ ${msg}`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#E74C3C",
    }).showToast()
  }
}

</script>

<style scoped>
* {
  font-family: 'Roboto', sans-serif;
}

.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/background.jpg') no-repeat center/cover;
  background-size: cover;
}

.auth-box {
  position: relative;
  z-index: 1;
  background-color: #EEEEEE;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
}

.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.logo {
  width: 125px;
  margin: 0 auto -4rem;
  display: block;
}

.auth-box p {
  font-size: 0.875rem;
  color: #dc77b2;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.form-wrapper {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.input-group input {
  width: 100%;
  height: 45px;
  padding: 0 10px;
  font-size: 1rem;
  border: 1px solid #000000;
  border-radius: 4px;
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box;
}

.input-group input.error-input {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 4px;
  text-align: left;
}

.btn {
  width: 100%;
  max-width: 320px;
  height: 45px;
  margin: 0 auto;
  display: block;
  border: none;
  border-radius: 4px;
  background-color: #dc77b2;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #dc77b2;
}

.back {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #dc77b2;
  text-decoration: none;
  text-align: center;
}

.back:hover {
  text-decoration: underline;
}
</style>