// src/socket.js   (hoặc đường dẫn bạn đặt)
import { io } from "socket.io-client";

const socket = io("http://localhost:8081", {
  transports: ["websocket"],
  auth: { token: localStorage.getItem("accessToken") },
});

// ➊ Gắn listener NGAY tại đây – chạy 1 lần duy nhất
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.id) {
    socket.emit("identify", user.id);
  }
});

// ➋ Khi socket tự reconnect, sự kiện `connect` sẽ chạy lại → tự gửi identify
export default socket;
