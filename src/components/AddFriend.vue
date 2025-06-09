<template>
  <layoutnew>
    <div class="container">
      <SideBarContact />
       
      <!-- Phần còn lại bên phải -->
      <div class="main-panel">
        <HeaderContact />
         
        <!-- Chỉ phần này được cuộn -->
        <div class="scroll-content">
          <!-- Tìm kiếm -->
          <div class="search-bar">
            <img src="/icons/search.png" class="search-icon" />
            <input type="text" v-model="searchText" placeholder="Tìm bạn bè" />
          </div>
          
          <div>
            <h1 class="friend-title">Kết quả tìm kiếm</h1>
          </div>
           
          <!-- Danh sách bạn bè -->
          <div class="friend-list">
            <div class="friend-item" v-for="friend in filteredFriends" :key="friend.id">
              <div class="friend-header">
                <img :src="friend.avatar" class="avatar" />
                <span class="friend-name">{{ friend.name }}</span>
              </div>
              <div class="friend-buttons">
                  <button class="btn-add">Kết bạn</button>
                  <button class="btn-delete">Xóa</button>
                </div>
              <button class="btn-info">Xem thông tin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layoutnew>
</template>

<script setup>
import { ref, computed } from 'vue'
import layoutnew from '@/layout/SideBarContanctNew.vue'
import quangImg from '@/assets/quang.png'
import cauImg from '@/assets/cau.png'
import nhanImg from '@/assets/nhan.png'

const searchText = ref('')
const friends = ref([
  { id: 1, name: 'Quang', avatar: quangImg },
  { id: 2, name: 'Cau', avatar: cauImg },
  { id: 3, name: 'Nhân', avatar: nhanImg },
  { id: 4, name: 'Quang', avatar: quangImg },
  { id: 5, name: 'Cau', avatar: cauImg },
  { id: 6, name: 'Nhân', avatar: nhanImg },
  { id: 7, name: 'Cau', avatar: cauImg },
  { id: 8, name: 'Nhân', avatar: nhanImg },
])

const filteredFriends = computed(() => {
  const keyword = searchText.value.toLowerCase()
  return friends.value.filter(friend =>
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
  background: #f5f5f5;
}

/* phần cuộn */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  background-color: white;
}

/* phần không cuộn */
.search-bar {
  position: relative;
  width: 400px;
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  background: white;
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

.friend-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.friend-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.friend-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.friend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.friend-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  flex: 1;
}

.friend-buttons {
  display: flex;
  gap: 250px;
}

.btn-add, .btn-delete {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.btn-add {
  background: #1877f2;
  color: white;
}

.btn-add:hover {
  background: #166fe5;
  transform: translateY(-1px);
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.btn-info {
  width: 100%;
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-info:hover {
  background: #5a6268;
}
</style>