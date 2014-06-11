var express = require('express'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  flow = require("asyncflow"),
  config = require('./lib/config'),
  mongohelper = require('./lib/mongohelper'),
  timehelper = require('./lib/timehelper'),
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


var reduce = function(key, values) {
    return {'tweets': values};
};

app.get('/tweets/bytime/:buckets', function(req, res) {
  mongohelper.mapReduce(
    config.mongo.TWEET_COLLECTION,
    timehelper.mapper,
    reduce,
    timehelper.getScope(req.params.buckets, -7),
    function(err, results, stats) {
      console.log(err);
      res.json(results);
    }
  );
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


