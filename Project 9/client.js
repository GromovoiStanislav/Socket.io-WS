const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Подключение к серверу Socket установлено');
  console.log('[x] To exit type "exit" or press CTRL+C');
  console.log('Type a message...');
});

socket.on('message', (message) => {
  console.log(`Получено сообщение от сервера: ${message}`);
});

socket.on('disconnect', () => {
  console.log('Соединение с сервером WebSocket закрыто');
});

process.stdin.on('data', (chunk) => {
  const str = chunk.toString().trim();
  if (str === 'exit') {
    process.exit(0);
  }

  socket.emit('message', str);
});
