var config = require('../lib/config');
var MongoClient = require('mongodb').MongoClient;

/*


db.tweets.mapReduce(mapFunction, reduceFunction, {out: { inline: 1 }})

*/

// > db.tweets.group({ key: {'user.screen_name': 1}, reduce: function(curr, result) { result['tweets'].push(curr.text);}, initial: {'tweets': []} });
// db.tweets.aggregate( { $group: { _id : "$user.screen_name",   ary: { $push: '$text'}}})


var map = function() {
    emit(this.user.screen_name, {'text': this.text, 'time': new Date(this.created_at)});
};

var reduce = function(key, values) {

    // MongoDB can invoke the reduce function more than once for the same key. 
    // In this case, the previous output from the reduce function for that key 
    // will become one of the input values to the next reduce function invocation 
    // for that key.
    var result = {'tweets' : []};

    values.forEach(function(value) {

      if (value["tweets"]) {
        asfasdf;
        result = {'tweets': result["tweets"].concat(value["tweets"])};
      } else {
        result["tweets"].push(value);
      }
    });

    return {'tweets': result};
};

var mapReduce = function(mapper, reducer) {
    MongoClient.connect(config.mongo.LOCAL_CONNECTION, function(err, db) {

        console.log(config.mongo.TWEET_COLLECTION);
        db.collection(config.mongo.TWEET_COLLECTION).mapReduce(
            mapper,
            reducer,
            { out: { inline: 1}, verbose: true},
            function(err, results, stats) {
              console.log(err);
              console.log(results);
              console.log(stats);
              db.close();
            }
        );
    });
};

var SECS_IN_DAY = 60 * 60 * 24;
var MS_IN_DAY = SECS_IN_DAY * 1000;

var secsSoFarToday = function(unixtime) {
  return (unixtime / 1000) % SECS_IN_DAY;
};

var bucketGivenNChunks = function(unixtime, n) {
  var secs_so_far = secsSoFarToday(unixtime);
  var bucket_size = SECS_IN_DAY / n;
  var bucket = Math.floor(secs_so_far / bucket_size);
  return bucket;
};

var mapper = function() {

    var SECS_IN_HOUR = 60 * 60;
    var SECS_IN_DAY = SECS_IN_HOUR * 24;
    var MS_IN_DAY = SECS_IN_DAY * 1000;

    var secsSoFarToday = function(unixtime) {
//      return ((unixtime / 1000)) % SECS_IN_DAY;
      return ((unixtime / 1000) + (SECS_IN_HOUR * utc_offset)) % SECS_IN_DAY;
    };

    var bucketGivenNChunks = function(unixtime, n) {
      var secs_so_far = secsSoFarToday(unixtime);
      var bucket_size = SECS_IN_DAY / n;
      var bucket = Math.floor(secs_so_far / bucket_size);
      return bucket;
    };

    emit(
      bucketGivenNChunks((new Date(this.created_at)).getTime(), num_buckets),
      {
        'id_str' : this.id_str,
        'screen_name': this.user.screen_name,
        'text': this.text,
        'time': this.created_at
      }
    );
};

var getScope = function(buckets, utc_offset) {

    var tscope = {
        'out': { 'inline': 1},
        'verbose': true,
        'scope': {
            'num_buckets': buckets,
            'utc_offset': utc_offset
        }
    };

    return tscope;
};




var reduce = function(key, values) {

    // MongoDB can invoke the reduce function more than once for the same key. 
    // In this case, the previous output from the reduce function for that key 
    // will become one of the input values to the next reduce function invocation 
    // for that key.
    var result = {'tweets' : []};

    values.forEach(function(value) {

      if (value["tweets"] !== undefined) {
        var tweet_array = value["tweets"];
        var combined_array = result["tweets"].concat(tweet_array);
        result = {'tweets': combined_array};
      } else {
        result["tweets"].push(value);
      }
    });

    return {'tweets': result};
};


var reduceByPerson = function(key, values) {

    var breakdown = {};

    for (var i in values) {
      tweet_list.tweets = tweet_list.tweets.concat(values[1]);
    }  

    values.forEach(function(tweet) {

      //tweet = 

      if (!tweet['screen_name']) {
        print("Bad tweet " + tweet);
      }

      if (tweet['screen_name'] in breakdown) {
        breakdown[tweet['screen_name']].push(tweet);
      } else {
        breakdown[tweet['screen_name']] = [];
        breakdown[tweet['screen_name']].push(tweet);
      }

    });

    return breakdown;
};



mapReduce(map, reduce);


var map2 = function() {
    emit(new Date(this.created_at), {'screen_name': this.user.screen_name, 'text': this.text});
};

mapReduce(map2, reduce);


