import React, {Component}from 'react';

let newUser = '';
let newContent = '';

export default class ChatBar extends Component {
  checkMsg (evt) {
    evt.preventDefault();
    if (evt.target.name === "theName"){
      newUser = evt.target.value;
      console.log("the user:", newUser)
    }
    if (evt.target.name === "newContent"){
      newContent = evt.target.value;
      console.log("the msg:", newContent)
    }
  }

  handleEnter = (evt) => {
    console.log('whatever', this)
    evt.preventDefault();
    if (evt.key === "Enter" && newContent != '' && newUser != ''){
      console.log("the newContent", newContent);
      console.log("The user sent something....");
      this.props.getNewMessage(newUser, newContent);
    }
  }

  render() {
    // const theUser = this.props.theUser.name;
    return (
        <footer className="chatbar">
          <input className="chatbar-username" placeholder="Your Name (Optional)" name="theName" onChange = {this.checkMsg}/>
          <input className="chatbar-message" placeholder="Type a message and hit ENTER" name="newContent" onChange={this.checkMsg} onKeyUp={this.handleEnter}/>
        </footer>
    )
  }
}
