
var Twit = require('twit');
var gracefulshutdown = require('./gracefulshutdown');
var config = require('./config');
var async = require('async');

var T = new Twit({
    consumer_key: config.twitter.CONSUMER_KEY
  , consumer_secret: config.twitter.CONSUMER_SECRET
  , access_token: config.twitter.ACCESS_TOKEN
  , access_token_secret: config.twitter.ACCESS_TOKEN_SECRET
});


var getStream = function(stream_options, tweet_callback) {

    // See: https://dev.twitter.com/docs/streaming-apis/parameters#locations
    var stream = T.stream('statuses/filter', stream_options);

    stream.on('tweet', function(tweet) {
        tweet_callback(tweet);
    });

    stream.on('limit', console.log);
    stream.on('warning', console.log);
    stream.on('disconnect', console.log);

    // Don't double-stop
    var stop = function() {
      if (stream.request) {
        stream.stop();
      }
    };

    gracefulshutdown.addShutdownCallback(stop);

};


// Followers
// "https://dev.twitter.com/docs/api/1.1/get/followers/ids"

var twitterCall = function(path, params, callback) {
  T.get(path, params, callback);
};


var getFriends = function(username, options, callback) {

  var params = _.clone(options);
  params['screen_name'] = username;
  if (!_.has(params, 'count')) {
    params['count'] = 200;
  }
  twitterCall('friends/list', params, callback);

};


var browseWholeCursor = function again(path, params, callback) {

  var cursor = -1;

  async.doWhilst(
      // Fn
      function(cb) {

        var params_cursed = _.clone(params);

        if (cursor !== -1) {
          params_cursed['cursor'] = cursor;
        }

        T.get(path, params_cursed, function(err, data, response) {
          console.log('Got data:' + data);
            if (err) {
              console.log(error);
              cursor = 0;
            }
            cursor = data['next_cursor'];
            callback(data);
        });

      },
      // test
      function() {
        return cursor !== 0;
      },
      // callback
      function(err) {
        return;
      }
  );
};


module.exports.getStream = getStream;
module.exports.getFriends = getFriends;
module.exports.twitterCall = twitterCall;
module.exports.browseWholeCursor = browseWholeCursor;

