const WebSocket = require('ws');
const server = new WebSocket.Server({ port: '3000' });

server.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    socket.send(`Roger that! ${message}`);
  });
});

console.log('listening on http://localhost:3000');
