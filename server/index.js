const http = require('http');
const express = require('express');
const youtubeApi = require('./youtubeService');
const db = require('../database/postgres');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoutes = require('./auth-routes');
require('../passport-setup');

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.static(`${__dirname}./../client`));
const roomSpace = io.of('/room');

// const lobbySpace = io.of('/lobby');

app.use(cookieSession({
  keys: process.env.COOKIEKEY,
  maxAge: 24 * 60 * 60 * 1000, // one day
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

// Room HTTP Requests
app.get('/room/:roomId', (req, res) => {
  const roomId = Number(req.params.roomId);
  const roomProperties = {};
  db.roomVideos.findAll();
  db.findVideos(/*roomId*/) // we will find by room id!
    .then((videos) => {
      roomProperties.videos = videos;
      return db.getRoomProperties(roomId);
    })
    .then(({ indexKey, startTime }) => {
      roomProperties.index = indexKey;
      roomProperties.start = startTime;
    })
    .then(() => res.json(roomProperties))
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.get('/rooms', (req, res) => {
  db.findRooms()
    .then(rooms => res.json(rooms));
});

app.get('/search', (req, res) => {
  youtubeApi.grabVideos(req.query.query)
    .then(searchResults => res.json(searchResults))
    .catch(() => res.sendStatus(404));
});

app.patch('/playNext/:length', (req, res) => {
  const roomPlaylistLength = Number(req.params.length);

  const sendIndex = ({ indexKey }) => {
    roomSpace.emit('playNext', indexKey);
  };

  const queueNextVideo = (playlistLength, currentIndex) => {
    if (playlistLength === currentIndex) return db.resetRoomIndex();
    return db.incrementIndex();
  };

  db.getIndex()
    .then(currentSongIndex => queueNextVideo(roomPlaylistLength, currentSongIndex))
    .then(room => sendIndex(room.dataValues))
    // Update this 1 to roomId after this route has access
    .then(() => db.setStartTime(1))
    .then(() => res.end())
    .catch(err => res.send(err));
});

// Room Socket Events
let roomHost;
const giveHostStatus = host => roomSpace.to(host).emit('host');

// Get users
app.get('/users', (req, res) => {
  db.findUser(req.query.user)
    .then(data => {
      res.send(data[0].dataValues);
    });
});

roomSpace.on('connection', (socket, roomId) => {
  console.log(`connected to ${Object.keys(socket.nsp.sockets).length} socket(s)`);
  roomSpace.to(socket.id).emit('id', socket.id);
  if (Object.keys(socket.nsp.sockets).length === 1) {
    roomHost = socket.id;
    giveHostStatus(roomHost);
  }

  console.log('DOES SERVER ROOM ID exists?!', roomId);
  roomId ? console.log('ROOM ID exists from socket connection:', roomId) : roomId = 1;
  console.log('ROOM ID after ternary:', roomId);

  const sendPlaylist = (roomId) => (
    db.findVideos(roomId)
      .then((videos) => {
        roomSpace.emit('retrievePlaylist', videos);
        if (videos.length === 0) throw videos;
        if (videos.length >= 1) db.setStartTime(roomId);
      })
      .catch((emptyPlaylist) => {
        // Check if the thrown item is an array rather than an Error
        if (Array.isArray(emptyPlaylist)) {
          roomSpace.emit('default');
        } else {
          throw emptyPlaylist;
        }
      })
      .catch(err => roomSpace.emit('error', err))
  );

  socket.on('saveToPlaylist', (video) => {
    const videoData = {
      title: video.snippet.title,
      creator: video.snippet.channelTitle,
      url: video.id.videoId,
      description: video.snippet.description,
    };
    return db.createVideoEntry(videoData, 1) // this 1 needs to be a variable for roomId!!!
      .then(() => sendPlaylist(roomId));
  });

  socket.on('removeFromPlaylist', (videoName) => {
    db.removeFromPlaylist(videoName)
      .then(() => sendPlaylist(roomId))
      .catch(err => roomSpace.emit('error', err));
  });

  socket.on('emitMessage', (message) => {
    // message.userName = message.userName.split('#')[1].substring(0, 8); // Pluck Socket ID
    // let sum = 0;
    // for (let i = 0; i < 3; i += 1) {
    //   sum += message.userName.charCodeAt(i);
    // }
    // const colors = ['#ffb3ba', '#ffd2b3', '#fff8b3', '#baffb3', '#bae1ff', '#e8baff'];
    // const userColor = colors[(sum % colors.length)];
    // message.userColor = userColor;
    roomSpace.emit('pushingMessage', message);
  });

  socket.on('disconnect', () => {
    if (Object.keys(socket.nsp.sockets).length > 0) {
      const newHost = Object.keys(socket.nsp.sockets)[0];
      console.log(`A user has disconnected from ${roomSpace.name}`);
      return (newHost === roomHost) ? null : giveHostStatus(newHost);
    }
    console.log(`${roomSpace.name} is now empty`);
  });
});
