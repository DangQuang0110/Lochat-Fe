import apiService from '@/api/apiService'

// Đăng ký tài khoản
export const registerUser = async ({ email,phoneNumber, username, password, confirmPassword }) => {
  try {
    const response = await apiService.post('/api/v1/auth/register', {
      email,
      username,
      phoneNumber,
      password,
      confirmPassword,
    })
    return response.data
  } catch (error) {
    console.error('❌ Lỗi khi tạo tài khoản:', error.response?.data || error)
    throw error
  }
}

// Đăng nhập
export const loginUser = async ({ username, password }) => {
  try {
    const response = await apiService.post('/api/v1/auth/login', {
      username,
      password,
    })

    const {
      id: userId,
      username: returnedUsername,
      accessToken,
      refreshToken,
      roles
    } = response.data.data

    // Lưu token và set header mặc định
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    apiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    return { userId, username: returnedUsername, roles }
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err.response?.data || err)
    throw err.response?.data ?? err
  }
}
// Đăng xuất người dùng
export const logoutUser = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  delete apiService.defaults.headers.common['Authorization']
}