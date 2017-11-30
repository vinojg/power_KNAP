import React from 'react';
import PropTypes from 'prop-types';


const PlaylistEntry = ({ song, index, isHost, removeSelected }) => {

  return (
      <div className="playlistEntry">
          <button className="deleteButton" onClick={() => { removeSelected(song.videoName); }}>
          Remove
          </button>

        <button className="voteButton"  onClick={() => { 

          console.log('upVote') 
          
          }}>
          +1
        </button>
        {isHost &&
        <button className="deleteButton" >
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
  // if (isHost) {
  //   return (
  //     <div className="hostPlaylistEntry">
  //       <button className="deleteButton" onClick={() => { removeSelected(song.videoName); }}>
  //         Remove
  //       </button>
  //       <button className="voteButton"  onClick={() => { console.log('upVote') }}>
  //         +1
  //       </button>
  //       <div className="songTitle">{index}. {song.videoName} </div>
  //     </div>
  //   );
  // }


        //   {isHost &&
  
        // }