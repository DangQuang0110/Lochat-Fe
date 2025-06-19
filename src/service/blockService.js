import apiService from '@/api/apiService'

export function blockUser(blockerId, blockedId) {
  return apiService.post('/api/v1/blocks/', {
    blockerId: String(blockerId),
    blockedId: String(blockedId)
  })
}

export function getBlockedList(accountId) {
  return apiService.get(`/api/v1/blocks/me/${accountId}`) 
}
export function unblockUser(blockerId, blockedId) {
  return apiService.delete('/api/v1/blocks/', {
    data: {
      blockerId: String(blockerId),
      blockedId: String(blockedId),
    },
  })
}