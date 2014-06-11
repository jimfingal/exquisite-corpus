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


module.exports.SECS_IN_DAY = SECS_IN_DAY;
module.exports.MS_IN_DAY = MS_IN_DAY;
module.exports.secsSoFarToday = secsSoFarToday;
module.exports.bucketGivenNChunks = bucketGivenNChunks;
module.exports.mapper = mapper;
module.exports.getScope = getScope;
