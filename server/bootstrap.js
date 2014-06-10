var _ = require('underscore');
var async = require('async');
var twitterhelper = require('./twitterhelper');
var mongohelper = require('./mongohelper');
var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var ObjectID = require('mongodb').ObjectID;


var getObjectID = function(str) {
  var hash = crypto.createHash('sha1').update(str).digest('hex').substring(0, 24);
  console.log(hash);
  var o_id = new ObjectID.createFromHexString(hash);
  return o_id;
};


var insertUser = function(userdoc, async_callback) {
  console.log("Inserting user: " + userdoc["name"]);
  var usercopy = _.clone(userdoc);
  usercopy['_id'] = getObjectID(usercopy['id_str']);
  mongohelper.insertDocumentIfDoesntExist(config.mongo.USER_COLLECTION, usercopy, async_callback);
};

var logError = function(err) {
  console.log(err);
};


var insertThisUser = function(screen_name, async_callback) {
  twitterhelper.twitterCall('users/show', {
    'screen_name' : screen_name
  }, function(err, data, response) {
      insertUser(data, async_callback);
  });
};

var getInsertArray = function(user_array) {

  var insert_array = [];

  _.each(user_array, function(user) {
    var func = function(callback) {
      insertUser(user, callback);
    };
    insert_array.push(func);
  });

  return insert_array;

};


var insertUserFriends = function(screen_name, async_callback) {

  twitterhelper.twitterCall('friends/list', {
    'screen_name': screen_name,
    'count': 200
  }, function(err, data, response) {
      console.log('Processing Friends of ' + screen_name);
      console.log(err);
      var insert_users = getInsertArray(data['users']);
      async.parallel(insert_users, function(err, results) {
          if (!err) {
            async_callback(null, "friends");
          }
      });
  });
};

var insertUserFollowers = function(screen_name, async_callback) {

  twitterhelper.twitterCall('followers/list', {
    'screen_name': screen_name,
    'count': 200
  }, function(err, data, response) {
      console.log('Processing Followers of ' + screen_name);
      console.log(err);

      var insert_users = getInsertArray(data['users']);
      async.parallel(insert_users, function(err, results) {
          if (!err) {
            async_callback(null, "followers");
          }
      });
  });

};

var insertAllFriendsAndFollowers = function(screen_name, final_callback) {

  async.parallel([
    function(callback) {
      insertThisUser(screen_name, callback);
    },
    function(callback) {
      insertUserFriends(screen_name, callback);
    },
    function(callback) {
      insertUserFollowers(screen_name, callback);
    }
  ],
  // Final callback
  function(err, results) {
    if (!err) {
      if (final_callback) {
        console.log("No error, calling final callback");
        final_callback();
      } else {
        console.log("No error and no final callback");
      }
    } else {
      console.log("Got an error, not calling callback");
      console.log(err);
      process.exit();
    }
  });
};









module.exports.insertAllFriendsAndFollowers = insertAllFriendsAndFollowers;



