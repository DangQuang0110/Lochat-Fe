<template>
  <layout>
    <div class="container">
      <SideBarContact />

      <div class="main-panel">
        <HeaderContact />

        <div class="scroll-content">
          <!-- Notification component -->
          <transition-group name="fade" tag="div" class="notification-container">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              :class="['notification', notification.type]"
            >
              {{ notification.message }}
            </div>
          </transition-group>

          <!-- Tìm kiếm -->
          <div class="search-bar">
            <img src="/icons/search.png" class="search-icon" />
            <input type="text" v-model="searchText" placeholder="Tìm bạn bè" />
          </div>

          <h2 class="section-title">Lời mời kết bạn</h2>

          <div class="grid-list">
            <div class="request-card" v-for="friend in filteredFriends" :key="friend.id">
              <div class="card-top">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
                <span class="time-label">{{ friend.time }}</span>
              </div>
              <div class="action-buttons">
                <button class="btn-accept" @click="acceptFriend(friend.id)">Chấp nhận</button>
                <button class="btn-decline" @click="declineFriend(friend.id)">Xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import layout from '@/layout/SideBarContact.vue'
import { getReceivedFriendRequests, respondToFriendRequest, unfriend } from '@/service/friendService'

const searchText = ref('')
const requests = ref([])
const accountId = localStorage.getItem('accountId')
const notifications = ref([])

const addNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

const fetchRequests = async () => {
  try {
    const data = await getReceivedFriendRequests(accountId)
    console.log('✅ Dữ liệu từ API:', data)
    console.log('🧪 accountId:', accountId)

    requests.value = data.map(user => ({
      id: user.id,
      name: user.username,
      avatar: user.imageUrl || 'image/avata.jpg',
      time: 'vừa gửi'
    }))
  } catch (err) {
    console.error('❌ Lỗi khi gọi API lời mời:', err)
    addNotification('Lỗi khi tải danh sách lời mời', 'error')
  }
}

onMounted(fetchRequests)

const filteredFriends = computed(() => {
  const keyword = searchText.value.toLowerCase()
  return requests.value.filter(friend =>
    friend.name.toLowerCase().includes(keyword)
  )
})

const acceptFriend = async (senderId) => {
  try {
    await respondToFriendRequest({
      senderId: String(senderId),
      receiverId: String(accountId),
      status: 'ACCEPTED'
    })
    addNotification('Đã chấp nhận lời mời kết bạn', 'success')
    fetchRequests()
  } catch {
    addNotification('Chấp nhận lời mời thất bại', 'error')
  }
}

const declineFriend = async (senderId) => {
  try {
    await unfriend({
      senderId: Number(senderId),
      receiverId: Number(accountId)
    })
    addNotification('Đã xóa lời mời kết bạn', 'success')
    fetchRequests()
  } catch {
    addNotification('Xóa lời mời thất bại', 'error')
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  position: relative;
}

.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.search-bar {
  position: relative;
  width: 300px;
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.section-title {
  font-weight: normal;
  font-size: 20px;
  margin-bottom: 20px;
}

.grid-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.request-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-name {
  font-weight: bold;
  font-size: 16px;
  flex: 1;
}

.time-label {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 82px;
  justify-content: center;
}

.btn-accept {
  background: #ccc;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.btn-decline {
  background: red;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>