  <template>
    <div class="auth-container">
      <div class="auth-box">
        <!-- BÊN TRÁI: CHỈ HIỂN THỊ ẢNH COVER -->
        <div class="left-side">
          <!-- Nếu bạn muốn chèn <img> thẳng vào, có thể dùng: -->
          <!-- <img src="@/assets/your-left-image.jpg" alt="Left Illustration" /> -->
          <!-- Ở ví dụ bên dưới, ta dùng CSS background để cover luôn -->
        </div>

        <!-- BÊN PHẢI: FORM ĐĂNG NHẬP -->
        <div class="right-side">
          <!-- Nếu bạn muốn logo ở đầu form, thay src thành logo thực -->
          <img src="@/assets/lgo.png" alt="LOCHAT" class="logo" />
          <h2>Đăng nhập</h2>

          <!-- Username -->
          <div class="input-group">
            <input
              type="text"
              v-model="email"
              @focus="emailFocus = true"
              @blur="() => { emailFocus = false; validateEmail() }"
              @input="validateEmail"
              placeholder=" "
            />
            <label :class="{ active: emailFocus || email }">Tên người dùng</label>
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div class="input-group password-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              @focus="passwordFocus = true"
              @blur="() => { passwordFocus = false; validatePassword() }"
              @input="validatePassword"
              placeholder=" "
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
            <p v-if="errors.password" class="error">{{ errors.password }}</p>
          </div>
  <!-- thêm 1 div.form-actions để gom Quên mật khẩu + nút Đăng nhập -->
  <div class="form-actions">
    <a href="/reset-Password" class="forgot">Quên mật khẩu?</a>
    <button class="btn" :disabled="!isFormValid" @click="handleLogin">
      ĐĂNG NHẬP
    </button>
  </div>

          <div class="or-divider">Hoặc</div>
          <p class="footer">
            Chưa có tài khoản? 
            <router-link to="/register">Đăng ký ngay</router-link>
          </p>
        </div>
      </div>
    </div>
</template>

  <script setup>
  import { ref, reactive, computed } from 'vue'
  import { loginUser } from '@/service/authService'
  import { useRouter } from 'vue-router'

  const router = useRouter()


  const email = ref('')
  const password = ref('')
  const emailFocus = ref(false)
  const passwordFocus = ref(false)
  const showPassword = ref(false)

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/

  const errors = reactive({
    email: '',
    password: ''
  })



  const validateEmail = () => {
    const value = email.value.trim()
    if (!value) {
      errors.email = 'Vui lòng nhập tên đăng nhập'
    } else if (value.length < 6 || value.length > 20) {
      errors.email = 'Tên đăng nhập phải từ 6 đến 20 ký tự'
    } else if (/\s/.test(value)) {
      errors.email = 'Tên đăng nhập không được chứa khoảng trắng'
    } else if (/^\d+$/.test(value)) {
      errors.email = 'Tên đăng nhập không được chỉ gồm số'
    } else if (!/^[A-Za-z\d]+$/.test(value)) {
      errors.email = 'Tên đăng nhập chỉ được chứa chữ cái và số'
    } else {
      errors.email = ''
    }
  }

  const validatePassword = () => {
    if (!password.value) {
      errors.password = 'Vui lòng nhập mật khẩu'
    } else if (/\s/.test(password.value)) {
      errors.password = 'Mật khẩu không được chứa khoảng trắng'
    } else if (password.value.length < 8 || password.value.length > 15) {
      errors.password = 'Mật khẩu phải từ 8 đến 15 ký tự'
    } else if (!passwordRegex.test(password.value)) {
      errors.password = 'Mật khẩu phải có 1 chữ in hoa, 1 ký tự đặc biệt và 1 số'
    } else {
      errors.password = ''
    }
  }

  const isFormValid = computed(() => {
    return email.value && password.value && !errors.email && !errors.password
  })

  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }

const handleLogin = async () => {
  validateEmail()
  validatePassword()
  if (!isFormValid.value) return

  try {
    const res = await loginUser({
      username: email.value,
      password: password.value
    })

    console.log('✅ Đăng nhập thành công:', res)

    // Lưu accountId và user
    localStorage.setItem('accountId', res.userId)
    localStorage.setItem('user', JSON.stringify({
      id: res.userId,
      username: res.username,
      roles: res.roles
    }))

    // 👉 Chuyển hướng nếu tài khoản là "toilaadmin"
    if (email.value === 'toilaadmin') {
      router.push('/admin')
    } else {
      router.push('/message')
    }

  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err)
    errors.password = err?.message || 'Tên đăng nhập hoặc mật khẩu sai'
  }
}
  </script>

  <style scoped>

  * {
  font-family: 'Roboto', sans-serif;
}

  /* Container full screen (nếu bạn muốn background full màn hình) */
  .auth-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    overflow-y: auto;
    overflow: hidden; /* Ẩn phần ảnh bị scale vượt khung */
    background-color: #f0f0f0; /* Màu nền dự phòng nếu ảnh không load */
  }

  /* === Pseudo-element để hiển thị ảnh nền và làm mờ === */
  .auth-container::before {
    content: "";
    position: absolute;
    inset: 0;
    /* Thay background.jpg thành file ảnh thực trong thư mục assets */
    background: url('@/assets/background.jpg') no-repeat center/cover;
                  /* Đặt phía sau mọi nội dung của auth-container */
  }

  /* Phần chứa chính (auth-box) */
  .auth-box {
    position: relative;          /* Đảm bảo nằm trên layer ảnh nền */
    z-index: 1;                  /* Làm cho auth-box hiển thị trên pseudo-element */
    display: flex;
    flex-direction: row;
    background-color: transparent;
    overflow: hidden;
    width: 800px;
    max-width: 95%;
    height: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* LEFT SIDE: hiển thị ảnh cover full */
  .left-side {
    flex: 1;
    background: url('@/assets/anhnen.jpg') no-repeat center/cover;
  }


  .right-side {
    flex: 1;
    position: relative;
    background-color: #EEEEEE; 
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
  }


  /* Pseudo-element này nằm ngay bên trong .right-side, phủ kín toàn bộ */
  .right-side::before {
    content: "";
    position: absolute;
    inset: 0;                  /* top:0; right:0; bottom:0; left:0; */
    background-color: #5b5b5b;   /* nền trắng bị blur */
    filter: blur(440px);         /* điều chỉnh độ mờ tùy thích */
    z-index: 0;                /* nằm dưới các nội dung con */
  }

  h2 {
    color: #dc77b2; /* màu hồng pastel giống trong hình */
    margin-bottom: 1rem;
  }
  /* Đảm bảo tất cả phần tử con của .right-side (form, input, nút, ...) đều có z-index cao hơn */
  .right-side > * {
    position: relative;
    z-index: 1;
  }

  /* Logo ở đầu form */
  .logo {
    width: 120px;              /* hoặc tuỳ chỉnh 100–150px tuỳ mockup */
    display: block;
    margin: -5rem 0; 
  }
  /* Input group (username/password) */
  .input-group {
  position: relative;
  margin-bottom: 0.5rem;
  width: 100%;
  max-width: 320px;
  min-height: 90px; /* CỐ ĐỊNH chiều cao để không giật khi label thay đổi */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.input-group input {
  width: 100%;
  height: 45px;
  padding: 0 10px;
  font-size: 1rem;
  border: 1px solid #000;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
}

/* LABEL nổi lên nhưng không đẩy khung */
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
  color: #DC77B2;
  font-weight: 500;
}

  /* đảm bảo wrapper có position: relative */
  .password-group {
    position: relative;
  }

  .toggle-password {
    position: absolute;
    top: 0;
    right: 12px;
    /* (45px input height − 20px icon height) / 2 = 12.5px */
    margin-top: 12.5px;
    cursor: pointer;
    user-select: none;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transform: none;   /* bỏ translateY */
  }

  .toggle-password svg {
    width: 20px;
    height: 20px;
    stroke: #888;
    margin: 0;
  }


  /* Link “Quên mật khẩu” */
  .forgot {
    margin-top: -0.5rem;
    margin-bottom: 1rem;
    color: #040404;
    font-size: 1rem;
    text-align: right;
    width: 100%;
    max-width: 320px;
    text-decoration: none;
  }

  .forgot:hover {
  text-decoration: none;
}
  /* Nút Đăng nhập */
  .btn {
    width: 100%;               /* full trong wrapper 320px */
    height: 45px;
    max-width: none;           /* đã bị override nếu trước đó có */
    border-radius: 4px;
    background-color: #000;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
  }

  .btn:hover:not(:disabled) {
    background-color: #DC77B2;
  }

  .btn:disabled {
    background-color: #DC77B2;
    cursor: not-allowed;
  }
  /* Divider “Hoặc” */
  .or-divider {
    margin: 1rem 0;
    font-size: 1rem;
    color: #000;
    position: relative;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    width: 100%;
    max-width: 320px;
  }

  .or-divider::before,
  .or-divider::after {
    content: '';
    height: 1px;
    background: #000;
    flex: 1;
    margin: 0 10px;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 320px;          /* giống với .input-group */
    gap: 0.5rem;               /* khoảng cách giữa link & button */
    margin-bottom: 1rem;
  }

  /* Footer dưới form */
  .footer {
    font-size: 1.1rem;
    text-align: center;
    width: 100%;
    max-width: 320px;
    margin-top: auto; /* đẩy xuống đáy right-side */
  }

  .footer a {
  color: #dc77b2;
    text-decoration: none;
  }

  /* Thông báo lỗi */
  .error {
    min-height: 18px;
    color: #e0251f;
    font-size: 0.85rem;
    margin-top: 6px;
    margin-bottom: 0;
    text-align: left;
  }

  /* RESPONSIVE: khi màn hình nhỏ, xếp cột thay vì hàng */
  @media (max-width: 768px) {
    .auth-box {
      flex-direction: column;
      width: 100%;
      height: auto;
    }
    .left-side,
    .right-side {
      width: 100%;
      height: 280px; /* mỗi phần một nửa chiều cao ban đầu */
    }
    .right-side {
      padding: 1rem;
    }
    .logo {
      width: 60px;
    }
    .input-group,
    .forgot,
    .btn,
    .or-divider,
    .footer {
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    .input-group input {
      padding: 10px 8px;
      font-size: 0.95rem;
    }
    .btn {
      padding: 10px;
      font-size: 0.95rem;
    }
    .forgot {
      font-size: 0.8rem;
    }
    .or-divider {
      font-size: 0.7rem;
    }
  }
  </style>   
