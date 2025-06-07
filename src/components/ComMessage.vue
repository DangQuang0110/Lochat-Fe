<template>
  <div class="chat-app">
         <aside class="sidebar icons-sidebar">
      <div class="sidebar-top">
        <img src="@/assets/quang.jpg" alt="Logo" class="sidebar-logo" />
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
        <button class="tab-btn active">Bạn bè</button>
        <button class="tab-btn">Nhóm</button>
        <div class="tab-indicator"></div>
      </div>
      <div class="friend-section">
        <div v-for="friend in friends" :key="friend.id" class="friend-item" :class="{ active: selectedId === friend.id }" @click="selectFriend(friend.id)">
          <img :src="friend.avatar" class="avatar" />
          <div class="friend-info">
            <div class="name">{{ friend.name }}<span v-if="friend.online" class="online-dot"></span></div>
            <div class="desc">{{ friend.desc }}</div>
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
      <div class="status">{{ current.online ? 'Đang hoạt động' : 'Offline' }}</div>
    </div>
  </div>
  <div class="header-right">
    <!-- nút thêm bạn/chat -->
    <button class="btn icon-btn search-btn">
    <img src="@/assets/search_icon.png" alt="" />
  </button>
      <!-- nếu có SVG thì import, ở đây tạm dùng dấu + -->
      
    <!-- nút menu (3 gạch) -->
    <button class="btn icon-btn menu-btn">
      <img src="@/assets/menu.png" alt="Menu" />
    </button>
  </div>
</header>

      <div class="chat-body">
        <div v-for="msg in messages" :key="msg.id" :class="['msg-wrapper', msg.fromMe ? 'align-right' : 'align-left']">
          <div class="msg-block">
            <div :class="['msg', msg.fromMe ? 'from-me' : 'from-other']">
              <div v-if="msg.file" class="file-attach">
                <span class="file-icon">📎</span>
                <div class="file-info">
                  <p class="file-name">{{ msg.file.name }}</p>
                  <p class="file-size">{{ msg.file.size }}</p>
                </div>
                <button class="download-btn">⬇️</button>
              </div>
              <p v-if="msg.text" class="msg-text">{{ msg.text }}</p>
            </div>
          </div>
        </div>
      </div>

     <footer class="chat-input">
    <div class="input-container">
      <button class="icon-btn attach-btn">
        <img src="@/assets/clip.png" alt="Đính kèm" />
      </button>

      <input type="text" placeholder="Nhập tin nhắn" />

      <button class="icon-btn emoji-btn">
        <img src="@/assets/happy-face.png" alt="Emoji" />
      </button>

      <button class="icon-btn send-btn">
        <img src="@/assets/send.png" alt="Gửi" />
      </button>
    </div>
  </footer>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ChatAppUI',
  data() {
    return {
      friends: [
        { id: 1, name: 'Nhân', avatar: require('@/assets/nhan.jpg'),   desc: 'Nhân muốn gửi tin nhắn', online: true },
        { id: 2, name: 'Cầu',  avatar: require('@/assets/cau.jpg'),    desc: 'Cầu muốn gửi tin nhắn', online: true },
        { id: 3, name: 'Trường', avatar: require('@/assets/truong.jpg'), desc: 'Trường muốn gửi tin nhắn', online: true },
        { id: 4, name: 'Quang', avatar: require('@/assets/quang.jpg'),  desc: 'Bạn : )',               online: true },
      ],
      selectedId: 4,
      messages: [
        { id: 1, fromMe: false, text: 'Hi bạn nha' },
        { id: 2, fromMe: true, text: 'Hi bạn nha' },
        { id: 3, fromMe: false, file: { name: 'Báo cáo.pdf', size: '9mb' } },
        { id: 4, fromMe: false, file: { name: 'Báo cáo.docx', size: '9mb' } },
        { id: 5, fromMe: false, file: { name: 'Xem chó.mp4', size: '8mb' } },
        { id: 6, fromMe: false, text: 'Đây nè bạn ơi' },
        { id: 7, fromMe: true, text: 'Cảm ơn nha' }
      ]
    }
  },
  computed: {
    current() {
      return this.friends.find(f => f.id === this.selectedId) || {}
    }
  },
  methods: {
    selectFriend(id) {
      this.selectedId = id;
    }
  }
}
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 100%;
  margin: 0;
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
  width: 100%;
  padding: 8px 12px 8px 36px; /* top/right/bottom/left */
  border: 1px solid #000;     /* viền đen */
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

/* Nút + tròn */
.search-bar .add-btn {
  width: 32px;
  height: 32px;
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
/* .friend-item:hover {
  background: #ffe0b2;
}
.friend-item.active {
  background: #ffc107;
} */
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
  margin-top : 8px;
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



</style>
