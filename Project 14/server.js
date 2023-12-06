const server = require('http').createServer();
const io = require('socket.io')(server);

const token = '707277cf-29e7-4feb-ad15-1ce054e74299';

io.use((socket, next) => {
  if (socket.handshake?.query?.token != token) {
    return next(new Error('Authentication error'));
  } else {
    next();
  }
});

io.on('connection', (client) => {
  client.on('message', (data) => {
    io.emit('message', data);
  });
});

server.listen(3000, () => console.log('WebSocket server running'));
