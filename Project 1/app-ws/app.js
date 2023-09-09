const socket = new WebSocket('ws://localhost:3000');

// Listen for messages
socket.onmessage = ({ data }) => {
  console.log('Message from server ', data);

  const el = document.createElement('li');
  el.innerHTML = data;
  document.querySelector('ul').appendChild(el);
};

document.querySelector('button').onclick = () => {
  const text = document.querySelector('input').value;
  socket.send(text);
};
