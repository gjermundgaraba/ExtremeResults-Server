var should = require('should'),
    request = require('supertest'),
    moment = require('moment'),
    server,
    mongoose = require('mongoose'),
    Outcome,
    User,
    token,
    agent;


describe('Outcome ITs', function () {

    beforeEach(function (done) {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        Outcome = mongoose.model('Outcome');

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
                return User.remove().exec();
            })
            .then(function () {
                server.close(done);
            });
    });

    describe('/activeEntries', function () {

        describe('get', function () {
            it('return all active entries', function (done) {
                var activeDailyOutcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                var activeWeeklyOutcome = {
                    typeName: 'Weekly',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .end(function (err, dailyResults) {
                        agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome)
                            .end(function (err, weeklyResults) {
                                agent.get('/api/activeEntries')
                                    .set('Authorization', 'bearer ' + token)
                                    .send()
                                    .expect(200)
                                    .end(function (err, results) {
                                        results.body.length.should.be.exactly(2);
                                        results.body[0]._id.should.be.equal(dailyResults.body._id);
                                        results.body[1]._id.should.be.equal(weeklyResults.body._id);
                                        done();
                                    });
                            });
                    });
            });

            it('should only get todays daily outcome if that is what is there', function (done) {
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

                agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .end(function (err, dailyResults) {
                        agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome)
                            .end(function () {
                                agent.get('/api/activeEntries')
                                    .set('Authorization', 'bearer ' + token)
                                    .send()
                                    .expect(200)
                                    .end(function (err, results) {
                                        results.body.length.should.be.exactly(1);
                                        results.body[0]._id.should.be.equal(dailyResults.body._id);
                                        done();
                                    });
                            });
                    });
            });

            it('should only get this weeks weekly outcome if that is what is there', function (done) {
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

                agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .end(function () {
                        agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome)
                            .end(function (err, weeklyResults) {
                                agent.get('/api/activeEntries')
                                    .set('Authorization', 'bearer ' + token)
                                    .send()
                                    .expect(200)
                                    .end(function (err, results) {
                                        results.body.length.should.be.exactly(1);
                                        results.body[0]._id.should.be.equal(weeklyResults.body._id);
                                        done();
                                    });
                            });
                    });
            });

            it('should get nothing if there are no active entires', function (done) {
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

                agent.post('/api/outcomes')
                    .set('Authorization', 'bearer ' + token)
                    .send(activeDailyOutcome)
                    .end(function () {
                        agent.post('/api/outcomes')
                            .set('Authorization', 'bearer ' + token)
                            .send(activeWeeklyOutcome)
                            .end(function () {
                                agent.get('/api/activeEntries')
                                    .set('Authorization', 'bearer ' + token)
                                    .send()
                                    .expect(200)
                                    .end(function (err, results) {
                                        results.body.length.should.be.exactly(0);
                                        done();
                                    });
                            });
                    });
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/activeEntries')
                    .send()
                    .expect(401, done);
            });
        });
    });
});

