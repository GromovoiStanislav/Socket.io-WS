import { io } from 'socket.io-client';

const form = document.getElementById('form');
const messageInput = document.getElementById('message-input');
const roomInput = document.getElementById('room-input');
const joinRoomBooton = document.getElementById('join-room-button');
const leaveRoomBooton = document.getElementById('leave-room-button');
const messageContainer = document.getElementById('message-container');

const socket = io('http://localhost:3000');
const userSocket = io('http://localhost:3000/user', {
  auth: { token: 'test-token' },
});

userSocket.on('connect_error', (error) => {
  displayMessage(error);
});

socket.on('connect', () => {
  displayMessage(`You connected with id: ${socket.id}`);
});

socket.on('receive-message', (message) => {
  displayMessage(message);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === '') return;

  socket.emit('send-message', message, room);
  displayMessage(message);
  messageInput.value = '';
});

joinRoomBooton.addEventListener('click', (e) => {
  const room = roomInput.value;
  socket.emit('join-room', room, (message) => displayMessage(message));
});

leaveRoomBooton.addEventListener('click', (e) => {
  const room = roomInput.value;
  socket.emit('leave-room', room, (message) => displayMessage(message));
});

function displayMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  messageContainer.append(div);
}

let count = 0;
setInterval(() => {
  socket.volatile.emit('ping', ++count);
}, 1000);

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input')) return;
  if (e.key === 'c') socket.connect();
  if (e.key === 'd') socket.disconnect();
});
