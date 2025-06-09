<template>
  <div class="edit-profile-form">
    <h2>Chỉnh sửa thông tin cá nhân</h2>
    <div class="form-group">
      <label>Ảnh đại diện</label>
      <div class="avatar-placeholder">
        <input type="file" accept="image/*" @change="handleAvatarUpload">
        <div v-if="!avatarPreview" class="avatar-icon">📷</div>
        <img v-else :src="avatarPreview" alt="Avatar Preview" class="avatar-preview">
      </div>
    </div>
    <div class="form-group">
      <label>Ảnh bìa</label>
      <div class="cover-placeholder">
        <input type="file" accept="image/*" @change="handleCoverUpload">
        <div v-if="!coverPreview" class="cover-icon">📸</div>
        <img v-else :src="coverPreview" alt="Cover Preview" class="cover-preview">
      </div>
    </div>
    <div class="form-group">
      <label>Thông tin cá nhân</label>
      <div class="info-group">
        <div>
          <label>Giới tính</label>
          <select v-model="gender">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div>
          <label>Ngày sinh</label>
          <input type="date" v-model="birthDate">
        </div>
        <div>
          <label>Địa chỉ</label>
          <input type="text" v-model="address" placeholder="Hải Nhơn, Bình Định">
        </div>
        <div>
          <label>Số điện thoại</label>
          <input type="tel" v-model="phone" placeholder="0369620631">
        </div>
      </div>
    </div>
    <button @click="saveChanges">Lưu thông tin chỉnh sửa</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatarPreview: null,
      coverPreview: null,
      gender: 'Nam',
      birthDate: '2004-09-25',
      address: 'Hải Nhơn, Bình Định',
      phone: '0369620631'
    };
  },
  methods: {
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      this.avatarPreview = URL.createObjectURL(file);
    },
    handleCoverUpload(event) {
      const file = event.target.files[0];
      this.coverPreview = URL.createObjectURL(file);
    },
    saveChanges() {
      console.log({
        avatarPreview: this.avatarPreview,
        coverPreview: this.coverPreview,
        gender: this.gender,
        birthDate: this.birthDate,
        address: this.address,
        phone: this.phone
      });
    }
  }
};
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.edit-profile-form {
  max-width: 600px;
  width: 100%;
  padding: 25px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-left: 700px;
}

.edit-profile-form h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-group {
  margin-bottom: 40px;
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

.avatar-placeholder {
  width: 120px;
  height: 120px;
  background: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-left: 240px;
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

.info-group select,
.info-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.info-group select:focus,
.info-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

button {
  width: 100%;
  background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.2);
}

@media (max-width: 576px) {
  .edit-profile-form {
    padding: 15px;
  }
  
  .avatar-placeholder,
  .cover-placeholder {
    height: 100px;
  }
}
</style>