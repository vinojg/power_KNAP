import React from 'react';

const RoomListEntry = (props) => (
  <li onClick={() => props.changeView('room')}>
    {props.room}
  </li>
);

export default RoomListEntry;
