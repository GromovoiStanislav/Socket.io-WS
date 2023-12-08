const http = require('http');
const socketIo = require('socket.io');

const server1 = http.createServer();
const server2 = http.createServer();

const io_1 = socketIo(server1);
const io_2 = socketIo(server2);

const token_1 = '707277cf-29e7-4feb-ad15-1ce054e74288';
const token_2 = '707277cf-29e7-4feb-ad15-1ce054e74299';

io_1.use((socket, next) => {
  if (socket.handshake?.query?.token != token_1) {
    return next(new Error('Authentication error'));
  } else {
    next();
  }
});

io_2.use((socket, next) => {
  if (socket.handshake?.query?.token != token_2) {
    return next(new Error('Authentication error'));
  } else {
    next();
  }
});

io_1.on('connection', (client) => {
  client.on('message', (data) => {
    io_2.emit('message', data);
  });
});

server1.listen(3001, () => console.log('WebSocket server running'));
server2.listen(3002, () => console.log('WebSocket server running'));
