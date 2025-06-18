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

          <h2 class="section-title">Gợi ý liên hệ</h2>

          <div class="grid-list">
            <div class="suggest-card" v-for="friend in filteredFriends" :key="friend.name">
              <div class="card-top">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
              </div>
              <div class="action-buttons">
                <button class="btn-skip" @click="skipFriend(friend.id)">Bỏ qua</button>
                <button class="btn-add" @click="addFriend(friend.id)">Kết bạn</button>
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
import { getRandomAccounts } from '@/service/accountService'
import { sendFriendRequest, getAcceptedFriends } from '@/service/friendService'

/* -------- state -------- */
const searchText = ref('')
const friends = ref([])
const loggedInAccountId = Number(localStorage.getItem('accountId'))
const currentFriends = ref([]) // 🟡 danh sách đã là bạn
const notifications = ref([])

/* -------- notification handler -------- */
const addNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

/* -------- fetch gợi ý -------- */
onMounted(async () => {
  try {
    const [suggestions, accepted] = await Promise.all([
      getRandomAccounts(20),            // lấy 20 người random
      getAcceptedFriends(loggedInAccountId) // lấy danh sách bạn bè
    ])

    currentFriends.value = accepted.map(f => f.id)

    friends.value = suggestions.filter(u =>
      u.id !== loggedInAccountId && !currentFriends.value.includes(u.id)
    )
  } catch (err) {
    console.error('Không load được gợi ý liên hệ:', err)
    addNotification('Không load được gợi ý liên hệ', 'error')
  }
})

/* -------- lọc theo ô search -------- */
const filteredFriends = computed(() => {
  const kw = searchText.value.toLowerCase()
  return friends.value.filter(f =>
    (f.username || '').toLowerCase().includes(kw) ||
    (f.profile?.fullname || '').toLowerCase().includes(kw)
  )
})

/* -------- hành động -------- */
async function addFriend(receiverId) {
  try {
    console.log('📤 Gửi request:', { senderId: loggedInAccountId, receiverId })
    await sendFriendRequest(loggedInAccountId, receiverId)
    friends.value = friends.value.filter(f => f.id !== receiverId)
    addNotification('Đã gửi lời mời kết bạn', 'success')
  } catch (err) {
    console.error('Không thể gửi lời mời:', err)
    addNotification('Gửi lời mời thất bại', 'error')
  }
}

function skipFriend(id) {
  friends.value = friends.value.filter(f => f.id !== id)
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

.suggest-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
}

.action-buttons {
  display: flex;
  gap: 80px;
  width: 100%;
  justify-content: center;
}

.btn-skip {
  background: #ccc;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.btn-add {
  background: white;
  color: blue;
  border: 2px solid blue;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
}
</style>