var relatedForOutcomesController = function (Outcome, Reflection, moment) {

    var get = function (req, res) {
        var startOfThisMonth = moment().startOf('month');
        var endOfThisMonth = moment().endOf('month');

        if (req.query.typeName === 'Daily') {
            var startOfThisWeek = moment().startOf('isoWeek');
            var endOfThisWeek = moment().endOf('isoWeek');

            var startOfYesterday = moment().startOf('day').subtract(1, 'days');
            var endOfYesterday = moment().endOf('day').subtract(1, 'days');

            var query = {
                $or: [
                    {
                        user: req.user._id,
                        typeName: 'Monthly',
                        effectiveDate: {
                            $gte: startOfThisMonth.toDate(),
                            $lt: endOfThisMonth.toDate()
                        }
                    },
                    {
                        user: req.user._id,
                        typeName: 'Weekly',
                        effectiveDate: {
                            $gte: startOfThisWeek.toDate(),
                            $lt: endOfThisWeek.toDate()
                        }
                    },
                    {
                        user: req.user._id,
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
                   var related = [];

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
        } else if (req.query.typeName === 'Weekly') {
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

            var thisMonthsEntriesQuery = {
                user: req.user._id,
                typeName: 'Monthly',
                effectiveDate: {
                    $gte: startOfThisMonth.toDate(),
                    $lt: endOfThisMonth.toDate()
                }
            };

            var outcomeQuery = {
                $or: [
                    lastWeeksEntriesQuery,
                    thisMonthsEntriesQuery
                ]
            };



            Reflection.find(lastWeeksEntriesQuery, function (err, reflections) {
               if (err) {
                   res.status(500).send(err);
               } else {
                   Outcome.find(outcomeQuery, function (err, outcomes) {
                       if (err) {
                           res.status(500).send(err);
                       } else {
                           var related = [];

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

                           res.json(related);
                       }
                   });
               }
            });
        } else if (req.query.typeName === 'Monthly') {
            var startOfLastMonth = moment().startOf('month').subtract(1, 'months');
            var endOfLastMonth = moment().endOf('month').subtract(1, 'months');


            var lastMonthsEntriesQuery = {
                user: req.user._id,
                typeName: 'Monthly',
                effectiveDate: {
                    $gte: startOfLastMonth.toDate(),
                    $lt: endOfLastMonth.toDate()
                }
            };

            Reflection.find(lastMonthsEntriesQuery, function (err, reflections) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    Outcome.find(lastMonthsEntriesQuery, function (err, outcomes) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            var related = [];

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

module.exports = relatedForOutcomesController;