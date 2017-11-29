import React from 'react';
import PropTypes from 'prop-types';
import PlaylistEntry from './PlayListEntry';

const Playlist = ({ playlist, isHost, removeSelected }) => (

  <div className="container playlist">
    <h3>Playlist</h3>
    <div className="scroll">
      {playlist.map((song, index) =>
        (<PlaylistEntry
          song={song}
          key={song.id}
          isHost={isHost}
          index={index + 1}
          removeSelected={removeSelected}
        />))}
    </div>
  </div>
);

Playlist.propTypes = {
  playlist: PropTypes.instanceOf(Array).isRequired,
};

export default Playlist;
