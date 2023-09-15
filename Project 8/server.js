const WebSocket = require('ws');
const server = new WebSocket.Server({ port: '3000' });

server.on('connection', (socket) => {
  console.log('Клиент подключился');

  socket.on('message', (message) => {
    console.log(`Получено сообщение: ${message}`);

    // console.log(message); // Buffer

    socket.send(`Вы сказали: ${message}`);
  });

  socket.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log('listening on http://localhost:3000');
