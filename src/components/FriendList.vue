<template>
  <layout>
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
            <h1 class="friend">Bạn Bè</h1>
          </div>

          <!-- Danh sách bạn bè -->
          <div class="grid-list">
            <div class="friend-card" v-for="friend in filteredFriends" :key="friend.name">
              <div class="card-header">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
                <button class="btn-friend">Bạn bè</button>
              </div>
              <button class="btn-info">Xem thông tin</button>
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
import cauImg from '@/assets/cau.png'
import nhanImg from '@/assets/nhan.png'

const searchText = ref('')
const friends = ref([
  { name: 'Quang', avatar: quangImg },
  { name: 'Cau', avatar: cauImg },
  { name: 'Nhân', avatar: nhanImg },
  { name: 'Quang', avatar: quangImg },
  { name: 'Cau', avatar: cauImg },
  { name: 'Nhân', avatar: nhanImg },
  { name: 'Cau', avatar: cauImg },
  { name: 'Nhân', avatar: nhanImg },
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
  background: #fff;
}
.friend h1{

}
/* phần cuộn */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
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

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.friend-name {
  flex: 1;
  margin-left: 10px;
  font-weight: bold;
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
</style>
