// server.js
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const express = require('express');
const http = require('http');
const uuid = require('uuid/v4');
const fetch = require('node-fetch');
const querystring = require('querystring');

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
let onlineUser = 0;
let userColorDB = [];


wss.broadcastJSON = obj => wss.broadcast(JSON.stringify(obj));

wss.broadcast = data => {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

colorGenerator = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

handleMessage = (msg) => {
  let matches = msg.match(/(http(s?):)([/|.|\w|\s|-])*\/giphy.(?:jpg|gif|png)/);
  if (matches) {
    const newMsg = msg.replace(matches[0], '');
    const qs = querystring.stringify({
      api_key: "nD0C2J4V7IQlcurU11m1rRzwWGcw79FY",
      tag: matches[1]
    })
    fetch('https://api.giphy.com/v1/gifs/random?${qs}')
        msg = `<div><div>${newMsg}</div>
                               <img src="${matches[0]}" />
                            </div>`
  }
  return msg;;
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', ws => {
  console.log('Client connected');
  let objectToBroadcast = {};
  const userKey = uuid();
  onlineUser++;
  objectToBroadcast['users'] = onlineUser;
  wss.broadcastJSON(objectToBroadcast);

  ws.on('message', data => {
    const objData = JSON.parse(data);

      switch (objData.type) {
        case 'postMessage':
          if(userColorDB.hasOwnProperty(objData.username) || userColorDB[userKey]){
              objectToBroadcast = {
                id: uuid(),
                name: objData.username,
                content: handleMessage(objData.content),
                type: 'incomingMessage',
                users: onlineUser,
                nameColor: userColorDB[userKey],
                userKey: objData.userKey
              };
          }
          else {
              objectToBroadcast = {
                id: uuid(),
                name: objData.username,
                content: handleMessage(objData.content),
                type: 'incomingMessage',
                users: onlineUser,
                nameColor: colorGenerator(),
                userKey: userKey
              };
          }
          userColorDB[userKey] = objectToBroadcast.nameColor;
          messageDatabase.push(objectToBroadcast);
          wss.broadcastJSON(objectToBroadcast);
          break;

        case 'postNotification':
              objectToBroadcast = {
                content: handleMessage(objData.content),
                type: 'incomingNotification',
                users: onlineUser
              };
          messageDatabase.push(objectToBroadcast);
          wss.broadcastJSON(objectToBroadcast);
          break;
        default:
      }
  });

  const initialMessage = {
    type: 'initial-messages',
    messages: messageDatabase,
    users: onlineUser
  };
  ws.send(JSON.stringify(initialMessage));

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    onlineUser--;
    objectToBroadcast['users'] = onlineUser;
    wss.broadcastJSON(objectToBroadcast);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
