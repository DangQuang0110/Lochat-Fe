<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="account-modal">
      <div class="modal-header">
        <span class="indicator"></span>
        <h2>Thông tin tài khoản</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <img :src="user.cover" class="cover-img" />
      <div class="profile-box">
        <img :src="user.avatar" class="avatar" />
        <h3 class="name">{{ user.name }}</h3>
        <!-- <button class="friend-btn">{{ user.isFriend ? 'Bạn bè' : 'Kết bạn' }}</button> -->
      </div>
        <div class="info-section">
          <h4>Thông tin cá nhân</h4>
          <div class="info-item">
            <img src="/icons/gioitinh.png" class="icon" />
            <span>{{ user.gender }}</span>
          </div>
          <div class="info-item">
            <img src="/icons/ngaysinh.png" class="icon" />
            <span>{{ user.birthdate }}</span>
          </div>
          <div class="info-item">
            <img src="/icons/trangchu.png" class="icon" />
            <span>{{ user.address }}</span>
          </div>
          <div class="info-item">
            <img src="/icons/phone.png" class="icon" />
            <span>{{ user.phone }}</span>
          </div>
        </div>
      <button class="unfriend-btn" v-if="user.isFriend">Hủy kết bạn</button>
    </div>
  </div>
</template> 

<script setup>
/* global defineProps, defineEmits */
defineProps(['user'])
const emit = defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.account-modal {
  width: 360px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  font-family: sans-serif;
}
.account-modal {
  width: 360px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  font-family: sans-serif;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.modal-header .indicator {
  width: 10px;
  height: 20px;
  background: red;
  /* border-radius: 50%; */
  margin-right: 8px;
}

.modal-header h2 {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
}

.modal-header .close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.cover-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.profile-box {
  text-align: center;
  margin-top: -30px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ccc;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
  margin-bottom: 8px;
}

.name {
  margin: 0;
  font-weight: bold;
}

/* .friend-btn {
  margin-top: 6px;
  padding: 4px 12px;
  font-size: 14px;
  border: 2px solid blue;
  color: blue;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start; /* ⬅ căn trái */


.info-section {
  padding: 0 16px 16px 16px;
}

.info-section h4 {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: bold;
}

.info-item {
  display: flex;
  align-items: center;
  gap:20px;
  margin-bottom: 20px;
  font-size: 14px;
}

.icon {
  font-size: 16px;
}

.unfriend-btn {
  background: red;
  color: white;
  width: calc(100% - 32px);
  margin: 0 16px 16px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
</style>
