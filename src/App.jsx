import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx'
import MessageList from './MessageLIst.jsx'
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      currentUser: {name: ''},
      messages : [],
      currentColor: {},
    };

    this._sendMessageToServer = this._sendMessageToServer.bind(this);
    this.updateCurrentUser= this.updateCurrentUser.bind(this);
  }

  // receive messages from server after the compoments mount
  componentDidMount(){
    this.socket = new WebSocket ("ws://localhost:3001");
    this.socket.onopen = () => {
      console.log("Connected to server!");
    };
    this.socket.onmessage = payload => {
      const json = JSON.parse(payload.data);
      this.setState({userNumber: json.users});
      switch (json.type) {
        case 'incomingMessage':
          this.setState({
            messages: [ ...this.state.messages, json],
            currentColor: {nameColor: json.nameColor},
            userKey: json.userKey
          });
          break;
        case 'incomingNotification':
          this.setState({
            messages: [ ...this.state.messages, json]
          })
          break;
        case 'initial-messages':
          this.setState({
            messages: json.messages
          });
          break;
        default:
      }
    }

    this.socket.onclose = () => {
      console.log('Disconnected from the WebSocket');
    };
  }

  // update user status after a user changes the name.
  updateCurrentUser(name){
    const oldUser = this.state.currentUser.name;
    const theColor = this.state.currentColor.nameColor;
    const that = this;

    let promise1 = new Promise (function(resolve, reject) {
      let userChangeNotification = {};
      if (oldUser != name ){
        that.setState({currentUser: {name: name}, currentColor: {}});
        if (oldUser == ''){
          userChangeNotification = {type: "postNotification", content: `New user:  ***${name}***`};
        }
        else {
          userChangeNotification = {type: "postNotification", content: `***${oldUser}*** has changed the name to ***${name}***`};
        }
        that.socket.send(JSON.stringify(userChangeNotification));
        resolve();
      };
      resolve();
    });
    return promise1;
  }

  //send data to the server
  _sendMessageToServer(name, content, color, key) {
    console.log("ready to send msg to server.")
    const newMsgToSend = {type:'postMessage', username: name, content: content, nameColor: color, userKey: key };
    this.socket.send(JSON.stringify(newMsgToSend));
  }

  //send data to child components and construct the webpage
  render() {
    return (
      <div className = 'theContainer'>
        <main className="messages">
          <div className="message system">
          </div>
        </main>
          <nav className="navbar">
                <a href="/" className="navbar-brand">Chatty</a>
                <span className="usersOnline">{this.state.userNumber} users online now</span>
          </nav>
          <main className="messages">
          <MessageList message={this.state.messages} nColor={this.state.currentColor.nameColor}/>
            <div className="message system">
            </div>
          </main>
        <footer className="chatbar">
            <ChatBar _sendMessageToServer={this._sendMessageToServer} updateCurrentUser={this.updateCurrentUser} nameColor= {this.state.currentColor.nameColor} userKey={this.state.userKey}/>
        </footer>
      </div>
    );
  }
}

export default App;
