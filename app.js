var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/xr');

var Outcome = require('./models/outcomeModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var outcomeRouter = require('./routes/outcomeRoutes')(Outcome);

app.use('/api/outcomes', outcomeRouter);

app.get('/', function(request, response) {
    response.send('Hello World!!!');
});

app.listen(port, function () {
    console.log('Extreme Results server running on PORT: ' + port);
});