
var _ = require('underscore');
var async = require('async');
var twitterhelper = require('./twitterhelper');
var mongohelper = require('./mongohelper');
var config = require('./config');
var bootstrap = require('./bootstrap');

var MongoClient = require('mongodb').MongoClient;

var stream;
var user_ids = [];

var handleTweet = function(tweet) {
  if (_.indexOf(user_ids, tweet['id_str']) > -1) {
    console.log(tweet.screenname + " : " + tweet.text);
    mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, tweet);
  } else {
    console.log("Got tweet not from user: " + tweet.text);
    mongohelper.insertDocument(config.mongo.RETWEET_COLLECTION, tweet);
  }
};

var streamUsersInDB = function() {

  MongoClient.connect(config.mongo.CONNECTION, function(err, database) {

    if (err) throw err;

    database.collection(config.mongo.USER_COLLECTION).find({}).toArray(function(err, docs) {

      user_ids = _.map(docs, function(doc) {
        return doc['id_str'];
      });
      var follow = user_ids.join(',');
      database.close();

      var options = { 'follow' : follow};

      console.log("Starting stream with: " + follow);
      stream = twitterhelper.getStream(options, handleTweet);

    });
  });
};


if (config.twitter.bootstrap) {
  mongohelper.initDbThen(function() {
      bootstrap.insertAllFriendsAndFollowers(config.twitter.bootstrapuser, streamUsersInDB);
  });
} else {
  mongohelper.initDbThen(streamUsersInDB);
}


