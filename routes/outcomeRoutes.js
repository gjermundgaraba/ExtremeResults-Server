var express = require('express');

var routes = function (Outcome) {
    var outcomeRouter = express.Router();

    var outcomeController = require('../controllers/outcomeController')(Outcome);

    outcomeRouter.route('/')
        .get(outcomeController.get)
        .post(outcomeController.post);

    outcomeRouter.use('/:outcomeId', function (req, res, next) {
        Outcome.findById(req.params.outcomeId, function (err, outcome) {
            if (err) {
                res.status(500).send(err);
            } else if (outcome) {
                req.outcome = outcome;
                next();
            } else {
                res.status(404).send('No outcome with that id found');
            }
        });
    });
    outcomeRouter.route('/:outcomeId')
        .get(outcomeController.outcomeId.get)
        .put(outcomeController.outcomeId.put)
        .delete(outcomeController.outcomeId.delete);

    return outcomeRouter;

};

module.exports = routes;