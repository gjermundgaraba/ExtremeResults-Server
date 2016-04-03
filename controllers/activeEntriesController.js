var activeEntriesController = function (Outcome, moment) {

    var get = function (req, res) {
        var startOfToday = moment().startOf('day');
        var endOfToday = moment().endOf('day');
        var startOfWeek = moment().startOf('isoWeek');
        var endOfWeek = moment().endOf('isoWeek');

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
                }
            ]
        };

        Outcome.find(query, function (err, results) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(results);
            }
        })

    };

    return {
        get: get
    }

};

module.exports = activeEntriesController;