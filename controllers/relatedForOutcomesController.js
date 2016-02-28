var relatedForOutcomesController = function (Outcome, Reflection, moment) {

    var get = function (req, res) {
        if (req.query.typeName === 'Daily') {
            var startOfWeek = moment().startOf('isoWeek');
            var endOfWeek = moment().endOf('isoWeek');

            var startOfYesterday = moment().startOf('day').subtract(1, 'days');
            var endOfYesterday = moment().endOf('day').subtract(1, 'days');

            var query = {
                $or: [
                    {
                        typeName: 'Weekly',
                        effectiveDate: {
                            $gte: startOfWeek.toDate(),
                            $lt: endOfWeek.toDate()
                        }
                    },
                    {
                        typeName: 'Daily',
                        effectiveDate: {
                            $gte: startOfYesterday.toDate(),
                            $lt: endOfYesterday.toDate()
                        }
                    }
                ]
            };

            Outcome.find(query, function (err, outcomes) {
               if (err) {
                   res.status(500).send(err);
               } else {
                   res.json(outcomes);
               }
            });
        } else if (req.query.typeName === 'Weekly') {
            var startOfLastWeek = moment().startOf('isoWeek').subtract(1, 'weeks');
            var endOfLastWeek = moment().endOf('isoWeek').subtract(1, 'weeks');

            var lastWeeksEntriesQuery = {
                typeName: 'Weekly',
                effectiveDate: {
                    $gte: startOfLastWeek.toDate(),
                    $lt: endOfLastWeek.toDate()
                }
            };

            Reflection.find(lastWeeksEntriesQuery, function (err, reflections) {
               if (err) {
                   res.status(500).send(err);
               } else {
                   Outcome.find(lastWeeksEntriesQuery, function (err, outcomes) {
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

module.exports = relatedForOutcomesController;