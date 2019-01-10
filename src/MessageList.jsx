import React, {Component}  from 'react';
import Messages from './Message.jsx'


export default class MessageList extends Component {

  render() {

    console.log("The style is...", this.props.nColor);


    const MsgList = this.props.message.map((msg, index) => (
      <Messages key={index} msg={msg} nColor={this.props.nColor}/>))
    return (
      <div >
         {MsgList}
      </div>
      )
  }
}