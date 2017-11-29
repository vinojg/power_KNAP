import React from 'react';

const RoomListEntry = (props) => (
  <li onClick={() => props.changeView('post')}>
    {props.room}
  </li>
);

export default RoomListEntry;
