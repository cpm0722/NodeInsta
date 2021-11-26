const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Message = require('./message');
const Image = require('./image');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Message = Message;
db.Image = Image;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Message.init(sequelize);
Image.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Message.associate(db);
Image.associate(db);

module.exports = db;
