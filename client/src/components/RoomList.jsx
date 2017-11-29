import React from 'react';
import PropTypes from 'prop-types';
import RoomListEntry from './RoomListEntry';

const RoomList = ({rooms, changeView}) => (
  <ul>
    {rooms.map(room => <RoomListEntry room={room} changeView={changeView} />)}
  </ul>
);

export default RoomList;


RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeView: PropTypes.arrayOf(PropTypes.string).isRequired,
};
