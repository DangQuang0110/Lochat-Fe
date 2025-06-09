<template>
  <layout>
    <div class="friend-management-page">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-wrapper">
            <img src="/icons/search.png" alt="Search Icon" class="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm bạn bè" 
              class="search-input"
              v-model="searchQuery"
            />
          </div>
        </div>
        <!-- Content Area -->
        <div class="content-area">
          <h3 class="content-title">{{ getContentTitle() }}</h3>
          
          <!-- Friend Requests -->
          <div v-if="activeTab === 'requests'" class="suggestions">
            <div 
              v-for="request in filteredRequests" 
              :key="request.id"
              class="suggestion-item"
            >
              <div class="profile-section">
                <img 
                  :src="request.avatar" 
                  :alt="request.name"
                  class="avatar"
                />
                <div class="friend-info">
                  <span class="name">{{ request.name }}</span>
                </div>
              </div>
              
              <div class="action-buttons">
                <button 
                  class="btn btn-accept"
                  @click="acceptRequest(request.id)"
                >
                  Chấp nhận
                </button>
                <button 
                  class="btn btn-cancel"
                  @click="cancelRequest(request.id)"
                >
                  Hủy
                </button>
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

// Reactive data
const activeTab = ref('requests')
const searchQuery = ref('')
const friendRequests = ref([
  { id: 1, name: 'Nguyễn Văn A', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face' },
  { id: 2, name: 'Trần Thị B', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&crop=face' },
  { id: 3, name: 'Lê Văn C', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
  { id: 4, name: 'Phạm Thị D', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face' },
  { id: 5, name: 'Hoàng Văn E', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
  { id: 6, name: 'Vũ Thị F', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  { id: 7, name: 'Đặng Văn G', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face' },
  { id: 8, name: 'Bùi Thị H', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
  { id: 9, name: 'Dương Văn I', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
])

// Computed properties
const filteredRequests = computed(() => {
  if (!searchQuery.value) return friendRequests.value
  return friendRequests.value.filter(request => 
    request.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const getContentTitle = () => {
  const titles = {
    'friends': 'Bạn bè',
    'requests': 'Lời mời kết bạn',
    'suggestions': 'Lời mời đã gửi',
    'contact': 'Gợi ý liên hệ'
  }
  return titles[activeTab.value]
}

const acceptRequest = (requestId) => {
  friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
  console.log('Accepted request for ID:', requestId)
}

const cancelRequest = (requestId) => {
  friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
  console.log('Cancelled request for ID:', requestId)
}
</script>

<style scoped>
.friend-management-page {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 12px;
}

.menu-item:hover {
  background-color: #f8f8f8;
}

.menu-item.active {
  background-color: #e3f2fd;
  border-right: 3px solid #1976d2;
}

.menu-item.active .menu-text {
  color: #1976d2;
  font-weight: 500;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.menu-text {
  font-size: 14px;
  color: #333;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100vh; /* Constrain to viewport height */
  overflow: hidden; /* Prevent overflow */
}

.search-container {
  margin-top: 20px;
  padding: 0 20px;
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 25px;
  background-color: #f8f8f8;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #090a0a;
  background-color: white;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  scroll-behavior: smooth; /* Smooth scrolling */
  max-height: calc(100vh - 100px); /* Account for search bar and padding */
}

/* Scrollbar customization */
.content-area::-webkit-scrollbar {
  width: 8px; /* Scrollbar width */
}

.content-area::-webkit-scrollbar-track {
  background: #f1f1f1; /* Scrollbar track color */
  border-radius: 10px;
}

.content-area::-webkit-scrollbar-thumb {
  background: #888; /* Scrollbar thumb color */
  border-radius: 10px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #555; /* Scrollbar thumb hover color */
}

.content-title {
  font-size: 30px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

/* Updated Card Styles */
.suggestions {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Exactly 4 columns */
  gap: 15px;
  max-width: 100%;
}

.suggestion-item {
  background-color: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  width: 100%;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  flex-shrink: 0;
}

.friend-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-accept {
  background-color: #e4e6ea;
  color: #1c1e21;
  border: 1px solid #dadde1;
}

.btn-accept:hover {
  background-color: #d8dadf;
}

.btn-cancel {
  background-color: #ff3333;
  color: white;
  border: 1px solid #ff3333;
}

.btn-cancel:hover {
  background-color: #e62e2e;
}

/* Responsive */
@media (max-width: 1024px) {
  .suggestions {
    grid-template-columns: repeat(3, 1fr); /* 3 columns for smaller screens */
  }
}

@media (max-width: 768px) {
  .friend-management-page {
    flex-direction: column;
  }
  
  .suggestions {
    grid-template-columns: 1fr; /* 1 column for mobile */
  }
  
  .suggestion-item {
    padding: 12px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .content-title {
    font-size: 24px;
  }
}
</style>