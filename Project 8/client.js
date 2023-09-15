const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000');

client.on('open', () => {
  console.log('Подключение к серверу WebSocket установлено');
  console.log('[x] To exit type "exit" or press CTRL+C');
  console.log('Type a message...');
});

client.on('message', (message) => {
  console.log(`Получено сообщение от сервера: ${message}`);
});

client.on('close', () => {
  console.log('Соединение с сервером WebSocket закрыто');
});

process.stdin.on('data', (chunk) => {
  const str = chunk.toString().trim();
  if (str === 'exit') {
    process.exit(0);
  }

  client.send(str);
});
