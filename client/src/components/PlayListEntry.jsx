import React from 'react';
import PropTypes from 'prop-types';


const PlaylistEntry = ({ song, index, isHost, removeSelected, vote, removeForHost}) => {

  return (
      <div className="playlistEntry">
          <button className="deleteButton" onClick={() => { removeSelected(song.videoName); }}>
          Remove
          </button>

        <button className="voteButton"  onClick={() => { 
          console.log('upVote')
          vote(song.id)
          }}>
          
          +1
        </button>
        {isHost &&
        <button className="deleteButton" onClick={() => { removeForHost(song.videoName); }}>
          Remove for Host
          </button>
      }
        <div className="songTitle">{index}. {song.videoName} </div>
      </div>
    );
};

PlaylistEntry.propTypes = {
  song: PropTypes.instanceOf(Object).isRequired,
};

export default PlaylistEntry;
