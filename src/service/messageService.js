import apiService from '@/api/apiService'

export async function getMessages({ conversationId }) {
  const response = await apiService.get(`/api/v1/messages/me/${conversationId}`, {
    params: { conversationId }  // hoặc { me } nếu BE yêu cầu
  })
  return response.data
}
export async function sendMessageToConversation(payload) {
  // Luôn serialize id dưới dạng string
  const body = {
    senderId:  String(payload.senderId),
    conversationId: String(payload.conversationId),
    content: payload.content
  }
  console.log('📤 Payload Axios gửi:', body)   // <-- kiểm tra lần cuối
  return apiService.post('/api/v1/messages', body)
                   .then(res => res.data)
}
