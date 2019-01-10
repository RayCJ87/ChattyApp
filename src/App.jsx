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
      currentColor: {}
    };

    this._sendMessageToServer = this._sendMessageToServer.bind(this);
    this.updateCurrentUser= this.updateCurrentUser.bind(this);
  }

  componentDidMount(){

    this.socket = new WebSocket ("ws://localhost:3001");

    this.socket.onopen = () => {
      console.log("Connected to server!");
    };

    this.socket.onmessage = payload => {
      console.log('Got a message from server', payload);
      const json = JSON.parse(payload.data);

      console.log("THe user online now --->", json.users);
      this.setState({userNumber: json.users});

      console.log("The name color is:", json.nameColor);
      switch (json.type) {
        case 'incomingMessage':
          this.setState({
            messages: [ ...this.state.messages, json],
            currentColor: {nameColor: json.nameColor}
          });
          console.log("The messages fof display:", this.state.messages);
          break;
        case 'incomingNotification':
          this.setState({
            messages: [ ...this.state.messages, json]
          })
          console.log("The messages of user change:", this.state.messages);
          break;
        case 'initial-messages':
          this.setState({
            messages: json.messages
          });
          break;
        case 'repeatedName':
          alert('This name is taken, please choose another one');
          break;
        default:
      }

      console.log("The messages now", this.state.messages);
      console.log("The currentUser is:  ", this.state.currentUser);
    }


    this.socket.onclose = () => {
      console.log('Disconnected from the WebSocket');
    };

    console.log("componentDidMount <App />");

  }


  updateCurrentUser(name){
    const oldUser = this.state.currentUser.name;
    const theColor = this.state.currentColor.nameColor;
    const that = this;

      let promise1 = new Promise (function(resolve, reject) {
        let userChangeNotification = {};
         if (oldUser != name ){
          that.setState({currentUser: {name: name},
                          currentColor: {}});
          if (oldUser == ''){
            userChangeNotification = {type: "postNotification", content: `New user:  ***${name}***`};
          }
          else {
            userChangeNotification = {type: "postNotification", content: `***${oldUser}*** has changed the name to ***${name}***`};
          }
          that.socket.send(JSON.stringify(userChangeNotification));
          console.log(userChangeNotification);
          resolve();
             };
          resolve();
      });
      return promise1;
  }

  _sendMessageToServer(name, content, color) {
    console.log("ready to send msg to server.")
    const newMsgToSend = {type:'postMessage', username: name, content: content, nameColor: color };
    console.log("New msg here", newMsgToSend.username);
    console.log("the obj to send: ", newMsgToSend);
    this.socket.send(JSON.stringify(newMsgToSend));
  }

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
          <ChatBar _sendMessageToServer={this._sendMessageToServer} updateCurrentUser={this.updateCurrentUser} nameColor= {this.state.currentColor.nameColor}/>
      </footer>
      </div>
    );
  }
}

export default App;
