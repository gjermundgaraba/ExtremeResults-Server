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

var outcomeRouter = require('./routes/outcomeRoutes')(Outcome);
var reflectionRouter = require('./routes/reflectionRoutes')(Reflection);

app.use('/api/outcomes', outcomeRouter);
app.use('/api/reflections', reflectionRouter);


var server = app.listen(port);

server.on('close', function () {
    mongoose.connection.close();
});

module.exports = server;