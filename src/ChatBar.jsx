import React , {Component}from 'react';


export default class ChatBar extends Component{

  handleEnter (evt) {
    evt.preventDefault();
    if (evt.key === "Enter"){
      console.log("The user sent something....");
      this.setState = ({action: true});
    }
  }

  render() {

    const theUser = this.props.theUser.name;
    return (
        <footer className="chatbar">
          <input className="chatbar-username" placeholder="Your Name (Optional)" value={theUser}/>
          <input className="chatbar-message" placeholder="Type a message and hit ENTER" />
        </footer>
    )
  }
}

