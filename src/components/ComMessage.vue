<template>
  <div class="chat-app">
    <!-- Icons Sidebar -->
    <aside class="sidebar icons-sidebar">
      <div class="sidebar-top">
        <img
          :src="user.avatar"
          class="avatar"
          @click.stop="toggleUserSidebar"
        />
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
      <button class="add-btnn" @click="showGroupForm = true">+</button>
    </aside>

    <!-- Main Chat Area -->
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
          <button class="btn icon-btn search-btn" @click="toggleSearch">
            <img src="@/assets/search_icon.png" alt="Tìm trong cuộc trò chuyện" />
          </button>
          <div v-if="showSearch" class="message-search">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm tin nhắn"
              class="search-message-input"
            />
          </div>
          <button class="btn icon-btn menu-btn" @click="toggleProfilePanel">
            <img src="@/assets/menu.png" alt="Menu" />
          </button>
        </div>
      </header>

      <div class="chat-body">
        <div v-if="currentMessages.length === 0" class="no-message">
          Chưa có tin nhắn mới
        </div>
        <template v-else>
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="msg-wrapper"
            :class="{ 'align-right': msg.fromMe, 'align-left': !msg.fromMe }"
          >
            <div v-if="msg.system" class="system-text">
              {{ msg.text }}
            </div>
            <template v-else-if="activeTab === 'groups'">
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
      <div v-else class="panel-content">
        <div class="profile-info">
          <img :src="current.avatar" class="profile-avatar" />
          <h3 class="profile-name">{{ current.name }} <span class="edit-icon" @click="openEditGroupModal">✎</span></h3>
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

    <!-- Add Members Modal -->
    <div v-if="showAddModal" class="group-modal-overlay" @click.self="showAddModal = false">
      <div class="group-modal">
        <div class="group-modal-header">
          <h3>Thêm vào nhóm</h3>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>
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

    <!-- Manage Group Modal -->
    <div v-if="showGroupModal" class="group-modal-overlay" @click.self="showGroupModal = false">
      <div class="group-modal">
        <div class="group-modal-header">
          <h3>Quản lí nhóm</h3>
          <button class="close-btn" @click="showGroupModal = false">×</button>
        </div>
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

    <!-- GroupForm Modal -->
    <div v-if="showGroupForm" class="group-modal-overlay" @click.self="showGroupForm = false">
      <GroupForm :friends="friends" @close="closeGroupForm" @group-created="handleGroupCreated" />
    </div>

    <!-- GroupEditModal -->
    <GroupEditModal
      v-if="showEditGroupModal"
      :group-name="current.name"
      @close="closeEditGroupModal"
      @confirm="handleGroupEdit"
    />

    <!-- Profile Modal -->
    <ProfileModal 
      v-if="showProfileModal" 
      :accountId="loggedInAccountId" 
      @close="closeProfileModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ProfileModal from './MessageNewDetail.vue';
import GroupForm from './GroupForm.vue';
import GroupEditModal from './GroupEditModal.vue'; // Import GroupEditModal

const loggedInAccountId = ref(localStorage.getItem('accountId'));
const showProfileModal = ref(false);
const showGroupForm = ref(false);
const showEditGroupModal = ref(false); // State for GroupEditModal
const user = ref({
  avatar: 'image/avata.jpg',
});
const friends = ref([
  { id: 1, name: 'Nhân', avatar: require('@/assets/nhan.jpg'), desc: 'Nhân muốn gửi tin nhắn', online: true },
  { id: 2, name: 'Cầu', avatar: require('@/assets/cau.jpg'), desc: 'Cầu muốn gửi tin nhắn', online: true },
  { id: 3, name: 'Trường', avatar: require('@/assets/truong.jpg'), desc: 'Trường muốn gửi tin nhắn', online: true },
  { id: 4, name: 'Quang', avatar: require('@/assets/quang.jpg'), desc: 'Bạn : )', online: true },
]);
const groups = ref([
  { id: 100, name: 'Nhóm học Vue', avatar: require('@/assets/group1.png'), desc: '5 thành viên', online: true },
  { id: 101, name: 'Cà phê cuối tuần', avatar: require('@/assets/group2.png'), desc: '8 thành viên', online: false },
]);
const groupMembers = ref([
  { id: 1, name: 'Nhân', avatar: require('@/assets/nhan.jpg') },
  { id: 2, name: 'Cầu', avatar: require('@/assets/cau.jpg') },
  { id: 3, name: 'Trường', avatar: require('@/assets/truong.jpg') },
  { id: 4, name: 'Quang', avatar: require('@/assets/quang.jpg') },
]);
const members = ref([
  { id: 1, name: 'Quang', avatar: require('@/assets/cau.jpg') },
  { id: 2, name: 'Nhân', avatar: require('@/assets/nhan.jpg') },
  { id: 3, name: 'Cầu', avatar: require('@/assets/truong.jpg') },
]);
const messages = ref([
  { id: 1, fromMe: false, text: 'Hi bạn nha' },
  { id: 2, fromMe: true, text: 'Hi bạn nha' },
  { id: 3, fromMe: false, file: { name: 'Báo cáo.pdf', size: '9mb' } },
  { id: 4, fromMe: false, file: { name: 'Báo cáo.docx', size: '9mb' } },
  { id: 5, fromMe: false, file: { name: 'Xem chó.mp4', size: '8mb' } },
  { id: 6, fromMe: false, text: 'Đây nè bạn ơi' },
  { id: 7, fromMe: true, text: 'Cảm ơn nha' },
  { id: 201, chatId: 1, fromMe: false, senderId: 1, text: 'Bạn đang làm gì đó?' },
  { id: 202, chatId: 1, fromMe: true, text: 'Tôi đang code Vue nha 😎' },
  { id: 203, chatId: 1, fromMe: false, senderId: 1, text: 'Gửi file báo cáo cho tôi với!' },
  { id: 204, chatId: 1, fromMe: true, file: { name: 'BaoCao_Thang6.pdf', size: '5MB', url: '#' } },
  { id: 205, chatId: 1, fromMe: false, senderId: 1, image: 'https://via.placeholder.com/200' },
  { id: 206, chatId: 1, fromMe: true, text: 'Đây là demo ảnh, bạn xem được chứ?' },
]);
const activeTab = ref('friends');
const selectedId = ref(1);
const showGroupModal = ref(false);
const showAddModal = ref(false);
const showProfilePanel = ref(false);
const showEmojiPicker = ref(false);
const showUserSidebar = ref(false);
const showSearch = ref(false);
const messageInput = ref('');
const searchText = ref('');
const addSearch = ref('');
const searchQuery = ref('');
const avatarWrapper = ref(null);
const fileInput = ref(null);
const emojis = ref([
  '😊', '😂', '😍', '🤣', '😎', '😢', '😡', '👍', '👎', '🎉', '😴', '🤔', '😘', '🥰', '🤩', '😇',
  '🤤', '😱', '😷', '🥳', '🤯', '🧐', '🤮', '🤗', '🤫', '🤭', '👏', '🙌', '🦄', '💩', '👻', '💀',
  '👽', '🤖', '🎃', '😺', '😼', '🙈', '🙉', '🙊', '🐶', '🐱', '🐻', '🦊', '🐼', '🐨', '🐯', '🦁',
]);

const current = computed(() => {
  const list = activeTab.value === 'friends' ? friends.value : groups.value;
  return list.find(f => f.id === selectedId.value) || {};
});
const filteredMembers = computed(() => 
  members.value.filter(m => 
    m.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
);
const filteredFriendsToAdd = computed(() =>
  friends.value.filter(f =>
    f.name.toLowerCase().includes(addSearch.value.toLowerCase()) ||
    String(f.id).includes(addSearch.value)
  )
);
const currentMessages = computed(() => {
  return messages.value.filter(msg => msg.chatId === selectedId.value);
});
const filteredMessages = computed(() => {
  const cm = currentMessages.value;
  if (!searchQuery.value) return cm;
  const q = searchQuery.value.toLowerCase();
  return cm.filter(m => m.text && m.text.toLowerCase().includes(q));
});

function getSender(msg) {
  return friends.value.find(f => f.id === msg.senderId) || null;
}
function removeFromGroup(id) {
  members.value = members.value.filter(m => m.id !== id);
}
function addToGroup(id) {
  friends.value = friends.value.filter(f => f.id !== id);
}
function selectFriend(id) {
  selectedId.value = id;
}
function triggerFileDialog() {
  fileInput.value && fileInput.value.click();
}
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const formatSize = (bytes) => {
    const kb = 1024;
    const mb = kb * 1024;
    if (bytes >= mb) return (bytes / mb).toFixed(2) + ' MB';
    if (bytes >= kb) return (bytes / kb).toFixed(2) + ' KB';
    return bytes + ' B';
  };
  const url = URL.createObjectURL(file);
  messages.value.push({
    id: Date.now(),
    fromMe: true,
    chatId: selectedId.value,
    file: { name: file.name, size: formatSize(file.size), url },
  });
  event.target.value = '';
}
function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value;
}
function addEmoji(emoji) {
  messageInput.value += emoji;
  showEmojiPicker.value = false;
}
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  messages.value.push({ id: Date.now(), fromMe: true, chatId: selectedId.value, text });
  messageInput.value = '';
}
function toggleProfilePanel() {
  showProfilePanel.value = !showProfilePanel.value;
}
function toggleUserSidebar() {
  showUserSidebar.value = !showUserSidebar.value;
}
function handleClickOutside(e) {
  if (
    avatarWrapper.value &&
    !avatarWrapper.value.contains(e.target) &&
    !e.target.closest('.user-sidebar')
  ) {
    showUserSidebar.value = false;
  }
}
function goToUserProfile() {
  showProfileModal.value = true;
}
function goToChangePassword() {
  console.log('Đổi mật khẩu');
}
function logout() {
  console.log('Đăng xuất');
}
function toggleSearch() {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) searchQuery.value = '';
}
function closeProfileModal() {
  showProfileModal.value = false;
}
function closeGroupForm() {
  showGroupForm.value = false;
}
function handleGroupCreated(groupData) {
  groups.value.push({
    id: Date.now(),
    name: groupData.name,
    avatar: groupData.avatar || require('@/assets/group1.png'),
    desc: `${groupData.members.length} thành viên`,
    online: true,
  });
  selectedId.value = groups.value[groups.value.length - 1].id;
  activeTab.value = 'groups';
  showGroupForm.value = false;
}
function openEditGroupModal() {
  showEditGroupModal.value = true;
}
function closeEditGroupModal() {
  showEditGroupModal.value = false;
}
function handleGroupEdit(changes) {
  const group = groups.value.find(g => g.id === selectedId.value);
  if (group) {
    if (changes.groupName) {
      group.name = changes.groupName;
    }
    if (changes.imageFile) {
      group.avatar = URL.createObjectURL(changes.imageFile);
    }
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: content-box;
}
.chat-app {
  display: flex;
  height: 100%;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
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
.icons-sidebar .sidebar-nav {
  margin-top:1.5rem;
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
.add-btnn {
  width: 46px;
  height: 46px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
  margin-right: 5px;
  margin-bottom: 5px;
}
.sidebar-top{
  display: flex;
  margin-top:20px;
}
.sidebar {
  background: #f9f9f9;
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
  border: 1px solid #000;
}
.sidebar:not(.icons-sidebar) {
  padding: 0;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 60px;
}
.search-bar .input-wrapper {
  position: relative;
  flex: 1;
}
.search-bar .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
}
.search-bar input {
  width: 94%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #000;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}
.search-bar .add-btn {
  width: 8px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: #3b6eee;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  margin-left: -16px;
  margin-right: 3px;
}
.search-bar .add-btn:hover {
  background: #335bcc;
}
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
  margin-top: 5px;
}
.desc {
  font-size: 12px;
  color: #000;
  display: flex;
  font-weight: 1000;
}
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
.chat-header .menu-btn img,
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
.chat-input .input-container {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 24px;
  padding: 4px 8px;
}
.input-container input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
  background: transparent;
  color: #333;
}
.input-container .icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
}
.input-container .attach-btn img,
.input-container .emoji-btn img,
.input-container .send-btn img {
  width: 20px;
  height: 20px;
}
.input-container .emoji-btn {
  font-size: 18px;
  line-height: 1;
}
.input-container .icon-btn:hover {
  background: rgba(0,0,0,0.05);
  border-radius: 50%;
}
.emoji-picker {
  position: absolute;
  bottom: 60px;
  right: 0;
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
.picker-header {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}
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
  position: relative;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}
.system-text {
  text-align: center;
  font-size: 12px;
  color: #888;
  padding: 4px 0;
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
.group-info .admin-label {
  font-size: 13px;
  margin: 4px 0;
  color: #333;
}
.edit-icon {
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
}
.group-buttons-horizontal {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  width: 500px;
  max-width: 95%;
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
.group-modal-header h3 {
  margin: 0;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
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
.remove-btn {
  background: #e02424;
  border: none;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
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
.search-wrapper .list-title {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}
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