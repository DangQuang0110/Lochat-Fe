<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="../assets/logo.png" alt="" class="logo" />
      <p>Gặp sự cố khi đăng nhập?</p>
      <p>Nhập email đã liên kết để đăng nhập vào tài khoản.</p>

      <!-- Wrapper cho input + button, max-width 320px -->
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

      <router-link to="/login" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { sendOTP } from '@/service/otpService' // đã bỏ API

const router = useRouter()
const contact = ref('')
const emailError = ref('')

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

const sendLink = () => {
  if (!validateEmail()) return

  // Demo giao diện: chỉ hiện alert, không gọi API
  alert(`Mã OTP đã được gửi tới: ${contact.value.trim()}`)
  router.push('/verificationCode')
}
</script>

<style scoped>
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-box {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.logo {
  width: 125px;
  margin: 0 auto 1rem;
  display: block;
}

.auth-box p {
  font-size: 0.875rem;
  color: #374151;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

/* === Wrapper giữ input + button cùng max-width 320px === */
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

/* Input y hệt Login */
.input-group input {
  width: 100%;
  height: 45px;               /* Cao 45px */
  padding: 0 10px;            /* Chỉ padding trái/phải */
  font-size: 1rem;
  border: 1px solid #000000;  /* Viền màu vàng giống login */
  border-radius: 4px;         /* Bo góc 4px */
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box;
}

/* Khi input có lỗi */
.input-group input.error-input {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 4px;
  text-align: left;
}

/* Nút Gửi mã OTP giống Login */
.btn {
  width: 100%;
  max-width: 320px;    /* Ngang tối đa 320px */
  height: 45px;        /* Cao 45px */
  margin: 0 auto;      /* Căn giữa */
  display: block;
  border: none;
  border-radius: 4px;  /* Bo góc 4px */
  background-color: #000000;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #FB8C00;
}

/* Link Trở về */
.back {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #1e88e5;
  text-decoration: none;
  text-align: center;
}

.back:hover {
  text-decoration: underline;
}
</style>
