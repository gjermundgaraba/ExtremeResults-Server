var outcomeController = function (Outcome) {

    var post = function (req, res) {
        var outcome = new Outcome();

        outcome.typeName = req.body.typeName;
        outcome.firstStory = req.body.firstStory;
        outcome.secondStory = req.body.secondStory;
        outcome.thirdStory = req.body.thirdStory;
        outcome.effectiveDate = req.body.effectiveDate;
        outcome.user = req.user._id;

        var validation = outcome.validateSync();
        if (validation) {
            res.status(400).send(validation.toString());
        } else {
            outcome.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.status(201).send(outcome);
                }
            });
        }
    };

    var get = function (req, res) {
        var query = {
            user: req.user._id
        };

        var mongooseQuery = Outcome.find(query);

        if (req.query.limit) {
            mongooseQuery.limit(parseInt(req.query.limit));
        }

        if (req.query.offset) {
            mongooseQuery.skip(parseInt(req.query.offset));
        }

        mongooseQuery.exec(function (error, outcomes) {
            if (error) {
                res.status(500).send(error);
            } else {
                var entries = [];

                outcomes.forEach(function (result) {
                    entries.push({
                        objectId: result._id,
                        typeName: result.typeName,
                        firstStory: result.firstStory,
                        secondStory: result.secondStory,
                        thirdStory: result.thirdStory,
                        effectiveDate: result.effectiveDate,
                        className: 'Outcome'
                    })
                });

                res.json(entries);
            }
        });
    };

    var getOutcomeId = function (req, res) {
        res.json(req.outcome);
    };

    var putOutcomeId = function (req, res) {
        req.outcome.typeName = req.body.typeName;
        req.outcome.firstStory = req.body.firstStory;
        req.outcome.secondStory = req.body.secondStory;
        req.outcome.thirdStory = req.body.thirdStory;
        req.outcome.effectiveDate = req.body.effectiveDate;

        var validation = req.outcome.validateSync();
        if (validation) {
            res.status(400).send(validation.toString());
        } else {
            req.outcome.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.json(req.outcome);
                }
            });
        }
    };

    var deleteOutcomeId = function (req, res) {
        req.outcome.remove(function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(204).send();
            }
        });
    };

    return {
        post: post,
        get: get,
        outcomeId: {
            get: getOutcomeId,
            put: putOutcomeId,
            delete: deleteOutcomeId
        }
    }

};

module.exports = outcomeController;