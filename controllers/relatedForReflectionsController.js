var logicalEntrySorter = require('../utils/logicalEntrySorter');

var relatedForReflectionsController = function (Outcome, Reflection, moment) {

    var get = function (req, res) {
        var momentObj = moment();
        if (req.query.effectiveDate) {
            momentObj = moment(req.query.effectiveDate);
        }

        var currentEntriesQuery;
        var previousPeriodsQuery;

        if (req.query.typeName === 'Weekly') {
            var startOfThisWeek = momentObj.clone().startOf('isoWeek');
            var endOfThisWeek = momentObj.clone().endOf('isoWeek');
            var startOfLastWeek = momentObj.clone().startOf('isoWeek').subtract(1, 'weeks');
            var endOfLastWeek = momentObj.clone().endOf('isoWeek').subtract(1, 'weeks');

            previousPeriodsQuery = {
                user: req.user._id,
                typeName: 'Weekly',
                effectiveDate: {
                    $gte: startOfLastWeek.toDate(),
                    $lt: endOfLastWeek.toDate()
                }
            };

            currentEntriesQuery = {
                user: req.user._id,
                typeName: 'Weekly',
                effectiveDate: {
                    $gte: startOfThisWeek.toDate(),
                    $lt: endOfThisWeek.toDate()
                }
            };
        } else if (req.query.typeName === 'Monthly') {
            var startOfThisMonth = momentObj.clone().startOf('month');
            var endOfThisMonth = momentObj.clone().endOf('month');
            var startOfLastMonth = momentObj.clone().startOf('month').subtract(1, 'months');
            var endOfLastMonth = momentObj.clone().endOf('month').subtract(1, 'months');

            previousPeriodsQuery = {
                user: req.user._id,
                typeName: 'Monthly',
                effectiveDate: {
                    $gte: startOfLastMonth.toDate(),
                    $lt: endOfLastMonth.toDate()
                }
            };

            currentEntriesQuery = {
                user: req.user._id,
                typeName: 'Monthly',
                effectiveDate: {
                    $gte: startOfThisMonth.toDate(),
                    $lt: endOfThisMonth.toDate()
                }
            };
        } else {
            // Not supported
            res.status(400).send();
        }
        
        if (typeof previousPeriodsQuery !== 'undefined' && typeof currentEntriesQuery !== 'undefined') {
            Reflection.find(previousPeriodsQuery, function (err, reflections) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    Outcome.find(currentEntriesQuery, function (err, outcomes) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            var related = [];

                            reflections.forEach(function (reflection) {
                                related.push({
                                    objectId: reflection._id,
                                    typeName: reflection.typeName,
                                    firstThingThatWentWell: reflection.firstThingThatWentWell,
                                    secondThingThatWentWell: reflection.secondThingThatWentWell,
                                    thirdThingThatWentWell: reflection.thirdThingThatWentWell,
                                    firstThingToImprove: reflection.firstThingToImprove,
                                    secondThingToImprove: reflection.secondThingToImprove,
                                    thirdThingToImprove: reflection.thirdThingToImprove,
                                    effectiveDate: reflection.effectiveDate,
                                    className: 'Reflection'
                                });
                            });

                            outcomes.forEach(function (outcome) {
                                related.push({
                                    objectId: outcome._id,
                                    typeName: outcome.typeName,
                                    firstStory: outcome.firstStory,
                                    secondStory: outcome.secondStory,
                                    thirdStory: outcome.thirdStory,
                                    effectiveDate: outcome.effectiveDate,
                                    className: 'Outcome'
                                });
                            });

                            logicalEntrySorter.performSort(related);

                            res.json(related);
                        }
                    });
                }
            });
        } else {

        }
    };

    return {
        get: get
    }

};

module.exports = relatedForReflectionsController;