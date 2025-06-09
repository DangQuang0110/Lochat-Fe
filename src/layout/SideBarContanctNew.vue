<template>
  <div class="contact-manager">
    <!-- Header -->
    <header class="header">
      <span class="dot"></span>
      <h2>Thêm bạn bè</h2>
      <button class="close-btn">✕</button>
    </header>

    <!-- Main layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <ul class="menu">
          <router-link to="/addfriend" custom v-slot="{ navigate, isActive }">
            <li :class="{ active: isActive || isAddFriendActive }" @click="navigate">
              <img src="/icons/add-friend.png" class="icon" /> Thêm bạn bè
            </li>
          </router-link>
          <router-link to="/add-to-group" custom v-slot="{ navigate, isActive }">
            <li :class="{ active: isActive }" @click="navigate">
              <img src="/icons/add-group.png" class="icon" /> Thêm bạn bè vào nhóm
            </li>
          </router-link>
        </ul>
      </aside>

      <!-- Content slot -->
      <section class="content">
        <slot />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactLayoutnew'
}
</script>

<style scoped>
.contact-manager {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ccc;

  /* Bóng đổ xuống dưới */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header .dot {
  width: 8px;
  height: 16px;
  background: red;
  margin-right: 8px;
}
.header h2 {
  flex: 1;
  margin: 0 12px;
  font-size: 18px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* Main layout */
.main-layout {
  display: flex;
  height: 100%;
}

/* Sidebar */
.sidebar {
  width: 180px;
  border-right: 1px solid #ddd;
  padding: 16px 8px;
  height:600px;
  /* Bóng đổ sang phải */
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.menu li {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.3s ease, transform 0.1s ease;
  border-radius: 8px;
}
.menu li:hover {
  background: #eee;
  transform: scale(1.02);
}
.menu li.active {
  color: red;
  font-weight: bold;
  background: #ffeaea;
}
.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

/* Slot content placeholder */
.content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
</style>
