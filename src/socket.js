import { io } from 'socket.io-client'

const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

const socket = io('http://localhost:8082', {
    transports:['websocket'],
  query: { userId: currentUser?.id ?? 0 },
  auth: { token: localStorage.getItem('accessToken') }
})

export default socket
