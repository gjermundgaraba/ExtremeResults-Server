var express = require('express');
var moment = require('moment');

var routes = function (Outcome, Reflection) {
    var relatedRouter = express.Router();

    var relatedForOutcomesController = require('../controllers/relatedForOutcomesController')(Outcome, Reflection, moment);

    relatedRouter.route('/outcomes')
        .get(relatedForOutcomesController.get);

    return relatedRouter;
};

module.exports = routes;