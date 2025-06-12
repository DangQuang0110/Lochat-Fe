<template>
  <div class="chat-app">
         <aside class="sidebar icons-sidebar">
      <div class="sidebar-top">
        <img
    :src="user.avatar"
    class="avatar"
    @click.stop="toggleUserSidebar"
  />
          <!-- <div v-if="showAvatarMenu" class="avatar-menu">
      <ul>
        <li @click="goToUserProfile">Hồ sơ người dùng</li>
        <li @click="goToChangePassword">Đổi mật khẩu</li>
        <li @click="logout">Đăng xuất</li>
      </ul>
    </div> -->
    <aside
  v-if="showUserSidebar"
  class="user-sidebar"
  ref="avatarWrapper"
>
  <ul class="user-sidebar-menu">
    <li @click="goToUserProfile">Hồ sơ người dùng</li>
    <li @click="goToChangePassword">Đổi mật khẩu</li>
    <li @click="logout">Đăng xuất</li>
  </ul>
</aside>

      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: true }">
            <img src="@/assets/message.png" alt="Nhắn tin" />
          </li>
          <li :class="{ active: true }">
            <img src="@/assets/contact-books.png" alt="Danh bạ" />
          </li>
          <!-- thêm icon khác nếu cần -->
        </ul>
      </nav>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-bottom">
        <img src="@/assets/menu.png" alt="Menu" class="hamburger" />
      </div>
    </aside>

    <!-- Sidebar Friends/Groups -->
   <aside class="sidebar">
     <div class="search-bar">
  <div class="input-wrapper">
    <img src="@/assets/search_icon.png" alt="Tìm kiếm" class="search-icon" />
    <input type="text" placeholder="Tìm kiếm" />
  </div>
  <button class="add-btn">+</button>
</div>
      <div class="tab-section">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'friends' }"
          @click="activeTab = 'friends'"
        >Bạn bè</button>
        
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'groups' }"
          @click="activeTab = 'groups'"
        >Nhóm</button>
        
        <div 
            class="tab-indicator"
            :style="{ transform: activeTab === 'friends' ? 'translateX(0%)' : 'translateX(100%)' }"
          />
      </div>
        <div class="friend-section">
          <div 
            v-for="item in activeTab === 'friends' ? friends : groups" 
            :key="item.id" 
            class="friend-item" 
            :class="{ active: selectedId === item.id }"
            @click="selectFriend(item.id)"
          >
            <img :src="item.avatar" class="avatar" />
            <div class="friend-info">
              <div class="name">{{ item.name }}<span v-if="item.online" class="online-dot"></span></div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
    </aside>

    <section class="main-chat">
      <header class="chat-header">
  <div class="header-left">
    <img :src="current.avatar" class="avatar" />
    <div class="info">
      <div class="name">{{ current.name }}</div>
      <div class="status">{{ current.online ? 'Đang hoạt động' : 'Offline' }}<span v-if="current.online" class="online-dot"></span></div>
    </div>
  </div>
  <div class="header-right">
    <!-- nút thêm bạn/chat -->
      <button class="btn icon-btn search-btn" @click="toggleSearch">
            <img src="@/assets/search_icon.png" alt="Tìm trong cuộc trò chuyện" />
          </button>
          <!-- Message search input -->
      <div v-if="showSearch" class="message-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm tin nhắn"
          class="search-message-input"
        />
      </div>

      <!-- nếu có SVG thì import, ở đây tạm dùng dấu + -->
      
    <!-- nút menu (3 gạch) -->
   <button class="btn icon-btn menu-btn" @click="toggleProfilePanel">
            <img src="@/assets/menu.png" alt="Menu" />
          </button>
  </div>
</header>

     <div class="chat-body">
  <!-- Khi không có tin nào cho cuộc hội thoại này -->
  <div v-if="currentMessages.length === 0" class="no-message">
    Chưa có tin nhắn mới
  </div>

  <!-- Khi có ít nhất 1 tin, render duy nhất 1 vòng lặp -->
  <template v-else>
    <div
    v-for="msg in filteredMessages"
    :key="msg.id"
    class="msg-wrapper"
    :class="{ 'align-right': msg.fromMe, 'align-left': !msg.fromMe }"
  >
    <!-- System Message -->
    <div v-if="msg.system" class="system-text">
      {{ msg.text }}
    </div>

    <!-- Tin nhắn nhóm -->
    <template v-else-if="activeTab === 'groups'">
      <!-- Tin nhắn từ người khác: hiện avatar + tên -->
      <div v-if="!msg.fromMe" class="group-msg">
        <img class="avatar" :src="getSender(msg)?.avatar" />
        <div class="msg-block">
          <div class="sender-name">{{ getSender(msg)?.name }}</div>
          <div class="msg from-other">
            <div v-if="msg.file" class="file-attach">
              <span class="file-icon">📎</span>
              <div class="file-info">
                <p class="file-name">{{ msg.file.name }}</p>
                <p class="file-size">{{ msg.file.size }}</p>
              </div>
              <button class="download-btn">⬇️</button>
            </div>
            <img v-if="msg.image" :src="msg.image" style="max-width: 200px; border-radius: 8px;" />
            <p v-if="msg.text" class="msg-text">{{ msg.text }}</p>
          </div>
        </div>
      </div>

      <!-- Tin nhắn của chính mình: dùng layout giống 1-1 -->
      <div v-else class="msg-block align-right">
        <div class="msg from-me">
          <div v-if="msg.file" class="file-attach">
            <span class="file-icon">📎</span>
            <div class="file-info">
              <p class="file-name">{{ msg.file.name }}</p>
              <p class="file-size">{{ msg.file.size }}</p>
            </div>
            <button class="download-btn">⬇️</button>
          </div>
          <img v-if="msg.image" :src="msg.image" style="max-width: 200px; border-radius: 8px;" />
          <p v-if="msg.text">{{ msg.text }}</p>
        </div>
      </div>
    </template>
    <!-- Tin nhắn 1-1 -->
<!-- Tin nhắn 1-1 -->
    <template v-else>
      <div v-if="!msg.fromMe" class="group-msg">
        <img class="avatar" :src="getSender(msg)?.avatar" />
        <div class="msg-block">
          <div class="sender-name">{{ getSender(msg)?.name }}</div>
          <div class="msg from-other">
            <p v-if="msg.text">{{ msg.text }}</p>
          </div>
        </div>
      </div>
      <div v-else class="msg-block align-right">
        <div class="msg from-me">
          <p v-if="msg.text">{{ msg.text }}</p>
        </div>
      </div>
    </template>
  </div>
  </template>
</div>

     <footer class="chat-input">
    <div class="input-container">
       <button class="icon-btn attach-btn" @click="triggerFileDialog">
            <img src="@/assets/clip.png" alt="Đính kèm" />
          </button>
          <!-- input file ẩn -->
          <input
            ref="fileInput"
            type="file"
            style="display:none"
            @change="handleFileSelect"
            accept="*/*"
          />

        <input
            ref="textInput"
            v-model="messageInput"
            @keydown.enter="sendMessage"
            type="text"
            placeholder="Nhập tin nhắn"
          />

     <button class="icon-btn emoji-btn" @click="toggleEmojiPicker">
        <img src="@/assets/happy-face.png" alt="Emoji" />
      </button>

       <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="picker-header">Cảm xúc</div>
        <div class="emoji-grid">
          <span
            v-for="emoji in emojis"
            :key="emoji"
            class="emoji-item"
            @click="addEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>

      <button class="icon-btn send-btn" @click="sendMessage">
            <img src="@/assets/send.png" alt="Gửi" />
          </button>
    </div>
  </footer>
    </section>

  <!-- Right Profile Panel -->
    <aside v-if="showProfilePanel" class="profile-panel">
      <header class="panel-header">
        <button class="close-btn" @click="toggleProfilePanel">✕</button>
      </header>

      <!-- Nếu đang xem bạn bè -->
      <div v-if="activeTab === 'friends'" class="panel-content">
        <div class="profile-info">
          <img :src="current.avatar" class="profile-avatar" />
          <h3 class="profile-name">{{ current.name }}</h3>
        </div>

        <div class="personal-details">
          <h4 class="section-title">Thông tin cá nhân</h4>
          <div class="detail-item">
            <i class="icon-phone"></i>
            <span>{{ current.phone || 'Chưa cập nhật' }}</span>
          </div>
          <div class="detail-item">
            <i class="icon-location"></i>
            <span>{{ current.location || 'Chưa cập nhật' }}</span>
          </div>
        </div>

        <div class="file-list">
          <h4 class="section-title">Files</h4>
          <ul>
            <li v-for="msg in messages.filter(m => m.file)" :key="msg.id" class="file-item">
              <i class="icon-file"></i>
              <span class="file-name">{{ msg.file.name }}</span>
              <a :href="msg.file.url" download class="icon-download"></a>
            </li>
          </ul>
        </div>

        <button class="delete-btn">Xóa đoạn tin nhắn</button>
      </div>

      <!-- Nếu đang xem nhóm -->
<!-- Nếu đang xem nhóm -->
      <div v-else class="panel-content">
        <div class="profile-info">
          <img :src="current.avatar" class="profile-avatar" />
          <h3 class="profile-name">{{ current.name }} <span class="edit-icon">✎</span></h3>
        </div>
        <div class="group-info">
          <h4 class="section-title">Thông tin nhóm</h4>
          <p>{{ groupMembers.length }} thành viên</p>
          <div class="member-avatars">
            <img v-for="m in groupMembers" :src="m.avatar" class="avatar" :key="m.id" />
          </div>
          <div class="group-actions-horizontal">
            <p class="admin-label">Bạn là quản trị viên</p>
            <div class="group-buttons-horizontal">
                  <button class="group-btn-icon" @click="showAddModal = true">
              <img src="@/assets/sendFriend.png" alt="Thêm" />
              Thêm bạn bè vào nhóm
            </button>
                <button class="group-btn-icon" @click="showGroupModal = true">
              <img src="@/assets/setting.png" alt="Quản lý" />
              Quản lí nhóm
            </button>
            </div>
          </div>
        </div>
<!-- Modal “Thêm bạn bè vào nhóm” -->
      <div
  v-if="showAddModal"
  class="group-modal-overlay"
  @click.self="showAddModal = false"
>
  <div class="group-modal">
    <!-- Header -->
    <div class="group-modal-header">
      <h3>Thêm vào nhóm</h3>
      <button class="close-btn" @click="showAddModal = false">×</button>
    </div>

    <!-- Body: search + list -->
    <div class="group-modal-body">
      <div class="search-wrapper">
        <span class="list-title">Danh sách bạn bè</span>
        <input
          type="text"
          v-model="addSearch"
          placeholder="Tìm theo tên hoặc số"
        />
      </div>
      <ul class="member-list">
        <li
          v-for="friend in filteredFriendsToAdd"
          :key="friend.id"
          class="member-item"
        >
          <img :src="friend.avatar" class="avatar" alt="" />
          <span class="name">{{ friend.name }}</span>
          <button
            class="add-btn"
            @click="addToGroup(friend.id)"
          >
            Thêm vào nhóm
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>

        <!-- Modal overlay + nội dung -->
 <div v-if="showGroupModal" class="group-modal-overlay" @click.self="showGroupModal = false">
    <div class="group-modal">
      <!-- Header & nút đóng -->
      <div class="group-modal-header">
        <h3>Quản lí nhóm</h3>
        <button class="close-btn" @click="showGroupModal = false">×</button>
      </div>

      <!-- Body: search + list thành viên -->
      <div class="group-modal-body">
        <input
          type="text"
          v-model="searchText"
          placeholder="Quản lí nhóm"
          class="group-search"
        />

        <ul class="member-list">
          <li v-for="member in filteredMembers" :key="member.id" class="member-item">
            <img :src="member.avatar" class="avatar" />
            <span class="name">{{ member.name }}</span>
            <button class="remove-btn" @click="removeFromGroup(member.id)">
              Xóa khỏi nhóm
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>


        <div class="file-list">
          <h4 class="section-title">Files</h4>
          <ul>
            <li v-for="msg in messages.filter(m => m.file)" :key="msg.id" class="file-item">
              <i class="icon-file"></i>
              <span class="file-name">{{ msg.file.name }}</span>
              <a :href="msg.file.url" download class="icon-download"></a>
            </li>
          </ul>
        </div>

        <button class="delete-btn">Xóa đoạn tin nhắn</button>
      </div>
    </aside>
    <ProfileModal 
      v-if="showProfileModal" 
      :accountId="loggedInAccountId" 
      @close="closeProfileModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed , onMounted, onBeforeUnmount} from 'vue'
import ProfileModal from './MessageNewDetail.vue'
// const isGroupPanel = computed(() => activeTab.value === 'groups')

// existing state imports

const loggedInAccountId = ref(localStorage.getItem('accountId'))
const showProfileModal = ref(false)
const user = ref({
  avatar: 'image/avatar.jpg', 
})

function getSender(msg) {
  return friends.value.find(f => f.id === msg.senderId) || null
}
const groupMembers = ref([
  { id: 1, name: 'Nhân', avatar: require('@/assets/nhan.jpg') },
  { id: 2, name: 'Cầu', avatar: require('@/assets/cau.jpg') },
  { id: 3, name: 'Trường', avatar: require('@/assets/truong.jpg') },
  { id: 4, name: 'Quang', avatar: require('@/assets/quang.jpg') },
  // { id: 5, name: 'Vũ', avatar: require('@/assets/vu.jpg') },
])

const members = ref([
  { id:1, name:'Quang',  avatar:require('@/assets/cau.jpg') },
  { id:2, name:'Nhân',   avatar:require('@/assets/nhan.jpg') },
  { id:3, name:'Cầu',    avatar:require('@/assets/truong.jpg') },
  /* ... */
])

const showGroupModal = ref(false)
const searchText      = ref('')

// Lọc theo tên
const filteredMembers = computed(() => 
  members.value.filter(m => 
    m.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
)

function removeFromGroup(id) {
  members.value = members.value.filter(m => m.id !== id)
}

function openProfileModal() {
  showProfileModal.value = true
}

function closeProfileModal() {
  showProfileModal.value = false
}

const showAddModal = ref(false)
const addSearch    = ref('')
// Lọc danh sách bạn bè để thêm
const filteredFriendsToAdd = computed(() =>
  friends.value.filter(f =>
    f.name.toLowerCase().includes(addSearch.value.toLowerCase()) ||
    String(f.id).includes(addSearch.value)
  )
)

function addToGroup(id) {
  // Ví dụ: remove bạn đó khỏi danh sách friends
  friends.value = friends.value.filter(f => f.id !== id)
  // TODO: đẩy lên API hoặc cập nhật group.members
}

// Danh sách bạn bè
const friends = ref([
  { id: 1, name: 'Nhân',   avatar: require('@/assets/nhan.jpg'),   desc: 'Nhân muốn gửi tin nhắn', online: true },
  { id: 2, name: 'Cầu',    avatar: require('@/assets/cau.jpg'),   desc: 'Cầu muốn gửi tin nhắn', online: true },
  { id: 3, name: 'Trường', avatar: require('@/assets/truong.jpg'),desc: 'Trường muốn gửi tin nhắn', online: true },
  { id: 4, name: 'Quang',  avatar: require('@/assets/quang.jpg'), desc: 'Bạn : )',              online: true },
])

// State
const selectedId = ref(1)
const messages = ref([
  { id: 1, fromMe: false, text: 'Hi bạn nha' },
  { id: 2, fromMe: true,  text: 'Hi bạn nha' },
  { id: 3, fromMe: false, file: { name: 'Báo cáo.pdf', size: '9mb' } },
  { id: 4, fromMe: false, file: { name: 'Báo cáo.docx', size: '9mb' } },
  { id: 5, fromMe: false, file: { name: 'Xem chó.mp4', size: '8mb' } },
  { id: 6, fromMe: false, text: 'Đây nè bạn ơi' },
  { id: 7, fromMe: true,  text: 'Cảm ơn nha' }
])
// const searchText = ref('')
const messageInput = ref('')
const showEmojiPicker = ref(false)
const showProfilePanel = ref(false)
const emojis = ref([
  '😊','😂','😍','🤣','😎','😢','😡','👍','👎','🎉','😴','🤔','😘','🥰','🤩','😇',
  '🤤','😱','😷','🥳','🤯','🧐','🤮','🤗','🤫','🤭','👏','🙌','🦄','💩','👻','💀',
  '👽','🤖','🎃','😺','😼','🙈','🙉','🙊','🐶','🐱','🐻','🦊','🐼','🐨','🐯','🦁'
])

const showUserSidebar = ref(false)
const avatarWrapper = ref(null)

function toggleUserSidebar() {
  showUserSidebar.value = !showUserSidebar.value
}

// click ngoài để đóng
function handleClickOutside(e) {
  if (
    avatarWrapper.value &&
    !avatarWrapper.value.contains(e.target) &&
    !e.target.closest('.user-sidebar')
  ) {
    showUserSidebar.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// action
function goToUserProfile() {
  openProfileModal()
}
function goToChangePassword(){ console.log('Đổi mật khẩu') }
function logout()            { console.log('Đăng xuất') }

const showSearch = ref(false)
const searchQuery = ref('')
function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
}
const currentMessages = computed(() => {
  return messages.value.filter(msg => msg.chatId === selectedId.value)
})
const filteredMessages = computed(() => {
  const cm = currentMessages.value
  if (!searchQuery.value) return cm
  const q = searchQuery.value.toLowerCase()
  return cm.filter(m => m.text && m.text.toLowerCase().includes(q))
})
// Computed
const current = computed(() => {
  const list = activeTab.value === 'friends' ? friends.value : groups.value
  return list.find(f => f.id === selectedId.value) || {}
})

messages.value.push(
  // Cuộc trò chuyện 1vs1 với Nhân (id: 1)
  { id: 201, chatId: 1, fromMe: false,senderId: 1, text: 'Bạn đang làm gì đó?' },
  { id: 202, chatId: 1, fromMe: true, text: 'Tôi đang code Vue nha 😎' },
  { id: 203, chatId: 1, fromMe: false,senderId: 1, text: 'Gửi file báo cáo cho tôi với!' },
  { id: 204, chatId: 1, fromMe: true,  file: { name: 'BaoCao_Thang6.pdf', size: '5MB', url: '#' } },
  { id: 205, chatId: 1, fromMe: false,senderId: 1, image: 'https://via.placeholder.com/200' },
  { id: 206, chatId: 1, fromMe: true,  text: 'Đây là demo ảnh, bạn xem được chứ?' }
)
// Methods
function selectFriend(id) {
  selectedId.value = id
}
// Ref cho input file
const fileInput = ref(null)

// Mở dialog chọn file
function triggerFileDialog() {
  fileInput.value && fileInput.value.click()
}

// Xử lý sau khi chọn file
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  // format size
  function formatSize(bytes) {
    const kb = 1024
    const mb = kb * 1024
    if (bytes >= mb) return (bytes / mb).toFixed(2) + ' MB'
    if (bytes >= kb) return (bytes / kb).toFixed(2) + ' KB'
    return bytes + ' B'
  }

   const url = URL.createObjectURL(file)
  messages.value.push({
    id: Date.now(),
    fromMe: true,
    chatId: selectedId.value,
    file: { name: file.name, size: formatSize(file.size), url }
  })

  // reset
  event.target.value = ''
}

function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value
}

// thêm emoji vào input
function addEmoji(emoji) {
  messageInput.value += emoji
  showEmojiPicker.value = false
}

// Gửi tin nhắn văn bản
function sendMessage() {
  const text = messageInput.value.trim()
  if (!text) return
  messages.value.push({ id: Date.now(), fromMe: true, chatId: selectedId.value, text })
  messageInput.value = ''
}

function toggleProfilePanel() {
  showProfilePanel.value = !showProfilePanel.value
}
const activeTab = ref('friends') // 'friends' hoặc 'groups'
const groups = ref([
  { id: 100, name: 'Nhóm học Vue', avatar: require('@/assets/group1.png'), desc: '5 thành viên', online: true },
  { id: 101, name: 'Cà phê cuối tuần', avatar: require('@/assets/group2.png'), desc: '8 thành viên', online: false },
])

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: content-box ;
}
.chat-app {
  display: flex;
  height: 100%;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
/* Sidebar */
.icons-sidebar {
  width: 60px;
  padding: 1rem 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
  border: none;
}

.icons-sidebar .sidebar-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.icons-sidebar .sidebar-nav {
  margin-top: 2rem;
}

.icons-sidebar .sidebar-nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.icons-sidebar .sidebar-nav li img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.icons-sidebar .sidebar-spacer {
  flex: 1;
}

.icons-sidebar .sidebar-bottom .hamburger {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

/* -------------------------
   2. Sidebar list (bên phải)
   ------------------------- */
  .sidebar {
  background: #f9f9f9;
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
  border: 1px solid #000;
}

/* ghi đè cho sidebar icon-only */
.icons-sidebar {
  width: 60px;
  padding: 1rem 0;
  align-items: center;
}

/* phần sidebar list (mặc định .sidebar sẽ lấy width này) */
.sidebar:not(.icons-sidebar) {
  padding: 0 ;
}

/* search + nút cộng */
.search-bar {
  display: flex;
  align-items: center;
  margin-top : 20px;
  gap: 60px;               /* khoảng cách giữa input và nút + */
}

/* Wrapper để đặt icon trong input */
.search-bar .input-wrapper {
  position: relative;
  flex: 1;
}

/* Icon kính lúp */
.search-bar .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
}

/* Input bo tròn, có padding-left chừa chỗ icon */
.search-bar input {
  width: 94%;
  padding: 8px 12px 8px 36px; /* top/right/bottom/left */
  border: 1px solid #000;     /* viền đen */
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  
}

/* Nút + tròn */
.search-bar .add-btn {
  width: 8px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: #3b6eee;        /* đổi màu theo theme */
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  margin-left: -16px;
}
.search-bar .add-btn:hover {
  background: #335bcc;
}
/* .add-btn {
  margin-left: 8px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #3b6eee;
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
} */

.tab-section {
  display: flex;
  position: relative;
  margin: 1rem 0;
  border-bottom: 1px solid #ddd;
}
.tab-btn {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: color 0.2s;
}
.tab-btn.active {
  color: #000;
  font-weight: 600;
}
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  background: #ffa726;
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.friend-section {
  flex: 1;
}
.friend-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.friend-item:hover {
  background: #d5dbdb;
} 
.friend-item.active {
  background: #d3f0f3;
} 
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.friend-info {
  margin-left: 10px;
  flex: 1;
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
}
.online-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  margin-left: 6px;
  margin-top : 5px;
}
.desc {
  font-size: 12px;
  color: #000;
  display : flex;
  font-weight: 1000;
}

/* Main chat area */
.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #000;
  background: #fff;
}

/* trái: avatar + info */
.chat-header .header-left {
  display: flex;
  align-items: center;
}
.chat-header .header-left .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}
.chat-header .header-left .info .name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.chat-header .header-left .info .status {
  font-size: 12px;
  color: #777;
  margin-top: 2px;
}

/* phải: các nút */
.chat-header .header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.chat-header .icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* nếu bạn muốn nút + tròn nền màu */
.chat-header .add-btn {
  background: #3b6eee;
  color: #fff;
  border-radius: 50%;
}
.chat-header .menu-btn img {
  width: 20px;
  height: 20px;
}

.chat-header .search-btn img {
  width: 20px;
  height: 20px;
}

.chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
    background: #f5f5f5;
    
}
.msg-wrapper {
  display: flex;
  align-items: flex-end;
}
.align-right {
  justify-content: flex-end;
}
.align-left {
  justify-content: flex-start;
}
.msg-block {
  position: relative;
  max-width: 60%;
}
.msg {
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
}
.from-other {
  background: #ececec;
  color: #333;
  border: 1px solid #ddd;
}
.from-me {
  background: #3b6eee;
  color: #fff;
}

.file-attach {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 8px;
  gap: 8px;
}
.file-icon {
  font-size: 18px;
}
.file-info {
  flex: 1;
}
.file-name {
  margin: 0;
  font-size: 14px;
  color: #333;
}
.file-size {
  margin: 0;
  font-size: 12px;
  color: #777;
}
.download-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.chat-input {
  padding: 0.75rem 1rem;
  background: #fff;
}

/* chung cho 1 ô bao toàn bộ */
.chat-input .input-container {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 24px;
  padding: 4px 8px;
}

/* input chiếm hết vùng còn lại */
.input-container input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
  background: transparent;
  color: #333;
}

/* các nút icon */
.input-container .icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
}

/* size icon */
.input-container .attach-btn img,
.input-container .emoji-btn img,
.input-container .send-btn img {
  width: 20px;
  height: 20px;
}

/* emoji */
.input-container .emoji-btn {
  font-size: 18px;
  line-height: 1;
}

/* hover nhẹ */
.input-container .icon-btn:hover {
  background: rgba(0,0,0,0.05);
  border-radius: 50%;
}

.input-container {
  position: relative;
}

/* Popup emoji-picker */
.emoji-picker {
  position: absolute;
  bottom: 60px;       /* nâng lên trên nút input */
  right: 0;           /* canh sát phải */
  width: 300px;
  max-height: 240px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  overflow-y: auto;
  z-index: 100;
}

/* Header của picker */
.picker-header {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

/* Lưới hiển thị emoji */
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}

/* Mỗi ô emoji */
.emoji-item {
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  text-align: center;
  border-radius: 4px;
  transition: background 0.2s;
}
.emoji-item:hover {
  background: #f0f0f0;
} 

.profile-panel {
  width: 320px;
  background: #fff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-left: none;
}
.panel-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.panel-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.profile-info {
  text-align: center;
  margin-bottom: 16px;
}
.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}
.profile-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.personal-details {
  margin-bottom: 16px;
}
.personal-details .detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.detail-item i {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-size: contain;
}
.icon-phone { background-image: url('@/assets/phone.png'); }
.icon-location { background-image: url('@/assets/trangchu.png'); }

.file-list {
  flex: 1;
}
.section-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.file-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.icon-file {
  width: 20px;
  height: 20px;
  background-image: url('@/assets/file-pdf.png');
  background-size: contain;
  margin-right: 8px;
}
.file-name {
  flex: 1;
  font-size: 13px;
  color: #555;
}
.icon-download {
  width: 20px;
  height: 20px;
  background-image: url('@/assets/download.png');
  background-size: contain;
}

.delete-btn {
  margin-top: auto;
  background: #ff3b30;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.message-search {
  padding: 0.5rem 1rem;
}
.search-message-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  margin-left: -12px;
}

.user-sidebar {
  width: 200px;
  background: #fff;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  position: relative;   /* nếu bạn để nó nằm trong .chat-app flex container */
  z-index: 150;
   margin-right: -200px;
}

.user-sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
}

.user-sidebar-menu li {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.user-sidebar-menu li:hover {
  background: #f5f5f5;
}

.no-message {
  flex: 1;               /* chiếm toàn vùng chat-body */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}
.system-message {
  justify-content: center;
  text-align: center;
  padding: 4px 0;
}
.system-text {
  font-size: 12px;
  color: #888;
  background: transparent;
}
.group-msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.group-msg .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.sender-name {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}
.system-text {
  text-align: center;
  font-size: 12px;
  color: #888;
  padding: 4px 0;
}
.group-info .member-avatars {
  display: flex;
  gap: 4px;
  margin: 8px 0;
}
.group-info .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.group-info .add-friend,
.group-info .admin-label,
.group-info .manage-group {
  font-size: 13px;
  margin: 4px 0;
  color: #333;
}
.edit-icon {
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
}
.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 16px; /* nhóm: bo nhẹ, user: 50% */
  object-fit: cover;
  margin-bottom: 8px;
}
.group-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.group-actions-horizontal {
  margin-top: 12px;
}

.group-buttons-horizontal {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.group-btn-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  background-color: white;
  border: 1px solid white;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.group-btn-icon img {
  width: 16px;
  height: 16px;
}

/* 1) Overlay fullscreen */
.group-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 2) Khung modal */
.group-modal {
  background: #fff;
  width: 500px;
  max-width: 90%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* 3) Header */
.group-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.group-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

/* 4) Body: search + list */
.group-modal-body {
  padding: 1rem;
}

.group-search {
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.member-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.member-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.name {
  flex: 1;
}

.remove-btn {
  background: #e02424;
  border: none;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.group-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.group-modal {
  background: #fff;
  width: 500px; max-width: 95%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.group-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.group-modal-header h3 { margin: 0; }
.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
.group-modal-body { padding: 1rem; }

/* Search input */
.search-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* hoặc space-between nếu muốn input giãn đều */
  gap: 10rem;                    /* khoảng giữa text và input */
  margin-bottom: 1rem;
}

.search-wrapper .list-title {
  font-weight: 500;
  color: #333;
  white-space: nowrap;         /* để text không bị xuống dòng */
}

.search-wrapper input {
  flex: 1;                      /* input chiếm phần còn lại */
  max-width: 200px;             /* hoặc auto tuỳ ý */
}

.search-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.search-wrapper input {
  width: 200px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 20px;
}

/* Danh sách bạn bè */
.member-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.member-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
.member-item .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}
.member-item .name {
  flex: 1;
}

/* Nút “Thêm vào nhóm” outline xanh */
.add-btn {
  background: transparent;
  border: 1px solid #1d4ed8;
  color: #1d4ed8;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.add-btn:hover {
  background: #eff6ff;
}

</style>
