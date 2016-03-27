var express = require('express');
var moment = require('moment');

var routes = function (Outcome, passport) {
    var activeEntriesRouter = express.Router();

    var activeEntriesController = require('../controllers/activeEntriesController')(Outcome, moment);

    activeEntriesRouter.use(passport.authenticate('bearer', { session: false }));

    activeEntriesRouter.route('/')
        .get(activeEntriesController.get);

    return activeEntriesRouter;
};

module.exports = routes;