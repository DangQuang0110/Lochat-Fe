<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- Notification component -->
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
      <h1>Thay đổi mật khẩu</h1>
      <p class="sub-text">Vui lòng nhập mật khẩu cũ và mật khẩu mới để cập nhật tài khoản</p>

      <label>Mật khẩu cũ</label>
      <div class="input-group password-group">
        <input
          :type="showOldPassword ? 'text' : 'password'"
          v-model="oldPassword"
          @input="validateOldPassword"
          placeholder="Nhập mật khẩu cũ"
          :class="{ 'error-input': oldPasswordError }"
        />
        <span class="toggle-password" @click="showOldPassword = !showOldPassword">
          <svg
            v-if="!showOldPassword"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>
      <div v-if="oldPasswordError" class="error-message">{{ oldPasswordError }}</div>

      <label>Mật khẩu mới</label>
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          @input="validatePassword"
          placeholder="Nhập mật khẩu mới"
          :class="{ 'error-input': passwordError }"
        />
        <span class="toggle-password" @click="showPassword = !showPassword">
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

      <label>Xác nhận mật khẩu mới</label>
      <div class="input-group password-group">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          @input="validateConfirmPassword"
          placeholder="Nhập lại mật khẩu mới"
          :class="{ 'error-input': confirmPasswordError }"
        />
        <span class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
          <svg
            v-if="!showConfirmPassword"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M12 4c4.5 0 8.3 2.7 9.54 6.36" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </div>
      <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>

      <button class="btn" @click="handleReset" :disabled="!isFormValid">
        Đặt lại
      </button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

const router = useRouter()

const oldPassword = ref('')
const password = ref('')
const confirmPassword = ref('')
const showOldPassword = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const oldPasswordError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const notifications = ref([])

// Notification handler
// const addNotification = (message, type = 'success') => {
//   const id = Date.now()
//   notifications.value.push({ id, message, type })
  
//   // Auto-remove after 3 seconds
//   setTimeout(() => {
//     notifications.value = notifications.value.filter(n => n.id !== id)
//   }, 3000)
// }

const validateOldPassword = () => {
  if (!oldPassword.value) {
    oldPasswordError.value = 'Vui lòng nhập mật khẩu cũ'
    return false
  }
  const pwd = oldPassword.value
  if (pwd.length < 8 || pwd.length > 15) {
    oldPasswordError.value = 'Mật khẩu cũ phải từ 8 đến 15 ký tự'
    return false
  }
  if (!/[A-Z]/.test(pwd)) {
    oldPasswordError.value = 'Mật khẩu cũ phải có ít nhất 1 chữ cái in hoa'
    return false
  }
  if (!/[0-9]/.test(pwd)) {
    oldPasswordError.value = 'Mật khẩu cũ phải có ít nhất 1 chữ số'
    return false
  }
  if (!/[!@#$%^&*]/.test(pwd)) {
    oldPasswordError.value = 'Mật khẩu cũ phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)'
    return false
  }
  oldPasswordError.value = ''
  return true
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Vui lòng nhập mật khẩu mới'
    return false
  }
  const pwd = password.value
  if (pwd.length < 8 || pwd.length > 15) {
    passwordError.value = 'Mật khẩu mới phải từ 8 đến 15 ký tự'
    return false
  }
  if (!/[A-Z]/.test(pwd)) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 1 chữ cái in hoa'
    return false
  }
  if (!/[0-9]/.test(pwd)) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 1 chữ số'
    return false
  }
  if (!/[!@#$%^&*]/.test(pwd)) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)'
    return false
  }
  if (pwd === oldPassword.value && oldPassword.value) {
    passwordError.value = 'Mật khẩu mới không được trùng với mật khẩu cũ'
    return false
  }
  passwordError.value = ''
  return true
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Vui lòng nhập lại mật khẩu mới'
    return false
  }
  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Mật khẩu xác nhận không khớp'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

const isFormValid = computed(() => {
  return (
    validateOldPassword() &&
    validatePassword() &&
    validateConfirmPassword()
  )
})

const handleReset = () => {
  const okOld = validateOldPassword()
  const okNew = validatePassword()
  const okConfirm = validateConfirmPassword()

  if (okOld && okNew && okConfirm) {
    Toastify({
      text: "✅ Đặt lại mật khẩu thành công!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#27AE60",
    }).showToast()

    // Chuyển về trang đăng nhập sau khi toast hiển thị
    setTimeout(() => {
      router.push('/')
    }, 2000)

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
  padding: 2rem;
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
  width: 100px;
  margin: 0 auto -4rem;
  display: block;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #dc77b2;
  margin-bottom: 0.5rem;
}

.sub-text {
  font-size: 0.95rem;
  color: #dc77b2;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  text-align: left;
  font-size: 0.9rem;
  color: #dc77b2;
  margin-bottom: 0.3rem;
}

.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  height: 45px;
  padding: 0 10px;
  font-size: 1rem;
  color: #dc77b2;
  border: 1px solid #FFFFFF;
  border-radius: 4px;
  background: #FFFFFF;
  outline: none;
  box-sizing: border-box;
}

.input-group input.error-input {
  border-color: #ef4444;
}

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.btn {
  width: 100%;
  max-width: 400px;
  height: 45px;
  margin: 1rem auto 0;
  display: block;
  border: none;
  border-radius: 4px;
  background-color: #dc77b2;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 24px;
}

.btn:hover:not(:disabled) {
  background-color: #dc77b2;
}

.btn:disabled {
  background-color: #dc77b2;
  cursor: not-allowed;
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