const dotenv = require('dotenv').config();
const WebSocket = require('ws');
const fs = require('fs');
const jwt = require('jsonwebtoken');

userIds = ['ALL'];

const server = new WebSocket.Server({ port: 8000 });
const jwtKey = fs.readFileSync(process.env.WS_JWT_PUBLIC_KEY, 'utf8');

server.on('connection', function (ws, request) {
  console.log('connected: %s', request.remoteAddress);

  ws.on('message', function (message) {
    const data = JSON.parse(message);
    if (data.type && data.type === 'auth') {
      try {
        const token = jwt.verify(data.token, jwtKey, { algorithms: ['RS256'] });
        console.log('user_id: %s', token.sub);
        ws.user_id = token.sub;
        userIds.push(token.sub);
        console.log('Type a message...');
      } catch (err) {
        console.log(err);
      }
    }
  });
});

const run = async () => {
  function getRandomUser() {
    const randomIndex = Math.floor(Math.random() * userIds.length);
    return userIds[randomIndex];
  }

  console.log('[x] To exit press CTRL+C.');
  console.log('Type a message...');
  process.stdin.on('data', async (chunk) => {
    const str = chunk.toString().trim();
    if (str === 'exit') {
      await producer.disconnect();
      process.exit(0);
    }
    const message = { user_id: getRandomUser(), message: str };

    server.clients.forEach((ws) => {
      if (ws.user_id === message.user_id || message.user_id === 'ALL') {
        ws.send(JSON.stringify(message));
      }
    });
  });
};

run().catch(console.error);
