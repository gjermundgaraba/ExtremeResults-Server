var should = require('should'),
    request = require('supertest-as-promised'),
    moment = require('moment'),
    server,
    mongoose = require('mongoose'),
    Outcome,
    User,
    token,
    otherUserToken,
    agent;


describe('Outcome ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        Outcome = mongoose.model('Outcome');

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
                return User.remove().exec();
            })
            .then(function () {
                server.close(done);
            });
    });

    describe('/activeEntries', function () {

        describe('get', function () {
            it('should return all active entries', function () {
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: moment().add(1, 'minutes')
                };

                var activeWeeklyOutcome = {
                    typeName: 'Weekly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: moment().add(2, 'minutes')
                };

                var activeMonthlyOutcome = {
                    typeName: 'Monthly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: moment().add(3, 'minutes')
                };

                var dailyResults;
                var weeklyResults;
                var monthlyResults;

                return agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .then(function (results) {
                        dailyResults = results;
                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome);
                    })
                    .then(function (results) {
                        weeklyResults = results;
                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeMonthlyOutcome);
                    })
                    .then(function (results) {
                        monthlyResults = results;
                        return agent.get('/api/activeEntries')
                            .set('Authorization', 'bearer ' + token)
                            .send()
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(3);
                        results.body[0].objectId.should.be.equal(dailyResults.body._id);
                        results.body[1].objectId.should.be.equal(weeklyResults.body._id);
                        results.body[2].objectId.should.be.equal(monthlyResults.body._id);
                    });
            });

            it('should return only entries for the user', function () {
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                var otherUsersActiveDailyOutcome = {
                    typeName: 'Weekly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                var dailyResults;
                return agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .then(function (results) {
                        dailyResults = results;
                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + otherUserToken)
                            .send(otherUsersActiveDailyOutcome);
                    })
                    .then(function () {
                        return agent.get('/api/activeEntries')
                            .set('Authorization', 'bearer ' + token)
                            .send()
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(1);
                        results.body[0].objectId.should.be.equal(dailyResults.body._id);
                    });
            });

            it('should only get todays daily outcome if that is what is there', function () {
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                var lastWeek = moment().subtract(1, 'weeks');
                var activeWeeklyOutcome = {
                    typeName: 'Weekly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: lastWeek.toDate()
                };

                var dailyResults;

                return agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .then(function (results) {
                        dailyResults = results;
                        return  agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome);
                    })
                    .then(function () {
                        return agent.get('/api/activeEntries')
                            .set('Authorization', 'bearer ' + token)
                            .send()
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(1);
                        results.body[0].objectId.should.be.equal(dailyResults.body._id);
                    });
            });

            it('should only get this weeks weekly outcome if that is what is there', function () {
                var yesterday = moment().subtract(1, 'days');
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: yesterday.toDate()
                };

                var activeWeeklyOutcome = {
                    typeName: 'Weekly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                var weeklyResults;

                return agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .then(function () {
                        return  agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome);
                    })
                    .then(function (results) {
                        weeklyResults = results;
                        return agent.get('/api/activeEntries')
                            .set('Authorization', 'bearer ' + token)
                            .send()
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(1);
                        results.body[0].objectId.should.be.equal(weeklyResults.body._id);
                    });
            });

            it('should only get this months outcome if that is what is there', function () {
                var yesterday = moment().subtract(1, 'days');
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: yesterday.toDate()
                };

                var activeMonthlyOutcome = {
                    typeName: 'Monthly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                var monthlyResults;

                return agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .then(function () {
                        return  agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeMonthlyOutcome);
                    })
                    .then(function (results) {
                        monthlyResults = results;
                        return agent.get('/api/activeEntries')
                            .set('Authorization', 'bearer ' + token)
                            .send()
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(1);
                        results.body[0].objectId.should.be.equal(monthlyResults.body._id);
                    });
            });

            it('should get nothing if there are no active entires', function () {
                var yesterday = moment().subtract(1, 'days');
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: yesterday.toDate()
                };

                var lastWeek = moment().subtract(1, 'weeks');
                var activeWeeklyOutcome = {
                    typeName: 'Weekly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: lastWeek.toDate()
                };

                var lastMonth = moment().subtract(1, 'months');
                var activeMonthlyOutcome = {
                    typeName: 'Monthly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: lastMonth.toDate()
                };


                return agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .then(function () {
                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome);
                    })
                    .then(function () {
                        return agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeMonthlyOutcome);
                    })
                    .then(function () {
                        return agent.get('/api/activeEntries')
                            .set('Authorization', 'bearer ' + token)
                            .send()
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(0);
                    });
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/activeEntries')
                    .expect(401, done);
            });
        });
    });
});

