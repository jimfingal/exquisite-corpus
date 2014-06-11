var SECS_IN_DAY = 60 * 60 * 24;
var MS_IN_DAY = SECS_IN_DAY * 1000;

var secsSoFarToday = function(unixtime) {
  return (unixtime / 1000) % SECS_IN_DAY;
};

var bucketGivenNChunks = function(secs_so_far, n) {
  var bucket_size = SECS_IN_DAY / n;
  var bucket = Math.floor(secs_so_far / bucket_size);
  return bucket;
};


module.exports.SECS_IN_DAY = SECS_IN_DAY;
module.exports.MS_IN_DAY = MS_IN_DAY;
module.exports.secsSoFarToday = secsSoFarToday;
module.exports.bucketGivenNChunks = bucketGivenNChunks;
