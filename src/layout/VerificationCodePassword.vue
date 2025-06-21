<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/lgo.png" alt="" class="logo" />
      <p>Hãy nhập mã xác thực được gửi tới email của bạn</p>
      <p>Mã OTP sẽ hết hạn trong vòng 2 phút</p>

      <div class="otp-inputs">
        <input
          v-for="(digit, index) in otp"
          :key="index"
          :id="`otp-input-${index}`"
          type="text"
          maxlength="1"
          class="otp-input"
          v-model="otp[index]"
          @input="(e) => handleOtpInput(e, index)"
        />
      </div>

      <a
        href="#"
        @click.prevent="resendOtp"
        :style="{ pointerEvents: countdown === 0 ? 'auto' : 'none', opacity: countdown === 0 ? 1 : 0.5 }"
      >
        Gửi lại mã OTP {{ formatCountdown() }}
      </a>

      <button class="btn" @click="verifyAndGo">Xác nhận</button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

import { verifyOTP } from '@/service/otpService'

/* -------------------------------------------------- */
const router     = useRouter()
const otp        = ref(['', '', '', '', '', ''])
const countdown  = ref(120)
let   intervalId = null
/* -------------------------------------------------- */

/* ======= Đếm ngược thời gian OTP ======= */
const startCountdown = () => {
  intervalId = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(intervalId)
  }, 1000)
}

onMounted(() => {
  nextTick(() => document.querySelector('#otp-input-0')?.focus())
  startCountdown()
})

onBeforeUnmount(() => clearInterval(intervalId))

/* ======= Xử lý nhập OTP ======= */
const handleOtpInput = async (e, idx) => {
  const v = e.target.value
  if (!/^\d?$/.test(v)) {
    otp.value[idx] = ''
    return
  }
  otp.value[idx] = v
  if (v && idx < otp.value.length - 1) {
    await nextTick()
    document.querySelector(`#otp-input-${idx + 1}`)?.focus()
  }
}

/* ======= Gửi lại OTP giả lập ======= */
const resendOtp = () => {
  Toastify({
    text: '🔄 Mã OTP mới đã được gửi lại.',
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor: '#3498DB',
  }).showToast()

  countdown.value = 120
  clearInterval(intervalId)
  startCountdown()
}

/* ======= Xác nhận OTP và chuyển trang ======= */
const verifyAndGo = async () => {
  const code = otp.value.join('')
  if (code.length !== 6) {
    Toastify({
      text: '⚠️ Vui lòng nhập đủ 6 chữ số OTP!',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#F39C12',
    }).showToast()
    return
  }

  const email = localStorage.getItem('reset_email')       // đã lưu ở bước “quên mật khẩu”

  try {
    await verifyOTP({ email, otp: code })

    /* Lưu cờ xác thực và điều hướng tới form đặt mật khẩu mới */
    localStorage.setItem('reset_email_verified', 'true')

    Toastify({
      text: '✅ Xác thực thành công! Vui lòng tạo mật khẩu mới.',
      duration: 2500,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#27AE60',
    }).showToast()

    setTimeout(() => router.push('/resetnewpassword'), 1200)
  } catch (err) {
    Toastify({
      text: '❌ Xác thực thất bại: ' + (err?.response?.data?.message || 'OTP sai hoặc hết hạn'),
      duration: 4000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#E74C3C',
    }).showToast()
  }
}

/* ======= Hiển thị mm:ss ======= */
const formatCountdown = () => {
  const m = String(Math.floor(countdown.value / 60)).padStart(2, '0')
  const s = String(countdown.value % 60).padStart(2, '0')
  return `${m}:${s}`
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
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-box {
  background-color: #EEEEEE;
  /* border-radius: 12px; */
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
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

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.otp-input {
  width: 45px;
  height: 50px;
  border: 2px solid #ABABAB; /* Đổi màu viền thành ABABAB */
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
  transition: border-color 0.3s;
}

.otp-input:focus {
  border-color: #dc77b2;
  outline: none;
  box-shadow: 0 0 5px rgba(147, 139, 130, 0.5);
}

.auth-box a {
  color: #dc77b2;
  font-size: 0.875rem;
  margin-top: 1rem;
  display: block;
  text-decoration: none;
}

.auth-box a:hover {
  text-decoration: underline;
}

.btn {
  margin-top: 1rem;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 8px;
  background-color: #dc77b2;
  color: white;
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
  background: transparent;
  padding: 0;
}

.back:hover {
  text-decoration: underline;
}
</style>
