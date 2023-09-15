const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: '3000' });

wss.on('connection', (ws) => {
	console.log('New client connected!');

	ws.on('message', data => {
		console.log(`Client has sent us: ${data}`);
		console.log(data);// Buffer
		console.log(data.toString());

		ws.send(data.toString().toUpperCase());
	});

	ws.on('close', () => {
		console.log('Client has disconnected!');
	});
});

console.log('listening on http://localhost:3000');