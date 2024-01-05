const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', data.candidate);
  });

  socket.on('register', (data) => {
    socket.join(data.username);
    console.log(`${data.username} joined the chat`);
  });

  socket.on('chat-message', (data) => {
    io.to(data.target).emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 65533;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
