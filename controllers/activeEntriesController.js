var logicalEntrySorter = require('../utils/logicalEntrySorter');

var activeEntriesController = function (Outcome, moment) {

    var get = function (req, res) {
        var startOfToday = moment().startOf('day');
        var endOfToday = moment().endOf('day');
        var startOfWeek = moment().startOf('isoWeek');
        var endOfWeek = moment().endOf('isoWeek');
        var startOfMonth = moment().startOf('month');
        var endOfMonth = moment().endOf('month');

        var query = {
            $or: [
                {
                    user: req.user._id,
                    typeName: 'Daily',
                    effectiveDate: {
                        $gte: startOfToday.toDate(),
                        $lt: endOfToday.toDate()
                    }
                },
                {
                    user: req.user._id,
                    typeName: 'Weekly',
                    effectiveDate: {
                        $gte: startOfWeek.toDate(),
                        $lt: endOfWeek.toDate()
                    }
                },
                {
                    user: req.user._id,
                    typeName: 'Monthly',
                    effectiveDate: {
                        $gte: startOfMonth.toDate(),
                        $lt: endOfMonth.toDate()
                    }
                }
            ]
        };

        Outcome.find(query, null, {sort: '-effectiveDate'}, function (err, queryResults) {
            if (err) {
                res.status(500).send(err);
            } else {
                var entries = [];

                queryResults.forEach(function (result) {
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
                
                logicalEntrySorter.performSort(entries);

                res.json(entries);
            }
        })

    };

    return {
        get: get
    }

};

module.exports = activeEntriesController;