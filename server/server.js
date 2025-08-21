require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LifeLink Connect API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// =======================================================
// Socket.IO Connection Logic with DEBUG LOGS
// =======================================================
io.on('connection', (socket) => {
  // LOG 1: A new user has opened a connection
  console.log(`[CONNECT] User Connected: ${socket.id}`);

  // User joins a room specific to a request
  socket.on('join_room', (requestId) => {
    socket.join(requestId);
    // LOG 2: A user has joined a specific chat room
    console.log(`[JOIN ROOM] User ${socket.id} joined room: ${requestId}`);
  });

  // User sends a message
  socket.on('send_message', (data) => {
    // LOG 3: The server has received a message to be sent
    console.log(`[SEND MSG] Message received from ${socket.id} for room ${data.room}. Broadcasting...`);
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    // LOG 4: A user has disconnected
    console.log(`[DISCONNECT] User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));