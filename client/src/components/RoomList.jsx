import React from 'react';
import RoomListEntry from './RoomListEntry';

const RoomList = (props) => (
  <ul>
    {props.rooms.map(room => <RoomListEntry room={room} changeView={props.changeView} />)}
  </ul>
);

export default RoomList;
