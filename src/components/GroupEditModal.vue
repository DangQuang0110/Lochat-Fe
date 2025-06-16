<template>
  <div class="modal-overlay" v-if="showModal" @click="closeModal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h3 class="modal-title" id="modal-title">Đổi ảnh và tên nhóm</h3>
        <button class="close-btn" @click="closeModal" aria-label="Đóng modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Đổi ảnh nhóm section -->
        <div class="section">
          <div class="section-header">
            <span class="section-title">Đổi ảnh nhóm</span>
          </div>
          <p class="section-subtitle">Hãy chọn ảnh để tải lên (tối đa 5MB)</p>
          
          <!-- Image upload area -->
          <div class="image-upload-area" @click="triggerFileInput" role="button" aria-label="Chọn ảnh để tải lên">
            <div class="upload-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
                <path d="M12 8l4 4-4 4"/>
              </svg>
            </div>
            <p v-if="selectedFile" class="selected-file">{{ selectedFile.name }}</p>
          </div>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileSelect" 
            style="display: none"
            id="file-input"
          />
        </div>

        <!-- Đổi tên nhóm section -->
        <div class="section">
          <div class="section-header">
            <span class="section-title">Đổi tên nhóm</span>
          </div>
          <p class="section-subtitle">Nhập tên nhóm mới (tối đa 50 ký tự)</p>
          
          <!-- Input field -->
          <input 
            v-model="localGroupName" 
            type="text" 
            class="name-input"
            placeholder="Nhập tên nhóm mới..."
            maxlength="50"
            aria-label="Tên nhóm mới"
          />
          <p v-if="nameError" class="error-message">{{ nameError }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="closeModal">
          Hủy
        </button>
        <button class="btn btn-confirm" @click="confirmChanges" :disabled="!isValid">
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { updateGroup } from '@/service/conversationService'      // <-- path tới service
const props = defineProps({
  /* dữ liệu gốc đưa cho modal để hiển thị ngay khi mở */
  ownerId:            { type: [String, Number], required: true },
  conversationId:     { type: [String, Number], required: true },
  initialGroupName:   { type: String,  default: ''  },
  initialGroupAvatar: { type: String,  default: ''  }
})

const emit = defineEmits(['close', 'confirm'])

const showModal          = ref(true)
const localGroupName     = ref('')          // tên đang chỉnh
const avatarPreview      = ref('')          // URL hiển thị <img>
const avatarFile         = ref(null)        // File người dùng chọn
const nameError          = ref('')

/* khi props thay đổi => đồng bộ lại */
watch(
  () => [props.initialGroupName, props.initialGroupAvatar],
  ([name, avatar]) => {
    localGroupName.value = name
    avatarPreview.value  = avatar
  },
  { immediate: true }
)

const isValid = computed(() =>
  localGroupName.value.trim().length > 0 && localGroupName.value.length <= 50
)
function closeModal() {
  showModal.value = false
  emit('close')
}

/* avatar */
const fileInput = ref(null)
const triggerFileInput = () => fileInput.value?.click()

function handleFileSelect (e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Ảnh phải nhỏ hơn 5 MB')
    e.target.value = ''
    return
  }
  avatarFile.value  = file
  avatarPreview.value = URL.createObjectURL(file)
}

/* xác nhận */
async function confirmChanges () {
  if (!isValid.value) {
    nameError.value = 'Tên nhóm phải từ 1-50 ký tự.'
    return
  }

  try {
    await updateGroup({
      ownerId:        props.ownerId,
      conversationId: props.conversationId,
      name:           localGroupName.value !== props.initialGroupName
                        ? localGroupName.value.trim()
                        : undefined,        
      avatar:         avatarFile.value ?? undefined
    })
    emit('confirm', {
      name:   localGroupName.value.trim(),
      avatar: avatarFile.value ? avatarPreview.value : props.initialGroupAvatar
    })
    closeModal()
  } catch (err) {
    console.error('❌ Lỗi cập nhật nhóm:', err.response?.data || err)
    alert(err.response?.data?.message || 'Cập nhật nhóm thất bại, vui lòng thử lại.')
  }
}
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 24px;
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.section-subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.image-upload-area:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-icon {
  color: #9ca3af;
  margin-bottom: 12px;
}

.selected-file {
  color: #374151;
  font-size: 14px;
  margin-top: 12px;
  word-break: break-all;
}

.name-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 8px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 80px;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  background-color: #3b82f6;
  color: white;
}

.btn-confirm:hover {
  background-color: #2563eb;
}

.btn-confirm:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn:active {
  transform: translateY(1px);
}
</style>