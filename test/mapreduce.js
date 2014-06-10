var config = require('../server/config');
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
    return {'tweets': values};
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

mapReduce(map, reduce);


var map2 = function() {
    emit(new Date(this.created_at), {'screen_name': this.user.screen_name, 'text': this.text});
};

mapReduce(map2, reduce);


