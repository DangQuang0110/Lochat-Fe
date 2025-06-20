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

        <!-- Cover and Avatar Section -->
        <div class="profile-header">
          <!-- Cover Image -->
          <div class="cover-section">
            <img v-if="profile.cover" :src="profile.cover" alt="Ảnh bìa" class="cover-image" />
            <div v-else class="cover-placeholder-display"></div>
          </div>
          
          <!-- Avatar positioned over cover -->
          <div class="avatar-section">
          <img :src="profile.avatar" :alt="profile.name" class="avatar" />
          </div>
        </div>

        <!-- Name Section -->
        <div class="profile-info">
          <h3 class="profile-name">{{ profile.name || 'Chưa đặt tên' }}</h3>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <h4 class="section-title">Thông tin cá nhân</h4>
          
          <!-- Bio Item -->
          <div class="info-item">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Tiểu sử</div>
              <div class="info-value">{{ profile.bio || 'Chưa có giới thiệu.' }}</div>
            </div>
          </div>

          <!-- Phone Item -->
          <div class="info-item">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-value">{{ profile.phone || 'Chưa có số điện thoại.' }}</div>
            </div>
          </div>
        </div>

        <!-- Edit Button -->
        <div class="edit-section">
          <button class="edit-btn" @click="startEditing" aria-label="Chỉnh sửa hồ sơ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Chỉnh sửa thông tin cá nhân
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
            <input id="name" type="text" v-model="editData.name" placeholder="Nhập tên của bạn" aria-label="Tên người dùng" />
          </div>

          <div class="form-group">
                      <label for="avatar-upload">Ảnh đại diện</label>
                      <div class="avatar-placeholder" @click="triggerAvatarInput">
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          ref="avatarInput" 
                          @change="handleAvatarUpload" 
                          style="display: none;"
                          aria-label="Tải lên ảnh đại diện" 
                        />
                        <div v-if="!editData.avatar" class="avatar-icon">📷</div>
                        <img v-else :src="editData.avatar" alt="Ảnh đại diện xem trước" class="avatar-preview" />
                      </div>
                    </div>

<div class="form-group">
            <label for="cover-upload">Ảnh bìa</label>
            <div class="cover-placeholder" @click="triggerCoverInput">
              <input 
                id="cover-upload" 
                type="file" 
                accept="image/*" 
                ref="coverInput" 
                @change="handleCoverUpload" 
                style="display: none;"
                aria-label="Tải lên ảnh bìa" 
              />
              <div v-if="!editData.cover" class="cover-icon">📸</div>
              <img v-else :src="editData.cover" alt="Ảnh bìa xem trước" class="cover-preview" />
            </div>
          </div>

          <div class="form-group">
            <label for="bio">Giới thiệu</label>
            <textarea id="bio" v-model="editData.bio" placeholder="Viết một vài dòng giới thiệu về bản thân..." rows="4" class="bio-textarea" aria-label="Giới thiệu bản thân"></textarea>
          </div>

          <div class="form-group">
            <label>Thông tin liên hệ</label>
            <div class="info-group">
              <div>
                <label for="phone">Số điện thoại</label>
                <input id="phone" type="tel" v-model="editData.phone" placeholder="Nhập số điện thoại" aria-label="Số điện thoại" />
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
        bio: '',
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
          avatar: profile.avatarUrl || require('@/assets/avata.jpg'),
          cover: profile.coverUrl || require('@/assets/avata.jpg'),
          bio: profile.bio || '',
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.profile-modal {
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-view {
  overflow-y: auto;
  max-height: 90vh;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
}

/* Profile Header with Cover and Avatar */
.profile-header {
  position: relative;
  margin-bottom: 50px;
}

.cover-section {
  width: 100%;
  height: 120px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder-display {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-section {
  position: absolute;
  left: 50%;
  bottom: -19px;
  transform: translateX(-50%);
  z-index: 2;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  background: #ffffff;
  margin-bottom:-25px;
}

.profile-info {
  text-align: center;
  padding: 0 20px 20px;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Info Section */
.info-section {
  padding: 0 20px 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
 
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
  font-weight: bold;
}

.info-value {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  word-wrap: break-word;
  justify-content: center;
  margin-top:10px;
}


/* Edit Section */
.edit-section {
  padding: 20px;
  background: #f9f9f9;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #0056CC;
}

/* Edit Form Styles */
.edit-form-view {
  padding: 0 20px 20px;
  overflow-y: auto;
  max-height: 90vh;
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  color: #FF3B30;
  font-size: 14px;
  text-align: center;
  margin: 0;
  padding: 8px 12px;
  background: #FFE8E6;
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
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007AFF;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px auto;
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s;
}

.avatar-placeholder:hover {
  border-color: #007AFF;
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
  color: #999;
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
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s;
}

.cover-placeholder:hover {
  border-color: #007AFF;
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
  color: #999;
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
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.bio-textarea:focus {
  outline: none;
  border-color: #007AFF;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-group label {
  font-size: 13px;
  color: #666;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 5px;
}

.save-btn {
  flex: 1;
  background: #007AFF;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #0056CC;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  flex: 1;
  background: #f5f5f5;
  color: #333;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .profile-modal {
    max-width: 95%;
    margin: 0 10px;
  }
  
  .modal-header {
    padding: 12px 16px;
  }
  
  .title {
    font-size: 16px;
  }
  
  .cover-section {
    height: 100px;
  }
  
  .avatar {
    width: 70px;
    height: 70px;
  }
  
  .avatar-section {
    bottom: -35px;
  }
  
  .profile-info {
    padding: 0 16px 16px;
  }
  
  .profile-name {
    font-size: 18px;
  }
  
  .info-section {
    padding: 0 16px 16px;
  }
  
  .edit-section {
    padding: 16px;
  }
  
  .edit-form-view {
    padding: 0 16px 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cover-placeholder {
    height: 100px;
  }
}
</style>