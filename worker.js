var flow = require("asyncflow");

var mongohelper = require('./lib/mongohelper');
var bootstrap = require('./lib/bootstrap');
var streamhandler = require('./lib/streamhandler');
var config = require("./lib/config");

var initDb = flow.wrap(mongohelper.initDb);
var bootstrapThings = flow.wrap(bootstrap.insertAllFriendsAndFollowers);

flow(function() {

  console.log("Initializing DB");
  var done = initDb().wait();

  console.log("Moving on");
  if (config.twitter.bootstrap) {
    console.log("Bootstrapping");
    bootstrapThings(config.twitter.bootstrapuser).wait();
    console.log("Done");
  }

  streamhandler.streamUsersInDB();

});
