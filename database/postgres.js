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
// Video.sync({ force: true });
// Room.sync({ force: true });

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
const getRoomProperties = () => Room.findById(1).then(room => room.dataValues);
const incrementIndex = () => Room.findById(1).then(room => room.increment('indexKey'));
const resetRoomIndex = () => Room.findById(1).then(room => room.update({ indexKey: 0 }));
const getIndex = () => Room.findById(1).then(room => room.dataValues.indexKey);
const setStartTime = () => Room.findById(1).then(room => room.update({ startTime: Date.now() }));

// Video Queries
const findVideos = () => Video.findAll();
const removeFromPlaylist = title => Video.find({ where: { videoName: title } })
  .then(video => video.destroy());

exports.createVideoEntry = createVideoEntry;
exports.getRoomProperties = getRoomProperties;
exports.incrementIndex = incrementIndex;
exports.resetRoomIndex = resetRoomIndex;
exports.getIndex = getIndex;
exports.setStartTime = setStartTime;
exports.findVideos = findVideos;
exports.removeFromPlaylist = removeFromPlaylist;
