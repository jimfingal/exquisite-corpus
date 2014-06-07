
var _ = require('underscore');
var async = require('async');
var twitterhelper = require('./twitterhelper');
var mongohelper = require('./mongohelper');
var config = require('./config');
var bootstrap = require('./bootstrap');

var MongoClient = require('mongodb').MongoClient;


if (config.twitter.bootstrap) {
  bootstrap.insertAllFriendsAndFollowers(config.twitter.bootstrapuser);
}


var handleTweet = function(tweet) {
  console.log(tweet);
  mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, tweet);
};

var stream;

var streamUsersInDB = function() {

  MongoClient.connect(config.mongo.CONNECTION, function(err, database) {

    if (err) throw err;

    database.collection(config.mongo.USER_COLLECTION).find({}).toArray(function(err, docs) {

      var user_ids = _.map(docs, function(doc) {
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

// streamUsersInDB();



