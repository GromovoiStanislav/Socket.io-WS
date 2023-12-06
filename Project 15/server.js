require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');

const server = http.createServer();
const io = socketIo(server);

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

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is not from a group
  if (!msg.chat.title) {
    io.emit('message', {
      from: msg.from.id,
      text: msg.text,
      timestamp: msg.date,
    });
  }
});
