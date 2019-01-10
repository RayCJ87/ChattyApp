import React, {Component}  from 'react';

let nameStyle;

export default class Messages extends Component {

  render() {
    console.log("The style at the end....", this.props.nColor);

    if (this.props.msg.type === "incomingNotification"){
      return (
        <div className="message">
          <span className="notification-content">{this.props.msg.content}</span>
        </div>
      )
    }
    else {
      return (
        <div className="message">
          <span className="message-username" style={{color: this.props.msg.nameColor}}>{this.props.msg.name}</span>
          <span className="message-content">{this.props.msg.content}</span>
        </div>
      )
    }
  }
}



