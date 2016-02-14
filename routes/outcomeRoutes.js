var express = require('express');

var routes = function (Outcome) {
    var outcomeRouter = express.Router();

    outcomeRouter.route('/')
        .get(function (req, res) {
            Outcome.find(function (error, outcomes) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.json(outcomes);
                }
            });
        })
        .post(function (req, res) {
            var outcome = new Outcome(req.body);
            outcome.save();
            res.status(201).send(outcome);
        });

    return outcomeRouter;

};

module.exports = routes;