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

          <h2 class="section-title">Gợi ý liên hệ</h2>

          <div class="grid-list">
            <div class="suggest-card" v-for="friend in filteredFriends" :key="friend.name">
              <div class="card-top">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
              </div>

              <div class="action-buttons">
                <button class="btn-skip">Bỏ qua</button>
                <button class="btn-add">Kết bạn</button>
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
const friends = ref([
  { name: 'Quang', avatar: quangImg },
  { name: 'Quang', avatar: quangImg },
  { name: 'Quang', avatar: quangImg },
{ name: 'Quang', avatar: quangImg }
])

const filteredFriends = computed(() => {
  const keyword = searchText.value.toLowerCase()
  return friends.value.filter(friend => friend.name.toLowerCase().includes(keyword))
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
