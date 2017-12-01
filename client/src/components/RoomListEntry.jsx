import React from 'react';

const RoomListEntry = (props) => (
  <li onClick={() => {
      props.changeView('room');
      props.setRoomId(props.room.id);
    }}>
    {props.room.id}
  </li>
);

export default RoomListEntry;
