<!-- AccountModal.vue -->
<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="account-modal">
      <!-- Header -->
      <div class="modal-header">
        <h2>Thông tin tài khoản</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <!-- Cover + avatar + name -->
      <img :src="user.cover" class="cover-img" />
      <div class="profile-box">
        <img :src="user.avatar" class="avatar" />
        <h3 class="name">{{ user.name }}</h3>
      </div>

      <!-- Personal info -->
      <div class="info-section">
        <h4>Thông tin cá nhân</h4>

        <!-- Tiểu sử -->
        <div class="info-item">
          <img src="/icons/tieusu.png" class="icon" />
          <textarea
            class="bio-text"
            readonly
            :value="user.bio || 'Chưa cập nhật tiểu sử'"
          ></textarea>
        </div>

        <!-- SĐT -->
        <div class="info-item">
          <img src="/icons/phone.png" class="icon" />
          <span style="margin-top: 4px;">{{ user.phone }}</span>
        </div>
      </div>

      <!-- Unfriend button -->
      <button
        v-if="user.isFriend"
        class="unfriend-btn"
        @click="$emit('unfriend', user.id)"
      >
        Hủy kết bạn
      </button>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { ref, watchEffect } from 'vue'
import { getAccountDetail } from '@/service/profileService'
import hinhImg from '@/assets/avata.jpg'

// 1️⃣ Nhận prop accountId
const props = defineProps({
  accountId: { type: [String, Number], required: true }
})
const emit  = defineEmits(['close', 'unfriend'])

// 2️⃣ State hiển thị
const user = ref({
  id: '',
  name: '',
  avatar: hinhImg,
  cover : '',
  bio   : '',
  phone : '',
  isFriend: true
})

// 3️⃣ Mỗi khi accountId thay đổi ⇒ gọi API
watchEffect(async () => {
  if (!props.accountId) return
  try {
    const res      = await getAccountDetail(props.accountId)
    // hỗ trợ cả 2 dạng trả về
    const root     = res?.data ?? res
    const profile  = root.profile ?? {}

    user.value = {
      id     : root.id,
      name   : profile.fullname || root.username || 'Không rõ',
      avatar : profile.avatarUrl || hinhImg,
      cover  : profile.coverUrl  || '',
      bio    : profile.bio       || '',
      phone  : root.phoneNumber  || 'Chưa cập nhật',
      isFriend: true
    }
  } catch (err) {
    console.error('❌ Không thể tải thông tin tài khoản:', err)
  }
})
</script>


<style scoped>
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
  background: #f8f8f8;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  pointer-events: none;
  outline: none;
  user-select: none;
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
</style>
