var relatedForReflectionsController = function (Outcome, Reflection, moment) {

    var get = function (req, res) {
        if (req.query.typeName === 'Weekly') {
            var momentObj = moment();
            if (req.query.effectiveDate) {
                momentObj = moment(req.query.effectiveDate);
            }

            var startOfThisWeek = momentObj.clone().startOf('isoWeek');
            var endOfThisWeek = momentObj.clone().endOf('isoWeek');
            var startOfLastWeek = momentObj.clone().startOf('isoWeek').subtract(1, 'weeks');
            var endOfLastWeek = momentObj.clone().endOf('isoWeek').subtract(1, 'weeks');

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

                            res.json(related);
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