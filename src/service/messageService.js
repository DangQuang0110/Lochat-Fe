import apiService from '@/api/apiService'

export async function getMessages({ conversationId }) {
  const response = await apiService.get(`/api/v1/messages/me/7`, {
    params: { conversationId }  // hoặc { me } nếu BE yêu cầu
  })
  console.log("Check đi: ", response.data.data)
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


export const delMessage = async (formData) => {
  try {
    console.log(formData)
    const response = await apiService.delete('/api/v1/messages',
      {
        data:formData
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi nè bạn:', error);
    throw error;                 
  }
};