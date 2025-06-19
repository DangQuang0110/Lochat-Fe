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
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <button class="add-btn"></button>
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
                    <span class="file-icon">📎</span>
                    <div class="file-info">
                      <p class="file-name">{{ msg.file.name }}</p>
                      <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                    </div>
                    <a :href="msg.file.url" target="_blank" class="download-btn"
                      >⬇️</a
                    >
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
                <div v-if="msg.file" class="file-attach">
                  <span class="file-icon">📎</span>
                  <div class="file-info">
                    <p class="file-name">{{ msg.file.name }}</p>
                    <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                  </div>
                  <a :href="msg.file.url" target="_blank" class="download-btn"
                    >⬇️</a
                  >
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
                    msg.fromMe ? 'from-me' : 'from-other',
                    isEmojiOnly(msg.text) ? 'emoji-only' : '',
                    msg.isDeleted ? 'deleted-message' : ''
                  ]"
                >
                  <span :class="{'text-deleted': msg.isDeleted}">
                    {{ msg.isDeleted ? 'Tin nhắn đã được thu hồi' : msg.text }}
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="!msg.fromMe" class="group-msg">
                <img class="avatar" :src="getSender(msg)?.avatar" />
                <div class="msg-block">
                  <div class="sender-name">{{ getSender(msg)?.name }}</div>
                  <div v-if="msg.file" class="file-attach">
                    <span class="file-icon">📎</span>
                    <div class="file-info">
                      <p class="file-name">{{ msg.file.name }}</p>
                      <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                    </div>
                    <a :href="msg.file.url" target="_blank" class="download-btn"
                      >⬇️</a
                    >
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
                  <span class="file-icon">📎</span>
                  <div class="file-info">
                    <p class="file-name">{{ msg.file.name }}</p>
                    <p class="file-size">{{ prettySize(msg.file.size) }}</p>
                  </div>
                  <a :href="msg.file.url" target="_blank" class="download-btn"
                    >⬇️</a
                  >
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
        <button class="delete-btn">Xóa đoạn tin nhắn</button>
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
          Xóa đoạn tin nhắn
        </button>
        <button v-else class="delete-btn leave-btn" @click="leaveGroup">
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
          <input
            type="text"
            v-model="searchText"
            placeholder="Quản lí nhóm"
            class="group-search"
          />
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
          class="group-buttons-horizontal"
          style="justify-content: flex-end; margin-top: 20px"
        >
          <button
            @click="showConfirmRemove = false"
            class="group-btn-icon-delete"
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
        <div class="group-buttons-horizontal">
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
import { getAcceptedFriends } from "@/service/friendService";
import { getMessages, delMessage } from "@/service/messageService";
import { useRouter } from "vue-router";
import socket from "@/socket";

const bottomRef = ref(null);
const showConfirmRemove = ref(false);
const memberToRemove = ref(null);

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

    socket.emit("identify", loggedInAccountId.value);
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
    friends.value = others
      .filter((f) => String(f.id) !== String(loggedInAccountId.value))
      .map((f) => ({
        id: f.id,
        name: f.profile?.fullname || f.username,
        avatar: f.profile?.avatarUrl || require("@/assets/avata.jpg"),
        desc: "",
        conversationId: f.conversationId,
        online: false,
      }));
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
    const idSet = new Set(onlineIds.map(Number));
    // cập nhật trạng thái online của friends
    friends.value.forEach((f) => {
      f.online = idSet.has(f.id);
    });
    // cập nhật trạng thái online cho nhóm (nếu cần)
    groups.value.forEach((g) => {
      g.online = g.members?.some((m) => idSet.has(m.accountId));
    });
  });
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
    console.error("❌ Lỗi khi xóa tin nhắn:", err);
    alert("Không thể xóa tin nhắn!");
  }
}

function handleClickOutsideContextMenu(event) {
  if (!event.target.closest('.context-menu')) {
    showContextMenu.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutsideContextMenu);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideContextMenu);
});
</script>

<style scoped src="../style/style.css"></style>
<style scoped>
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
  color: #888;
  font-style: italic;
  font-size: 13px;
}

</style>