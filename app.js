var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db;

if (process.env.ENV === 'test') {
    db = mongoose.connect('mongodb://localhost/xr_it');
} else {
    db = mongoose.connect('mongodb://localhost/xr');
}

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var Outcome = require('./models/outcomeModel');
var Reflection = require('./models/reflectionModel');
var HotSpotBucket = require('./models/hotSpotBucketModel');

var outcomeRouter = require('./routes/outcomeRoutes')(Outcome);
var reflectionRouter = require('./routes/reflectionRoutes')(Reflection);
var hotSpotBucketRouter = require('./routes/hotSpotBucketRoutes')(HotSpotBucket);
var relatedRouter = require('./routes/relatedRoutes')(Outcome, Reflection);
var activeEntriesRouter = require('./routes/activeEntriesRoutes')(Outcome);

app.use('/api/outcomes', outcomeRouter);
app.use('/api/reflections', reflectionRouter);
app.use('/api/hotSpotBuckets', hotSpotBucketRouter);
app.use('/api/related', relatedRouter);
app.use('/api/activeEntries', activeEntriesRouter);


var server = app.listen(port);

server.on('close', function () {
    mongoose.connection.close();
});

module.exports = server;