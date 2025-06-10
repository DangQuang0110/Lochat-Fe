
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
        
        <div class="members-list">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-item"
          >
            <div class="member-info">
              <div class="avatar">
                <img :src="member.avatar" :alt="member.name" />
              </div>
              <span class="member-name">{{ member.name }}</span>
            </div>
            
            <button 
              class="remove-btn"
              @click="removeMember(member.id)"
            >
              Xóa khỏi nhóm
            </button>
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
            <button class="confirm-btn" @click="confirmRemove">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupManagement',
  data() {
    return {
      showConfirmModal: false,
      memberToRemove: null,
      members: [
        {
          id: 1,
          name: 'Quang',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format'
        },
        {
          id: 2,
          name: 'Nhân',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format'
        },
        {
          id: 3,
          name: 'Cầu',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format'
        },
        {
          id: 4,
          name: 'Trường',
          avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face&auto=format'
        },
        {
          id: 5,
          name: 'Vũ',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face&auto=format'
        }
      ]
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    removeMember(memberId) {
      this.memberToRemove = this.members.find(member => member.id === memberId)
      this.showConfirmModal = true
    },
    
    confirmRemove() {
      if (this.memberToRemove) {
        this.members = this.members.filter(member => member.id !== this.memberToRemove.id)
        this.showConfirmModal = false
        this.memberToRemove = null
        
        // Emit event to parent component
        this.$emit('member-removed', this.memberToRemove)
      }
    },
    
    cancelRemove() {
      this.showConfirmModal = false
      this.memberToRemove = null
    }
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

/* Confirmation Modal Styles */
.inner-modal {
  z-index: 1100; /* Higher z-index for nested modal */
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

/* Responsive */
@media (max-width: 640px) {
  .group-management {
    width: calc(100% - 32px);
    margin: 16px;
  }
  
  .header {
    padding: 16px 20px;
  }
  
  .members-section {
    padding: 20px;
  }
  
  .member-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .member-item:last-child {
    border-bottom: none;
  }
  
  .remove-btn {
    align-self: flex-end;
    width: 100%;
    justify-content: center;
  }
}
</style>
