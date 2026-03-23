import http from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.io
const httpServer = http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [];

const io = new SocketIO(httpServer, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io auth middleware – verify JWT from handshake
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error – no token'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return next(new Error('Authentication error – user not found'));

    socket.user = user;
    next();
  } catch {
    next(new Error('Authentication error – invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.user?.fullName} (${socket.id})`);

  // Join a conversation room
  socket.on('join_room', (conversationId) => {
    socket.join(conversationId);
    console.log(`[Socket] ${socket.user?.fullName} joined room: ${conversationId}`);
  });

  // Leave a conversation room
  socket.on('leave_room', (conversationId) => {
    socket.leave(conversationId);
    console.log(`[Socket] ${socket.user?.fullName} left room: ${conversationId}`);
  });

  // Handle sending a message
  socket.on('send_message', async ({ conversationId, content }) => {
    try {
      if (!conversationId || !content?.trim()) return;

      const userId = socket.user._id;

      // Verify user belongs to this conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        $or: [{ donorId: userId }, { receiverId: userId }],
        status: 'open',
      });

      if (!conversation) {
        socket.emit('error_message', { message: 'Không tìm thấy cuộc trò chuyện' });
        return;
      }

      // Save message to DB
      const message = await Message.create({
        conversationId,
        senderId: userId,
        content: content.trim(),
      });

      await message.populate('senderId', 'fullName avatar');

      // Update last message on conversation
      conversation.lastMessage = {
        content: content.trim(),
        senderId: userId,
        sentAt: new Date(),
      };
      await conversation.save();

      // Broadcast to all clients in the room (including sender)
      io.to(conversationId).emit('receive_message', message);
    } catch (err) {
      console.error('[Socket] send_message error:', err.message);
      socket.emit('error_message', { message: 'Lỗi khi gửi tin nhắn' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.user?.fullName}`);
  });
});

// Export io so controllers can use it if needed
export { io };

// Connect to Database and start server
connectDB().then(() => {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Accessible on LAN at http://0.0.0.0:${PORT}`);
  });
});

