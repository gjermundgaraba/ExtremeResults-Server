var should = require('should'),
    request = require('supertest-as-promised'),
    moment = require('moment'),
    server,
    mongoose = require('mongoose'),
    Outcome,
    Reflection,
    User,
    token,
    otherUserToken,
    agent;


describe('Related ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        Outcome = mongoose.model('Outcome');
        Reflection = mongoose.model('Reflection');

        User = mongoose.model('User');
        var itUser = {
            username: 'test',
            password: 'password'
        };

        var otherItUser = {
            username: 'test2',
            password: 'password'
        };

        return agent.post('/api/register')
            .send(itUser)
            .then(function () {
                return agent.post('/api/register')
                    .send(otherItUser);
            })
            .then(function () {
                return agent.post('/api/login')
                    .send(itUser);
            })
            .then(function (results) {
                token = results.body.token;
                return agent.post('/api/login')
                    .send(otherItUser)
            })
            .then(function (results) {
                otherUserToken = results.body.token;
            });
    });

    afterEach(function (done) {
        Outcome.remove().exec()
            .then(function () {
                return Reflection.remove().exec();
            })
            .then(function () {
                return User.remove().exec();
            })
            .then(function () {
                server.close(done);
            });

    });

    describe('/related', function () {

        describe('/outcomes', function () {
            it('should send back 400 if typeName is not allowed', function (done) {
                agent.get('/api/related/outcomes?typeName=NotAllowed')
                    .set('Authorization', 'bearer ' + token)
                    .expect(400, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/related/outcomes?typeName=Daily')
                    .expect(401, done);
            });

            describe('Daily', function () {
                it('should get back the current weekly outcome', function () {
                    var currentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var postOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .then(function (results) {
                            postOutcomeResults = results;
                            return agent.get('/api/related/outcomes?typeName=Daily')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postOutcomeResults.body._id);
                        });
                });

                it('should get back nothing if no current weekly outcome', function () {
                    var notThisWeek = moment().subtract(1, 'weeks');
                    var currentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: notThisWeek.toDate()
                    };

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .then(function () {
                            return agent.get('/api/related/outcomes?typeName=Daily')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(0);
                        });
                });

                it('should get back yesterdays outcome', function () {
                    var yesterday = moment().subtract(1, 'days');
                    var yesterdaysOutcome = {
                        typeName: 'Daily',
                        firstStory: 'The First Daily Story',
                        secondStory: 'The Second Daily Story',
                        thirdStory: 'The Third Daily Story',
                        effectiveDate: yesterday.toDate()
                    };

                    var postOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(yesterdaysOutcome)
                        .then(function (results) {
                            postOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Daily')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postOutcomeResults.body._id);
                        });
                });

                it('should get back this months outcome', function () {
                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Monthly Story',
                        secondStory: 'The Second Monthly Story',
                        thirdStory: 'The Third Monthly Story',
                        effectiveDate: new Date()
                    };

                    var postOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisMonthsOutcome)
                        .then(function (results) {
                            postOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Daily')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postOutcomeResults.body._id);
                        });
                });

                it('should get back all related entries', function () {
                    var currentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var yesterday = moment().subtract(1, 'days');
                    var yesterdaysOutcome = {
                        typeName: 'Daily',
                        firstStory: 'The First Daily Story',
                        secondStory: 'The Second Daily Story',
                        thirdStory: 'The Third Daily Story',
                        effectiveDate: yesterday.toDate()
                    };

                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Monthly Story',
                        secondStory: 'The Second Monthly Story',
                        thirdStory: 'The Third Monthly Story',
                        effectiveDate: new Date()
                    };

                    var postWeeklyOutcomeResults;
                    var yesterdaysOutcomeResults;
                    var thisMonthsOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .then(function (results) {
                            postWeeklyOutcomeResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + token)
                                .send(yesterdaysOutcome);
                        })
                        .then(function (results) {
                            yesterdaysOutcomeResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + token)
                                .send(thisMonthsOutcome);
                        })
                        .then(function (results) {
                            thisMonthsOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Daily')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(3);
                            results.body[0].objectId.should.be.equal(postWeeklyOutcomeResults.body._id);
                            results.body[1].objectId.should.be.equal(yesterdaysOutcomeResults.body._id);
                            results.body[2].objectId.should.be.equal(thisMonthsOutcomeResults.body._id);
                        });

                });

                it('should only get back related entries for the user', function () {
                    var currentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var otherUsersCurrentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Other Users Weekly Story',
                        secondStory: 'The Second Other Users Weekly Story',
                        thirdStory: 'The Third Other Users Weekly Story',
                        effectiveDate: new Date()
                    };

                    var yesterday = moment().subtract(1, 'days');
                    var yesterdaysOutcome = {
                        typeName: 'Daily',
                        firstStory: 'The First Daily Story',
                        secondStory: 'The Second Daily Story',
                        thirdStory: 'The Third Daily Story',
                        effectiveDate: yesterday.toDate()
                    };

                    var postWeeklyOutcomeResults;
                    var yesterdaysOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .then(function (results) {
                            postWeeklyOutcomeResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + token)
                                .send(yesterdaysOutcome);
                        })
                        .then(function (results) {
                            yesterdaysOutcomeResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + otherUserToken)
                                .send(otherUsersCurrentWeeklyOutcome);
                        })
                        .then(function () {
                            return agent.get('/api/related/outcomes?typeName=Daily')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(postWeeklyOutcomeResults.body._id);
                            results.body[1].objectId.should.be.equal(yesterdaysOutcomeResults.body._id);
                        })
                });
            });

            describe('Weekly', function () {
                it('should get back the last weekly reflection', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var lastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastWeek.toDate()
                    };

                    var postReflectionResults;

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksReflection)
                        .then(function (results) {
                            postReflectionResults = results;

                            return agent.get('/api/related/outcomes?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postReflectionResults.body._id);
                        });

                });

                it('should get back nothing if no last weekly reflection', function () {
                    var notLastWeek = moment().subtract(2, 'weeks');
                    var notLastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: notLastWeek.toDate()
                    };

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(notLastWeeksReflection)
                        .then(function () {
                            return agent.get('/api/related/outcomes?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(0);
                        });
                });

                it('should get back last weeks weekly outcome', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var lastWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: lastWeek.toDate()
                    };

                    var lastWeeksOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksOutcome)
                        .then(function (results) {
                            lastWeeksOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(lastWeeksOutcomeResults.body._id);
                        });
                });

                it('should get back this months outcome', function () {
                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Monthly Story',
                        secondStory: 'The Second Monthly Story',
                        thirdStory: 'The Third Monthly Story',
                        effectiveDate: new Date()
                    };

                    var postOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisMonthsOutcome)
                        .then(function (results) {
                            postOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postOutcomeResults.body._id);
                        });
                });


                it('should get back all related entries', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var lastWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: lastWeek.toDate()
                    };

                    var lastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastWeek.toDate()
                    };

                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Monthly Story',
                        secondStory: 'The Second Monthly Story',
                        thirdStory: 'The Third Monthly Story',
                        effectiveDate: new Date()
                    };


                    var lastWeeksOutcomeResults;
                    var lastWeeksReflectionResults;
                    var thisMonthsOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksOutcome)
                        .then(function (results) {
                            lastWeeksOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastWeeksReflection);
                        })
                        .then(function (results) {
                            lastWeeksReflectionResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + token)
                                .send(thisMonthsOutcome);
                        })
                        .then(function (results) {
                            thisMonthsOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(3);
                            results.body[0].objectId.should.be.equal(lastWeeksOutcomeResults.body._id);
                            results.body[1].objectId.should.be.equal(thisMonthsOutcomeResults.body._id);
                            results.body[2].objectId.should.be.equal(lastWeeksReflectionResults.body._id);
                        });
                });

                it('should only get back related entries for the user', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var lastWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: lastWeek.toDate()
                    };

                    var otherUsersLastWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Other Users Weekly Story',
                        secondStory: 'The Second Other Users Weekly Story',
                        thirdStory: 'The Third Other Users Weekly Story',
                        effectiveDate: lastWeek.toDate()
                    };

                    var lastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastWeek.toDate()
                    };

                    var lastWeeksOutcomeResults;
                    var lastWeeksReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksOutcome)
                        .then(function (results) {
                            lastWeeksOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastWeeksReflection);
                        })
                        .then(function (results) {
                            lastWeeksReflectionResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + otherUserToken)
                                .send(otherUsersLastWeeksOutcome);
                        })
                        .then(function () {
                            return agent.get('/api/related/outcomes?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastWeeksOutcomeResults.body._id);
                            results.body[1].objectId.should.be.equal(lastWeeksReflectionResults.body._id);
                        });
                })
            });

            describe('Monthly', function () {
                it('should get back the last monthly reflection', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var lastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastMonth.toDate()
                    };

                    var postReflectionResults;

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastMonthsReflection)
                        .then(function (results) {
                            postReflectionResults = results;

                            return agent.get('/api/related/outcomes?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postReflectionResults.body._id);
                        })

                });

                it('should get back nothing if no last monthly reflection', function () {
                    var notLastMonth = moment().subtract(2, 'months');
                    var notLastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: notLastMonth.toDate()
                    };

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(notLastMonthsReflection)
                        .then(function () {
                            return agent.get('/api/related/outcomes?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(0);
                        });
                });

                it('should get back last months monthly outcome', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var lastMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: lastMonth.toDate()
                    };

                    var lastWeeksOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastMonthsOutcome)
                        .then(function (results) {
                            lastWeeksOutcomeResults = results;

                            return agent.get('/api/related/outcomes?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(lastWeeksOutcomeResults.body._id);
                        });
                });

                it('should get back all related entries', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var lastMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: lastMonth.toDate()
                    };

                    var lastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastMonth.toDate()
                    };

                    var lastMonthsOutcomeResults;
                    var lastMonthReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastMonthsOutcome)
                        .then(function (results) {
                            lastMonthsOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastMonthsReflection);
                        })
                        .then(function (results) {
                            lastMonthReflectionResults = results;

                            return agent.get('/api/related/outcomes?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastMonthsOutcomeResults.body._id);
                            results.body[1].objectId.should.be.equal(lastMonthReflectionResults.body._id);
                        });
                });

                it('should only get back related entries for the user', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var lastWeeksOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Monthly Story',
                        secondStory: 'The Second Monthly Story',
                        thirdStory: 'The Third Monthly Story',
                        effectiveDate: lastMonth.toDate()
                    };

                    var otherUsersLastMonthssOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Other Users Monthly Story',
                        secondStory: 'The Second Other Users Monthly Story',
                        thirdStory: 'The Third Other Users Monthly Story',
                        effectiveDate: lastMonth.toDate()
                    };

                    var lastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastMonth.toDate()
                    };

                    var lastMonthsOutcomeResults;
                    var lastMonthsReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksOutcome)
                        .then(function (results) {
                            lastMonthsOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastMonthsReflection);
                        })
                        .then(function (results) {
                            lastMonthsReflectionResults = results;

                            return agent.post('/api/outcomes')
                                .send(otherUsersLastMonthssOutcome)
                                .set('Authorization', 'bearer ' + otherUserToken);
                        })
                        .then(function () {
                            return agent.get('/api/related/outcomes?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastMonthsOutcomeResults.body._id);
                            results.body[1].objectId.should.be.equal(lastMonthsReflectionResults.body._id);
                        });
                })
            })
        });

        describe('/reflections', function () {

            it('should send back 400 if typeName is not allowed', function (done) {
                agent.get('/api/related/reflections?typeName=NotAllowed')
                    .set('Authorization', 'bearer ' + token)
                    .send()
                    .expect(400, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/related/reflections?typeName=Weekly')
                    .expect(401, done);
            });

            describe('Weekly', function () {
                it('should get back the last weekly reflection', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var lastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastWeek.toDate()
                    };

                    var postReflectionResults;

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksReflection)
                        .then(function (results) {
                            postReflectionResults = results;

                            return agent.get('/api/related/reflections?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postReflectionResults.body._id);
                        });

                });

                it('should get back nothing if no last weekly reflection', function () {
                    var notLastWeek = moment().subtract(2, 'weeks');
                    var notLastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: notLastWeek.toDate()
                    };

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(notLastWeeksReflection)
                        .then(function () {
                            return agent.get('/api/related/reflections?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(0);
                        });
                });

                it('should get back current weekly outcome', function () {
                    var thisWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var thisWeeksOutcomeResults;
                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisWeeksOutcome)
                        .then(function (results) {
                            thisWeeksOutcomeResults = results;

                            return agent.get('/api/related/reflections?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(thisWeeksOutcomeResults.body._id);
                        })
                });

                it('should get back all related entries', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var thisWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var lastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastWeek.toDate()
                    };

                    var thisWeeksOutcomeResults;
                    var lastWeeksReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisWeeksOutcome)
                        .then(function (results) {
                            thisWeeksOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastWeeksReflection);
                        })
                        .then(function (results) {
                            lastWeeksReflectionResults = results;

                            return agent.get('/api/related/reflections?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastWeeksReflectionResults.body._id);
                            results.body[1].objectId.should.be.equal(thisWeeksOutcomeResults.body._id);
                        })
                });

                it('should only get back related entries for the user', function () {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var thisWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var otherUsersWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Other Users Weekly Story',
                        secondStory: 'The Second Other Users Weekly Story',
                        thirdStory: 'The Third Other Users Weekly Story',
                        effectiveDate: new Date()
                    };

                    var lastWeeksReflection = {
                        typeName: 'Weekly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastWeek.toDate()
                    };

                    var thisWeeksOutcomeResults;
                    var lastWeeksReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisWeeksOutcome)
                        .then(function (results) {
                            thisWeeksOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastWeeksReflection);
                        })
                        .then(function (results) {
                            lastWeeksReflectionResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + otherUserToken)
                                .send(otherUsersWeeksOutcome);
                        })
                        .then(function () {
                            return agent.get('/api/related/reflections?typeName=Weekly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastWeeksReflectionResults.body._id);
                            results.body[1].objectId.should.be.equal(thisWeeksOutcomeResults.body._id);
                        })
                });

                describe('effectiveDate param', function () {
                    it('should get back based on effectiveDate sent in', function () {
                        var lastWeek = moment().subtract(1, 'weeks');
                        var twoWeeksAgo = moment().subtract(2, 'weeks');
                        var lastWeeksOutcome = {
                            typeName: 'Weekly',
                            firstStory: 'The First Weekly Story',
                            secondStory: 'The Second Weekly Story',
                            thirdStory: 'The Third Weekly Story',
                            effectiveDate: lastWeek.toDate()
                        };

                        var twoWeeksAgoReflection = {
                            typeName: 'Weekly',
                            firstThingThatWentWell: 'The First Thing That Went Well',
                            secondThingThatWentWell: 'The Second Thing That Went Well',
                            thirdThingThatWentWell: 'The Third Thing That Went Well',
                            firstThingToImprove: 'The First Thing To Improve',
                            secondThingToImprove: 'The Second Thing To Improve',
                            thirdThingToImprove: 'The Third Thing To Improve',
                            effectiveDate: twoWeeksAgo.toDate()
                        };

                        var lastWeeksOutcomeResults;
                        var twoWeeksAgoReflectionResults;

                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(lastWeeksOutcome)
                            .then(function (results) {
                                lastWeeksOutcomeResults = results;

                                return agent.post('/api/reflections')
                                    .set('Authorization', 'bearer ' + token)
                                    .send(twoWeeksAgoReflection);
                            })
                            .then(function (results) {
                                twoWeeksAgoReflectionResults = results;

                                return agent.get('/api/related/reflections?typeName=Weekly&effectiveDate=' + encodeURI(lastWeek.toDate()))
                                    .set('Authorization', 'bearer ' + token)
                                    .send()
                                    .expect(200);
                            })
                            .then(function (results) {
                                results.body.length.should.be.exactly(2);
                                results.body[0].objectId.should.be.equal(twoWeeksAgoReflectionResults.body._id);
                                results.body[1].objectId.should.be.equal(lastWeeksOutcomeResults.body._id);
                            });
                    });
                });
            });

            describe('Monthly', function () {
                it('should get back the last monthly reflection', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var lastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastMonth.toDate()
                    };

                    var postReflectionResults;

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastMonthsReflection)
                        .then(function (results) {
                            postReflectionResults = results;

                            return agent.get('/api/related/reflections?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(postReflectionResults.body._id);
                        });

                });

                it('should get back nothing if no last monthly reflection', function () {
                    var notLastMonth = moment().subtract(2, 'months');
                    var notLastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: notLastMonth.toDate()
                    };

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + token)
                        .send(notLastMonthsReflection)
                        .then(function () {
                            return agent.get('/api/related/reflections?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(0);
                        })
                });

                it('should get back current monthly outcome', function () {
                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var thisWeeksOutcomeResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisMonthsOutcome)
                        .then(function (results) {
                            thisWeeksOutcomeResults = results;

                            return agent.get('/api/related/reflections?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(1);
                            results.body[0].objectId.should.be.equal(thisWeeksOutcomeResults.body._id);
                        })
                });

                it('should get back all related entries', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Monthly Story',
                        secondStory: 'The Second Monthly Story',
                        thirdStory: 'The Third Monthly Story',
                        effectiveDate: new Date()
                    };

                    var lastMonthsReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastMonth.toDate()
                    };

                    var thisMonthsOutcomeResults;
                    var lastMonthsReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisMonthsOutcome)
                        .then(function (results) {
                            thisMonthsOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastMonthsReflection);
                        })
                        .then(function (results) {
                            lastMonthsReflectionResults = results;

                            return agent.get('/api/related/reflections?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastMonthsReflectionResults.body._id);
                            results.body[1].objectId.should.be.equal(thisMonthsOutcomeResults.body._id);
                        })
                });

                it('should only get back related entries for the user', function () {
                    var lastMonth = moment().subtract(1, 'months');
                    var thisMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    var otherUsersMonthsOutcome = {
                        typeName: 'Monthly',
                        firstStory: 'The First Other Users Weekly Story',
                        secondStory: 'The Second Other Users Weekly Story',
                        thirdStory: 'The Third Other Users Weekly Story',
                        effectiveDate: new Date()
                    };

                    var lastMonthReflection = {
                        typeName: 'Monthly',
                        firstThingThatWentWell: 'The First Thing That Went Well',
                        secondThingThatWentWell: 'The Second Thing That Went Well',
                        thirdThingThatWentWell: 'The Third Thing That Went Well',
                        firstThingToImprove: 'The First Thing To Improve',
                        secondThingToImprove: 'The Second Thing To Improve',
                        thirdThingToImprove: 'The Third Thing To Improve',
                        effectiveDate: lastMonth.toDate()
                    };

                    var thisWeeksOutcomeResults;
                    var lastWeeksReflectionResults;

                    return agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisMonthsOutcome)
                        .then(function (results) {
                            thisWeeksOutcomeResults = results;

                            return agent.post('/api/reflections')
                                .set('Authorization', 'bearer ' + token)
                                .send(lastMonthReflection);
                        })
                        .then(function (results) {
                            lastWeeksReflectionResults = results;

                            return agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + otherUserToken)
                                .send(otherUsersMonthsOutcome);
                        })
                        .then(function () {
                            return agent.get('/api/related/reflections?typeName=Monthly')
                                .set('Authorization', 'bearer ' + token)
                                .send()
                                .expect(200);
                        })
                        .then(function (results) {
                            results.body.length.should.be.exactly(2);
                            results.body[0].objectId.should.be.equal(lastWeeksReflectionResults.body._id);
                            results.body[1].objectId.should.be.equal(thisWeeksOutcomeResults.body._id);
                        })
                });

                describe('effectiveDate param', function () {
                    it('should get back based on effectiveDate sent in', function () {
                        var lastMonth = moment().subtract(1, 'months');
                        var twoMonthsAgo = moment().subtract(2, 'months');
                        var lastMonthsOutcome = {
                            typeName: 'Monthly',
                            firstStory: 'The First Weekly Story',
                            secondStory: 'The Second Weekly Story',
                            thirdStory: 'The Third Weekly Story',
                            effectiveDate: lastMonth.toDate()
                        };

                        var twoMonthsAgoReflection = {
                            typeName: 'Monthly',
                            firstThingThatWentWell: 'The First Thing That Went Well',
                            secondThingThatWentWell: 'The Second Thing That Went Well',
                            thirdThingThatWentWell: 'The Third Thing That Went Well',
                            firstThingToImprove: 'The First Thing To Improve',
                            secondThingToImprove: 'The Second Thing To Improve',
                            thirdThingToImprove: 'The Third Thing To Improve',
                            effectiveDate: twoMonthsAgo.toDate()
                        };

                        var lastWeeksOutcomeResults;
                        var twoWeeksAgoReflectionResults;

                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(lastMonthsOutcome)
                            .then(function (results) {
                                lastWeeksOutcomeResults = results;

                                return agent.post('/api/reflections')
                                    .set('Authorization', 'bearer ' + token)
                                    .send(twoMonthsAgoReflection);
                            })
                            .then(function (results) {
                                twoWeeksAgoReflectionResults = results;

                                return agent.get('/api/related/reflections?typeName=Monthly&effectiveDate=' + encodeURI(lastMonth.toDate()))
                                    .set('Authorization', 'bearer ' + token)
                                    .send()
                                    .expect(200);
                            })
                            .then(function (results) {
                                results.body.length.should.be.exactly(2);
                                results.body[0].objectId.should.be.equal(twoWeeksAgoReflectionResults.body._id);
                                results.body[1].objectId.should.be.equal(lastWeeksOutcomeResults.body._id);
                            });
                    });
                });
            });

        });
    });
});

