import React from 'react';

const RoomListEntry = (props) => (
  <li onClick={() => {
      props.setRoomId(props.room.id);
      props.changeView('room');
    }}>
    { props.room.name }
  </li>
);

export default RoomListEntry;
