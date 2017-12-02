import React from 'react';
import PropTypes from 'prop-types';


const PlaylistEntry = ({ song, index, isHost, removeSelected, vote, removeForHost}) => {

  return (
      <div className="playlistEntry">
      Votes: {song.roomvideos.votes}
        <button className="voteButton"  onClick={() => { 
          vote(song.id, song.videoName, '+')
          }}>
          
          +
        </button>
        <button className="voteButton"  onClick={() => { 
          vote(song.id, song.videoName, '-')
          }}>
          
          -
        </button>
        
        {isHost &&
        <button className="deleteButton" onClick={() => { removeForHost(song.videoName); }}>
          Remove for Host
          </button>
      }
      {!isHost &&
        <button className="deleteButton" onClick={() => { removeSelected(song.videoName); }}>
          Remove
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
