var should = require('should'),
    request = require('supertest'),
    moment = require('moment'),
    server,
    mongoose = require('mongoose'),
    Outcome,
    Reflection,
    User,
    token,
    agent;


describe('Related ITs', function () {

    beforeEach(function (done) {
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

        var user = new User();
        user.local.username = itUser.username;
        user.local.password = itUser.password;

        user.save();

        agent.post('/api/login')
            .send(itUser)
            .end(function (err, results) {
                token = results.body.token;
                done();
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
                    .send()
                    .expect(400, done);
            });

            describe('Daily', function () {
                it('should get back the current weekly outcome', function (done) {
                    var currentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .end(function (err, postOutcomeResults) {
                            agent.get('/api/related/outcomes?typeName=Daily')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(1);
                                    results.body[0]._id.should.be.equal(postOutcomeResults.body._id);
                                    done();
                                });
                        });
                });

                it('should get back nothing if no current weekly outcome', function (done) {
                    var notThisWeek = moment().subtract(1, 'weeks');
                    var currentWeeklyOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: notThisWeek.toDate()
                    };

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .end(function () {
                            agent.get('/api/related/outcomes?typeName=Daily')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(0);
                                    done();
                                });
                        });
                });

                it('should get back yesterdays outcome', function (done) {
                    var yesterday = moment().subtract(1, 'days');
                    var yesterdaysOutcome = {
                        typeName: 'Daily',
                        firstStory: 'The First Daily Story',
                        secondStory: 'The Second Daily Story',
                        thirdStory: 'The Third Daily Story',
                        effectiveDate: yesterday.toDate()
                    };

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(yesterdaysOutcome)
                        .end(function (err, postOutcomeResults) {
                            agent.get('/api/related/outcomes?typeName=Daily')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(1);
                                    results.body[0]._id.should.be.equal(postOutcomeResults.body._id);
                                    done();
                                })
                        })
                });

                it('should get back all related entries', function (done) {
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

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(currentWeeklyOutcome)
                        .end(function (err, postWeeklyOutcomeResults) {
                            agent.post('/api/outcomes')
                                .set('Authorization', 'bearer ' + token)
                                .send(yesterdaysOutcome)
                                .end(function (err, yesterdaysOutcomeResults) {
                                    agent.get('/api/related/outcomes?typeName=Daily')
                                        .send()
                                        .expect(200)
                                        .end(function (err, results) {
                                            results.body.length.should.be.exactly(2);
                                            results.body[0]._id.should.be.equal(postWeeklyOutcomeResults.body._id);
                                            results.body[1]._id.should.be.equal(yesterdaysOutcomeResults.body._id);
                                            done();
                                        });
                                });
                        })

                });
            });

            describe('Weekly', function () {
                it('should get back the last weekly reflection', function (done) {
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

                    agent.post('/api/reflections')
                        .send(lastWeeksReflection)
                        .end(function (err, postReflectionResults) {
                            agent.get('/api/related/outcomes?typeName=Weekly')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(1);
                                    results.body[0]._id.should.be.equal(postReflectionResults.body._id);
                                    done();
                                });
                        })

                });

                it('should get back nothing if no last weekly reflection', function (done) {
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

                    agent.post('/api/reflections')
                        .send(notLastWeeksReflection)
                        .end(function (err, postReflectionResults) {
                            agent.get('/api/related/outcomes?typeName=Weekly')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(0);
                                    done();
                                });
                        })
                });

                it('should get back last weeks weekly outcome', function (done) {
                    var lastWeek = moment().subtract(1, 'weeks');
                    var lastWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: lastWeek.toDate()
                    };

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksOutcome)
                        .end(function (err, lastWeeksOutcomeResults) {
                            agent.get('/api/related/outcomes?typeName=Weekly')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(1);
                                    results.body[0]._id.should.be.equal(lastWeeksOutcomeResults.body._id);
                                    done();
                                });
                        });
                });

                it('should get back all related entries', function (done) {
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

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(lastWeeksOutcome)
                        .end(function (err, lastWeeksOutcomeResults) {
                            agent.post('/api/reflections')
                                .send(lastWeeksReflection)
                                .end(function (err, lastWeeksReflectionResults) {
                                    agent.get('/api/related/outcomes?typeName=Weekly')
                                        .send()
                                        .expect(200)
                                        .end(function (err, results) {
                                            results.body.length.should.be.exactly(2);
                                            results.body[0]._id.should.be.equal(lastWeeksReflectionResults.body._id);
                                            results.body[1]._id.should.be.equal(lastWeeksOutcomeResults.body._id);
                                            done();
                                        });
                                });
                        });
                });
            });
        });

        describe('/reflections', function () {

            it('should send back 400 if typeName is not allowed', function (done) {
                agent.get('/api/related/reflections?typeName=NotAllowed')
                    .send()
                    .expect(400, done);
            });

            describe('Weekly', function () {
                it('should get back the last weekly reflection', function (done) {
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

                    agent.post('/api/reflections')
                        .send(lastWeeksReflection)
                        .end(function (err, postReflectionResults) {
                            agent.get('/api/related/reflections?typeName=Weekly')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(1);
                                    results.body[0]._id.should.be.equal(postReflectionResults.body._id);
                                    done();
                                });
                        })

                });

                it('should get back nothing if no last weekly reflection', function (done) {
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

                    agent.post('/api/reflections')
                        .send(notLastWeeksReflection)
                        .end(function (err, postReflectionResults) {
                            agent.get('/api/related/reflections?typeName=Weekly')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(0);
                                    done();
                                });
                        })
                });

                it('should get back current weekly outcome', function (done) {
                    var thisWeeksOutcome = {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    };

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisWeeksOutcome)
                        .end(function (err, thisWeeksOutcomeResults) {
                            agent.get('/api/related/reflections?typeName=Weekly')
                                .send()
                                .expect(200)
                                .end(function (err, results) {
                                    results.body.length.should.be.exactly(1);
                                    results.body[0]._id.should.be.equal(thisWeeksOutcomeResults.body._id);
                                    done();
                                });
                        });
                });

                it('should get back all related entries', function (done) {
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

                    agent.post('/api/outcomes')
                        .set('Authorization', 'bearer ' + token)
                        .send(thisWeeksOutcome)
                        .end(function (err, thisWeeksOutcomeResults) {
                            agent.post('/api/reflections')
                                .send(lastWeeksReflection)
                                .end(function (err, lastWeeksReflectionResults) {
                                    agent.get('/api/related/reflections?typeName=Weekly')
                                        .send()
                                        .expect(200)
                                        .end(function (err, results) {
                                            results.body.length.should.be.exactly(2);
                                            results.body[0]._id.should.be.equal(lastWeeksReflectionResults.body._id);
                                            results.body[1]._id.should.be.equal(thisWeeksOutcomeResults.body._id);
                                            done();
                                        });
                                });
                        });
                });
            });

        });
    });
});

