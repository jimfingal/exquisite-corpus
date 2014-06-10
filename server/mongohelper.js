
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var gracefulshutdown = require('./gracefulshutdown');
var config = require('./config');

var MongoClient = require('mongodb').MongoClient;
var db;

var initialized = false;
var closed = false;

var closeConnection = function() {
    if (!closed) {
        db.close();
        closed = true;
    }
};



var insertDocument = function(collection, doc, async_callback) {
    db.collection(collection).insert(doc, function(err, inserted) {
        if (err) {
          if (async_callback) {
              async_callback(err, inserted['_id']);
          }
        }
        if (async_callback) {
          async_callback(null, inserted['_id']);
        }
    });
};

var insertDocumentIfDoesntExist = function(collection, doc, async_callback) {

  db.collection(collection).findOne({'_id': doc['_id']}, function(err, exists) {
    if (err) {
      if (async_callback) {
        async_callback(err, 'error inserting doc');
      }
    } else {
      if (exists) {
        if (async_callback) {
          async_callback(null, doc['_id']);
        }
      } else {
        insertDocument(collection, doc, async_callback);
      }
    }
  });
};


var find = function(collection, query, callback) {
    db.collection(collection).find(query).toArray(callback);
};

var getDB = function() {
    return db;
};

var initDb = function(callback) {

  if (callback === undefined) {
    callback = function() {};
  }

  if (!initialized) {
      MongoClient.connect(config.mongo.CONNECTION, function(err, database) {
        if (err) {
          throw err;
        } else {
          initialized = true;
        }
        db = database;
        gracefulshutdown.addShutdownCallback(closeConnection);
        callback();
    });
  } else {
    callback();
  }
};


module.exports.insertDocumentIfDoesntExist = insertDocumentIfDoesntExist;
module.exports.insertDocument = insertDocument;
module.exports.find = find;
module.exports.initDb = initDb;
