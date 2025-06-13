<!-- GroupProfile.vue – 1 file gộp cả hiển thị tên + modal chỉnh sửa -->
<template>
  <!-- Tên nhóm (click để mở modal) -->
  <h3 class="profile-name" @click="showModal = true">
    {{ current.name }}
    <span class="edit-icon">✎</span>
  </h3>

  <!-- Modal đổi ảnh & tên nhóm -->
  <div v-if="showModal" class="overlay" @click.self="close">
    <div class="modal-box">
      <div class="modal-header">
        <h2>Đổi ảnh và tên nhóm</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Đổi ảnh nhóm -->
      <div class="section">
        <label class="section-title">Đổi ảnh nhóm </label>
        <p class="hint">Hãy chọn ảnh để tải lên</p>
        <div class="image-preview">
          <img v-if="previewImage" :src="previewImage" />
          <img v-else src="/icons/image-placeholder.png" />
        </div>
        <input type="file" @change="onImageChange" />
      </div>

      <!-- Đổi tên nhóm -->
      <div class="section">
        <label class="section-title">Đổi tên nhóm </label>
        <p class="hint">Bạn có chắc muốn đổi tên nhóm</p>
        <input
          class="name-input"
          v-model="newGroupName"
          type="text"
          placeholder="Nhập tên mới"
        />
      </div>

      <!-- Nút hành động -->
      <div class="actions">
        <button class="btn cancel" @click="close">Hủy</button>
        <button class="btn confirm" @click="confirm">Xác nhận</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

/* State nhóm hiện tại (demo) */
const current = reactive({
  name: 'Tên nhóm cũ',
})

/* Modal & form state */
const showModal = ref(false)
const newGroupName = ref(current.name)
const previewImage = ref(null)

/* Image → base64 preview */
function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (previewImage.value = reader.result)
  reader.readAsDataURL(file)
}

/* Xác nhận cập nhật */
function confirm() {
  current.name = newGroupName.value.trim() || current.name
  // TODO: gửi API lưu tên/ảnh tại đây
  close()
}

/* Đóng modal */
function close() {
  showModal.value = false
}
</script>

<style scoped>
/* tên nhóm */
.profile-name {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.edit-icon {
  font-size: 14px;
}

/* overlay & modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-box {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* sections */
.section {
  margin-top: 16px;
}
.section-title {
  font-weight: bold;
  color: #d90000;
  display: block;
  margin-bottom: 4px;
}
.hint {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

/* image preview */
.image-preview {
  width: 100%;
  height: 180px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}
.image-preview img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* input */
.name-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* actions */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn.cancel {
  background: #ccc;
}
.btn.confirm {
  background: #007bff;
  color: #fff;
}
</style>
