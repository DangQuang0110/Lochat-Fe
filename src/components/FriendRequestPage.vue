<template>
  <layout>
    <div class="container">
      <SideBarContact />

      <div class="main-panel">
        <HeaderContact />

        <div class="scroll-content">
          <!-- Tìm kiếm -->
          <div class="search-bar">
            <img src="/icons/search.png" class="search-icon" />
            <input type="text" v-model="searchText" placeholder="Tìm bạn bè" />
          </div>

          <h2 class="section-title">Lời mời kết bạn</h2>

          <div class="grid-list">
            <div class="request-card" v-for="friend in filteredFriends" :key="friend.name">
              <div class="card-top">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
                <span class="time-label">{{ friend.time }}</span>
              </div>
              <div class="action-buttons">
                <button class="btn-accept">Chấp nhận</button>
                <button class="btn-decline">Xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import layout from '@/layout/SideBarContact.vue'
import quangImg from '@/assets/quang.png'

const searchText = ref('')
const requests = ref([
  { name: 'Quang', avatar: quangImg, time: '4 năm trước' },
  { name: 'Quang', avatar: quangImg, time: '2 giờ trước' },
  { name: 'Quang', avatar: quangImg, time: '2 giờ trước' },
  { name: 'Quang', avatar: quangImg, time: '2 giờ trước' }
])

const filteredFriends = computed(() => {
  const keyword = searchText.value.toLowerCase()
  return requests.value.filter(friend =>
    friend.name.toLowerCase().includes(keyword)
  )
})
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
