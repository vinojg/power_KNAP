import React from 'react';
import PropTypes from 'prop-types';
import RoomListEntry from './RoomListEntry';

const RoomList = ({rooms, changeView}) => (
  <ul>
    {rooms.map((room, index) => <RoomListEntry
        room={room}
        key={index}
        changeView={changeView}
      />)}
  </ul>
);

export default RoomList;


RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  changeView: PropTypes.func.isRequired,
};
