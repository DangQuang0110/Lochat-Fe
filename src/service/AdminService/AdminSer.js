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