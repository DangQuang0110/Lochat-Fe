<template>
  <div class="modal-overlay">
    <div class="profile-modal">
      <!-- Profile View -->
      <div v-if="!isEditing" class="profile-view">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="title">Hồ sơ của tôi</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <!-- Background Image Section with Avatar -->
        <div class="background-section">
          <div class="background-image" :style="{ backgroundImage: `url(${profile.cover || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=220&fit=crop'})` }"></div>
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

        <!-- Bio Section -->
        <div class="bio-section">
          <h4 class="section-title">Giới thiệu</h4>
          <div class="bio-content">
            <p class="bio-text">{{ profile.bio }}</p>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="info-section">
          <h4 class="section-title">Thông tin liên hệ</h4>
          
          <div class="info-item">
            <div class="icon">
              <img src="/icons/phone.png" alt="Phone" class="icon-img" />
            </div>
            <span class="label">{{ profile.phone }}</span>
          </div>
        </div>

        <!-- Edit Button -->
        <div class="edit-section">
          <button class="edit-btn" @click="startEditing">
            <span>Chỉnh sửa thông tin cá nhân</span>
            <img src="/icons/pencil.png" alt="Edit" class="edit-icon" />
          </button>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else class="edit-form-view">
        <div class="modal-header">
          <h2 class="title">Chỉnh sửa thông tin cá nhân</h2>
          <button class="close-btn" @click="cancelEdit">×</button>
        </div>

        <div class="edit-profile-form">
          <div class="form-group">
            <label>Tên</label>
            <input type="text" v-model="editData.name" placeholder="Nhập tên của bạn">
          </div>

          <div class="form-group">
            <label>Ảnh đại diện</label>
            <div class="avatar-placeholder">
              <input type="file" accept="image/*" @change="handleAvatarUpload">
              <div v-if="!editData.avatar" class="avatar-icon">📷</div>
              <img v-else :src="editData.avatar" alt="Avatar Preview" class="avatar-preview">
            </div>
          </div>

          <div class="form-group">
            <label>Ảnh bìa</label>
            <div class="cover-placeholder">
              <input type="file" accept="image/*" @change="handleCoverUpload">
              <div v-if="!editData.cover" class="cover-icon">📸</div>
              <img v-else :src="editData.cover" alt="Cover Preview" class="cover-preview">
            </div>
          </div>

          <div class="form-group">
            <label>Giới thiệu</label>
            <textarea 
              v-model="editData.bio" 
              placeholder="Viết một vài dòng giới thiệu về bản thân..."
              rows="4"
              class="bio-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Thông tin liên hệ</label>
            <div class="info-group">
              <div>
                <label>Số điện thoại</label>
                <input type="tel" v-model="editData.phone" placeholder="0369620631">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="save-btn" @click="saveChanges">Lưu thông tin</button>
            <button class="cancel-btn" @click="cancelEdit">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileModal',
  data() {
    return {
      isEditing: false,
      profile: {
        name: 'Gia Phong',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        cover: null,
        bio: 'Tôi là một nhà phát triển phần mềm đam mê công nghệ và học hỏi những điều mới mỗi ngày. Thích khám phá các framework mới, xây dựng ứng dụng web hiện đại và chia sẻ kiến thức với cộng đồng.',
        phone: '0369620631'
      },
      editData: {}
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    startEditing() {
      this.isEditing = true;
      // Copy current profile data to edit data
      this.editData = { ...this.profile };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editData = {};
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editData.avatar = URL.createObjectURL(file);
      }
    },
    handleCoverUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editData.cover = URL.createObjectURL(file);
      }
    },
    saveChanges() {
      // Update profile with edited data
      this.profile = { ...this.editData };
      this.isEditing = false;
      
      // Emit save event to parent component
      this.$emit('save', this.profile);
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
  
  width: 100%;
  max-width: 600px;
  max-height: 95vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  width: 40px;
  height: 40px;
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

/* Profile View Styles */
.background-section {
  position: relative;
  height: 220px;
  overflow: visible;
}

.background-image {
  width: 100%;
  height: 100%;
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
  bottom: -60px;
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
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 6px solid white;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 10;
  position: relative;
}

.name-section {
  padding: 90px 30px 25px 30px;
  text-align: center;
}

.profile-name {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.bio-section {
  padding: 0 30px 30px 30px;
}

.bio-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #4A90E2;
}

.bio-text {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin: 0;
  font-style: italic;
}

.info-section {
  padding: 0 30px 30px 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin: 0 0 25px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.label {
  font-size: 18px;
  color: #333;
  font-weight: 400;
}

.edit-section {
  padding: 0 30px 30px 30px;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px 30px;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: #3B82F6;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
}

.edit-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.edit-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

/* Edit Form Styles */
.edit-form-view {
  max-height: 95vh;
  overflow-y: auto;
}

.edit-profile-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
  font-size: 15px;
  transition: color 0.3s ease;
}

.form-group:hover label {
  color: #2980b9;
}

.form-group input[type="text"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus,
.form-group input[type="tel"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  background: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px auto 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-placeholder:hover {
  background: #dfe6e9;
  border-color: #3498db;
}

.avatar-placeholder input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.avatar-icon {
  font-size: 28px;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.avatar-placeholder:hover .avatar-icon {
  color: #3498db;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.cover-placeholder {
  width: 100%;
  height: 120px;
  background: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cover-placeholder:hover {
  background: #dfe6e9;
  border-color: #3498db;
}

.cover-placeholder input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.cover-icon {
  font-size: 28px;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.cover-placeholder:hover .cover-icon {
  color: #3498db;
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bio-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.bio-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
}

.bio-textarea::placeholder {
  color: #95a5a6;
  font-style: italic;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-group div {
  display: flex;
  flex-direction: column;
}

.info-group label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #2c3e50;
}

.info-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.info-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.save-btn {
  flex: 1;
  background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.save-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.2);
}

.cancel-btn {
  flex: 1;
  background: #95a5a6;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

/* Responsive */
@media (max-width: 768px) {
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
  
  .modal-header, .info-section, .edit-section, .name-section, .bio-section, .edit-profile-form {
    padding-left: 25px;
    padding-right: 25px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .profile-name {
    font-size: 26px;
  }
  
  .bio-text {
    font-size: 15px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>