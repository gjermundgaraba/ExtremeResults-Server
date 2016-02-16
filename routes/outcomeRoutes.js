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
            outcome.save(function (err) {
                if (err) {
                    res.status(500).send(error);
                } else {
                    res.status(201).send(outcome);
                }
            });
        });

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
        .get(function (req, res) {
            res.json(req.outcome);
        })
        .put(function (req, res) {
            req.outcome.typeName = req.body.typeName;
            req.outcome.firstStory = req.body.firstStory;
            req.outcome.secondStory = req.body.secondStory;
            req.outcome.thirdStory = req.body.thirdStory;
            req.outcome.effectiveDate = req.body.effectiveDate;
            req.outcome.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.json(req.outcome);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }

            for (var outcomeField in req.body) {
                req.outcome[outcomeField] = req.body[outcomeField];
            }

            req.outcome.save(function (err) {
                if (err) {
                    res.status(500).send(error);
                } else {
                    res.json(req.outcome);
                }
            });
        })
        .delete(function (req, res) {
            req.outcome.remove(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.status(204).send();
                }
            });
        });

    return outcomeRouter;

};

module.exports = routes;