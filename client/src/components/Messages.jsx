import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'cookie';

const Messages = ({ messages, getUser }) => (
  messages.map((message, index) => {
    const spanStyle = { color: message.color };
    return (
      <div key={index}>
        <span className="dateTime">[{message.date}]</span>
        <span
          className="username"
          style={spanStyle}
          onClick={ () => message.username !== 'Anonymous' ? getUser(message.username) : console.log('nonono') } > {message.username}:</span> {message.message}
      </div>
    );
  }));

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  getUser: PropTypes.func.isRequired,
};

export default Messages;
