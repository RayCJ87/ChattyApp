import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx'
import MessageList from './MessageLIst.jsx'
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      currentUser: { name: 'Danny'},
      messages : []
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

      switch (json.type) {
        case 'incomingMessage':
          this.setState({
            messages: [ ...this.state.messages, json]
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

  // getNewMessage(name, content){
  //   console.log("ready to get msg")
  //     const newMsg = this.state.messages.concat({username: name, content: content});
  //     this.setState({messages: newMsg});
  // }

  updateCurrentUser(name){
    const oldUser = this.state.currentUser.name;
    const that = this;

      let promise1 = new Promise (function(resolve, reject) {
         if (oldUser != name){
          that.setState({currentUser: {name: name}});
          const userChangeNotification = {type: "postNotification", content: `${oldUser} has changed their name tp ${name}`};
          that.socket.send(JSON.stringify(userChangeNotification));
          console.log(userChangeNotification);
          resolve();
             };
          resolve();
      });
      return promise1;
  }

  _sendMessageToServer(name, content) {
    console.log("ready to send msg to server.")
    const newMsgToSend = {type:'postMessage', username: name, content: content};
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
          </nav>
          <main className="messages">
          <MessageList message={this.state.messages}/>
            <div className="message system">
            </div>
          </main>
      <footer className="chatbar">
          <ChatBar _sendMessageToServer={this._sendMessageToServer} updateCurrentUser={this.updateCurrentUser} />
      </footer>
      </div>
    );
  }
}

export default App;
