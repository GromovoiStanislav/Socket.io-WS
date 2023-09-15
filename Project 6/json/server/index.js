const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: '3000' });

wss.on('connection', (ws) => {


	ws.on('message', (message) => {
		console.log(message);// Buffer

		try {
			const data = JSON.parse(message.toString())
			console.dir(data);
		} catch (e) {
			console.log(e.message)
		}
	});


});

console.log('listening on http://localhost:3000');