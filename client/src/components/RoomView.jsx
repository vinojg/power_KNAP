import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import moment from 'moment';
import axios from 'axios';
import cookie from 'cookie';
import VideoPlayer from './VideoPlayer';
import Playlist from './Playlist';
import Search from './Search';
import ChatView from './ChatView';

const roomSocket = io('/room');

class RoomView extends React.Component {
  constructor() {
    super();
    this.state = {
      currentVideo: undefined,
      playlist: [],
      startOptions: null,
      isHost: false,
      message: '',
      username: '', // refers to socketIDs when user is in chat but not logged in
      user: null, // refers to Google username when logged in in chat
      // TODO: eliminate the need for two separate username references
    };
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.saveToPlaylist = this.saveToPlaylist.bind(this);
    this.emitMessage = this.emitMessage.bind(this);
  }

  componentDidMount() {
    if (cookie.parse(document.cookie).user) {
      this.setState({ user: cookie.parse(document.cookie).user }) 
    }
    this.renderRoom();
    roomSocket.on('default', () => this.setState({ currentVideo: undefined }));
    roomSocket.on('host', () => this.setState({ isHost: true }));
    roomSocket.on('retrievePlaylist', videos => this.addToPlaylist(videos));
    roomSocket.on('playNext', (next) => {
      this.setState({
        currentVideo: this.state.playlist[next],
      });
    });
    roomSocket.on('error', err => console.error(err));
    roomSocket.on('pushingMessage', (message) => {
      this.setState({
        message,
      });
    });
    roomSocket.on('id', id => this.setState({ username: id }));
  }

  componentWillUnmount() {
    roomSocket.disconnect();
  }

  onPlayerReady(e) {
    e.target.playVideo();
  }

  onPlayerStateChange(e) {
    // when video has ended
    if (e.data === 0) {
      if (this.state.isHost) {
        axios.patch(`/playNext/${this.state.playlist.length - 1}`);
      }
      this.setState({
        startOptions: { playerVars: { start: 0 } },
      });
    }
    // when video is unstarted
    if (e.data === -1) {
      e.target.playVideo();
    }
  }

  handleDelete(videoName) {
    roomSocket.emit('removeFromPlaylist', videoName);
  }

  addToPlaylist(videos) {
    if (videos.length === 1) {
      this.setState({
        playlist: videos,
        currentVideo: videos[0],
        startOptions: { playerVars: { start: 0 } },
      });
    } else {
      this.setState({ playlist: videos });
    }
  }

  saveToPlaylist(video) {
    roomSocket.emit('saveToPlaylist', video);
  }

  emitMessage(time, message) {
    roomSocket.emit('emitMessage', {
      body: message,
      userName: this.state.username,
      dateTime: time,
    });
  }

  renderRoom() {
    return axios.get('/renderRoom')
      .then(({ data }) => {
        const currentTime = Date.now();
        const timeLapsed = moment.duration(moment(currentTime).diff(data.start)).asSeconds();
        this.setState({
          playlist: data.videos,
          currentVideo: data.videos[data.index],
          startOptions: {
            playerVars: { start: Math.ceil(timeLapsed) },
          },
        });
      })
      .catch(err => console.error('Could not retrieve playlist: ', err));
  }

  render() {
    let playlistComponent;
    if (this.state.isHost) {
      playlistComponent = (<Playlist
        playlist={this.state.playlist}
        removeSelected={this.handleDelete}
        isHost={this.state.isHost}
      />);
    } else {
      playlistComponent = <Playlist playlist={this.state.playlist} />;
    }

    const view = this.state.user ?
      <span className="login">Welcome, {this.state.user} <a href="/auth/logout">Logout</a></span> :
      <span className="login">Login with <a href="/auth/google">Google</a></span>;

    return (
      <div className="room">
        <div className="container navbar">fam.ly {view}</div>
        {playlistComponent}
        <VideoPlayer
          currentVideo={this.state.currentVideo}
          opts={this.state.startOptions}
          onReady={this.onPlayerReady}
          onStateChange={this.onPlayerStateChange}
        />
        <Search saveToPlaylist={this.saveToPlaylist} />
        <ChatView
          message={this.state.message}
          date={this.state.dateTime}
          username={this.state.username}
          emitMessage={this.emitMessage}
        />
      </div>
    );
  }
}

// ReactDOM.render(<RoomView />, document.getElementById('room'));
