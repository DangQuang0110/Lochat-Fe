import apiService from '@/api/apiService'

// Lấy các nhóm do mình làm admin
export const getOwnedGroups = (accountId) =>
  apiService.get(`/api/v1/conversations/owned/me/${accountId}`)

// Lấy các nhóm mình đã tham gia
export const getJoinedGroups = (accountId) =>
  apiService.get(`/api/v1/conversations/joined/me/${accountId}`)

export const createGroup = (formData) => {
  // Log nội dung FormData
  for (const [k, v] of formData.entries()) {
    console.log('📦', k, v instanceof File ? `${v.name} (${v.size}B)` : v)
  }

  return apiService.post('/api/v1/conversations/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const addMembers = (body) => {
  console.log('📦 Gọi API thêm thành viên:', body)
  return apiService.post(
    '/api/v1/conversations/members',
    {
      conversationId: String(body.conversationId),
      ownerId:        String(body.ownerId),
      ids:            body.ids.map(id => String(id))
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export const removeMembers = (body) => {
  // ✅ ép tất cả về string
  return apiService.delete(
    '/api/v1/conversations/members',
    {
      data: {
        conversationId: String(body.conversationId),
        ownerId:        String(body.ownerId),
        ids:            body.ids.map(String)   // ← quan trọng
      },
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export const getConversationDetail = (conversationId) => {
  return apiService.get(`/api/v1/conversations/${conversationId}`)
}
export async function updateGroup ({
  ownerId,
  conversationId,
  name,     // optional
  avatar    // optional File
}) {
  const fd = new FormData()

  // ❗ PHẢI có cả ownerId và conversationId trong body
  fd.append('ownerId',        String(ownerId))
  fd.append('conversationId', String(conversationId))

  if (name?.trim()) fd.append('name', name.trim())
  if (avatar)       fd.append('avatar', avatar)

  // ✅ Log lại dữ liệu để kiểm tra
  console.log('📤 PATCH /api/v1/conversations/ →', {
    ownerId,
    conversationId,
    name,
    avatar
  })
  for (const [key, val] of fd.entries()) {
    console.log(`📝 ${key}:`, val)
  }

  // ❗ Đúng endpoint: KHÔNG gắn ID vào URL
  return apiService.patch(
    `/api/v1/conversations/`,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
}


