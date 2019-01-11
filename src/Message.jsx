import React, {Component}  from 'react';

let nameStyle;

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
          <span className="message-username" style={{color: this.props.msg.nameColor}}>{this.props.msg.name}</span>
          <span className="message-content" dangerouslySetInnerHTML={{__html: this.props.msg.content}}/>
        </div>
      )
    }
  }
}



