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
let onlineUser = 0;
let userlist = [];
let userColorDB = [];
onlineUser['userNow'] = 0;


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

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', ws => {
  console.log('Client connected');
  let objectToBroadcast = {};

  onlineUser++;
  objectToBroadcast['users'] = onlineUser;
  wss.broadcastJSON(objectToBroadcast);


  ws.on('message', data => {
    console.log(`Got message from the client ${data}`);
    const objData = JSON.parse(data);
     console.log("The name here: ", objData.username)
     console.log("The COLOR here: ", objData.nameColor)

      switch (objData.type) {
        case 'postMessage':
          if(userColorDB.hasOwnProperty(objData.username)){
              objectToBroadcast = {
                id: uuid(),
                name: objData.username,
                content: objData.content,
                type: 'incomingMessage',
                users: onlineUser,
                nameColor: userColorDB[objData.username]
              };
          }

          else if (objData.nameColor == undefined){
              objectToBroadcast = {
                id: uuid(),
                name: objData.username,
                content: objData.content,
                type: 'incomingMessage',
                users: onlineUser,
                nameColor: colorGenerator()
              };
            userlist.push(objData.username);
            userColorDB[objData.username] = objectToBroadcast.nameColor;
          }

          else{
           objectToBroadcast = {
              id: uuid(),
              name: objData.username,
              content: objData.content,
              type: 'incomingMessage',
              users: onlineUser,
              nameColor: objData.nameColor
            };
          }
          messageDatabase.push(objectToBroadcast);
          wss.broadcastJSON(objectToBroadcast);
          break;


        case 'postNotification':
          if (!userlist.includes(objData.username)){
              objectToBroadcast = {
                content: objData.content,
                type: 'incomingNotification',
                users: onlineUser
              };
          }
          else{
           objectToBroadcast = {type: 'repeatedName'}

          }
          messageDatabase.push(objectToBroadcast);
          wss.broadcastJSON(objectToBroadcast);
          break;
        default:
      }
    console.log("The user list now:", userlist);
    console.log("the users now", onlineUser);

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
