var _ = require('underscore');
var async = require('async');
var twitterhelper = require('./twitterhelper');
var mongohelper = require('./mongohelper');
var config = require('./config');



var insertUser = function(userdoc) {
  mongohelper.insertDocument(config.mongo.USER_COLLECTION, userdoc);
};

var logError = function(err) {
  console.log(err);
};


var insertThisUser = function(screen_name) {
  twitterhelper.twitterCall('users/show', {
    'screen_name' : screen_name
  }, function(err, data, response) {
      insertUser(data);
  });
};

var insertUserFriends = function(screen_name) {

  twitterhelper.twitterCall('friends/list', {
    'screen_name': screen_name,
    'count': 200
  }, function(err, data, response) {
      console.log('Processing Friends of ' + screen_name);
      console.log(err);
      _.each(data['users'], insertUser);
  });


};

var insertUserFollowers = function(screen_name) {

  twitterhelper.twitterCall('followers/list', {
    'screen_name': screen_name,
    'count': 200
  }, function(err, data, response) {
      console.log('Processing Followers of ' + screen_name);
      console.log(err);
      _.each(data['users'], insertUser);
  });

};

var insertAllFriendsAndFollowers = function(screen_name) {

  insertThisUser(screen_name);
  insertUserFriends(screen_name);
  insertUserFollowers(screen_name);

};


module.exports.insertAllFriendsAndFollowers = insertAllFriendsAndFollowers;


if (config.twitter.bootstrap) {
  insertAllFriendsAndFollowers(config.twitter.bootstrapuser);
}
