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
            <div class="friend-card" v-for="friend in filteredFriends" :key="friend.id">
              <div class="info-row">
                <img :src="friend.avatar" class="avatar" />
                <strong class="friend-name">{{ friend.name }}</strong>
              </div>
              <div class="action-buttons">
                <button class="btn-info" @click="openDetail(friend)">Xem thông tin</button>
                <button class="btn-unfriend" @click="handleUnfriend(friend.id)">Hủy kết bạn</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chi tiết tài khoản -->
    <div v-if="selectedUser" class="overlay" @click.self="selectedUser = null">
      <div class="account-modal">
        <div class="modal-header">
          <h2>Thông tin tài khoản</h2>
          <button class="close-btn" @click="selectedUser = null">✕</button>
        </div>

        <img :src="selectedUser.cover" class="cover-img" />
        <div class="profile-box">
          <img :src="selectedUser.avatar" class="avatar" />
          <h3 class="name">{{ selectedUser.name }}</h3>
        </div>

        <div class="info-section">
          <h4>Thông tin cá nhân</h4>

          <div class="info-item">
            <img src="/icons/tieusu.png" class="icon" />
            <textarea
              class="bio-text"
              readonly
              :value="selectedUser.bio || 'Chưa cập nhật tiểu sử'"
            ></textarea>
          </div>

          <div class="info-item">
            <img src="/icons/phone.png" class="icon" />
            <span style="margin-top: 4px;">{{ selectedUser.phone }}</span>
          </div>
        </div>

        <button
          class="unfriend-btn"
          @click="handleUnfriend(selectedUser.id)"
        >
          Hủy kết bạn
        </button>
      </div>
    </div>
  </layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import layout from '@/layout/SideBarContact.vue'
import { getAcceptedFriends, unfriend } from '@/service/friendService'
import { getAccountDetail } from '@/service/profileService'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import hinhImg from '@/assets/avata.jpg'

const searchText   = ref('')
const friends      = ref([])
const selectedUser = ref(null)
const accountId    = localStorage.getItem('accountId')

/* 1) Tải danh sách bạn bè - KÉM SĐT */
const fetchFriends = async () => {
  try {
    const list = await getAcceptedFriends(accountId)

    const enriched = await Promise.all(
      list.map(async (f) => {
        try {
          const res      = await getAccountDetail(f.id)
          const root     = res?.data ?? res          // ⚡ gom về 1 gốc
          const profile  = root.profile || {}

          return {
            id    : root.id,
            name  : profile.fullname || root.username,
            avatar: profile.avatarUrl || hinhImg,
            phone : root.phoneNumber || 'Chưa rõ',    // 👉 THÊM SĐT
            profile                                   // giữ profile gốc
          }
        } catch {
          return {
            id    : f.id,
            name  : f.username,
            avatar: hinhImg,
            phone : 'Chưa rõ',
            profile: {}
          }
        }
      })
    )

    friends.value = enriched
  } catch {
    Toastify({
      text: '❌ Lấy danh sách bạn bè thất bại.',
      duration: 3000, close: true, gravity: 'top', position: 'right',
      backgroundColor: '#E74C3C'
    }).showToast()
  }
}

onMounted(fetchFriends)

/* 2) Bộ lọc tìm kiếm */
const filteredFriends = computed(() => {
  const kw = searchText.value.toLowerCase()
  return friends.value.filter(f => f.name.toLowerCase().includes(kw))
})

/* 3) Mở modal chi tiết – ĐƯA SĐT VÀO */
const openDetail = (friend) => {
  const p = friend.profile || {}
  selectedUser.value = {
    id   : friend.id,
    name : friend.name,
    avatar: friend.avatar,
    cover : p.coverUrl || hinhImg,
    phone : friend.phone,              // 👉 LẤY TỪ friend.phone
    bio   : p.bio || '',
    isFriend: true
  }
}

/* 4) Huỷ kết bạn – giữ nguyên */
const handleUnfriend = async (friendId) => {
  try {
    await unfriend({ senderId: Number(accountId), receiverId: friendId })
    Toastify({
      text: '✅ Đã huỷ kết bạn.',
      duration: 3000, close: true, gravity: 'top', position: 'right',
      backgroundColor: '#27AE60'
    }).showToast()
    selectedUser.value = null
    fetchFriends()
  } catch {
    Toastify({
      text: '❌ Huỷ kết bạn thất bại.',
      duration: 3000, close: true, gravity: 'top', position: 'right',
      backgroundColor: '#E74C3C'
    }).showToast()
  }
}
</script>
<style scoped>
/* Giao diện modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.account-modal {
  width: 320px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  font-family: sans-serif;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f5f5f5;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.cover-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}
.profile-box {
  text-align: center;
  margin-top: -30px;
  padding-bottom: 10px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
}
.name {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
}
.info-section {
  padding: 0 16px 16px;
}
.info-section h4 {
  margin: 12px 0 10px;
  font-size: 15px;
  font-weight: 600;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 14px;
}
.icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-top: 2px;
}
.bio-text {
  flex: 1;
  border: none;
  resize: none;
  /* background: #f8f8f8; */
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  pointer-events: none;
  outline: none;
  user-select: none;
  font-family: 'Roboto', sans-serif;
}
.unfriend-btn {
  background: #e11919;
  color: white;
  width: calc(100% - 32px);
  margin: 0 16px 16px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.unfriend-btn:hover {
  background: #c61414;
}

/* Giao diện bạn bè */
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
.section-title {
  font-weight: normal;
  font-size: 20px;
  margin-bottom: 20px;
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
.btn-info {
  background: #ccc;
  font-weight: bold;
  border: none;
  padding: 10px 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.action-buttons {
  display: flex;
  gap: 25px;
}
.btn-unfriend {
  font-size: 14px;
  color: white;
  background-color: #ff3d3d;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
