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
import { getAccountDetail, updateProfile } from '@/service/profileService'

export default {
  name: 'ProfileModal',
  props: {
    accountId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      profile: {
        name: '',
        avatar: '',
        cover: '',
        bio: '',
        phone: '',
        profileId: ''
      },
      editData: {},
      avatarFile: null,
      coverFile: null
    }
  },
  mounted() {
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        const data = await getAccountDetail(this.accountId)
        const profile = data.profile || {}
        this.profile = {
          name: profile.fullname || data.username,
          avatar: profile.avatarUrl || '',
          cover: profile.coverUrl || '',
          bio: profile.bio || '',
          phone: data.phoneNumber || '',
          profileId: profile.id || ''
        }
      } catch (err) {
        console.error('Không thể tải hồ sơ:', err)
      }
    },
    closeModal() {
      this.$emit('close')
    },
    startEditing() {
      this.isEditing = true
      this.editData = { ...this.profile }
    },
    cancelEdit() {
      this.isEditing = false
      this.editData = {}
      this.avatarFile = null
      this.coverFile = null
    },
    handleAvatarUpload(e) {
      const file = e.target.files[0]
      if (file) {
        this.avatarFile = file
        this.editData.avatar = URL.createObjectURL(file)
      }
    },
    handleCoverUpload(e) {
      const file = e.target.files[0]
      if (file) {
        this.coverFile = file
        this.editData.cover = URL.createObjectURL(file)
      }
    },
    async saveChanges() {
      try {
        const result = await updateProfile(
          this.profile.profileId,
          this.editData,
          this.avatarFile,
          this.coverFile
        )

        this.profile = {
          name: result.fullname,
          avatar: result.avatarUrl,
          cover: result.coverUrl,
          bio: result.bio,
          phone: this.editData.phone,
          profileId: result.profileId
        }

        this.isEditing = false
        this.avatarFile = null
        this.coverFile = null
        this.$emit('save', this.profile)
      } catch (err) {
        console.error('Lỗi khi cập nhật hồ sơ:', err)
      }
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
  max-width: 400px;
  max-height: 100vh;  
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  overflow: hidden;
  border-radius: 12px;
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
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-left: -6px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 36px;
  color: #999;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;  
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  margin-right : -24px;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

/* Profile View Styles */
.background-section {
  position: relative;
  height: 180px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
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
  inset: 0;
  background: linear-gradient(180deg,
    rgba(74, 144, 226, 0.4) 0%,
    rgba(123, 104, 238, 0.2) 60%,
    rgba(147, 112, 219, 0.0) 100%);
}

.avatar-overlay {
  position: absolute;
  bottom: -70px;
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  object-fit: cover;
  transition: transform 0.3s;
  margin-bottom : 24px;
}
.avatar:hover {
  transform: scale(1.03);
}

.name-section {
  padding: calc(50px + 16px) 24px 8px;  /* top = avatar lift + spacing */
  text-align: center;
  background: #fff;
}

.profile-name {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  color: #222;
}

.bio-section {
  padding: 16px 24px 24px;
  background: #fcfcfc;
}

.bio-content {
  background: #eeeeee;
  border-radius: 8px;
  padding: 16px;
  /* border-left: 4px solid #4A90E2; */
}

.bio-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #555;
  font-style: italic;
}


.info-section {
  padding: 0 30px 30px 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
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
  width: 80%;
  height: 80%;
  object-fit: contain;
  margin-left: -16px;
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
  background: #666;
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
  .background-section {
    height: 180px;
  }
  .avatar {
    width: 120px;
    height: 120px;
  }
  .name-section {
    padding-top: calc(60px + 12px);
  }
  .profile-name {
    font-size: 22px;
  }
  .bio-content {
    padding: 12px;
  }
  .bio-text {
    font-size: 14px;
  }
}
  
  .title {
    font-size: 20px;
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

</style>