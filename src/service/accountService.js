import apiService from '@/api/apiService'

/**
 * @param {number} accountId - ID của người dùng hiện tại
 * @returns {Promise<Array>}
 */
export async function getSuggestedAccounts(accountId) {
  const { data } = await apiService.get('/api/v1/accounts/random', {
    params: {
      me: accountId,
      getBlock: false
    }
  })

  return data.data.map(u => ({
    id      : Number(u.id),
    username: u.username,
    email   : u.email,
    phone   : u.phoneNumber,
    avatar  : u.profile?.avatarUrl || '/image/avata.jpg',
    fullname: u.profile?.fullname || ''
  }))
}
