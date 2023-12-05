import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(express.json());

// Хранение активных сокетов
const activeSockets = [];

app.get('/', (req, res) => {
  res.send('Real-Time Application');
});

app.post('/message', (req, res) => {
  const message = req.body.message;

  // Отправить сообщение всем активным сокетам
  activeSockets.forEach((socket) => {
    socket.emit('new_message', message);
  });

  res.sendStatus(200);
});

io.on('connection', async (socket) => {
  console.log('A user connected');

  // Добавить сокет в массив активных сокетов
  activeSockets.push(socket);

  socket.on('disconnect', () => {
    // Удалить отключенный сокет из массива
    const index = activeSockets.indexOf(socket);
    if (index !== -1) {
      activeSockets.splice(index, 1);
    }

    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
