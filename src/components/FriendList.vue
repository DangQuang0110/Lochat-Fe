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

          <h2 class="section-title">Bạn Bè</h2>

          <div class="grid-list">
            <div class="friend-card" v-for="friend in filteredFriends" :key="friend.name">
              <div class="info-row">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
              </div>
              <div class="action-buttons">
                <button class="btn-friend">Bạn bè</button>
                <button class="btn-unfriend">Hủy kết bạn</button>
              </div>
              <button class="btn-info" @click="openDetail(friend)">Xem thông tin</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FriendDetail v-if="selectedUser" :user="selectedUser" @close="selectedUser = null" />
  </layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import layout from '@/layout/SideBarContact.vue'
import FriendDetail from './FriendDetail.vue' // Đã tạo riêng popup

import quangImg from '@/assets/quang.png'
import cauImg from '@/assets/cau.png'
import nhanImg from '@/assets/nhan.png'
import hinhImg from '@/assets/hinh.jpg'

const searchText = ref('')
const friends = ref([
  { name: 'Quang', avatar: quangImg },
  { name: 'Cau', avatar: cauImg },
  { name: 'Quang', avatar: quangImg },
  { name: 'Nhân', avatar: nhanImg }
])

const filteredFriends = computed(() => {
  const keyword = searchText.value.toLowerCase()
  return friends.value.filter(friend =>
    friend.name.toLowerCase().includes(keyword)
  )
})

const selectedUser = ref(null)
const openDetail = (friend) => {
  selectedUser.value = {
    ...friend,
    cover: hinhImg,
    gender: 'Nam',
    birthdate: '25/09/2004',
    address: 'Hoài Nhơn, Bình Định',
    phone: '0369620631',
    isFriend: true
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  overflow: hidden;
}
.friend {
  font-weight: normal; 
  font-size: 24px; /* Tuỳ bạn, có thể nhỏ hơn nếu muốn */
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
/* phần cuộn */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}
.section-title {
  font-weight: normal;
  font-size: 20px;
  margin-bottom: 20px;
}
/* phần không cuộn */
.search-bar {
  position: relative;
  width: 300px;
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px 10px 40px; /* 👈 thêm padding trái để chừa chỗ cho icon */
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
.grid-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.friend-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
} */

.info-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
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

.btn-friend {
  font-size: 12px;
  color: blue;
  border: 1px solid blue;
  background-color: white;
  padding: 4px 10px;
  border-radius: 8px;
  white-space: nowrap;
}

.btn-info {
  width: 80%;
  background: #ccc;
  border: none;
  padding: 8px 0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 65px;
}

.btn-friend {
  font-size: 12px;
  color: white;
  background-color: #2f64ff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-unfriend {
  font-size: 12px;
  color: white;
  background-color: #ff3d3d;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-info {
  width: 100%;
  background: #ccc;
  border: none;
  padding: 8px 0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
</style>
