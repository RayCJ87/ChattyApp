import React, {Component}  from 'react';
import Messages from './Message.jsx'


export default class MessageList extends Component {
  render() {
    const MsgList = this.props.message.map((msg, index) => (
      <Messages key={index} msg={msg} />))
    return (
      <div >
         {MsgList}
      </div>
      )
  }
}