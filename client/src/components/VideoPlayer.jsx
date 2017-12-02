import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';

const VideoPlayer = ({ currentVideo, opts, onReady, onStateChange }) => {
  if (currentVideo !== undefined) {
    return (
      <div className="container videoplayer">
        <YouTube
          //className="videoFrame" // TODO uncomment to restrict player controls
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
      <img className="fillerImage" src="https://78.media.tumblr.com/2b92d1386a908d98d7a1a855161157cc/tumblr_o8xmm4cH7l1ubz7jho1_500.gif" alt="pizza boy" />
    </div>
  );
};

VideoPlayer.propTypes = {
  currentVideo: PropTypes.instanceOf(Object),
  onStateChange: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default VideoPlayer;
