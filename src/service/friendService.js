// src/services/friendService.js
import apiService from '@/api/apiService'

export const getAcceptedFriends = async (accountId) => {
  try {
    const response = await apiService.get(`/api/v1/friendShips/${accountId}`)
    return response.data.data?.others ?? [] // ✅ truy đúng vào `data.others`
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bạn bè:', error)
    return []
  }
}

export const getReceivedFriendRequests = async (accountId) => {
  try {
    const res = await apiService.get(`/api/v1/friendShips/receive/${accountId}`)
    return res.data.data?.others ?? [] // ✅ fix: truy cập đúng vào data.others
  } catch (err) {
    console.error('Lỗi khi lấy lời mời kết bạn:', err)
    return []
  }
}


export const respondToFriendRequest = async ({ senderId, receiverId, status }) => {
  try {
    await apiService.put('/api/v1/friendShips/', { senderId, receiverId, status })
  } catch (err) {
    console.error('Lỗi khi phản hồi lời mời:', err)
    throw err
  }
}
export const getSentFriendRequests = async (accountId) => {
  try {
    const res = await apiService.get(`/api/v1/friendShips/send/${accountId}`)
    return res.data.data?.others ?? [] // lấy danh sách đã gửi
  } catch (err) {
    console.error('Lỗi khi lấy lời mời đã gửi:', err)
    return []
  }
}
export const unfriend = async ({ senderId, receiverId }) => {
  try {
    await apiService.delete('/api/v1/friendShips/', {
      data: { senderId, receiverId } // 💡 axios cần `data` khi dùng DELETE
    })
  } catch (err) {
    console.error('❌ Lỗi khi huỷ kết bạn:', err)
    throw err
  }
}