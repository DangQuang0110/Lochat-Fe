import apiService from '@/api/apiService'

export const sendOTP = async (email) => {
  try {
  const response= await apiService.post('/api/v1/auth/sendOtp', { email })
  console.log(response)
  return response  
  } catch (error) {
    console.log(error)
  }
}

export const verifyOTP = async ({ email, otp }) => {
  console.log(' Gửi verify OTP với:', { email, otp })
  try {
    const response = await apiService.post('/api/v1/auth/verifyOtp', { email, otp })
    console.log(' Kết quả verify:', response)
    return response
  } catch (error) {
    console.error(' Lỗi verifyOTP:', error)
    throw error
  }
}

