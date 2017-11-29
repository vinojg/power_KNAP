import React from 'react';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';
import Messages from './Messages';

class ChatView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== '') {
      this.setState({
        messages: this.state.messages.concat({
          message: nextProps.message.body,
          username: nextProps.message.userName,
          date: nextProps.message.dateTime,
          color: nextProps.message.userColor,
        }),
      });
    }
  }

  sendMessage(time, message) {
    this.props.emitMessage(time, message);
  }

  render() {
    return (
      <div className="container userChat">
        <h3>Chat Box</h3>
        <div className="scroll">
          <div className="messageContainer">
            <Messages messages={this.state.messages} />
          </div>
          <div className="messageInput">
            <MessageInput sendMessage={this.sendMessage} />
          </div>
        </div>
      </div>
    );
  }
}

ChatView.propTypes = {
  emitMessage: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ChatView;
