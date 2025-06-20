```vue
<template>
  <div class="chat-app">
    <!-- Icons Sidebar -->
    <aside class="sidebar icons-sidebar">
      <div class="sidebar-top">
        <img
          :src="user.avatar"
          class="avatar"
          @click.stop="toggleUserSidebar"
        />
        <aside v-if="showUserSidebar" class="user-sidebar" ref="avatarWrapper">
          <div class="user-sidebar-header">{{ user.name }}</div>
          <div class="user-sidebar-divider"></div>
          <ul class="user-sidebar-menu">
            <li @click="goToUserProfile">Hồ sơ người dùng</li>
            <!-- <li @click="goToChangePassword">Đổi mật khẩu</li> -->
            <li @click="goToBlockedList">Quản lí chặn</li>
            <li @click="logout">Đăng xuất</li>
          </ul>
        </aside>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: true }">
            <img src="@/assets/message.png" alt="Nhắn tin" />
          </li>
          <li :class="{ active: true }" @click="goToFriendList">
            <img src="@/assets/contact-books.png" alt="Danh bạ" />
          </li>
        </ul>
      </nav>
      <div class="sidebar-spacer"></div>
    </aside>
    <!-- Sidebar Friends/Groups -->
    <aside class="sidebar">
      <div class="search-bar">
        <div class="input-wrapper">
          <img
            src="@/assets/search_icon.png"
            alt="Tìm kiếm"
            class="search-icon"
          />
          <input type="text" placeholder="Tìm kiếm" style="
    padding-right: 0px;
    padding-left: 28px;
" />
        </div>
        <button class="add-btnm" @click="showAddFriendPopup = true">+</button>

      </div>
      <div class="tab-section">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'friends' }"
          @click="activeTab = 'friends'"
        >
          Bạn bè
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'groups' }"
          @click="activeTab = 'groups'"
        >
          Nhóm
        </button>
        <div
          class="tab-indicator"
          :style="{
            transform:
              activeTab === 'friends' ? 'translateX(0%)' : 'translateX(100%)',
          }"
        />
      </div>
      <div class="friend-section">
        <div
          v-for="item in activeTab === 'friends' ? friends : groups"
          :key="item.id"
          class="friend-item"
          :class="{ active: selectedId === item.id }"
          @click="selectFriend(item.id)"
        >
          <img :src="item.avatar" class="avatar" />
          <div class="friend-info">
            <div class="name">
              {{ item.name }}<span v-if="item.online" class="online-dot"></span>
            </div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
      <button class="add-btnn" @click="showGroupForm = true">+</button>
    </aside>

    <!-- Main Chat Area -->
    <section class="main-chat">
      <header class="chat-header">
        <div class="header-left">
          <img :src="current.avatar" class="avatar" />
          <div class="info">
            <div class="name">{{ current.name }}</div>
            <div class="status">
              {{ current.online ? "Đang hoạt động" : "Offline" }}
              <span v-if="current.online" class="online-dot"></span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <button class="btn icon-btn search-btn" @click="toggleSearch">
            <img
              src="@/assets/search_icon.png"
              alt="Tìm trong cuộc trò chuyện"
            />
          </button>
          <div v-if="showSearch" class="message-search">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm tin nhắn"
              class="search-message-input"
            />
          </div>
          <button class="btn icon-btn menu-btn" @click="toggleProfilePanel">
            <img src="@/assets/menu.png" alt="Menu" />
          </button>
        </div>
      </header>

      <div class="chat-body">
        <div
          v-if="currentMessages && currentMessages.length === 0"
          class="no-message"
        >
          Chưa có tin nhắn mới
        </div>
        <template v-else>
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="msg-wrapper"
            :class="{ 'align-right': msg.fromMe, 'align-left': !msg.fromMe }"
            @contextmenu.prevent="handleRightClickMessage($event, msg)"
          >
            <div v-if="msg.system" class="system-text">
              {{ msg.text }}
            </div>
            <template v-else-if="activeTab === 'groups'">
              <div v-if="!msg.fromMe" class="group-msg">
                <img class="avatar" :src="getSender(msg)?.avatar" />
                <div class="msg-block">
                  <div class="sender-name">{{ getSender(msg)?.name }}</div>
                  <div v-if="msg.file" class="file-attach">
                    <span class="file-icon">
                      <img src="@/assets/file.png" alt="File icon" class="clip-icon" />
                    </span>
                    <div class="file-info">
                      <p class="file-name">{{ msg.file.name }}</p>
                      <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                    </div>
                    <a :href="msg.file.url" target="_blank" class="download-btn" title="Tải xuống">
                      <img src="@/assets/tai.png" alt="Download" class="download-icon" />
                    </a>
                  </div>
                  <template v-if="msg.image || msg.video">
                    <img
                      v-if="msg.image"
                      :src="msg.image"
                      style="max-width: 200px; border-radius: 8px"
                    />
                    <video
                      v-if="msg.video"
                      :src="msg.video"
                      controls
                      playsinline
                      style="max-width: 200px; border-radius: 8px"
                    ></video>
                  </template>
                  <div
                    :class="[
                      'msg',
                      'from-other',
                      isEmojiOnly(msg.text) && !msg.file && !msg.image
                        ? 'emoji-only'
                        : '',
                    ]"
                  >
                    <span :class="{'text-deleted': msg.isDeleted}">
                      {{ msg.isDeleted ? 'Tin nhắn đã được thu hồi' : msg.text }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="msg-block align-right">
                <!-- FILE -->
                <div v-if="msg.file" class="file-attach">
                  <span class="file-icon">
                    <img src="@/assets/file.png" alt="File icon" class="clip-icon" />
                  </span>
                  <div class="file-info">
                    <p class="file-name">{{ msg.file.name }}</p>
                    <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                  </div>
                  <a :href="msg.file.url" target="_blank" class="download-btn" title="Tải xuống">
                    <img src="@/assets/tai.png" alt="Download" class="download-icon" />
                  </a>
                </div>

                <!-- IMAGE / VIDEO -->
                <template v-if="msg.image || msg.video">
                  <img
                    v-if="msg.image"
                    :src="msg.image"
                    style="max-width: 200px; border-radius: 8px"
                  />
                  <video
                    v-if="msg.video"
                    :src="msg.video"
                    controls
                    playsinline
                    style="max-width: 200px; border-radius: 8px"
                  ></video>
                </template>

                <!-- TEXT -->
                <div
                  v-if="msg.text && !msg.isDeleted"
                  :class="[
                    'msg',
                    'from-me',
                    isEmojiOnly(msg.text) ? 'emoji-only' : ''
                  ]"
                >
                  <span>{{ msg.text }}</span>
                </div>

                <!-- DELETED MESSAGE -->
                <div
                  v-else-if="msg.isDeleted"
                  class="msg from-me deleted-message"
                >
                  <span class="text-deleted">Tin nhắn đã được thu hồi</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="!msg.fromMe" class="group-msg">
                <img class="avatar" :src="getSender(msg)?.avatar" />
                <div class="msg-block">
                  <div class="sender-name">{{ getSender(msg)?.name }}</div>
                  <div v-if="msg.file" class="file-attach">
                    <span class="file-icon">
                      <img src="@/assets/file.png" alt="File icon" class="clip-icon" />
                    </span>
                    <div class="file-info">
                      <p class="file-name">{{ msg.file.name }}</p>
                      <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                    </div>
                    <a :href="msg.file.url" target="_blank" class="download-btn" title="Tải xuống">
                      <img src="@/assets/tai.png" alt="Download" class="download-icon" />
                    </a>

                  </div>
                  <template v-if="msg.image || msg.video">
                    <img
                      v-if="msg.image"
                      :src="msg.image"
                      style="max-width: 200px; border-radius: 8px"
                    />
                    <video
                      v-if="msg.video"
                      :src="msg.video"
                      controls
                      playsinline
                      style="max-width: 200px; border-radius: 8px"
                    ></video>
                  </template>
                  <div
                    v-if="!msg.image && !msg.video && !msg.file"
                    :class="[
                      'msg',
                      'from-other',
                      isEmojiOnly(msg.text) ? 'emoji-only' : '',
                    ]"
                  >
                    <span :class="{'text-deleted': msg.isDeleted}">
                      {{ msg.isDeleted ? 'Tin nhắn đã được thu hồi' : msg.text }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="msg-block align-right">
                <div v-if="msg.file" class="file-attach">
                  <span class="file-icon">
                      <img src="@/assets/file.png" alt="File icon" class="clip-icon" />
                    </span>
                  <div class="file-info">
                    <p class="file-name">{{ msg.file.name }}</p>
                    <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                  </div>
                  <a :href="msg.file.url" target="_blank" class="download-btn" title="Tải xuống">
                      <img src="@/assets/tai.png" alt="Download" class="download-icon" />
                    </a>
                </div>
                <template v-if="msg.image || msg.video">
                  <img
                    v-if="msg.image"
                    :src="msg.image"
                    style="max-width: 200px; border-radius: 8px"
                  />
                  <video
                    v-if="msg.video"
                    :src="msg.video"
                    controls
                    playsinline
                    style="max-width: 200px; border-radius: 8px"
                  ></video>
                </template>
                <div
                  v-if="!msg.image && !msg.video && !msg.file"
                  :class="[
                    'msg',
                    'from-me',
                    isEmojiOnly(msg.text) ? 'emoji-only' : '',
                  ]"
                >
                  <span :class="{'text-deleted': msg.isDeleted}">
                    {{ msg.isDeleted ? 'Tin nhắn đã được thu hồi' : msg.text }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </template>
        <div ref="bottomRef" />
      </div>

      <footer class="chat-input">
        <div class="input-container">
          <button class="icon-btn attach-btn" @click="triggerFileDialog">
            <img src="@/assets/clip.png" alt="Đính kèm" />
          </button>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            @change="handleFileSelect"
            accept="*/*"
          />
          <textarea
            ref="textInput"
            v-model="messageInput"
            @input="autoResize"
            @keydown="handleKeydown"
            placeholder="Nhập tin nhắn"
            rows="1"
            class="chat-textarea"
          />
          <button class="icon-btn emoji-btn" @click="toggleEmojiPicker">
            <img src="@/assets/happy-face.png" alt="Emoji" />
          </button>
          <div v-if="showEmojiPicker" class="emoji-picker">
            <div class="picker-header">Cảm xúc</div>
            <div class="emoji-grid">
              <span
                v-for="emoji in emojis"
                :key="emoji"
                class="emoji-item"
                @click="addEmoji(emoji)"
              >
                {{ emoji }}
              </span>
            </div>
          </div>
          <button class="icon-btn send-btn" @click="sendMessage">
            <img src="@/assets/send.png" alt="Gửi" />
          </button>
        </div>
      </footer>
    </section>
    <!-- Right Profile Panel -->
    <aside v-if="showProfilePanel" class="profile-panel">
      <header class="panel-header">
        <button class="close-btn" @click="toggleProfilePanel">✕</button>
      </header>
      <div v-if="activeTab === 'friends'" class="panel-content">
        <div class="profile-info">
          <img :src="current.avatar" class="profile-avatar" />
          <h3 class="profile-name">{{ current.name }}</h3>
        </div>
        <div class="personal-details">
          <h4 class="section-title">Thông tin cá nhân</h4>
          <div class="detail-item">
            <i class="icon-phone"></i>
            <span>{{ current.phone || "Chưa cập nhật" }}</span>
          </div>
          <div class="detail-item">
            <i class="icon-location"></i>
            <button class="block-btn" @click="handleBlockUser">
              Chặn người dùng
            </button>
          </div>
        </div>
        <div class="file-list">
          <h4 class="section-title">Files</h4>
          <ul>
            <li
              v-for="msg in messages.filter((m) => m.file)"
              :key="msg.id"
              class="file-item"
            >
              <i class="icon-file"></i>
              <span class="file-name">{{ msg.file.name }}</span>
              <a :href="msg.file.url" download class="icon-download"></a>
            </li>
          </ul>
        </div>
        <!-- <button class="delete-btn">Xóa đoạn tin nhắn</button> -->
      </div>
      <div v-else class="panel-content">
        <div class="profile-info">
          <img :src="current.avatar" class="profile-avatar" />
          <h3 class="profile-name">
            {{ current.name }}
            <span class="edit-icon" @click="openEditGroupModal">✎</span>
          </h3>
        </div>
        <div class="group-info">
          <h4 class="section-title">Thông tin nhóm</h4>
          <p>{{ groupMembers.length }} thành viên</p>
          <div class="member-avatars">
            <img
              v-for="m in groupMembers"
              :src="m.avatar"
              class="avatar"
              :key="m.id"
            />
          </div>
          <div class="group-actions-horizontal" v-if="isGroupAdmin">
            <p class="admin-label">Bạn là quản trị viên</p>
            <div class="group-buttons-horizontal">
              <button class="group-btn-icon" @click="showAddModal = true">
                <img src="@/assets/sendFriend.png" alt="Thêm" />
                Thêm bạn bè vào nhóm
              </button>
              <button class="group-btn-icon" @click="showGroupModal = true">
                <img src="@/assets/setting.png" alt="Quản lý" />
                Quản lí nhóm
              </button>
            </div>
          </div>
        </div>
        <div class="file-list">
          <h4 class="section-title">Files</h4>
          <ul>
            <li
              v-for="msg in messages.filter((m) => m.file)"
              :key="msg.id"
              class="file-item"
            >
              <i class="icon-file"></i>
              <span class="file-name">{{ msg.file.name }}</span>
              <a :href="msg.file.url" download class="icon-download"></a>
            </li>
          </ul>
        </div>
        <button
          v-if="isGroupAdmin"
          class="delete-btn"
          @click="handleDeleteChat"
        >
        </button>
        <button v-else class="delete-btn-leave-btn" @click="leaveGroup">
          Rời nhóm
        </button>
      </div>
    </aside>
    <!-- Add Members Modal -->
    <div
      v-if="showAddModal"
      class="group-modal-overlay"
      @click.self="showAddModal = false"
    >
      <div class="group-modal">
        <div class="group-modal-header">
          <h3>Thêm vào nhóm</h3>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>
        <div class="group-modal-body">
          <div class="search-wrapper">
            <span
              class="list-title"
              style="width: 73px; padding-top: 8px; height: 50.6"
              >Danh sách bạn bè</span
            >
            <input
              type="text"
              v-model="addSearch"
              placeholder="Tìm theo tên hoặc số"
            />
          </div>
          <ul class="member-list">
            <li
              v-for="friend in friendsToAdd"
              :key="friend.id"
              class="member-item"
            >
              <img :src="friend.avatar" class="avatar" alt="" />
              <span class="name">{{ friend.name }}</span>
              <button class="add-btn" @click="addToGroup(friend.id)">
                Thêm vào nhóm
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Manage Group Modal -->
    <div
      v-if="showGroupModal"
      class="group-modal-overlay"
      @click.self="showGroupModal = false"
    >
      <div class="group-modal">
        <div class="group-modal-header">
          <h3>Quản lí nhóm</h3>
          <button class="close-btn" @click="showGroupModal = false">×</button>
        </div>
        <div class="group-modal-body">
          <!-- <input
            type="text"
            v-model="searchText"
            placeholder="Quản lí nhóm"
            class="group-search"
          /> -->
          <ul class="member-list">
            <li
              v-for="member in filteredMembers"
              :key="member.id"
              class="member-item"
            >
              <img :src="member.avatar" class="avatar" />
              <span class="name">{{ member.name }}</span>
              <button class="remove-btn" @click="confirmRemoveMember(member)">
                Xóa khỏi nhóm
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- GroupForm Modal -->
    <div
      v-if="showGroupForm"
      class="group-modal-overlay"
      @click.self="showGroupForm = false"
    >
      <GroupForm
        :friends="friends"
        @close="closeGroupForm"
        @group-created="handleGroupCreated"
      />
    </div>

    <!-- GroupEditModal -->
    <GroupEditModal
      v-if="showEditGroupModal"
      :owner-id="loggedInAccountId"
      :conversation-id="selectedConversationId"
      :initial-group-name="current.name"
      :initial-group-avatar="current.avatar"
      @close="closeEditGroupModal"
      @confirm="handleGroupEdit"
    />
    <!-- Profile Modal -->
    <ProfileModal
      v-if="showProfileModal"
      :accountId="loggedInAccountId"
      @close="closeProfileModal"
    />
    <!-- Context Menu -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px', position: 'fixed', zIndex: 2000 }"
    >
      <ul>
        <li @click="deleteMessage">Xóa tin nhắn</li>
      </ul>
    </div>
  </div>
  <div
    v-if="showConfirmRemove"
    class="group-modal-overlay"
    @click.self="showConfirmRemove = false"
  >
    <div class="group-modal">
      <div class="group-modal-header">
        <h3>Xác nhận</h3>
        <button class="close-btn" @click="showConfirmRemove = false">×</button>
      </div>
      <div class="group-modal-body">
        <p>
          Bạn có chắc chắn muốn xóa
          <strong>{{ memberToRemove?.name }}</strong> khỏi nhóm không?
        </p>
        <div
          class="group-buttons-horizontal-b"
          style="justify-content: flex-end; margin-top: 20px"
        >
          <button
            @click="showConfirmRemove = false"
            class="group-btn-icon-delete-n"
          >
            Huỷ
          </button>
          <button @click="removeConfirmedMember" class="group-btn-icon-delete">
            Xoá
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showBlockConfirm"
    class="group-modal-overlay"
    @click.self="cancelBlockUser"
  >
    <div class="group-modal">
      <div class="group-modal-body">
        <p>
          Bạn có chắc chắn muốn chặn <strong>{{ current.name }}</strong
          >?
        </p>
        <div class="group-buttons-horizontal-n">
          <button @click="cancelBlockUser" class="btn cancel-btn">Huỷ</button>
          <button @click="confirmBlockUser" class="btn danger-btn">Chặn</button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showBlockListModal"
    class="group-modal-overlay"
    @click.self="showBlockListModal = false"
  >
    <div class="group-modal">
      <div class="group-modal-header">
        <h3>🔴 Quản lí chặn</h3>
        <button class="close-btn" @click="showBlockListModal = false">×</button>
      </div>
      <div class="group-modal-body">
        <p style="margin-bottom: 12px">Danh sách chặn</p>
        <div
          v-for="user in blockedUsers"
          :key="user.id"
          class="block-user-item"
        >
          <img :src="user.avatar" class="avatar" />
          <span class="name">{{ user.name }}</span>
          <button class="unblock-btn" @click="unblockUserHandler(user.id)">
            Bỏ chặn
          </button>
        </div>
      </div>
    </div>
  </div>


  <!-- Thêm bạn bè -->
 <!-- Add Friend Popup -->
<div
  v-if="showAddFriendPopup"
  class="group-modal-overlay"
  @click.self="showAddFriendPopup = false"
>
  <div class="group-modal small-popup">
    <div class="group-modal-header">
      <h3 style="color: #e53935">🔴 Thêm bạn bè</h3>
      <button class="close-btn" @click="showAddFriendPopup = false">×</button>
    </div>
    <div class="group-modal-body" style="gap: 10px">
      <!-- input và nút tìm kiếm -->
      <div class="search-wrapper">
        <input
          type="text" style="padding-right: 144px;"
          v-model="friendSearchInput"
          placeholder="Nhập số điện thoại"
        />
        <button
          class="btn search-btn" style="border-radius: 6px; background-color: #3b6eee;color: #ffffff; height: 22px;"
          :disabled="loadingSearch"
          @click="handleSearchFriend"
        >
          {{ loadingSearch ? 'Đang tìm...' : 'Tìm kiếm' }}
        </button>
      </div>

      <!-- thông báo lỗi -->
      <div v-if="errorSearch" class="error-msg">{{ errorSearch }}</div>

      <!-- hiển thị kết quả -->
      <div
        v-if="foundFriend"
        class="found-friend"
        style="display: flex; align-items: center; gap: 12px; margin-top: 10px"
      >
        <img
          :src="foundFriend.avatar"
          class="avatar"
          style="width: 40px; height: 40px; border-radius: 50%"
        />
        <strong>{{ foundFriend.name }}</strong>
        <div style="margin-left: auto; display: flex; gap: 6px">
         <!-- trong phần popup Add Friend -->
<button class="btn primary" style="height: 22px;" @click="onClickAdd">
  Kết bạn
</button>
          <button class="btn" style="height: 22px;margin-right: 0px;width: 130px;padding-left: 10px;padding-right: 10px;border-radius: 6px;" @click="viewFriendProfile">
            Xem thông tin
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Friend Info Popup -->
<div
  v-if="showFriendProfilePopup"
  class="group-modal-overlay"
  @click.self="closeFriendProfile"
>
  <div class="group-modal small-popup">
    <div class="group-modal-header">
      <h3>Hồ sơ bạn bè</h3>
      <button class="close-btn" @click="closeFriendProfile">×</button>
    </div>
    <div class="group-modal-body friend-profile-body">
      <!-- cover -->
      <div
        class="cover"
        :style="`background-image: url(${friendProfile.coverUrl});`"
      />

      <!-- avatar & tên -->
      <div class="avatar-container">
        <img
          :src="friendProfile.avatarUrl"
          class="avatar-large"
          alt="avatar"
        />
      </div>
      <h3 class="friend-name">{{ friendProfile.fullname }}</h3>

      <!-- thông tin cá nhân -->
      <h4 class="section-title">Thông tin cá nhân</h4>
      <p class="bio">
        {{ friendProfile.bio || 'Chưa cập nhật tiểu sử' }}
      </p>
      <div class="detail-item">
        <i class="icon-phone"></i>
        <span>{{ friendProfile.phoneNumber }}</span>
      </div>

      <!-- hành động -->
      <div class="action-buttons">
        <button class="btn primary" style="margin-right: 90px;" @click="onClickAdd">
          Kết bạn
        </button>
        <button class="btn" @click="closeFriendProfile">
          Hủy
        </button>
      </div>
    </div>
  </div>
</div>


</template>

 

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import ProfileModal from "./MessageNewDetail.vue";
import GroupForm from "./GroupForm.vue";
import GroupEditModal from "./GroupEditModal.vue";
import { getAccountDetail } from "@/service/profileService";
import { getOwnedGroups, getJoinedGroups } from "@/service/conversationService";
import {
  addMembers,
  removeMembers,
  getConversationDetail,
} from "@/service/conversationService";
import { getBlockedList, blockUser, unblockUser } from "@/service/blockService";
import { getAcceptedFriends, findFriendByPhone,sendFriendRequest } from "@/service/friendService";
import { getMessages, delMessage } from "@/service/messageService";
import { useRouter } from "vue-router";
import socket from "@/socket";
import defaultAvatar from '@/assets/avata.jpg' 
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';



const bottomRef = ref(null);
const showConfirmRemove = ref(false);
const foundFriendRaw           = ref(null) 
const memberToRemove = ref(null);
const showAddFriendPopup = ref(false)
const friendSearchInput = ref('')
const foundFriend = ref(null) // object: { name, avatar }
const loadingSearch        = ref(false)
const errorSearch          = ref(null)
const showFriendProfilePopup   = ref(false)
const friendProfile            = ref({
  fullname: '',
  avatarUrl: '',
  coverUrl: '',
  phoneNumber: '',
  bio: ''
})




// tìm bạn bè qua số điện thoại 
async function handleSearchFriend() {
  if (!friendSearchInput.value) return
  loadingSearch.value = true
  errorSearch.value   = null
  foundFriend.value   = null

  try {
    const res = await findFriendByPhone(friendSearchInput.value)
    const list = res.data || []
    if (list.length > 0) {
      const user = list[0]
      foundFriend.value = {
         id:     user.id, 
        name:   user.profile.fullname || user.username,
        avatar: user.profile.avatarUrl || defaultAvatar
      }
       foundFriendRaw.value = user.profile
       foundFriendRaw.value.phoneNumber= user.phoneNumber
       foundFriendRaw.value.username = user.username
    } else {
      errorSearch.value = 'Không tìm thấy người dùng'
    }
  } catch (err) {
    errorSearch.value = err.response?.data?.message || 'Lỗi khi tìm kiếm'
  } finally {
    loadingSearch.value = false
  }
}
// Gửi lời mời kết bạn
async function onClickAdd() {
  if (!foundFriend.value) return

  // Lấy senderId từ localStorage
  const meId = localStorage.getItem('userId') || localStorage.getItem('accountId')
  if (!meId) {
    alert('Chưa có thông tin userId trong localStorage!')
    return
  } 

  try {
    await sendFriendRequest(meId, foundFriend.value.id)
    toast.success('Gửi lời mời kết bạn thành công!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT,
        });
    showAddFriendPopup.value = false
  } catch {
    toast.error('Gửi lời mời kết bạn thất bại!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT,
        });
  }
}

function viewFriendProfile() {
  const u = foundFriendRaw.value
  console.log("check u:", u)
  friendProfile.value = {
    fullname:    u.fullname || u.username,
    avatarUrl:   u.avatarUrl || defaultAvatar,
    coverUrl:    u.coverUrl    || defaultAvatar, 
    phoneNumber: u.phoneNumber,
    bio:         u.bio
  }
  console.log('lỗi nè ----',friendProfile.value )
    // eslint-disable-next-line no-debugger
  debugger
  showFriendProfilePopup.value = true

}

// đóng profile popup
function closeFriendProfile() {
  showFriendProfilePopup.value = false
}

function confirmRemoveMember(member) {
  memberToRemove.value = member;
  showConfirmRemove.value = true;
}

const showBlockListModal = ref(false);

const blockedUsers = ref([
  { id: 1, name: "Quang", avatar: "https://i.imgur.com/your-avatar.png" },
  { id: 2, name: "Quang", avatar: "https://i.imgur.com/your-avatar.png" },
  { id: 3, name: "Quang", avatar: "https://i.imgur.com/your-avatar.png" },
]);

async function goToBlockedList() {
  try {
    const res = await getBlockedList(loggedInAccountId.value);
    const raw = res?.data?.data?.blockedList || [];

    console.log("📦 Danh sách người bị chặn từ BE:", raw);

    blockedUsers.value = raw.map((user) => ({
      id: user.id,
      name: user.profile?.fullname || user.username || "Không rõ",
      avatar: user.profile?.avatarUrl || require("@/assets/avata.jpg"),
    }));

    showBlockListModal.value = true;
    showUserSidebar.value = false;
  } catch (err) {
    console.error("❌ Không thể tải danh sách chặn:", err);
    alert("Lỗi khi tải danh sách chặn");
  }
}

async function unblockUserHandler(id) {
  try {
    await unblockUser(loggedInAccountId.value, id);
    blockedUsers.value = blockedUsers.value.filter((u) => u.id !== id);
    alert("Đã bỏ chặn thành công!");
  } catch (err) {
    console.error("❌ Không thể bỏ chặn:", err);
    alert(err?.response?.data?.message || "Lỗi khi bỏ chặn.");
  }
}

const activeTab = ref("friends");

function handleKeydown(e) {
  if (e.key === "Shift" && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    messageInput.value += "\n";
    autoResize();
    return;
  }
  if (
    e.key === "Enter" &&
    !e.shiftKey &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey
  ) {
    e.preventDefault();
    sendMessage();
    return;
  }
}

function autoResize() {
  nextTick(() => {
    const el = textInput.value;
    if (el) {
      const lineHeight = 22;
      const minRows = 1;
      const maxRows = 4;
      el.style.height = "auto";
      const rows = Math.floor(el.scrollHeight / lineHeight);
      const finalRows = Math.min(Math.max(rows, minRows), maxRows);
      el.style.height = finalRows * lineHeight + "px";
    }
  });
}

watch(activeTab, (newTab) => {
  if (newTab === "friends" && friends.value.length) {
    const firstFriend = friends.value[0];
    selectedId.value = firstFriend.id;
    selectedConversationId.value = Number(firstFriend.conversationId);
    socket.emit("join room", `conversation_${selectedConversationId.value}`);
    loadMessages();
  }
  if (newTab === "groups" && groups.value.length) {
    const firstGroup = groups.value[0];
    selectedId.value = firstGroup.id;
    selectedConversationId.value = Number(firstGroup.conversationId);
    socket.emit("join room", `conversation_${selectedConversationId.value}`);
    loadMessages();
  }
});

async function removeConfirmedMember() {
  const member = memberToRemove.value;
  if (!member) return;
  try {
    await removeMembers({
      conversationId: selectedConversationId.value,
      ownerId: loggedInAccountId.value,
      ids: [member.id],
    });
    const grp = groups.value.find((g) => g.id === selectedId.value);
    if (grp) {
      grp.members = grp.members.filter(
        (m) => Number(m.accountId) !== Number(member.id)
      );
    }
    members.value = members.value.filter(
      (m) => Number(m.id) !== Number(member.id)
    );
    showConfirmRemove.value = false;
    memberToRemove.value = null;
  } catch (err) {
    console.error("❌ Xoá thất bại:", err);
    showConfirmRemove.value = false;
    memberToRemove.value = null;
  }
}

function scrollToBottom() {
  nextTick(() => {
    bottomRef.value?.scrollIntoView({ behavior: "smooth" });
  });
}

const router = useRouter();

function goToFriendList() {
  router.push("/friendlist");
}

function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value;
}

function addEmoji(emoji) {
  messageInput.value += emoji;
}

function isEmojiOnly(text = "") {
  return (
    text.trim() !== "" &&
    /^[\p{Emoji_Presentation}\u200d\s]+$/u.test(text.trim())
  );
}

function handleClickOutsideEmoji(e) {
  if (
    showEmojiPicker.value &&
    !e.target.closest(".emoji-picker") &&
    !e.target.closest(".emoji-btn")
  ) {
    showEmojiPicker.value = false;
  }
}

const showBlockConfirm = ref(false);

function handleBlockUser() {
  showBlockConfirm.value = true;
}

async function confirmBlockUser() {
  console.log("⚠️ blockerId:", loggedInAccountId.value);
  console.log("⚠️ blockedId:", current.value.id);
  try {
    await blockUser(loggedInAccountId.value, current.value.id);
    blockedUsers.value.push({
      id: current.value.id,
      name: current.value.name,
      avatar: current.value.avatar || require("@/assets/avata.jpg"),
    });
    showBlockConfirm.value = false;
    alert(`Đã chặn ${current.value.name}`);
  } catch (err) {
    console.error("❌ Lỗi khi chặn người dùng:", err);
    alert("Không thể chặn người dùng này.");
  }
}

function cancelBlockUser() {
  showBlockConfirm.value = false;
}

onMounted(() => document.addEventListener("click", handleClickOutsideEmoji));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutsideEmoji)
);
// onMounted(() => {
//   const rawId = localStorage.getItem("accountId");
//   const accountId = rawId ? Number(rawId) : null;
//   if (accountId) {
//     socket.emit("identify", accountId); // ✅ Gửi accountId khi kết nối
//   }
// });
// onMounted(() => socket.on('chat message', handleIncomingMessage))

onBeforeUnmount(() => socket.off("chat message", handleIncomingMessage));

function handleIncomingMessage(msg) {
  if (`${msg.conversationId}` !== `${selectedConversationId.value}`) return;
  const url = msg.content || "";
  const isImage =
    msg.type === "image" || /\.(jpe?g|png|gif|webp|avif)$/i.test(url);
  const isVideo =
    msg.type === "video" || /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);
  const isFile = msg.type === "file";
  const fromMe = String(msg.senderId) === String(loggedInAccountId.value);
  if (fromMe && pendingUploads.value.has(url)) {
    messages.value = messages.value.filter(
      (t) =>
        !(
          t.clientTempId &&
          (t.image === url || t.video === url || t.file?.url === url)
        )
    );
    pendingUploads.value.delete(url);
  }
  const fallbackName = decodeURIComponent(url.split("/").pop() || "Tập tin");
  messages.value.push({
    id: msg.id || Date.now(),
    chatId: Number(msg.conversationId),
    senderId: Number(msg.senderId),
    fromMe,
    text: msg.type === "text" ? msg.content : "",
    image: isImage ? url : null,
    video: isVideo ? url : null,
    file: isFile
      ? {
          name: msg.originFilename?.trim() || fallbackName,
          size: msg.size || "Không rõ",
          url,
        }
      : null,
    type: isImage ? "image" : isVideo ? "video" : isFile ? "file" : "text",
    createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
  });
  scrollToBottom();
}

function goToUserProfile() {
  console.log("✅ Đã click Hồ sơ người dùng");
  showProfileModal.value = true;
  showUserSidebar.value = false;
}

const loggedInAccountId = ref(Number(localStorage.getItem("accountId")));
const user = ref([]);
const groupMembers = ref([]);
const friends = ref([]);
const groups = ref([]);
const messages = ref([]);
const members = ref([]);

/* ---------- UI STATE ---------- */
const selectedId = ref(null);
const showProfileModal = ref(false);
const showProfilePanel = ref(false);
const showUserSidebar = ref(false);
const showGroupForm = ref(false);
const showEditGroupModal = ref(false);
const showGroupModal = ref(false);
const showAddModal = ref(false);
const showEmojiPicker = ref(false);
const showSearch = ref(false);
const pendingUploads = ref(new Set());

/* ---------- INPUT / SEARCH ---------- */
const messageInput = ref("");
const searchText = ref("");
const addSearch = ref("");
const searchQuery = ref("");

/* ---------- REFS DOM ---------- */
const avatarWrapper = ref(null);
const fileInput = ref(null);
const textInput = ref(null);
const isGroupLoading = ref(false);

const emojis = ref([
  "😊",
  "😂",
  "😍",
  "🤣",
  "😎",
  "😢",
  "😡",
  "👍",
  "👎",
  "🎉",
  "😴",
  "🤔",
  "😘",
  "🥰",
  "🤩",
  "😇",
  "🤤",
  "😱",
  "😷",
  "🥳",
  "🤯",
  "🧐",
  "🤮",
  "🤗",
  "🤫",
  "🤭",
  "👏",
  "🙌",
  "🦄",
  "💩",
  "👻",
  "💀",
  "👽",
  "🤖",
  "🎃",
  "😺",
  "😼",
  "🙈",
  "🙉",
  "🙊",
  "🐶",
  "🐱",
  "🐻",
  "🦊",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
]);

const current = computed(() => {
  const list = activeTab.value === "friends" ? friends.value : groups.value;
  return list.find((i) => i.id === selectedId.value) || {};
});

const filteredMembers = computed(() =>
  members.value
    .filter((m) => m.role !== "admin")
    .filter((m) =>
      m.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
);

const currentMessages = computed(() =>
  messages.value.filter(
    (m) => m.chatId === Number(selectedConversationId.value)
  )
);

async function loadGroupMembers(conversationId) {
  try {
    const res = await getConversationDetail(conversationId);
    const raw = res?.data?.data?.members || [];
    groupMembers.value = raw.map((m) => ({
      id: m.accountId,
      name: m.username,
      avatar: m.avatarUrl || require("@/assets/avata.jpg"),
      role: m.role,
    }));
  } catch (err) {
    console.error("❌ Lỗi khi tải thành viên nhóm:", err);
    groupMembers.value = [];
  }
}

const selectedConversationId = ref(null);

const filteredMessages = computed(() => {
  if (!searchQuery.value) return currentMessages.value;
  const q = searchQuery.value.toLowerCase();
  return currentMessages.value.filter((m) => m.text?.toLowerCase().includes(q));
});

function getSender(msg) {
  const friend = friends.value.find((f) => f.id === msg.senderId);
  return friend
    ? {
        name: friend.profile?.fullname || friend.name || "Không rõ",
        avatar: friend.profile?.avatarUrl || friend.avatar,
      }
    : null;
}

const prettySize = (s) => {
  if (!s || s === "Không rõ") return "(Không rõ)";
  return `(${s})`;
};

function toggleSearch() {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) searchQuery.value = "";
}

function toggleProfilePanel() {
  showProfilePanel.value = !showProfilePanel.value;
}

function toggleUserSidebar() {
  showUserSidebar.value = !showUserSidebar.value;
}

function closeProfileModal() {
  showProfileModal.value = false;
}

function closeGroupForm() {
  showGroupForm.value = false;
}

function openEditGroupModal() {
  showEditGroupModal.value = true;
}

function closeEditGroupModal() {
  showEditGroupModal.value = false;
}

async function selectFriend(id) {
  const source = activeTab.value === "friends" ? friends.value : groups.value;
  const selected = source.find((item) => item.id === id);
  if (!selected) {
    console.warn("⚠️ Không tìm thấy item với ID:", id);
    return;
  }
  selectedId.value = id;
  if (!selected.conversationId) {
    selected.conversationId = Date.now();
  }
  selectedConversationId.value = Number(selected.conversationId);
  if (activeTab.value === "groups") {
    await loadGroupMembers(selected.conversationId);
    members.value = [...groupMembers.value];
  }
  socket.emit("join room", `conversation_${selectedConversationId.value}`);
  console.log("🟢 Join room:", `conversation_${selectedConversationId.value}`);
  loadMessages();
}

async function addToGroup(friendId) {
  const groupId = selectedConversationId.value;
  const ownerId = loggedInAccountId.value;
  const payload = {
    conversationId: String(groupId),
    ownerId: String(ownerId),
    ids: [String(friendId)],
  };
  try {
    console.log("📦 Gửi request thêm thành viên:", payload);
    await addMembers(payload);
    const grp = groups.value.find((g) => g.id === selectedId.value);
    const friend = friends.value.find((f) => f.id === friendId);
    if (grp && friend) {
      grp.members.push({
        accountId: friend.id,
        avatarUrl: friend.avatar,
        username: friend.name,
        role: "member",
      });
    }
    addSearch.value = "";
  } catch (err) {
    console.error("❌ Thêm thành viên thất bại:", err);
    console.log("📨 Lỗi từ server:", err?.response?.data);
    alert(
      `Không thể thêm thành viên: ${
        err?.response?.data?.message || "Lỗi máy chủ"
      }`
    );
  }
}

const friendsToAdd = computed(() => {
  if (activeTab.value !== "groups") return [];
  const grp = groups.value.find((g) => g.id === selectedId.value);
  const memberIds = new Set(
    (grp?.members || []).map((m) => Number(m.accountId))
  );
  return friends.value.filter(
    (f) =>
      !memberIds.has(f.id) &&
      (f.name.toLowerCase().includes(addSearch.value.toLowerCase()) ||
        String(f.id).includes(addSearch.value))
  );
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !selectedConversationId.value) return;
  const payload = {
    conversationId: Number(selectedConversationId.value),
    senderId: Number(loggedInAccountId.value),
    content: text,
    originFilename: "",
    size: "",
    type: "text",
  };
  socket.emit("chat message", payload);
  messageInput.value = "";
  const el = textInput.value;
  if (el) el.style.height = "auto";
  nextTick(() => autoResize());
}

function triggerFileDialog() {
  fileInput.value?.click();
}

import axios from "axios";

async function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat_up");
  try {
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/drniqvbgy/auto/upload",
      formData
    );
    const url = data.secure_url;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const tempId = Date.now();
    pendingUploads.value.add(url);
    messages.value.push({
      id: tempId,
      chatId: Number(selectedConversationId.value),
      fromMe: true,
      image: isImage ? url : null,
      video: isVideo ? url : null,
      file:
        !isImage && !isVideo
          ? { name: file.name, size: formatSize(file.size), url }
          : null,
      text: "",
      type: isImage ? "image" : isVideo ? "video" : "file",
      createdAt: new Date(),
      clientTempId: tempId,
    });
    scrollToBottom();
    socket.emit("chat message", {
      conversationId: Number(selectedConversationId.value),
      senderId: Number(loggedInAccountId.value),
      type: isImage ? "image" : isVideo ? "video" : "file",
      content: url,
      originFilename: file.name,
      size: formatSize(file.size),
    });
  } catch (err) {
    console.error("❌ Upload lỗi:", err);
    alert("Không thể upload file, thử lại.");
  } finally {
    e.target.value = "";
  }
}

function formatSize(bytes) {
  return bytes > 1024 * 1024
    ? (bytes / 1024 / 1024).toFixed(2) + " MB"
    : (bytes / 1024).toFixed(2) + " KB";
}

async function loadMessages() {
  console.log(
    "[loadMessages] tab =",
    activeTab.value,
    "conversationId =",
    selectedConversationId.value
  );
  try {
    const res = await getMessages({
      conversationId: selectedConversationId.value,
    });
    const rawMessages = Array.isArray(res?.data?.messages)
      ? res.data.messages
      : [];
    if (!rawMessages.length) {
      console.warn("[loadMessages] Không có message nào");
      messages.value = [];
      return;
    }
    const isFileUrl = (url = "") =>
      /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|txt)$/i.test(url);
    messages.value = rawMessages.map((m) => {
      const isDeleted = m.isDeleted === true;
      const url = m.content || "";
      
      const isImage = !isDeleted && (
        m.type === "image" || /\.(jpe?g|png|gif|webp)$/i.test(url)
      );
      const isVideo = !isDeleted && (
        m.type === "video" || /\.(mp4|webm|ogg|mov|m4v)$/i.test(url)
      );
      const isFile = !isDeleted && (
        m.type === "file" || (m.type === "text" && isFileUrl(url))
      );

      return {
        id: m.id,
        chatId: Number(selectedConversationId.value),
        senderId: Number(m.senderId),
        fromMe: String(m.senderId) === String(loggedInAccountId.value),
        text: isDeleted ? "Tin nhắn đã thu hồi" : (
          !isImage && !isVideo && !isFile && m.type === "text" ? m.content : ""
        ),
        image: isImage ? url : null,
        video: isVideo ? url : null,
        file: isFile && url ? {
          name: m.originFilename?.trim() || decodeURIComponent(url.split("/").pop()) || "Không rõ tên",
          size: m.size || "Không rõ",
          url,
        } : null,
        type: isDeleted ? "deleted" : (
          isImage ? "image" : isVideo ? "video" : isFile ? "file" : "text"
        ),
        isDeleted,
        createdAt: m.createdAt,
      };
    });

    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error("❌ [loadMessages] Lỗi khi tải tin nhắn:", err);
    messages.value = [];
  }
}

function handleClickOutside(e) {
  if (
    avatarWrapper.value &&
    !avatarWrapper.value.contains(e.target) &&
    !e.target.closest(".user-sidebar")
  ) {
    showUserSidebar.value = false;
  }
}

onMounted(async () => {
  document.addEventListener("click", (e) => {
    if (
      avatarWrapper.value &&
      !avatarWrapper.value.contains(e.target) &&
      !e.target.closest(".user-sidebar")
    ) {
      showUserSidebar.value = false;
    }
  });
  try {
    const me = await getAccountDetail(loggedInAccountId.value);
    const profile = me?.profile || {};
    user.value = {
      avatar: profile.avatarUrl || require("@/assets/avata.jpg"),
      name: profile.fullname || profile.username || "Người dùng",
    };
// Gửi identify ngay sau khi socket connect
socket.emit("identify", Number(loggedInAccountId.value));

// ✅ Ép server gửi lại danh sách online sau 500ms nếu chưa có
setTimeout(() => {
  socket.emit("get online users");
}, 500);

// 🔽 Tiếp tục lấy danh sách bạn bè và gán profile
const rawFriends = await getAcceptedFriends(loggedInAccountId.value);
const others = await Promise.all(
  rawFriends.map(async (f) => {
    try {
      const d = await getAccountDetail(f.id);
      return { ...f, profile: d.profile };
    } catch {
      return { ...f, profile: null };
    }
  })
);

// ✅ Gán lại friends list
friends.value = others
  .filter((f) => String(f.id) !== String(loggedInAccountId.value))
  .map((f) => ({
    id: f.id,
    name: f.profile?.fullname || f.username,
    avatar: f.profile?.avatarUrl || require("@/assets/avata.jpg"),
    desc: "",
    conversationId: f.conversationId,
    online: false, // mặc định là offline, sẽ cập nhật sau từ socket
  }));

    /* GROUPS ------------------------------------ */
    const [owned, joined] = await Promise.all([
      getOwnedGroups(loggedInAccountId.value),
      getJoinedGroups(loggedInAccountId.value),
    ]);
    const merged = [
      ...(Array.isArray(owned?.data?.data) ? owned.data.data : []),
      ...(Array.isArray(joined?.data?.data) ? joined.data.data : []),
    ];
    groups.value = merged.reduce((acc, g) => {
      if (!acc.some((x) => x.conversationId === g.conversationId))
        acc.push({
          id: Number(g.conversationId),
          name: g.name,
          avatar: g.groupAvatar || require("@/assets/avata.jpg"),
          desc: `${g.members?.length || 0} thành viên`,
          conversationId: g.conversationId,
          online: false,
          members: g.members,
        });
      return acc;
    }, []);
    isGroupLoading.value = false;
    if (activeTab.value === "friends" && friends.value.length) {
      selectFriend(friends.value[0].id);
    } else if (activeTab.value === "groups" && groups.value.length) {
      selectFriend(groups.value[0].id);
    }
    if (friends.value.length) {
      selectedId.value = friends.value[0].id;
      selectedConversationId.value = Number(friends.value[0].conversationId);
      socket.emit("join room", `conversation_${selectedConversationId.value}`);
      await loadMessages();
    }
  } catch (err) {
    console.error("❌ Không thể tải dữ liệu:", err);
  }
  socket.on("chat message", handleIncomingMessage);
  socket.on("online users", (onlineIds) => {
    const onlineSet = new Set(onlineIds.map(Number));

    friends.value.forEach((f) => {
      f.online = onlineSet.has(f.id); // đúng ID người dùng
    });

    groups.value.forEach((g) => {
      g.online = g.members?.some((m) => onlineSet.has(m.accountId));
    });
  });
// socket.on("connect", () => {
//   console.log("✅ Socket connected:", socket.id);

//   // Gửi identify NGAY KHI connect
//   const accountId = localStorage.getItem("accountId");
//   if (accountId) {
//     socket.emit("identify", parseInt(accountId));
//   }
// });


});

const isGroupAdmin = computed(() => {
  if (activeTab.value !== "groups") return false;
  const grp = groups.value.find((g) => g.id === selectedId.value);
  if (!grp || !Array.isArray(grp.members)) return false;
  return grp.members.some(
    (m) =>
      String(m.accountId) === String(loggedInAccountId.value) &&
      m.role === "admin"
  );
});

async function leaveGroup() {
  const grp = groups.value.find((g) => g.id === selectedId.value);
  if (!grp || !Array.isArray(grp.members)) return;
  const admin = grp.members.find((m) => m.role === "admin");
  if (!admin) {
    alert("Không tìm thấy quản trị viên nhóm để xác thực yêu cầu.");
    return;
  }
  try {
    await removeMembers({
      conversationId: selectedConversationId.value,
      ownerId: admin.accountId,
      ids: [loggedInAccountId.value],
    });
    groups.value = groups.value.filter((g) => g.id !== selectedId.value);
    selectedId.value = null;
    selectedConversationId.value = null;
    messages.value = [];
    alert("Bạn đã rời khỏi nhóm thành công.");
  } catch (err) {
    console.error("❌ Không thể rời nhóm:", err);
    console.log("Server response:", err?.response?.data);
    alert(
      `Không thể rời nhóm: ${err?.response?.data?.message || "Lỗi máy chủ"}`
    );
  }
}

onBeforeUnmount(() => {
  socket.off("chat message", handleIncomingMessage);
});
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);

const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedMessage = ref(null);

function handleRightClickMessage(event, msg) {
  event.preventDefault();
  selectedMessage.value = msg;
  showContextMenu.value = true;

  // Đợi context menu render xong để lấy kích thước
  nextTick(() => {
    const menu = document.querySelector('.context-menu');
    let x = event.clientX;
    let y = event.clientY;
    if (menu) {
      const { innerWidth, innerHeight } = window;
      const rect = menu.getBoundingClientRect();
      // Nếu tràn phải
      if (x + rect.width > innerWidth) {
        x = innerWidth - rect.width - 8;
      }
      // Nếu tràn dưới
      if (y + rect.height > innerHeight) {
        y = innerHeight - rect.height - 8;
      }
    }
    contextMenuPosition.value = { x, y };
  });
}

async function deleteMessage() {
  if (!selectedMessage.value) return;
  
  const body = {
    ownerId: String(loggedInAccountId.value),
    conversationId: String(selectedConversationId.value),
    messageId: selectedMessage.value.id
  };

  try {
    await delMessage(body);
    // Sau khi xóa thành công, load lại tin nhắn để cập nhật trạng thái
    await loadMessages();
    showContextMenu.value = false;
  } catch (err) {
    
    toast.error('Không thể xóa tin nhắn!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT,
        });
  }
}

function handleClickOutsideContextMenu(event) {
  if (!event.target.closest('.context-menu')) {
    showContextMenu.value = false;
  }
}
function logout() {
  localStorage.removeItem("accountId");   
  socket.disconnect();                        
  router.push("/");                       
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideContextMenu);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideContextMenu);
});
</script>
<style scoped >

@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: content-box;
}
.chat-app {
  display: flex;
  height: 100%;
  margin: 0;
  font-family: "Roboto", sans-serif;
}
.download-icon {
  width: 14px;     /* Hoặc 12px nếu muốn nhỏ hơn nữa */
  height: 14px;
  object-fit: contain;
  display: inline-block;
}
.icons-sidebar {
  width: 60px;
  padding: 1rem 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
  border: none;
}
.icons-sidebar .sidebar-nav {
  margin-top: 1.5rem;
}
.icons-sidebar .sidebar-nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.icons-sidebar .sidebar-nav li img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.icons-sidebar .sidebar-spacer {
  flex: 1;
}
.icons-sidebar .sidebar-bottom .hamburger {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.clip-icon {
  width: 14px;           /* Kích thước nhỏ gọn, có thể điều chỉnh */
  height: 14px;
  object-fit: contain;   /* Đảm bảo không méo hình */
  display: inline-block;
}
.add-btnn {
  width: 46px;
  height: 46px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
  margin-right: 10px;
  margin-bottom: 10px;
}
.sidebar-top {
  display: flex;
  margin-top: 20px;
}
.sidebar {
  background: #f9f9f9;
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #000;
}
.sidebar:not(.icons-sidebar) {
  padding: 0;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 60px;
  margin-left: 10px;
}
.search-bar .input-wrapper {
  position: relative;
  flex: 1;
}
.search-bar .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
}
.search-bar input {
  width: 110%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #000;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}
.search-bar input:focus {
  border-color: #007bff;
  background-color: #f0f8ff;
}
.search-bar .add-btn {
  width: 8px;
  height: 16px;
  border: none;
  border-radius: 50%;
  /* background: #3b6eee; */
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  margin-left: -16px;
  margin-right: 3px;
  padding-right: 10px;
  margin-right: 10px;
}
.search-bar .add-btn:hover {
  background: #335bcc;
}

.tab-section {
  display: flex;
  position: relative;
  margin: 1rem 0;
  border-bottom: 1px solid #ddd;
}
.tab-btn {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: color 0.2s;
}
.tab-btn.active {
  color: #000;
  font-weight: 600;
}
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  background: #ffa726;
  border-radius: 2px;
  transition: transform 0.3s ease;
}
.friend-section {
  flex: 1;
}
.friend-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.friend-item:hover {
  background: #d5dbdb;
}
.friend-item.active {
  background: #d3f0f3;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.friend-info {
  margin-left: 10px;
  flex: 1;
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
}
.online-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  margin-left: 6px;
  margin-top: 5px;
}
.desc {
  font-size: 12px;
  color: #000;
  display: flex;
  font-weight: 1000;
}
.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #000;
  background: #fff;
}
.chat-header .header-left {
  display: flex;
  align-items: center;
}
.chat-header .header-left .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}
.chat-header .header-left .info .name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.chat-header .header-left .info .status {
  font-size: 12px;
  color: #777;
  margin-top: 2px;
}

.chat-header .header-right {
  display: flex;
  align-items: center;
}
.chat-header .icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-header .menu-btn img,
.chat-header .search-btn img {
  width: 20px;
  height: 20px;
}
.chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f5f5f5;
}
.msg-wrapper {
  display: flex;
  align-items: flex-end;
}
.align-right {
  justify-content: flex-end;
}
.align-left {
  justify-content: flex-start;
}
.msg-block.align-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Đẩy nội dung bên trong về phải */
  max-width: 50%; /* Giới hạn chiều rộng khối tin nhắn */
  margin-left: auto; /* Căn cả block sang phải */
}

.msg {
  display: inline-flex;
  flex-direction: column;
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  background-color: #ececec;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

/* .msg-block {
  max-width: 80%;
} */

.msg-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.from-other {
  background: #ececec;
  color: #333;
  border: 1px solid #ddd;
}
.from-me {
  background: #3b6eee;
  color: #fff;
}
.file-attach {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f1f3ff 100%);
  border: 1px solid #e1e8ff;
  border-radius: 12px;
  margin: 8px 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.file-icon {
  font-size: 18px;
}
.file-info {
  flex: 1;
}
.file-name {
  margin: 0;
  font-size: 14px;
  color: #333;
}
.file-size {
  margin: 0;
  font-size: 12px;
  color: #777;
}
.download-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
}
.chat-input {
  padding: 0.75rem 1rem;
  background: #fff;
}
.chat-input .input-container {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 24px;
  padding: 4px 8px;
}
.input-container input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
  background: transparent;
  color: #333;
}
.input-container .icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
}
.input-container .attach-btn img,
.input-container .emoji-btn img,
.input-container .send-btn img {
  width: 20px;
  height: 20px;
}
.input-container .emoji-btn {
  font-size: 18px;
  line-height: 1;
}
.input-container .icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}
.emoji-picker {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 300px;
  max-height: 240px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  overflow-y: auto;
  z-index: 100;
}
.picker-header {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}
.emoji-item {
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  text-align: center;
  border-radius: 4px;
  transition: background 0.2s;
}
.emoji-item:hover {
  background: #f0f0f0;
}
.profile-panel {
  width: 320px;
  background: #fff;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-left: none;
}
.panel-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.panel-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.profile-info {
  text-align: center;
  margin-bottom: 16px;
}
.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}
.profile-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.personal-details {
  margin-bottom: 16px;
}
.personal-details .detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}
.detail-item i {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-size: contain;
}
.icon-phone {
  background-image: url("@/assets/phone.png");
}
.icon-location {
  background-image: url("@/assets/trangchu.png");
}
.file-list {
  flex: 1;
}
.section-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.file-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.icon-file {
  width: 20px;
  height: 20px;
  background-image: url("@/assets/file-pdf.png");
  background-size: contain;
  margin-right: 8px;
}
.file-name {
  flex: 1;
  font-size: 13px;
  color: #555;
}
.icon-download {
  width: 20px;
  height: 20px;
  background-image: url("@/assets/download.png");
  background-size: contain;
}
.delete-btn-leave-btn {
  margin-top: auto;
  background: #ff3b30;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.search-message-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}
.user-sidebar {
  position: absolute;
  top: 20px;
  left: 70px;
  width: 200px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  z-index: 1000;
  padding-top: 10px;
}

.user-sidebar-header {
  font-size: 18px;
  font-weight: bold;
  color: red;
  text-align: center;
  margin-bottom: 6px;
}
.user-sidebar-divider {
  width: 80%;
  height: 1px;
  background-color: #ccc;
  margin: 0 auto 12px auto;
}
.user-sidebar-menu {
  list-style: none;
  padding: 0;
  width: 100%;
}

.user-sidebar-menu li {
  text-align: center;
  padding: 10px 0;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-sidebar-menu li:hover {
  background-color: #f5f5f5;
}
.no-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}
.system-text {
  text-align: center;
  font-size: 12px;
  color: #888;
  padding: 4px 0;
}
.group-msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 50%;
}
.group-msg .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.sender-name {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}
.group-info .member-avatars {
  display: flex;
  gap: 4px;
  margin: 8px 0;
}
.group-info .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.group-info .admin-label {
  font-size: 13px;
  margin: 4px 0;
  color: #333;
}
.edit-icon {
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
}
.group-buttons-horizontal-n {
  display: flex;
  flex-direction: column;
  gap: 10px; 
  margin-top: 6px;
}
.group-buttons-horizontal-b {
  display: flex;
  flex-direction: column;
  gap: 10px; 
  margin-top: 6px;
}
.group-btn-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  background-color: white;
  border: 1px solid white;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.group-btn-icon img {
  width: 16px;
  height: 16px;
}
.group-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.group-modal {
  background: #fff;
  width: 500px;
  max-width: 95%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.group-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.group-modal-header h3 {
  margin: 0;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
/* .group-modal-body {
  padding: 1rem;
} */
.group-search {
  width: 95%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.member-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.member-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
.member-item .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}
.member-item .name {
  flex: 1;
}
.remove-btn {
  background: #e02424;
  border: none;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.search-wrapper {
  display: flex;
  /* justify-content: flex-end; */
  margin-bottom: 1rem;
  gap: 120px;
}
.search-wrapper input {
  width: 200px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 20px;
}
.search-wrapper .list-title {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}
.add-btn {
  background: transparent;
  border: 1px solid #1d4ed8;
  color: #1d4ed8;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.add-btn:hover {
  background: #eff6ff;
}
.emoji-only {
  font-size: 32px;
  background: transparent !important;
  border: none !important;
  padding: 4px 8px;
  line-height: 1.2;
  animation: pop 0.2s ease;
}

@keyframes pop {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.chat-textarea {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
  resize: none;
  background: transparent;
  line-height: 22px; /* đảm bảo khớp với JS */
  color: #333;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: "Roboto", sans-serif;

  height: 22px; /* 1 dòng */
  max-height: calc(22px * 4); /* tối đa 4 dòng */
}
.group-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.group-modal {
  background-color: #fff;
  width: 90%;
  max-width: 400px;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: fadeInModal 0.25s ease-out;
}

@keyframes fadeInModal {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.group-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.group-modal-header h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
}
.close-btn:hover {
  color: #333;
}

.group-modal-body p {
  font-size: 15px;
  color: #333;
  margin: 0;
}

.group-buttons-horizontal-n {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.group-btn-icon-delete {
  background: red;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  color:white;
  transition: background-color 0.2s ease;
}
.group-btn-icon-delete-n {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.block-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  background-color: white;
  border: 1px solid white;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

/* Huỷ (nút đầu tiên) */
/* .group-buttons-horizontal button:first-child {
  background-color: #ecf0f1;
  color: #2c3e50;
} */
/* .group-buttons-horizontal button:first-child:hover {
  background-color: #bdc3c7;
} */

/* Xoá (nút thứ hai) */
/* .group-buttons-horizontal button:last-child {
  background-color: #e74c3c;
  color: white;
} */
/* .group-buttons-horizontal button:last-child:hover {
  background-color: #c0392b;
} */
.group-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.group-modal {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.25s ease-out;
  font-family: "Poppins", sans-serif;
}

.group-modal-header {
  padding: 16px 20px;
  background: #f5f5f5;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.group-modal-body {
  font-size: 16px;
  color: #333;
}

/* .group-buttons-horizontal {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
} */

.btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #d5d5d5;
}

.danger-btn {
  background-color: #e74c3c;
  color: white;
}

.danger-btn:hover {
  background-color: #c0392b;
}
.block-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.block-user-item .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}
.block-user-item .name {
  flex: 1;
  font-weight: 500;
  color: #333;
}
.unblock-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 8px; 
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
}
.unblock-btn:hover {
  background-color: #c0392b;
}

.context-menu {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 120px;
  padding: 4px 0;
}
.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.context-menu li:hover {
  background: #f5f5f5;
}

.text-deleted {
  color: #888;
  font-style: italic;
  font-size: 13px;
}

.context-menu {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 120px;
  padding: 4px 0;
}
.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.context-menu li:hover {
  background: #f5f5f5;
}
.text-deleted {
  color: #ffffff;
  font-style: italic;
  font-size: 13px;
}
.small-popup {
  max-width: 450px;
}
.search-wrapper input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.search-wrapper {
  display: flex;
  gap: 10px;
}
.btn.primary {
  background-color: #0047ff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
}
.btn {
  background-color: #eee;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.small-popup { max-width: 460px; }

.friend-profile-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 16px;
}

.cover {
  width: 100%;
  height: 100px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-top: -24px;
}

.avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.friend-name {
  text-align: center;
  margin: 8px 0;
}

.section-title {
  margin: 12px 0 4px;
  font-weight: bold;
}

.bio {
  font-size: 0.9em;
  color: #666;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: #eee;
}

.btn.primary {
  background: #0047ff;
  color: #fff;
}
.add-btnm {
  background: transparent;
  border: 1px solid #1d4ed8;
  color: #1d4ed8;
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  
    margin-right: 10px;

}
.add-btnm:hover {
  background: #eff6ff;
}

</style>