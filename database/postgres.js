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
const Playlist = sequelize.define('playlist', {
  playlistName: Sequelize.STRING,
});

// TODO we will need to refer to the Room ID when there are multiple room instances
const Room = sequelize.define('room', {
  indexKey: Sequelize.INTEGER,
  startTime: Sequelize.DATE,
});

// uncomment this first time running, then comment
Video.sync({ force: true })
Room.sync({ force: true })
Users.sync({ force: true })

const createVideoEntry = (videoData) => {
  const videoEntry = {
    videoName: videoData.title,
    creator: videoData.creator,
    url: videoData.url,
    description: videoData.description,
  };
  return Video.create(videoEntry); // returns a promise when called
};

// Room Queries
const findRooms = () => Room.findAll();
const getRoomProperties = () => Room.findById(1).then(room => room.dataValues);
const incrementIndex = () => Room.findById(1).then(room => room.increment('indexKey'));
const resetRoomIndex = () => Room.findById(1).then(room => room.update({ indexKey: 0 }));
const getIndex = () => Room.findById(1).then(room => room.dataValues.indexKey);
const setStartTime = () => Room.findById(1).then(room => room.update({ startTime: Date.now() }));

// Video Queries
const findVideos = () => Video.findAll();
const removeFromPlaylist = title => Video.find({ where: { videoName: title } })
  .then(video => video.destroy());

const saveGoogleUser = function(googleProfile) {
  return Users.create({
    google_id: googleProfile.id, // eslint-disable-line camelcase
    google_name: googleProfile.name.givenName, // eslint-disable-line camelcase
    google_avatar: googleProfile.photos[0].value // eslint-disable-line camelcase
  })
    .catch(err => console.log('Error saving user: ', err));
};

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
