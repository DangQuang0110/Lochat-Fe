<template>
  <div class="form-container">
    <h2>Tạo nội dung</h2>
    <div class="image-section">
      <button @click="selectImage">Chọn ảnh</button>
    </div>
    <div class="input-section">
      <label for="content">Nội dung:</label>
      <input v-model="content" id="content" type="text" placeholder="Nhập nội dung..." />
    </div>
    <div class="suggestion-section">
      <ul>
        <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
          {{ suggestion }}
        </li>
      </ul>
    </div>
    <button class="submit-btn" @click="submitForm">Tạo nội dung</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      suggestions: ['Thêm vào hôm', 'Thêm vào ngày', 'Thêm vào tháng']
    };
  },
  methods: {
    selectImage() {
      // Logic để chọn ảnh (có thể dùng input type="file" hoặc thư viện)
      alert('Chọn ảnh!');
    },
    selectSuggestion(suggestion) {
      this.content = suggestion;
    },
    submitForm() {
      // Logic xử lý khi submit form
      alert(`Nội dung: ${this.content}`);
    }
  }
};
</script>

<style scoped>
.form-container {
  padding: 20px;
}
.image-section button {
  padding: 10px 20px;
  background-color: #1da1f2;
  color: white;
  border: none;
  cursor: pointer;
}
.input-section label {
  display: block;
  margin-bottom: 5px;
}
.input-section input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
.suggestion-section ul {
  list-style: none;
  padding: 0;
}
.suggestion-section li {
  padding: 5px 10px;
  cursor: pointer;
}
.suggestion-section li:hover {
  background-color: #f0f0f0;
}
.submit-btn {
  padding: 10px 20px;
  background-color: #1da1f2;
  color: white;
  border: none;
  cursor: pointer;
}
</style>