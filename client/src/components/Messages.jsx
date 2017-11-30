import React from 'react';
import PropTypes from 'prop-types';

const Messages = ({ messages }) => (
  messages.map((message, index) => {
    const spanStyle = { color: message.color };
    return (
      <div key={index}>
        <span className="dateTime">[{message.date}]</span>
        <span className="username" style={spanStyle}> {message.username}:</span> {message.message}
      </div>
    );
  }));

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Messages;
