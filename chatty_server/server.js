// server.js
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const express = require('express');
const http = require('http');
const uuid = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const app = express();

   // Make the express server serve static assets (html, javascript, css) from the /public folder
  // .use(express.static('public'))
  // .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));




app.get('/', (req, res) => {
  res.send('Hello!');
});

const server = http.createServer(app);

// Create the WebSockets server
const wss = new SocketServer({ server });

const messageDatabase = [];

wss.broadcastJSON = obj => wss.broadcast(JSON.stringify(obj));

wss.broadcast = data => {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', data => {
    console.log(`Got message from the client ${data}`);
    const objData = JSON.parse(data);
     console.log("The name here: ", objData.username)
     let objectToBroadcast = {};
    switch (objData.type) {
      case 'postMessage':
        objectToBroadcast = {
          id: uuid(),
          name: objData.username,
          content: objData.content,
          type: 'incomingMessage'
        };
        messageDatabase.push(objectToBroadcast);
        wss.broadcastJSON(objectToBroadcast);
        break;

      case 'postNotification':
        objectToBroadcast = {
          content: objData.content,
          type: 'incomingNotification'
        };
        messageDatabase.push(objectToBroadcast);
        wss.broadcastJSON(objectToBroadcast);
        break;

      default:
    }


  });

  const initialMessage = {
    type: 'initial-messages',
    messages: messageDatabase
  };
  ws.send(JSON.stringify(initialMessage));

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
