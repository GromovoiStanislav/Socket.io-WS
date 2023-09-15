const WebSocket = require('ws');
const yup = require('yup');

const wss = new WebSocket.Server({ port: '3000' });

wss.on('connection', (ws) => {
	console.log('New client connected!');

	const yupEventSchema = {
		"PLAYER_MOVEMENT": yup.object().shape({
			x: yup.number().required().positive().integer(),
			y: yup.number().required().positive().integer(),
			description: yup.string().required().max(200),
		})
	}


	function parseMessage(message) {

		const object = JSON.parse(message)

		if (!('event' in object)) {
			throw new Error("Event property not provided!")
		}
		if (!('payload' in object)) {
			throw new Error("Payload property not provided!")
		}

		object.payload = yupEventSchema[object.event].validateSync(object.payload)

		return object
	}

	ws.on('message', (message) => {
		console.log(message); // Buffer

		let data
		try {
			data = parseMessage(message.toString())

		} catch (err) {
			console.log(`INVALID MESSAGE: ${err.message}`)
			return
		}

		console.log(data);

		switch (data.event){
			case 'PLAYER_MOVEMENT':
				console.log("OK... recieved prayer movement");
				break
		}
	});


});

console.log('listening on http://localhost:3000');