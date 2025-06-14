import apiService from '@/api/apiService'

/**
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getRandomAccounts (limit = 10) {
  const { data } = await apiService.get(`/api/v1/accounts/random/${limit}`)
  //   data = { code:200, message:'OK', data:[ {...}, {...} ] }
  return data.data.map(u => ({
    id      : Number(u.id),
    name    : u.username,
    email   : u.email,
    phone   : u.phoneNumber,
    avatar  : u.profile?.avatarUrl || '/image/avata.jpg'
  }))
}
