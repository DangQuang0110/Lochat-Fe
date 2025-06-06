<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="../assets/logo.png" alt="LOPET" class="logo" />
      <h1>Đăng Ký Tài Khoản</h1>
      <!-- <p class="sub-text">Tham gia cộng đồng yêu thú cưng ngay hôm nay!</p> -->

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
    <!-- Đổi nhãn thành “Email hoặc SĐT” -->
    <label :class="{ active: contactFocus || contact }">Email hoặc số điện thoại</label>
    <div class="validation-message" :class="{ error: contactError }">
      {{ contactError || '' }}
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
          {{ passwordError || 'Tối đa 15 ký tự, có ít nhất 1 chữ hoa, 1 ký tự đặc biệt và 1 số' }}
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
      <router-link to="/login" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const contact = ref('')
const contactFocus = ref(false)
const contactError = ref('')

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

/** Validate Email (cơ bản) **/
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
const validateContact = () => {
  const val = contact.value.trim()
  if (!val) {
    contactError.value = 'Vui lòng nhập email'
    return false
  }
  if (!isValidEmail(val)) {
    contactError.value = 'Email không đúng định dạng'
    return false
  }
  contactError.value = ''
  return true
}

/** Validate Tên người dùng **/
const validateFullname = () => {
  const name = fullname.value.trim()
  if (!name) {
    fullnameError.value = 'Vui lòng nhập tên người dùng'
    return false
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

/** Validate Mật khẩu **/
const validatePassword = () => {
  const pwd = password.value
  if (!pwd) {
    passwordError.value = 'Vui lòng nhập mật khẩu'
    return false
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

/** Validate Xác nhận mật khẩu **/
const validateConfirmPassword = () => {
  const confirm = confirmPassword.value
  if (!confirm) {
    confirmPasswordError.value = 'Vui lòng xác nhận mật khẩu'
    return false
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
    validateFullname() &&
    validatePassword() &&
    validateConfirmPassword()
  )
})

/** Khi bấm Đăng ký (chỉ log ra console, không gọi API) **/
const handleRegister = () => {
  const okEmail = validateContact()
  const okName = validateFullname()
  const okPwd = validatePassword()
  const okConfirm = validateConfirmPassword()
  if (okEmail && okName && okPwd && okConfirm) {
    console.log('Form đăng ký hợp lệ:', {
      email: contact.value,
      username: fullname.value,
      password: password.value,
    })
    alert('Đăng ký thành công (ví dụ) — hiển thị thông báo hoặc chuyển trang tùy ý')
    // Nếu muốn redirect sau khi đăng ký, dùng router.push(...) ở đây
  }
}
</script>

<style scoped>
/* 1. Toàn màn hình, background rõ nét */
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('../assets/background.jpg') no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 2. Hộp đăng ký */
.auth-box {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
}

/* Logo */
.logo {
  width: 120px;
  margin: 0 auto 1rem;
  display: block;
}

/* Tiêu đề & sub-text */
h1 {
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.sub-text {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
}

/* Input-group chung */
.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 1.25rem;
}

.input-group input {
  width: 100%;
  height: 45px;               /* Cao 45px giống form Đăng ký */
  padding: 0 10px;            /* Padding trái/phải 10px, bỏ padding trên/dưới để giữ height cố định */
  font-size: 1rem;
  border: 1px solid #000000;  /* Màu border #f4ae18 giống bên Đăng ký */
  border-radius: 4px;
  background: #FFFFFF;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;     /* Đảm bảo padding không làm tăng kích thước vượt 45px */
}

.input-group input:focus {
  border-color: #000000;      /* Nếu muốn giống bên Đăng ký khi focus */
}

.input-group input.error {
  border-color: #f44336;
}

.input-group label {
  position: absolute;
  left: 10px;
  top: 14px;
  color: #999;
  pointer-events: none;
  transition: all 0.2s ease;
  background-color: #ffffff;
  padding: 0 4px;
  font-size: 1rem;
}

.input-group label.active {
  top: -10px;
  left: 8px;
  font-size: 0.75rem;
  color: #000000;
  font-weight: 600;
}

/* Password-group */
.password-group input {
  padding-right: 45px !important;
}

.password-group input::-ms-reveal,
.password-group input::-ms-clear {
  display: none;
}

.password-group input::-webkit-credentials-auto-fill-button,
.password-group input::-webkit-strong-password-auto-fill-button {
  display: none !important;
}

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
  color: #f44336;
}

.validation-message:not(.error) {
  color: #666;
}

/* Nút Đăng ký */
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #ffa726;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn:hover:not(:disabled) {
  background-color: #fb8c00;
  transform: translateY(-1px);
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Link ↩ Trở về */
.back {
  display: block;
  margin-top: 1rem;
  color: #1e88e5;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
  background-color: transparent !important;
  outline: none;
  border: none;
  transition: color 0.3s ease;
}

.back:hover {
  text-decoration: underline;
  color: #1565c0;
}
</style>
