require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const options = { query: { token: '707277cf-29e7-4feb-ad15-1ce054e74299' } };
const clientSocket = require('socket.io-client')(
  'http://localhost:3000',
  options
);

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is not from a group
  if (!msg.chat.title) {
    clientSocket.emit('message', {
      from: msg.from.id,
      text: msg.text,
      timestamp: msg.date,
    });
  }
});
