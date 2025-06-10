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

      <!-- Nút xác nhận -->
      <button class="btn" @click="sendLink">Xác nhận</button>
      <router-link to="/login" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { verifyOTP } from '@/service/otpService';
import { registerUser } from '@/service/authService';
import { useRouter } from 'vue-router'

const router = useRouter()

// Mảng lưu 6 ký tự OTP
const otp = ref(['', '', '', '', '', ''])

// Đếm ngược 120 giây
const countdown = ref(120)
let intervalId = null

// Chạy đếm ngược
const startCountdown = () => {
  intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(intervalId)
    }
  }, 1000)
}

onMounted(() => {
  nextTick(() => {
    document.querySelector('#otp-input-0')?.focus()
  })
  startCountdown()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

// Khi gõ OTP, tự động nhảy sang ô kế tiếp
const handleOtpInput = async (event, index) => {
  const value = event.target.value
  // Chỉ cho phép số (hoặc xóa để sửa lại)
  if (!/^\d?$/.test(value)) {
    otp.value[index] = ''
    return
  }
  otp.value[index] = value

  if (value.length === 1 && index < otp.value.length - 1) {
    await nextTick()
    const nextInput = document.querySelector(`#otp-input-${index + 1}`)
    if (nextInput) nextInput.focus()
  }
}

// Hàm giả lập gửi lại OTP (chỉ show alert, không gọi API)
const resendOtp = () => {
  alert('Chức năng gửi lại mã OTP đã được kích hoạt.')
  countdown.value = 120
  clearInterval(intervalId)
  startCountdown()
}

// Khi bấm Xác nhận
const sendLink = async () => {
  const otpString = otp.value.join('')
  if (otpString.length !== 6) {
    alert('⚠️ Vui lòng nhập đủ 6 chữ số OTP!')
    return
  }

  // Lấy thông tin từ localStorage
  const email = localStorage.getItem('register_email')
  const phone = localStorage.getItem('register_phone')
  const username = localStorage.getItem('register_username')
  const password = localStorage.getItem('register_password')
  const confirmPassword = localStorage.getItem('register_confirm')

  try {
    // 1. Gửi OTP xác minh
    await verifyOTP({ email, otp: otpString })

    // 2. OTP hợp lệ => Gửi API tạo tài khoản
    await registerUser({
      email,
      phoneNumber: phone,
      username,
      password,
      confirmPassword
    })

    // 3. Xóa localStorage
    localStorage.removeItem('register_email')
    localStorage.removeItem('register_phone')
    localStorage.removeItem('register_username')
    localStorage.removeItem('register_password')
    localStorage.removeItem('register_confirm')
    localStorage.removeItem('register_flow')

    alert('✅ Đăng ký và xác thực thành công! Mời bạn đăng nhập.')
    router.push('/login')
  } catch (err) {
    alert('❌ Xác thực thất bại: ' + (err?.response?.data?.message || 'OTP sai hoặc hết hạn'))
  }
}
// Format đếm ngược thành mm:ss
const formatCountdown = () => {
  const min = String(Math.floor(countdown.value / 60)).padStart(2, '0')
  const sec = String(countdown.value % 60).padStart(2, '0')
  return `${min}:${sec}`
}
</script>

<style scoped>
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/background(1).png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-box {
  background-color: #5b5b5b;
  /* border-radius: 12px; */
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
  color: #FFFFFF;
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
  border-color: #fb8c00;
  outline: none;
  box-shadow: 0 0 5px rgba(251, 140, 0, 0.5);
}

.auth-box a {
  color: #FFFFFF;
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
  background-color: #000;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #fb8c00;
}

.back {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #1e88e5;
  text-decoration: none;
  text-align: center;
  background: transparent;
  padding: 0;
}

.back:hover {
  text-decoration: underline;
}
</style>
