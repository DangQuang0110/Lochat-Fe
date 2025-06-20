<template>
  <div class="admin-container">
    <!-- Add notification component -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="sidebar-brand">Admin</h2>
      <ul class="sidebar-menu">
        <li class="menu-item active">
          <img src="@/assets/block-user.png" class="icon" />
          <span>Chặn người dùng</span>
        </li>
      </ul>
      <button class="logout-btn" @click="handleLogout">
        <img src="@/assets/logout.png" class="icon" />
        <span>Đăng xuất</span>
      </button>
    </aside>

    <!-- Main panel -->
    <div class="main-panel">
      <!-- Header -->
      <header class="header">
        <h1>Good morning, Admin</h1>
      </header>

      <!-- Body -->
      <section class="body">
        <!-- Sort -->
        <div class="sort-bar">
          <label for="sort">Sắp xếp</label>
          <select id="sort" v-model="sortOrder">
            <option value="name-asc">Tên (A–Z)</option>
            <option value="name-desc">Tên (Z–A)</option>
          </select>
        </div>

        <!-- Grid of cards -->
        <div class="grid">
          <div class="card" v-for="user in pagedUsers" :key="user.id">
            <div class="card-header">
              <img
                :src="user.avatar"
                class="avatar"
                @error="(event) => (event.target.src = defaultAvatar)"
              />
              <div class="user-info">
                <strong>{{ user.name }}</strong>
                <span class="role">{{ user.role }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="line">
                <img src="@/assets/phone.png" class="icon-sm" />
                <span>{{ user.phone }}</span>
              </div>
            </div>
            <div class="card-footer">
              <button
                v-if="!user.isBanned"
                class="btn-block"
                @click="handleBanUser(user)"
              >
                Khóa
              </button>
              <button 
                v-else 
                class="btn-unblock" 
                @click="handleUnbanUser(user)"
              >
                Mở khóa
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">‹</button>
          <button
            v-for="p in totalPages"
            :key="p"
            :class="{ active: p === currentPage }"
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            ›
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getListAccount, banUser, unbanUser } from "@/service/AdminService/AdminSer";
import defaultAvatar from "@/assets/avata.jpg";
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([]);
const notification = ref({ show: false, message: '', type: '' });

const sortOrder = ref("name-asc");
const currentPage = ref(1);
const pageSize = 6;


const handleLogout = () => {
  // Xóa thông tin lưu trong localStorage
  localStorage.removeItem('accountId')
  localStorage.removeItem('user')

  // Chuyển về trang đăng nhập
  router.push('/')
}
// Sắp xếp
const sorted = computed(() => {
  return [...users.value].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return sortOrder.value === "name-asc" ? cmp : -cmp;
  });
});

// Phân trang
const totalPages = computed(() => Math.ceil(sorted.value.length / pageSize));
const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sorted.value.slice(start, start + pageSize);
});

// Chuyển trang
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// lấy danh sách tài khoản ở đây
const fetchListAccount = async () => {
  try {
    const res = await getListAccount();
    console.log("Dữ liệu từ API:", res);
    users.value = res.map((acc) => ({
      id: acc.id,
      name: acc.profile.fullname || "Người dùng",
      phone: acc.phoneNumber || "",
      avatar: acc.profile.avatarUrl || defaultAvatar,
      isBanned: acc.isBanned || false,
    }));
    console.log("Danh sách người dùng sau khi map:", users.value);
  } catch (err) {
    console.error("❌ Lỗi khi gọi API:", err);
  }
};

// Add notification function
const showNotification = (message, type = 'info') => {
  notification.value = {
    show: true,
    message,
    type
  };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const handleBanUser = async (user) => {
  try {
    await banUser(user.id);
    user.isBanned = true;
    showNotification('Đã khóa người dùng thành công', 'success');
  } catch (error) {
    if (error.response?.status === 409) {
      // Kiểm tra response data để xác định lý do lỗi
      const errorMessage = error.response?.data?.message || 'Người dùng đã bị khóa trước đó';
      user.isBanned = true;
      showNotification(errorMessage, 'warning');
    } else {
      showNotification('Có lỗi xảy ra khi khóa người dùng', 'error');
    }
  }
};

const handleUnbanUser = async (user) => {
  try {
    await unbanUser(user.id);
    user.isBanned = false;
    showNotification('Đã mở khóa người dùng thành công', 'success');
  } catch (error) {
    if (error.response?.status === 409) {
      // Kiểm tra response data để xác định lý do lỗi
      const errorMessage = error.response?.data?.message || 'Người dùng chưa bị khóa';
      user.isBanned = false;
      showNotification(errorMessage, 'warning');
    } else {
      showNotification('Có lỗi xảy ra khi mở khóa người dùng', 'error');
    }
  }
};

onMounted(fetchListAccount);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
.admin-container {
  font-family: "Roboto", sans-serif;
  display: flex;
  height: 100vh;
  background: #f7effc;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #d161a8;
  padding: 24px 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.sidebar-brand {
  position: relative;
  padding-left: 52px;
  margin: 0;
  font-size: 40px;
  font-weight: bold;
}
/*  */

/* --- Gạch trắng dưới chữ "Admin" --- */
.sidebar-brand::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: -16px;
  width: calc(100% - -32px); /* lề phải cân bằng với padding-left */
  height: 2px;
  background: #fff;
}

.sidebar-menu {
  flex: 1;
  margin-top: 32px;
  padding: 0;
  list-style: none;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.menu-item.active {
  background: #ec3b5f;
}
.menu-item .icon {
  width: 20px;
  margin-right: 8px;
}
.logout-btn {
  background: none;
  border: none;
  color: #fff;
  display: flex;
  align-self: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  margin-top: auto;
  margin-right: 10px;
}
.logout-btn .icon {
  width: 18px;
  margin-right: 6px;
}

/* Main panel */
.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}
.header h1 {
  margin: 0;
  color: #d161a8;
}

/* Body */
.body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
.sort-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.sort-bar select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: space-between;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info strong {
  display: block;
  font-size: 16px;
}
.user-info .role {
  font-size: 14px;
  color: #666;
}
.card-body .line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}
.icon-sm {
  width: 16px;
  opacity: 0.6;
}
.card-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.btn-block {
  background: #e31a26;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-unblock {
  background: #3cb970;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.pagination button {
  border: none;
  background: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button.active {
  background: #d161a8;
  color: #fff;
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Add notification styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #f44336;
}

.notification.warning {
  background-color: #ff9800;
}

.notification.info {
  background-color: #2196F3;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
