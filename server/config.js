var config = {};

config.mongo = {};
config.web = {};
config.twitter = {};
config.geo = {};
config.process = {};
config.lang = {};

config.web.PORT = process.env.PORT || 3000;

config.twitter.CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY_SENTIMENTAL;
config.twitter.CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET_SENTIMENTAL;
config.twitter.ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_SENTIMENTAL;
config.twitter.ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET_SENTIMENTAL;

config.process.SHUTDOWN_WAIT = 2;

config.twitter.bootstrap = true;
config.twitter.bootstrapuser = "jimfingal";

var DB_NAME = "sentimentaled";

config.mongo.LOCAL_CONNECTION = "mongodb://127.0.0.1:27017/" + DB_NAME;
config.mongo.CONNECTION = process.env.MONGOHQ_URL || config.mongo.LOCAL_CONNECTION;
config.mongo.LOCAL_MONGOHQ = process.env.LOCAL_MONGOHQ;

config.mongo.USER_COLLECTION = "users";
config.mongo.TWEET_COLLECTION = "tweets";


config.twitter.ENABLE_STREAM = true;

module.exports = config;
