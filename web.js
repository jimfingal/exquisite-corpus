var express = require('express'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  flow = require("asyncflow"),
  config = require('./lib/config'),
  mongohelper = require('./lib/mongohelper'),
  io = require('socket.io');

var app = express();

app.set('port', config.web.PORT);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', function(req, res) {
  res.render('index', {
      title: "Twitterlytics"
    });
});

var secsinday = 60 * 60 * 24;

var secsSoFarToday = function(unixtime) {
  return (unixtime / 1000) % secsinday;
};

var bucketGivenNChunks = function(secs_so_far, n) {
  var bucket_size = secsinday / n;
  console.log("Secs so far: " + secs_so_far);
  console.log("Bockets: " + n);
  console.log("Bucket Size: " + bucket_size);
  var bucket = Math.round(secs_so_far / bucket_size);
  console.log("Bucket: " + bucket);
  return bucket;
};

var map = function() {
  emit(new Date(this.created_at), {'screen_name': this.user.screen_name, 'text': this.text});
};

var reduce = function(key, values) {
    return {'tweets': values};
};

app.get('/users', function(req, res) {
  mongohelper.mapReduce(config.mongo.TWEET_COLLECTION, map, reduce, function(err, results, stats) {
    res.json(results);
  });
});



var initDb = flow.wrap(mongohelper.initDb);

flow(function() {
  console.log("Initializing DB");
  var done = initDb().wait();

  console.log("Starting Server");
  var server = http.createServer(app);
  var serverio = io.listen(server);

  serverio.sockets.on('connection', function(socket) {
    // TODO
  });

  server.listen(app.get('port'));


  console.log('Listening on: ' + app.get('port'));

  //console.log("Listening to stream");
  //streamhandler.streamUsersInDB();
});


