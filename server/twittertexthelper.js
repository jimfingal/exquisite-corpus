var twittertext = require('twitter-text');
var _ = require('underscore');

var removeAllTwitterEntities = function(text) {

    var entity_indexes = []
    _.each(twittertext.extractEntitiesWithIndices(text), function(entity) { 
        entity_indexes.push(entity['indices']);
    });

    var new_text = text;
    _.each(entity_indexes.reverse(), function(indexes) {
        new_text = new_text.slice(0, indexes[0]) + new_text.slice(indexes[1]);
    });

    return new_text.trim();
};


module.exports.removeAllTwitterEntities = removeAllTwitterEntities
