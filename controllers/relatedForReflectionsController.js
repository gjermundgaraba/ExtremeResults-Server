var relatedForReflectionsController = function (Outcome, Reflection, moment) {

    var get = function (req, res) {
        if (req.query.typeName === 'Weekly') {
            var startOfThisWeek  = moment().startOf('isoWeek');
            var endOfThisWeek  = moment().endOf('isoWeek');
            var startOfLastWeek = moment().startOf('isoWeek').subtract(1, 'weeks');
            var endOfLastWeek = moment().endOf('isoWeek').subtract(1, 'weeks');

            var lastWeeksEntriesQuery = {
                user: req.user._id,
                typeName: 'Weekly',
                effectiveDate: {
                    $gte: startOfLastWeek.toDate(),
                    $lt: endOfLastWeek.toDate()
                }
            };

            var thisWeeksEntriesQuery = {
                user: req.user._id,
                typeName: 'Weekly',
                effectiveDate: {
                    $gte: startOfThisWeek.toDate(),
                    $lt: endOfThisWeek.toDate()
                }
            };

            Reflection.find(lastWeeksEntriesQuery, function (err, reflections) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    Outcome.find(thisWeeksEntriesQuery, function (err, outcomes) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.json(reflections.concat(outcomes));
                        }
                    });
                }
            });
        } else {
            // Not supported
            res.status(400).send();
        }
    };

    return {
        get: get
    }

};

module.exports = relatedForReflectionsController;