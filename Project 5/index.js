import http from 'http';
import ws from 'websocket';

let connections = [];
const WebSocketServer = ws.server;

const publish = (message) => {
  try {
    connections.forEach((c) => c.send(message));
  } catch (err) {
    console.log('ERR::' + err);
  }
};

const httpserver = http.createServer();
const websocket = new WebSocketServer({
  httpServer: httpserver,
});

httpserver.listen(3000, () => console.log('Server is listening on port 3000'));

websocket.on('request', (request) => {
  const con = request.accept(null, request.origin);
  con.on('open', () => console.log('opened'));
  con.on('close', () => console.log('CLOSED!!!'));
  con.on('message', (message) => {
    //publish the message to redis
    console.log(`Received message ${message.utf8Data}`);

    publish(message.utf8Data);
  });
  connections.push(con);
});

/*
    //client code
    let ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = message => console.log(`Received: ${message.data}`);
    ws.send("Hello! I'm client")

*/
