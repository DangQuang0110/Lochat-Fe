<template>
  <div class="modal-overlay" v-if="showModal" @click="closeModal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="profile-modal" @click.stop>
      <!-- Profile View -->
      <div v-if="!isEditing" class="profile-view">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="title" id="modal-title">Hồ sơ của tôi</h2>
          <button class="close-btn" @click="closeModal" aria-label="Đóng modal">×</button>
        </div>

        <!-- Background Image Section with Avatar -->
        <div class="background-section">
          <div class="background-image" :style="{ backgroundImage: `url(${profile.cover || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=220&fit=crop'})` }"></div>
          <div class="avatar-overlay">
            <div class="avatar-container">
              <img :src="profile.avatar || '/icons/default-avatar.png'" :alt="profile.name" class="avatar" />
            </div>
          </div>
        </div>

        <!-- Profile Name -->
        <div class="name-section">
          <h3 class="profile-name">{{ profile.name || 'Chưa đặt tên' }}</h3>
        </div>

        <!-- Bio Section -->
        <div class="bio-section">
          <h4 class="section-title">Giới thiệu</h4>
          <div class="bio-content">
            <p class="bio-text">{{ profile.bio || 'Chưa có giới thiệu.' }}</p>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="info-section">
          <h4 class="section-title">Thông tin liên hệ</h4>
          <div class="info-item">
            <div class="icon">
              <img src="/icons/phone.png" alt="Phone" class="icon-img" />
            </div>
            <span class="label">{{ profile.phone || 'Chưa có số điện thoại.' }}</span>
          </div>
        </div>

        <!-- Edit Button -->
        <div class="edit-section">
          <button class="edit-btn" @click="startEditing" aria-label="Chỉnh sửa hồ sơ">
            <span>Chỉnh sửa thông tin cá nhân</span>
            <img src="/icons/pencil.png" alt="Edit" class="edit-icon" />
          </button>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else class="edit-form-view">
        <div class="modal-header">
          <h2 class="title" id="modal-title">Chỉnh sửa thông tin cá nhân</h2>
          <button class="close-btn" @click="cancelEdit" aria-label="Hủy chỉnh sửa">×</button>
        </div>

        <div class="edit-profile-form">
          <!-- Error Notification -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <div class="form-group">
            <label for="name">Tên</label>
            <input id="name" type="text" v-model="editData.name" placeholder="Nhập tên của bạn" aria-label="Tên người dùng" value="Gia Phong" />
          </div>

          <div class="form-group">
            <label for="avatar-upload">Ảnh đại diện</label>
            <div class="avatar-placeholder" @click="triggerAvatarInput">
              <input id="avatar-upload" type="file" accept="image/*" ref="avatarInput" @change="handleAvatarUpload" aria-label="Tải lên ảnh đại diện" />
              <div v-if="!editData.avatar" class="avatar-icon">📷</div>
              <img v-else :src="editData.avatar" alt="Ảnh đại diện xem trước" class="avatar-preview" />
            </div>
          </div>

          <div class="form-group">
            <label for="cover-upload">Ảnh bìa</label>
            <div class="cover-placeholder" @click="triggerCoverInput">
              <input id="cover-upload" type="file" accept="image/*" ref="coverInput" @change="handleCoverUpload" aria-label="Tải lên ảnh bìa" />
              <div v-if="!editData.cover" class="cover-icon">📸</div>
              <img v-else :src="editData.cover" alt="Ảnh bìa xem trước" class="cover-preview" />
            </div>
          </div>

          <div class="form-group">
            <label for="bio">Giới thiệu</label>
            <textarea id="bio" v-model="editData.bio" placeholder="Viết một vài dòng giới thiệu về bản thân..." rows="4" class="bio-textarea" aria-label="Giới thiệu bản thân">Sinh ra và lớn lên trong một gia đình bình thường, Phong đã sớm học được những giá trị sống cơ bản. Hiện tại, Phong đang học ở trường Đại học Bách Khoa Hà Nội.</textarea>
          </div>

          <div class="form-group">
            <label>Thông tin liên hệ</label>
            <div class="info-group">
              <div>
                <label for="phone">Số điện thoại</label>
                <input id="phone" type="tel" v-model="editData.phone" placeholder="0369620631" aria-label="Số điện thoại" value="0369620631" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="save-btn" @click="saveChanges" :disabled="isSaving" aria-label="Lưu thông tin">
              {{ isSaving ? 'Đang lưu...' : 'Lưu thông tin' }}
            </button>
            <button class="cancel-btn" @click="cancelEdit" aria-label="Hủy chỉnh sửa">Hủy</button>
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
      showModal: true,
      isEditing: false,
      isSaving: false,
      errorMessage: '',
      profile: {
        name: 'Gia Phong',
        avatar: '',
        cover: '',
        bio: 'Sinh ra và lớn lên trong một gia đình bình thường, Phong đã sớm học được những giá trị sống cơ bản. Hiện tại, Phong đang học ở trường Đại học Bách Khoa Hà Nội.',
        phone: '0369620631',
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
          name: profile.fullname || data.username || 'Gia Phong',
          avatar: profile.avatarUrl || '',
          cover: profile.coverUrl || '',
          bio: profile.bio || 'Sinh ra và lớn lên trong một gia đình bình thường, Phong đã sớm học được những giá trị sống cơ bản. Hiện tại, Phong đang học ở trường Đại học Bách Khoa Hà Nội.',
          phone: data.phoneNumber || '0369620631',
          profileId: profile.id || ''
        }
      } catch (err) {
        this.errorMessage = 'Không thể tải hồ sơ. Vui lòng thử lại sau.'
        console.error('Không thể tải hồ sơ:', err)
      }
    },
    closeModal() {
      this.showModal = false
      this.$emit('close')
    },
    startEditing() {
      this.isEditing = true
      this.editData = { ...this.profile }
      this.errorMessage = ''
    },
    cancelEdit() {
      this.isEditing = false
      this.editData = {}
      this.avatarFile = null
      this.coverFile = null
      this.errorMessage = ''
    },
    triggerAvatarInput() {
      this.$refs.avatarInput.click()
    },
    triggerCoverInput() {
      this.$refs.coverInput.click()
    },
    handleAvatarUpload(e) {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Ảnh đại diện phải nhỏ hơn 5MB.'
          e.target.value = ''
          return
        }
        this.avatarFile = file
        this.editData.avatar = URL.createObjectURL(file)
        this.errorMessage = ''
      }
    },
    handleCoverUpload(e) {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Ảnh bìa phải nhỏ hơn 5MB.'
          e.target.value = ''
          return
        }
        this.coverFile = file
        this.editData.cover = URL.createObjectURL(file)
        this.errorMessage = ''
      }
    },
    async saveChanges() {
      if (!this.editData.name.trim()) {
        this.errorMessage = 'Vui lòng nhập tên.'
        return
      }
      this.isSaving = true
      this.errorMessage = ''
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
        this.errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ. Vui lòng thử lại.'
        console.error('Lỗi khi cập nhật hồ sơ:', err)
      } finally {
        this.isSaving = false
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.profile-view {
  max-width: 380px;
  margin: 0 auto;
  padding: 0 16px;
  overflow-y: auto;
  max-height: 96vh;
}

.profile-modal {
  background: #ffffff;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Profile View Styles */
.background-section {
  position: relative;
  height: 160px;
  overflow: hidden;
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
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
}

.avatar-overlay {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  object-fit: cover;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.05);
}

.name-section {
  padding: 60px 24px 16px;
  text-align: center;
  background: #ffffff;
}

.profile-name {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.bio-section {
  padding: 16px 24px;
  background: #f9fafb;
}

.bio-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.bio-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
}

.info-section {
  padding: 16px 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
  text-transform: uppercase;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.label {
  font-size: 14px;
  color: #333;
  font-weight: 400;
}

.edit-section {
  padding: 16px 24px;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.edit-btn:active {
  transform: translateY(0);
}

.edit-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

/* Edit Form Styles */
.edit-form-view {
  padding: 24px;
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin: 0 0 16px;
  padding: 8px;
  background: #fef2f2;
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  background: #ffffff;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px auto;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-placeholder:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.avatar-placeholder input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.avatar-icon {
  font-size: 24px;
  color: #6b7280;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.cover-placeholder {
  width: 100%;
  height: 100px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.cover-placeholder:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.cover-placeholder input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.cover-icon {
  font-size: 24px;
  color: #6b7280;
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.bio-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  background: #ffffff;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s;
}

.bio-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-group label {
  font-size: 13px;
  color: #4b5563;
}

.info-group input {
  padding: 10px;
  border-radius: 6px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.save-btn {
  flex: 1;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.cancel-btn {
  flex: 1;
  background: #f3f4f6;
  color: #374151;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-modal {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .background-section {
    height: 140px;
  }
  .avatar {
    width: 80px;
    height: 80px;
  }
  .name-section {
    padding-top: 50px;
  }
  .profile-name {
    font-size: 20px;
  }
  .bio-text {
    font-size: 14px;
  }
  .form-actions {
    flex-direction: column;
  }
  .form-group label {
    font-size: 13px;
  }
  .form-group input,
  .bio-textarea {
    font-size: 14px;
  }
}
</style>