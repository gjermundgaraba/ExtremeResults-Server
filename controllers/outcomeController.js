var outcomeController = function (Outcome) {

    var post = function (req, res) {
        var outcome = new Outcome(req.body);

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
        Outcome.find(function (error, outcomes) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.json(outcomes);
            }
        });
    };

    return {
        post: post,
        get: get
    }

};

module.exports = outcomeController;