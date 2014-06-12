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


app.get('/tweets/', function(req, res) {
  mongohelper.aggregate(
    config.mongo.TWEET_COLLECTION,
    [{ $project:
        {'id_str': 1,
          'text': 1,
          'created_at': 1,
          'screen_name': '$user.screen_name'
        }
      },
      { $sort: {'created_at': 1} }
    ],
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


