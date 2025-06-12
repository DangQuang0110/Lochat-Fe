import apiService from '@/api/apiService'


export async function getAccountDetail(accountId) {
  try {
    const response = await apiService.get(`/api/v1/accounts/detail/${accountId}`)
    return response.data.data
  } catch (err) {
    console.error('Lỗi khi gọi API lấy tài khoản chi tiết:', err)
    throw err
  }
}
export async function updateProfile(profileId, data, avatarFile, coverFile) {
  const formData = new FormData()
  formData.append('fullname', data.name)
  formData.append('bio', data.bio)
  formData.append('phone', data.phone)
  if (avatarFile) formData.append('avatar', avatarFile)
  if (coverFile) formData.append('cover', coverFile)

  const res = await apiService.put(`/api/v1/profiles/${profileId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return res.data.data
}