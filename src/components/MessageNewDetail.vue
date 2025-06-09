<template>
  <div class="modal-overlay">
    <div class="profile-modal">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="title">Hồ sơ của tôi</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <!-- Background Image Section with Avatar -->
      <div class="background-section">
        <div class="background-image"></div>
        <div class="avatar-overlay">
          <div class="avatar-container">
            <img :src="profile.avatar" :alt="profile.name" class="avatar" />
          </div>
        </div>
      </div>

      <!-- Profile Name -->
      <div class="name-section">
        <h3 class="profile-name">{{ profile.name }}</h3>
      </div>

      <!-- Personal Information -->
      <div class="info-section">
        <h4 class="section-title">Thông tin cá nhân</h4>
        
        <div class="info-item">
          <div class="icon">
            <img src="/icons/gioitinh.png" alt="Gender" class="icon-img" />
          </div>
          <span class="label">{{ profile.gender }}</span>
        </div>

        <div class="info-item">
          <div class="icon">
            <img src="/icons/ngaysinh.png" alt="Birthdate" class="icon-img" />
          </div>
          <span class="label">{{ profile.birthDate }}</span>
        </div>

        <div class="info-item">
          <div class="icon">
            <img src="/icons/trangchu.png" alt="Address" class="icon-img" />
          </div>
          <span class="label">{{ profile.address }}</span>
        </div>

        <div class="info-item">
          <div class="icon">
            <img src="/icons/phone.png" alt="Phone" class="icon-img" />
          </div>
          <span class="label">{{ profile.phone }}</span>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="edit-section">
        <button class="edit-btn" @click="editProfile">
          <span>Chỉnh sửa thông tin cá nhân</span>
          <img src="/icons/pencil.png" alt="Edit" class="edit-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileModal',
  data() {
    return {
      profile: {
        name: 'Gia Phong',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        gender: 'Nam',
        birthDate: '25/09/2004',
        address: 'Hoài Nhơn, Bình Định',
        phone: '0369620631'
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    editProfile() {
      this.$emit('edit', this.profile);
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.profile-modal {
  background: white;
  border-radius: 20px; /* Tăng border-radius */
  width: 100%;
  max-width: 600px; /* Tăng từ 500px lên 600px */
  max-height: 95vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25); /* Đổ bóng đậm hơn */
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px; /* Tăng padding */
  border-bottom: 1px solid #f0f0f0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 26px; /* Tăng font size */
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px; /* Tăng kích thước nút close */
  color: #999;
  cursor: pointer;
  width: 40px; /* Tăng kích thước */
  height: 40px; /* Tăng kích thước */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.background-section {
  position: relative;
  height: 220px; /* Tăng chiều cao */
  overflow: visible;
}

.background-image {
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=220&fit=crop'); /* Tăng kích thước ảnh */
  background-size: cover;
  background-position: center;
  position: relative;
}

.background-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.3) 0%, rgba(123, 104, 238, 0.3) 50%, rgba(147, 112, 219, 0.3) 100%);
}

.avatar-overlay {
  position: absolute;
  bottom: -60px; /* Điều chỉnh vị trí avatar */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 140px; /* Tăng kích thước avatar */
  height: 140px; /* Tăng kích thước avatar */
  border-radius: 50%;
  border: 6px solid white; /* Tăng border */
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); /* Đổ bóng mạnh hơn */
  z-index: 10;
  position: relative;
}

.name-section {
  padding: 90px 30px 25px 30px; /* Tăng padding */
  text-align: center;
}

.profile-name {
  font-size: 28px; /* Tăng font size */
  font-weight: 600;
  color: #333;
  margin: 0;
}

.info-section {
  padding: 0 30px 30px 30px; /* Tăng padding */
}

.section-title {
  font-size: 18px; /* Tăng font size */
  font-weight: 600;
  color: #666;
  margin: 0 0 25px 0; /* Tăng margin */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 18px 0; /* Tăng padding */
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.icon {
  width: 32px; /* Tăng kích thước icon */
  height: 32px; /* Tăng kích thước icon */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px; /* Tăng margin */
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.label {
  font-size: 18px; /* Tăng font size */
  color: #333;
  font-weight: 400;
}

.edit-section {
  padding: 0 30px 30px 30px; /* Tăng padding */
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Tăng khoảng cách */
  width: 100%;
  padding: 18px 30px; /* Tăng padding */
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 14px; /* Tăng border-radius */
  font-size: 18px; /* Tăng font size */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: #3B82F6;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4); /* Đổ bóng mạnh hơn */
}

.edit-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.edit-icon {
  width: 20px; /* Tăng kích thước */
  height: 20px; /* Tăng kích thước */
  object-fit: contain;
}

/* Responsive */
@media (max-width: 768px) { /* Điều chỉnh breakpoint */
  .profile-modal {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .profile-modal {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
  }
  
  .modal-header, .info-section, .edit-section, .name-section {
    padding-left: 25px;
    padding-right: 25px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .profile-name {
    font-size: 26px;
  }
}
</style>