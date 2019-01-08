import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx'
import MessageList from './MessageLIst.jsx'
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      currentUser: { name: 'Danny', action: false},
      messages : [{
          username: 'Danny',
          content: 'Where is my phone?'
        },
        {
          username: 'Tracy',
          content: 'My flight is delayed.'
        },
            {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };
  }

  componentDidMount(){
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  render() {
    // if (this.state.loading){
    //   return (<h1>Loading...</h1>);
    // }

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
              <ChatBar theUser={this.state.currentUser}/>
      </footer>
      </div>
    );
  }
}

export default App;
