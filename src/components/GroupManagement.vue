<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="group-management" @click.stop>
      <!-- Header -->
      <div class="header">
        <h2 class="title">Quản lý nhóm</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Members Section -->
      <div class="members-section">
        <h3 class="section-title">Thành viên nhóm</h3>
        <div v-if="loading" class="loading">Đang tải...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="members.length === 0" class="empty">Không có thành viên nào</div>
        <div v-else class="members-list">
          <div v-for="member in members" :key="member.id" class="member-item">
            <div class="member-info">
              <div class="avatar">
                <img :src="member.avatar" :alt="member.name" />
              </div>
              <span class="member-name">{{ member.name }}</span>
            </div>
            <button class="remove-btn" @click="removeMember(member.id)">Xóa khỏi nhóm</button>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showConfirmModal" class="modal-overlay inner-modal" @click="cancelRemove">
        <div class="confirm-modal" @click.stop>
          <h3>Xác nhận xóa thành viên</h3>
          <p>Bạn có chắc chắn muốn xóa <strong>{{ memberToRemove?.name }}</strong> khỏi nhóm?</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="cancelRemove">Hủy</button>
            <button class="confirm-btn" :disabled="removing" @click="confirmRemove">
              {{ removing ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// const emit = defineEmits(['close'])

const members = ref([])
const loading = ref(true)
const error = ref(null)
const showConfirmModal = ref(false)
const memberToRemove = ref(null)
const removing = ref(false)

const apiBaseUrl = '/api' // Replace with your actual API base URL

async function fetchMembers() {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get(`${apiBaseUrl}/members`)
    members.value = response.data
  } catch (err) {
    error.value = 'Không thể tải danh sách thành viên. Vui lòng thử lại sau.'
    console.error('Error fetching members:', err)
  } finally {
    loading.value = false
  }
}

// function closeModal() {
//   emit('close')
// }

function removeMember(memberId) {
  memberToRemove.value = members.value.find(member => member.id === memberId)
  showConfirmModal.value = true
}

async function confirmRemove() {
  if (!memberToRemove.value) return

  try {
    removing.value = true
    await axios.delete(`${apiBaseUrl}/members/${memberToRemove.value.id}`)
    members.value = members.value.filter(member => member.id !== memberToRemove.value.id)
    showConfirmModal.value = false
    memberToRemove.value = null
  } catch (err) {
    error.value = 'Không thể xóa thành viên. Vui lòng thử lại sau.'
    console.error('Error removing member:', err)
  } finally {
    removing.value = false
  }
}

function cancelRemove() {
  showConfirmModal.value = false
  memberToRemove.value = null
}

onMounted(() => {
  fetchMembers()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.group-management {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.members-section {
  padding: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin: 0 0 20px 0;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f3f4f6;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.remove-btn:active {
  transform: translateY(0);
}

.inner-modal {
  z-index: 1100;
}

.confirm-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.confirm-modal h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.confirm-modal p {
  margin: 0 0 20px 0;
  color: #6b7280;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.confirm-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background-color: #dc2626;
}

.confirm-btn:disabled {
  background-color: #f87171;
  cursor: not-allowed;
}

.loading,
.error,
.empty {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 20px 0;
}

@media (max-width: 640px) {
  .group-management {
    width: calc(100% - 32px);
    margin: 16px;
  }

  .header {
    padding: 16px;
  }

  .members-section {
    padding: 20px;
  }

  .member-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #f3f6f4;
  }

  .member-item {
    border-bottom: none;
  }

  .remove-btn {
    align-self: flex-end;
    width: 100%;
    justify-content: center;
  }
}
</style>