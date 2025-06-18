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
      <!-- Notification component -->
      <transition-group name="fade" tag="div" class="notification-container">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="['notification', notification.type]"
        >
          {{ notification.message }}
        </div>
      </transition-group>

      <!-- Ảnh nhóm -->
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

      <!-- Tên nhóm -->
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

      <!-- Danh sách thành viên -->
      <div class="members-section">
        <div class="members-label">Danh sách thành viên</div>
        <div class="members-list">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-item"
          >
            <div class="member-info">
              <img 
                :src="member.avatar" 
                :alt="member.name"
                class="member-avatar"
              />
              <span class="member-name">{{ member.name }}</span>
            </div>
            <button 
              @click="toggleMember(member.id)"
              :class="member.selected ? 'btn-remove' : 'btn-add'"
            >
              {{ member.selected ? 'Xóa khỏi nhóm' : 'Thêm vào nhóm' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Nút tạo nhóm -->
      <div class="button-section">
        <button 
          @click="createGroup"
          :disabled="!groupName.trim() || selectedMembers.length === 0"
          class="create-btn"
          :class="{ disabled: !groupName.trim() || selectedMembers.length === 0 }"
        >
          Tạo nhóm
          <span v-if="selectedMembers.length"> ({{ selectedMembers.length }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, reactive, computed } from 'vue'
import { createGroup as apiCreateGroup, addMembers } from '@/service/conversationService'

const props = defineProps({ friends: { type: Array, default: () => [] } })
const emit = defineEmits(['group-created', 'close'])

const groupName = ref('')
const avatarFile = ref(null)
const groupAvatar = ref(null)
const creating = ref(false)
const notifications = ref([])

const members = reactive(props.friends.map(f => ({ ...f, selected: false })))
const selectedMembers = computed(() => members.filter(m => m.selected))
const selectedIds = computed(() => selectedMembers.value.map(m => String(m.id)))

const avatarInput = ref(null)
const triggerAvatarDialog = () => avatarInput.value?.click()

// Notification handler
const addNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

function handleAvatarSelect(e) {
  const file = e.target.files[0]
  if (!file) return
  avatarFile.value = file
  groupAvatar.value = URL.createObjectURL(file)
}

const toggleMember = id => {
  const m = members.find(x => x.id === id)
  if (m) m.selected = !m.selected
}

async function createGroup() {
  if (creating.value) return
  if (!groupName.value.trim() || selectedIds.value.length === 0) return
  if (!avatarFile.value) {
    addNotification('Vui lòng chọn ảnh nhóm!', 'error')
    return
  }

  creating.value = true
  try {
    // 1 — Tạo nhóm
    const fd = new FormData()
    fd.append('name', groupName.value.trim())
    fd.append('ownerId', localStorage.getItem('accountId') || '0')
    fd.append('avatar', avatarFile.value)

    const { data: createRes } = await apiCreateGroup(fd)
    const convId = String(createRes.conversationId ?? createRes.data?.conversationId ?? '')
    const convName = createRes.name ?? createRes.data?.name ?? groupName.value
    const convAvatar = createRes.groupAvatar ?? createRes.data?.groupAvatar

    if (!convId) throw new Error('Không lấy được conversationId sau khi tạo nhóm.')

    // 2 — Thêm thành viên
    if (selectedIds.value.length) {
      const addBody = {
        conversationId: convId,
        ownerId: String(localStorage.getItem('accountId')),
        ids: selectedIds.value.map(String)
      }
      console.log('📦 Payload /conversations/members:', addBody)
      await addMembers(addBody)
    }

    // 3 — Emit lên component cha
    emit('group-created', {
      conversationId: convId,
      name: convName,
      groupAvatar: convAvatar || groupAvatar.value,
      members: selectedMembers.value
    })

    addNotification('Tạo nhóm thành công!', 'success')
    resetForm()
    emit('close')
  } catch (e) {
    console.error('❌ Tạo nhóm hoặc thêm thành viên thất bại:', e.response?.data || e.message)
    addNotification('Tạo nhóm không thành công. Vui lòng thử lại!', 'error')
  } finally {
    creating.value = false
  }
}

function closeForm() {
  resetForm()
  emit('close')
}

function resetForm() {
  groupName.value = ''
  avatarFile.value = null
  groupAvatar.value = null
  members.forEach(m => (m.selected = false))
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
  position: relative;
}

.notification-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.avatar-section {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24vempx;
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