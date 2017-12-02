require('dotenv').config();
const Sequelize = require('sequelize');

let params = {};
if (!process.env.LOCAL) {
  params = {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: { ssl: true },
  };
}
const sequelize = new Sequelize(process.env.DATABASE_URL, params);

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully'))
  .catch(err => console.error('Unable to connect to database:', err));

const Users = sequelize.define('users', {
  google_id: Sequelize.STRING,
  google_name: Sequelize.STRING,
  google_avatar: Sequelize.STRING,
});

const Video = sequelize.define('video', {
  videoName: Sequelize.STRING,
  creator: Sequelize.STRING,
  url: Sequelize.STRING,
  description: Sequelize.STRING,
});

/* not used?? */
// const Playlist = sequelize.define('playlist', {
//   playlistName: Sequelize.STRING,
// });

// TODO we will need to refer to the Room ID when there are multiple room instances
const Room = sequelize.define('room', {
  indexKey: Sequelize.INTEGER,
  startTime: Sequelize.DATE,

});

// This is a join table to deal with multiple rooms each having videos
const RoomVideos = sequelize.define('roomvideos', {
  playlistPosition: Sequelize.INTEGER,
  votes: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});
Video.belongsToMany(Room, { through: RoomVideos });
Room.belongsToMany(Video, { through: RoomVideos });

// uncomment this first time running, then comment
// Video.sync({ force: true });
// Room.sync({ force: true });
// Users.sync({ force: true });
// RoomVideos.sync({ force: true });

// Seed room table to avoid errors
Room.findOrCreate({ where: { id: 1 } })
  .catch(err => console.log('Error in Sequelize: ', err));

const createVideoEntry = (videoData, roomId) => {
  console.log(videoData);
  const videoEntry = {
    videoName: videoData.title,
    creator: videoData.creator,
    url: videoData.url,
    description: videoData.description,
  };
  return Video.findOrCreate({ where: { url: videoData.url }, defaults: videoEntry })
    .spread((video) => {
      RoomVideos.create({
        videoId: video.id,
        roomId,
      });
      console.log('DONE CREATING ROOMVIDEOS');
    }) // returns a promise when called
    .catch(err => console.log('Error creating RoomVideos: ', err));
};

// Room Queries
const findRooms = () => Room.findAll();

const getRoomProperties = roomId => Room.findById(roomId)
  .then(room => room.dataValues);

// used to play next video in queue - see queueNextVideo in index.js
const incrementIndex = roomId => Room.findById(roomId)
  .then(room => room.increment('indexKey'));

// used to play next video in queue - see queueNextVideo in index.js
const resetRoomIndex = roomId => Room.findById(roomId)
  .then(room => room.update({ indexKey: 0 }));

const getIndex = (roomId) => {
  console.log('getIndex request. roomId is: ', roomId);
  return Room.findById(roomId)
    .then((room) => {
      console.log('room.indexKey is: ', room.indexKey);
      return room.indexKey;
    });
};

const setStartTime = roomId => Room.findById(roomId)
  .then(room => (
    room.update({
      startTime: Date.now(),
    })
  ));


// Video Queries
const findVideos = () => Video.findAll();

const getRoomVideos = roomId => Room.findById(roomId)
  .then(room => room.getVideos());

const removeFromPlaylist = (title, roomId) => {
  let room;
  return Room.findById(roomId)
    .then((roomFound) => {
      room = roomFound;
      return Video.find({ where: { videoName: title } });
    })
    .then(video => room.removeVideo(video)) // removeVideo is from sequelize
    .catch(err => console.log('Error removing video: ', err));
};

const findUser = user => Users.findAll({ where: { google_name: user } });

const saveGoogleUser = googleProfile => (
  Users.create({
    google_id: googleProfile.id,
    google_name: googleProfile.displayName,
    google_avatar: googleProfile.photos[0].value,
  })
    .catch(err => console.log('Error saving user: ', err))
);

const vote = (room, video) => {return RoomVideos.update({ votes: Sequelize.literal('votes + 1') }, { where: { videoId: video }})}

exports.Room = Room;
exports.findUser = findUser;
exports.roomVideos = RoomVideos;
exports.getRoomVideos = getRoomVideos;
exports.findRooms = findRooms;
exports.createVideoEntry = createVideoEntry;
exports.getRoomProperties = getRoomProperties;
exports.incrementIndex = incrementIndex;
exports.resetRoomIndex = resetRoomIndex;
exports.getIndex = getIndex;
exports.setStartTime = setStartTime;
exports.findVideos = findVideos;
exports.removeFromPlaylist = removeFromPlaylist;
exports.db = sequelize;
exports.saveGoogleUser = saveGoogleUser;
exports.Users = Users;
exports.vote = vote;
