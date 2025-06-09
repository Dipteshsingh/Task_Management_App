import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import chatModel from './models/chatModel.js';
import chatRouter from './routes/chatRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('API Working');
});
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/chat',chatRouter)

// Connect to DB
connectDb();

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.io server with CORS config
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const onlineUsers = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User notifies server when connected with userId
  socket.on('user_connected', (userId) => {
    onlineUsers[userId] = socket.id;
    console.log('User connected:', userId);
  });

  // Listen for chat messages from clients
  socket.on('send_message', async (data) => {
    const { sender, reciever, message } = data;

    // Save message to database
    try {
      await chatModel.create({ sender, reciever: reciever, message });
    } catch (error) {
      console.error('Message saving failed:', error.message);
    }

    // Emit to receiver if online
    const receiverSocketId = onlineUsers[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', {
        sender,
        message,
        timestamp: new Date(),
      });
    } else {
      // Optionally notify sender that receiver is offline
      socket.emit('receive_message', {
        sender: 'System',
        message: 'User not available right now.',
        timestamp: new Date(),
      });
    }
  });

  // Remove user from onlineUsers on disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const [userId, sockId] of Object.entries(onlineUsers)) {
      if (sockId === socket.id) {
        delete onlineUsers[userId];
        console.log('User disconnected:', userId);
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
