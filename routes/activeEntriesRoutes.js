var express = require('express');
var moment = require('moment');

var routes = function (Outcome) {
    var activeEntriesRouter = express.Router();

    var activeEntriesController = require('../controllers/activeEntriesController')(Outcome, moment);

    activeEntriesRouter.route('/')
        .get(activeEntriesController.get);

    return activeEntriesRouter;
};

module.exports = routes;