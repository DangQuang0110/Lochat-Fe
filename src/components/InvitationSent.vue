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

          <h2 class="section-title">Lời mời đã gửi</h2>

          <div class="grid-list">
            <div
              class="invite-card"
              v-for="friend in filteredFriends"
              :key="friend.id"
            >
              <div class="card-top">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
                <span class="time-label">1 phút trước</span>
              </div>

              <button class="btn-cancel" @click="openConfirm(friend.id)">
                Thu hồi lời mời
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Modal xác nhận thu hồi lời mời ===== -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal-content">
        <h3>Bạn chắc chắn muốn thu hồi lời mời?</h3>
        <div class="btn-group">
          <button class="btn-yes" @click="confirmUnfriend">Có</button>
          <button class="btn-no" @click="closeConfirm">Không</button>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import layout from '@/layout/SideBarContact.vue'
import { getSentFriendRequests, unfriend } from '@/service/friendService'

/* ------------ STATE ------------ */
const searchText = ref('')
const friends = ref([])
const accountId = Number(localStorage.getItem('accountId'))
const notifications = ref([])

/* cho modal */
const showConfirm = ref(false)
const selectedReceiverId = ref(null)

/* ------------ NOTIFICATION HANDLER ------------ */
const addNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

/* ------------ API ------------ */
const fetchSentRequests = async () => {
  try {
    const data = await getSentFriendRequests(accountId)
    friends.value = data.map(f => ({
      id: Number(f.id),
      name: f.username,
      avatar: f.imageUrl || 'image/avata.jpg'
    }))
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách đã gửi:', err)
    addNotification('Lỗi khi tải danh sách lời mời đã gửi', 'error')
  }
}

onMounted(fetchSentRequests)

/* ------------ FILTER ------------ */
const filteredFriends = computed(() => {
  const kw = searchText.value.toLowerCase()
  return friends.value.filter(f => f.name.toLowerCase().includes(kw))
})

/* ------------ CONFIRM FLOW ------------ */
function openConfirm(receiverId) {
  selectedReceiverId.value = receiverId
  showConfirm.value = true
}

function closeConfirm() {
  showConfirm.value = false
  selectedReceiverId.value = null
}

async function confirmUnfriend() {
  try {
    await unfriend({ senderId: accountId, receiverId: selectedReceiverId.value })
    friends.value = friends.value.filter(f => f.id !== selectedReceiverId.value)
    addNotification('Đã thu hồi lời mời', 'success')
  } catch (err) {
    console.error('❌ Lỗi khi thu hồi lời mời:', err)
    addNotification('Không thể thu hồi lời mời', 'error')
  } finally {
    closeConfirm()
  }
}
</script>

<style scoped>
/* ---------- layout cũ ---------- */
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
  opacity: .6; 
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

.invite-card { 
  background: white; 
  border-radius: 12px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1); 
  padding: 16px; 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  align-items: flex-start; 
}

.card-top { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  width: 100%; 
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

.btn-cancel { 
  background: #ccc; 
  border: none; 
  border-radius: 6px; 
  padding: 8px 16px; 
  cursor: pointer; 
  font-size: 14px; 
  align-self: center; 
}

/* ---------- modal ---------- */
.modal-overlay {
  position: fixed; 
  inset: 0; 
  background: rgba(0, 0, 0, 0.4);
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 1000;
}

.modal-content {
  background: #fff; 
  width: 320px; 
  padding: 24px; 
  border-radius: 8px; 
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .2);
}

.modal-content h3 { 
  margin: 0 0 20px; 
  font-size: 16px; 
}

.btn-group { 
  display: flex; 
  justify-content: center; 
  gap: 20px; 
}

.btn-yes, .btn-no {
  border: none; 
  border-radius: 6px; 
  padding: 8px 18px; 
  cursor: pointer; 
  font-size: 14px;
}

.btn-yes { 
  background: #ff5252; 
  color: #fff; 
}

.btn-no { 
  background: #e0e0e0; 
}
</style>