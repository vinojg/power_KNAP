import React from 'react';
import PropTypes from 'prop-types';

const RoomList = ({ rooms }) => (
  <div>
    {rooms.map(room => room)}
  </div>
);

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoomList;
