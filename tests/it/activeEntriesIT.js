var should = require('should'),
    request = require('supertest'),
    moment = require('moment'),
    server,
    mongoose = require('mongoose'),
    Outcome,
    agent;


describe('Outcome ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        Outcome = mongoose.model('Outcome');
    });

    afterEach(function (done) {
        Outcome.remove().exec()
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
                    .send(activeDailyOutcome)
                    .end(function (err, dailyResults) {
                        agent.post('/api/outcomes')
                            .send(activeWeeklyOutcome)
                            .end(function (err, weeklyResults) {
                                agent.get('/api/activeEntries')
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
                    .send(activeDailyOutcome)
                    .end(function (err, dailyResults) {
                        agent.post('/api/outcomes')
                            .send(activeWeeklyOutcome)
                            .end(function () {
                                agent.get('/api/activeEntries')
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
                    .send(activeDailyOutcome)
                    .end(function () {
                        agent.post('/api/outcomes')
                            .send(activeWeeklyOutcome)
                            .end(function (err, weeklyResults) {
                                agent.get('/api/activeEntries')
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
                    .send(activeDailyOutcome)
                    .end(function () {
                        agent.post('/api/outcomes')
                            .send(activeWeeklyOutcome)
                            .end(function () {
                                agent.get('/api/activeEntries')
                                    .send()
                                    .expect(200)
                                    .end(function (err, results) {
                                        results.body.length.should.be.exactly(0);
                                        done();
                                    });
                            });
                    });
            });
        });
    });
});

