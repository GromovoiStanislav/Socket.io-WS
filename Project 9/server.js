const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Клиент подключился');

  socket.on('message', (message) => {
    console.log(`Получено сообщение: ${message}`);
    console.log(message);
    socket.emit('message', `Вы сказали: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('Клиент отключился');
  });
});

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
