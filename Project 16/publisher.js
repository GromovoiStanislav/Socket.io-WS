const socket = require('socket.io-client');
const readline = require('readline');

const options = { query: { token: '707277cf-29e7-4feb-ad15-1ce054e74288' } };
const client = socket.connect('http://localhost:3001', options);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ', // Добавляем приглашение к вводу
});

// Обработчик события подключения
client.on('connect', () => {
  console.log('Enter your message:');
  rl.prompt(); // Выводим приглашение для ввода
});

// Обработчик события получения сообщения от сервера
client.on('message', (data) => {
  console.log(`Received message: ${data}`);
  rl.prompt(); // Выводим приглашение для ввода после получения сообщения
});

// Обработчик события отключения
client.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Функция для отправки сообщения на сервер
function sendMessage(message) {
  client.emit('message', message);
}

// Ждем ввода из консоли и отправляем на сервер
rl.on('line', (input) => {
  sendMessage(input);
  rl.prompt(); // Выводим приглашение для следующего ввода
});

// Обработчик закрытия интерфейса ввода-вывода
rl.on('close', () => {
  client.disconnect();
  process.exit(0);
});
