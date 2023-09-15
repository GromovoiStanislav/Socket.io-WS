const io = require('socket.io')(3000, {
  //cors: { origin: '*' },
  cors: { origin: ['http://localhost:8080'] },
});


const userIo = io.of('/user');
userIo.on('connection', (socket) => {
  console.log(`Connected to User namespace with username = ${socket.username}`);
});
userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUserFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error('Please send token'));
  }
});

function getUserFromToken(token) {
  return token;
}

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('send-message', (message, room) => {
    if (room === '') {
      // io.emit("receive-message", message)
      socket.broadcast.emit('receive-message', message);
    } else {
      socket.to(room).emit('receive-message', message);
    }
  });

  socket.on('join-room', (room, cb) => {
    socket.join(room);
    cb(`Joined room ${room}`);
    socket
      .to(room)
      .emit('receive-message', `${socket.id} joined to room ${room}`);
  });

  socket.on('leave-room', (room, cb) => {
    socket.leave(room);
    cb(`Left room ${room}`);
    socket.to(room).emit('receive-message', `${socket.id} left room ${room}`);
  });

  socket.on('ping', (n) => {
    console.log(n);
  });
});
