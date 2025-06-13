```vue
<template>
  <div class="mobile-form">
    <div class="form-header">
      <span class="header-title">Tạo nhóm</span>
      <button @click="closeForm" class="close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="form-content">
      <div class="avatar-section">
        <div class="avatar-container">
          <img 
            v-if="groupAvatar" 
            :src="groupAvatar" 
            class="avatar-placeholder" 
            style="width: 60px; height: 60px; border-radius: 12px; object-fit: cover;"
          />
          <div v-else class="avatar-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l-3-3 1.41-1.41L9 14.17l7.59-7.59L18 8l-9 9z"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="M7 15s0-2 2-2 2 2 2 2"/>
              <circle cx="15" cy="9" r="2"/>
              <path d="M13 15s0-2 2-2 2 2 2 2"/>
            </svg>
          </div>
          <input
            ref="avatarInput"
            type="file"
            style="display: none"
            accept="image/*"
            @change="handleAvatarSelect"
          />
          <button @click="triggerAvatarDialog" class="avatar-upload-btn">Chọn ảnh</button>
        </div>
        <div class="avatar-text">
          <div class="avatar-label">Ảnh nhóm</div>
          <div class="avatar-subtitle">Hãy chọn ảnh để tải lên</div>
        </div>
      </div>

      <div class="input-section">
        <label class="input-label">
          Tên nhóm <span class="required">*</span>
        </label>
        <input
          v-model="groupName"
          type="text"
          class="group-input"
        />
      </div>

      <div class="members-section">
        <div class="members-label">Danh sách thành viên</div>
        <div class="members-list">
          <div 
            v-for="friend in friends" 
            :key="friend.id"
            class="member-item"
          >
            <div class="member-info">
              <img 
                :src="friend.avatar" 
                :alt="friend.name"
                class="member-avatar"
              />
              <span class="member-name">{{ friend.name }}</span>
            </div>
            <button 
              @click="toggleMember(friend.id)"
              :class="friend.selected ? 'btn-remove' : 'btn-add'"
            >
              {{ friend.selected ? 'Xóa khỏi nhóm' : 'Thêm vào nhóm' }}
            </button>
          </div>
        </div>
      </div>

      <div class="button-section">
        <button 
          @click="createGroup"
          :disabled="!groupName.trim() || selectedMembers.length === 0"
          class="create-btn"
          :class="{ disabled: !groupName.trim() || selectedMembers.length === 0 }"
        >
          Tạo nhóm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupForm',
  props: {
    friends: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      groupName: '',
      groupAvatar: null,
      members: []
    }
  },
  created() {
    this.members = this.friends.map(friend => ({
      ...friend,
      selected: false
    }));
  },
  computed: {
    selectedMembers() {
      return this.members.filter(member => member.selected)
    }
  },
  methods: {
    triggerAvatarDialog() {
      this.$refs.avatarInput.click();
    },
    handleAvatarSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.groupAvatar = URL.createObjectURL(file);
      }
    },
    toggleMember(memberId) {
      const member = this.members.find(m => m.id === memberId);
      if (member) {
        member.selected = !member.selected;
      }
    },
    createGroup() {
      if (!this.groupName.trim() || this.selectedMembers.length === 0) {
        return;
      }
      const groupData = {
        name: this.groupName,
        avatar: this.groupAvatar,
        members: this.selectedMembers
      };
      this.$emit('group-created', groupData);
      this.resetForm();
    },
    closeForm() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.groupName = '';
      this.groupAvatar = null;
      this.members.forEach(member => {
        member.selected = false;
      });
    }
  }
}
</script>

<style scoped>
.mobile-form {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
}
.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}
.close-btn {
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.close-btn:hover {
  background-color: #f5f5f5;
}
.form-content {
  padding: 20px;
}
.avatar-section {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}
.avatar-container {
  margin-right: 12px;
}
.avatar-placeholder {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  border: 2px dashed #dee2e6;
}
.avatar-text {
  flex: 1;
  padding-top: 8px;
}
.avatar-label {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
}
.avatar-subtitle {
  font-size: 13px;
  color: #888888;
}
.avatar-upload-btn {
  margin-top: 8px;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}
.avatar-upload-btn:hover {
  background: #bbdefb;
}
.input-section {
  margin-bottom: 24px;
}
.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}
.required {
  color: #ff4757;
}
.group-input {
  width: 90%;
  padding: 12px 16px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  transition: border-color 0.2s;
}
.group-input:focus {
  outline: none;
  border-color: #1da1f2;
  box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.1);
}
.members-section {
  margin-bottom: 32px;
}
.members-label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}
.members-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.member-name {
  font-size: 15px;
  color: #333333;
  font-weight: 400;
}
.btn-add, .btn-remove {
  padding: 6px 12px;
  border-radius: 16px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add {
  background: #e3f2fd;
  color: #1976d2;
}
.btn-add:hover {
  background: #bbdefb;
}
.btn-remove {
  background: #ffebee;
  color: #d32f2f;
}
.btn-remove:hover {
  background: #ffcdd2;
}
.button-section {
  margin-top: 24px;
}
.create-btn {
  width: 100%;
  padding: 14px 24px;
  background: #1da1f2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.create-btn:hover:not(.disabled) {
  background: #1991db;
}
.create-btn.disabled {
  background: #ccd6dd;
  cursor: not-allowed;
}
@media (max-width: 480px) {
  .mobile-form {
    border-radius: 0;
    box-shadow: none;
  }
  .form-content {
    padding: 16px;
  }
}
</style>
```