<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/lgo.png" alt="LOPET" class="logo" />
      <h1>Đăng Ký Tài Khoản</h1>

      <!-- Email -->
      <div class="input-group">
        <input
          type="text"
          v-model="contact"
          @focus="contactFocus = true"
          @blur="() => { contactFocus = false; validateContact() }"
          @input="validateContact"
          placeholder=" "
          :class="{ error: contactError }"
        />
        <label :class="{ active: contactFocus || contact }">Email</label>
        <div class="validation-message" :class="{ error: contactError }">
          {{ contactError || '' }}
        </div>
      </div>

      <!-- Số điện thoại -->
      <div class="input-group">
        <input
          type="text"
          v-model="phone"
          @focus="phoneFocus = true"
          @blur="() => { phoneFocus = false; validatePhone() }"
          @input="validatePhone"
          placeholder=" "
          :class="{ error: phoneError }"
        />
        <label :class="{ active: phoneFocus || phone }">Số điện thoại</label>
        <div class="validation-message" :class="{ error: phoneError }">
          {{ phoneError || '' }}
        </div>
      </div>

      <!-- Tên Người dùng -->
      <div class="input-group">
        <input
          type="text"
          v-model="fullname"
          @focus="fullnameFocus = true"
          @blur="() => { fullnameFocus = false; validateFullname() }"
          @input="validateFullname"
          placeholder=" "
          :class="{ error: fullnameError }"
        />
        <label :class="{ active: fullnameFocus || fullname }">Tên Người dùng</label>
        <div class="validation-message" :class="{ error: fullnameError }">
          {{ fullnameError || '' }}
        </div>
      </div>

      <!-- Mật khẩu -->
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          @focus="passwordFocus = true"
          @blur="() => { passwordFocus = false; validatePassword() }"
          @input="validatePassword"
          placeholder=" "
          autocomplete="new-password"
          :class="{ error: passwordError }"
        />
        <label :class="{ active: passwordFocus || password }">Mật khẩu</label>
        <span class="toggle-password" @click="togglePassword">
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
            <path
              d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36"
            />
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
            <path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
        <div class="validation-message" :class="{ error: passwordError }">
          {{ passwordError || ' ' }}
        </div>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="input-group password-group">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          @focus="confirmFocus = true"
          @blur="() => { confirmFocus = false; validateConfirmPassword() }"
          @input="validateConfirmPassword"
          placeholder=" "
          autocomplete="new-password"
          :class="{ error: confirmPasswordError }"
        />
        <label :class="{ active: confirmFocus || confirmPassword }">
          Nhập lại mật khẩu
        </label>
        <span class="toggle-password" @click="toggleConfirm">
          <svg
            v-if="!showConfirm"
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
            <path
              d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-10-4.5-10-10 0-2.5 1-4.7 2.64-6.36"
            />
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
            <path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
        <div class="validation-message" :class="{ error: confirmPasswordError }">
          {{ confirmPasswordError || '' }}
        </div>
      </div>

      <button class="btn" @click="handleRegister" :disabled="!isFormValid">
        Đăng ký
      </button>
      <router-link to="/" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { sendOTP } from '@/service/otpService';
import router from '@/router';
const contact = ref('')
const contactFocus = ref(false)
const contactError = ref('')

const phone = ref('')
const phoneFocus = ref(false)
const phoneError = ref('')

const fullname = ref('')
const fullnameFocus = ref(false)
const fullnameError = ref('')

const password = ref('')
const passwordFocus = ref(false)
const passwordError = ref('')
const showPassword = ref(false)

const confirmPassword = ref('')
const confirmFocus = ref(false)
const confirmPasswordError = ref('')
const showConfirm = ref(false)

/** Chuyển đổi hiển thị/mật khẩu ẩn */
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const toggleConfirm = () => {
  showConfirm.value = !showConfirm.value
}

/** Validate Email **/
// === Validate Email ===
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
const validateContact = () => {
  const val = contact.value.trim()
  // Nếu rỗng, không báo lỗi (chỉ clear)
  if (!val) {
    contactError.value = ''
    return true
  }
  // Nếu không rỗng nhưng sai định dạng thì báo lỗi
  if (!isValidEmail(val)) {
    contactError.value = 'Email không đúng định dạng'
    return false
  }
  contactError.value = ''
  return true
}

// === Validate Số điện thoại ===
const isValidPhone = (phoneStr) => {
  const cleaned = phoneStr.replace(/[\s-]/g, '')
  const re0 = /^0\d{9}$/
  const re84 = /^\+84\d{9}$/
  return re0.test(cleaned) || re84.test(cleaned)
}
const validatePhone = () => {
  const val = phone.value.trim()
  // Nếu rỗng, không báo lỗi (chỉ clear)
  if (!val) {
    phoneError.value = ''
    return true
  }
  // Nếu không rỗng nhưng sai định dạng thì báo lỗi
  if (!isValidPhone(val)) {
    phoneError.value = 'SĐT không đúng định dạng'
    return false
  }
  phoneError.value = ''
  return true
}

// === Validate Tên người dùng ===
const validateFullname = () => {
  const name = fullname.value.trim()
  // Nếu rỗng, không báo lỗi (chỉ clear)
  if (!name) {
    fullnameError.value = ''
    return true
  }
  if (name.length < 5) {
    fullnameError.value = 'Tên phải có ít nhất 5 ký tự'
    return false
  }
  if (name.length > 15) {
    fullnameError.value = 'Tên không được quá 15 ký tự'
    return false
  }
  if (/^\d+$/.test(name)) {
    fullnameError.value = 'Tên không được chỉ là số'
    return false
  }
  if (/\s/.test(name)) {
    fullnameError.value = 'Tên không được chứa khoảng trắng'
    return false
  }
  if (!/^[a-zA-ZÀ-ỹ0-9]+$/.test(name)) {
    fullnameError.value = 'Tên chỉ được chứa chữ cái và số'
    return false
  }
  fullnameError.value = ''
  return true
}

// === Validate Mật khẩu ===
const validatePassword = () => {
  const pwd = password.value
  // Nếu rỗng, không báo lỗi (chỉ clear)
  if (!pwd) {
    passwordError.value = ''
    return true
  }
  if (pwd.length < 8 || pwd.length > 15) {
    passwordError.value = 'Mật khẩu phải từ 8 đến 15 ký tự'
    return false
  }
  if (/\s/.test(pwd)) {
    passwordError.value = 'Mật khẩu không được chứa khoảng trắng'
    return false
  }
  const hasUpper = /[A-Z]/.test(pwd)
  const hasNum = /[0-9]/.test(pwd)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  if (!hasUpper) {
    passwordError.value = 'Mật khẩu phải có ít nhất 1 chữ hoa'
    return false
  }
  if (!hasNum) {
    passwordError.value = 'Mật khẩu phải có ít nhất 1 số'
    return false
  }
  if (!hasSpecial) {
    passwordError.value = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
    return false
  }
  passwordError.value = ''
  return true
}

// === Validate Xác nhận mật khẩu ===
const validateConfirmPassword = () => {
  const confirm = confirmPassword.value
  // Nếu rỗng, không báo lỗi (chỉ clear)
  if (!confirm) {
    confirmPasswordError.value = ''
    return true
  }
  if (confirm !== password.value) {
    confirmPasswordError.value = 'Mật khẩu xác nhận không khớp'
    return false
  }
  confirmPasswordError.value = ''
  return true
}


/** Computed để bật/tắt nút Đăng ký **/
const isFormValid = computed(() => {
  return (
    validateContact() &&
    validatePhone() &&
    validateFullname() &&
    validatePassword() &&
    validateConfirmPassword()
  )
})

/** Khi bấm Đăng ký (chỉ log ra console, không gọi API) **/
const handleRegister = async () => {
  const okEmail = validateContact()
  const okPhone = validatePhone()
  const okName = validateFullname()
  const okPwd = validatePassword()
  const okConfirm = validateConfirmPassword()

  if (okEmail && okPhone && okName && okPwd && okConfirm) {
    try {
      // 1. Gửi OTP đến email (chưa tạo tài khoản vội)
      await sendOTP(contact.value)

      // 2. Lưu thông tin đăng ký vào localStorage để dùng lại sau khi xác minh OTP
      localStorage.setItem('register_email', contact.value)
      localStorage.setItem('register_phone', phone.value)
      localStorage.setItem('register_username', fullname.value)
      localStorage.setItem('register_password', password.value)
      localStorage.setItem('register_confirm', confirmPassword.value)
      localStorage.setItem('register_flow', 'true')

      // 3. Chuyển sang trang nhập OTP
      router.push({ path: '/verificationCode' })
    } catch (error) {
      alert('❌ Gửi OTP thất bại: ' + (error?.response?.data?.message || 'Lỗi không xác định'))
    }
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
  overflow: hidden; /* Ẩn phần thừa khi scale ảnh */
}

/* Pseudo-element ::before chịu trách nhiệm hiển thị và làm mờ hình nền */
.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/background.jpg') no-repeat center/cover;
  background-size: cover;
       /* Điều chỉnh độ mờ theo ý bạn */
  transform: scale(1.1); /* Phóng to 10% để blur không bị viền cắt */
  z-index: 0;             /* Đặt nằm sau form */
}

/* Phần hộp form (auth-box) nằm ở trên lớp blur */
.auth-box {
  position: relative;
  z-index: 1;               /* Luôn luôn “trên” pseudo-element */
  background-color: #EEEEEE;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
  /* Nếu muốn form hơi “nổi” hơn, có thể thêm backdrop hoặc border:
     border: 1px solid rgba(0,0,0,0.05);
  */
}

.logo {
  width: 120px;
  margin: 0 auto -4rem;
  display: block;
}

h1 {
  font-size: 1.6rem;
  color: #dc77b2;
  margin-bottom: 1rem;
}

/* Giữ khoảng cách giữa các đoạn chữ */
.auth-box p {
  font-size: 0.95rem;
  color: #666;
  margin: 0.5rem 0 1rem;
}

/* Input-group chung */
.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

/* Input khung cao 45px, bo góc 4px */
.input-group input {
  width: 100%;
  height: 45px;
  padding: 0 10px;
  font-size: 1rem;
  border: 1px solid #000;
  border-radius: 4px;
  background: #f9f9f9;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #dc77b2;
}

.input-group input.error {
  border-color: #ef4444;
}

.input-group label {
  position: absolute;
  left: 10px;
  top: 14px;
  color: #dc77b2;
  pointer-events: none;
  transition: all 0.2s ease;
  
  padding: 0 4px;
  font-size: 1rem;
}

.input-group label.active {
  top: -16px;
  left: 8px;
  font-size: 0.75rem;
  color: #dc77b2;
  font-weight: 600;
}

/* Password-group để padding-right đủ chỗ toggle */
.password-group input {
  padding-right: 45px !important;
}

/* Ẩn autofill icon */
.password-group input::-ms-reveal,
.password-group input::-ms-clear {
  display: none;
}
.password-group input::-webkit-credentials-auto-fill-button,
.password-group input::-webkit-strong-password-auto-fill-button {
  display: none !important;
}

/* Toggle (icon mắt) */
.toggle-password {
  position: absolute;
  top: 14px;
  right: 12px;
  cursor: pointer;
  user-select: none;
  z-index: 10;
  height: 20px;
}

/* Validation message */
.validation-message {
  font-size: 0.8rem;
  text-align: left;
  margin-top: 0.25rem;
  padding-left: 10px;
  min-height: 1.2em;
  transition: color 0.3s ease;
}

.validation-message.error {
  color: #ef4444;
}

/* Nút Đăng ký */
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #dc77b2;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn:hover:not(:disabled) {
  background-color: #dc77b2;
  transform: translateY(-1px);
}

.btn:disabled {
  background-color: #dc77b2;
  cursor: not-allowed;
  transform: none;
}

/* Link ↩ Trở về */
.back {
  display: block;
  margin-top: 1rem;
  color: #dc77b2;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
}

.back:hover {
  text-decoration: underline;
}
</style>
