<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/lgo.png" alt="" class="logo" />
      <h1>Đặt lại mật khẩu</h1>
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
      <router-link to="/login" class="back">← Trở về trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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
    alert('Đặt lại mật khẩu thành công (demo giao diện)')
    router.push('/')
  }
}
</script>

<style scoped>
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
  background: url('@/assets/background(1).png') no-repeat center/cover;
  background-size: cover;
}

/* Phần hộp form (auth-box) nằm ở trên lớp blur */
.auth-box {
  position: relative;
  z-index: 1;               /* Luôn luôn “trên” pseudo-element */
  background-color: #5b5b5b;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 400px;
  /* Nếu muốn form hơi “nổi” hơn, có thể thêm backdrop hoặc border:
     border: 1px solid rgba(0,0,0,0.05);
  */
}

.logo {
  width: 100px;
  margin: 0 auto 1rem;
  display: block;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.sub-text {
  font-size: 0.95rem;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  text-align: left;
  font-size: 0.9rem;
  color: #FFF;
  margin-bottom: 0.3rem;
}

.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
}

 .input-group input {
  width: 100%;
  height: 45px;             /* Chiều cao bằng nút */
  padding: 0 10px;          /* Chỉ padding trái/phải để giữ height cố định */
  font-size: 1rem;
  border: 1px solid #ABABAB;
  border-radius: 4px;
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box;   /* Đảm bảo padding không làm input vượt 45px */
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
  max-width: 400px;    /* ngang tối đa 320px */
  height: 45px;        /* cao 45px */
  margin: 1rem auto 0; /* cách trên 1rem, căn giữa */
  display: block;      /* để max-width và margin:auto có hiệu lực */
  border: none;
  border-radius: 4px;  /* bo góc 4px */
  background-color: #FFA726; /* giống màu cam Login */
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 24px;
}

.btn:hover:not(:disabled) {
  background-color: #FB8C00; /* cam đậm hơn khi hover */
}

.btn:disabled {
  background-color: #000;
  cursor: not-allowed;
}

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
