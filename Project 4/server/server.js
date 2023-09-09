const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = require('./users');

const PORT = process.env.PORT || 3000;

const path = require('path');
const { isGeneratorObject } = require('util/types');
const pathPublic = path.join(__dirname, '../public');
app.use(express.static(pathPublic));

const message = (name, text, id) => ({ name, text, id });

io.on('connection', (socket) => {
  socket.on('join', (user, callback) => {
    if (!user.name || !user.room) {
      callback('Enter valid user data');
    } else {
      callback(null, { userId: socket.id });
      socket.join(user.room);
      users.remove(socket.id);
      users.add(socket.id, user.name, user.room);

      io.to(user.room).emit('users:apdate', users.getByRoom(user.room));

      socket.emit('message:new', message('Admin', `Welcome, ${user.name}!`));
      socket.broadcast
        .to(user.room)
        .emit('message:new', message('Admin', `${user.name} joined`));
    }
  });

  socket.on('message:create', (data, callback) => {
    if (!data) {
      callback(`Message can't be empty`);
    } else {
      const user = users.get(socket.id);
      if (user) {
        io.to(user.room).emit(
          'message:new',
          message(data.name, data.text, data.id)
        );
      }
      callback();
    }
  });

  socket.on('disconnect', () => {
    const user = users.remove(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message:new',
        message('Admin', `${user.name} left`)
      );

      io.to(user.room).emit('users:apdate', users.getByRoom(user.room));
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server started - http://192.168.1.143:${PORT}`)
);
