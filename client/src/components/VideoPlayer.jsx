import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';

const VideoPlayer = ({ currentVideo, opts, onReady, onStateChange }) => {
  if (currentVideo !== undefined) {
    return (
      <div className="container videoplayer">
        <YouTube
          className="videoFrame" // TODO uncomment to restrict player controls
          videoId={currentVideo.url}
          onReady={onReady}
          opts={opts}
          onStateChange={onStateChange}
        />
        <div className="currentSongDetails">
          <div className="videoTitle"> {currentVideo.videoName} </div>
          <div className="songDescription"> {currentVideo.description} </div>
        </div>
        <div className="line" />
      </div>
    );
  }
  return (
    <div className="container videoplayer">
      <img src="https://www.reaconverter.com/howto/wp-content/uploads/2015/10/banana.gif" alt="pizza boy" />
    </div>
  );
};

VideoPlayer.propTypes = {
  currentVideo: PropTypes.instanceOf(Object),
  onStateChange: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default VideoPlayer;
