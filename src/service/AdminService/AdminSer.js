import apiService from "@/api/apiService";

export const getListAccount = async ()=>{
    try {
            const response = await apiService.get(`/api/v1/accounts`)
            return response.data.data
    } catch (error) {
        console.log('Bị lỗi rồi check lại nha!',error)
        throw error
    }
}

// Ban user
export const banUser = async (accountId) => {
    try {
        const response = await apiService.post(`/api/v1/bans/create`, { accountId })
        return response.data
    } catch (error) {
        console.log('Lỗi khi khóa người dùng:', error.response?.data || error)
        throw error
    }
}

// Unban user
export const unbanUser = async (accountId) => {
    try {
        const response = await apiService.post(`/api/v1/bans/delete`, { accountId })
        return response.data
    } catch (error) {
        console.log('Lỗi khi mở khóa người dùng:', error.response?.data || error)
        throw error
    }
}