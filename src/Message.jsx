import React, {Component}  from 'react';

export default class Messages extends Component {
  render() {

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
          <span className="message-username">{this.props.msg.name}</span>
          <span className="message-content">{this.props.msg.content}</span>
        </div>
      )
    }
  }
}



