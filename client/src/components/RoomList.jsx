import React from 'react';
import PropTypes from 'prop-types';
import RoomListEntry from './RoomListEntry';

const RoomList = ({rooms, changeView, setRoomId}) => (
  <ul>
    {rooms.map((room, index) => <RoomListEntry
        room={room}
        key={index}
        changeView={changeView}
        setRoomId={setRoomId}
      />)}
  </ul>
);

export default RoomList;


RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeView: PropTypes.func.isRequired,
  setRoomId: PropTypes.func.isRequired,
};
