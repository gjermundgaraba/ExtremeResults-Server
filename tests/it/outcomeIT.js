var should = require('should'),
    request = require('supertest'),
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

    describe('/outcomes', function () {

        describe('post', function () {
            it('should allow an outcome to be posted properly', function (done) {
                var outcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                agent.post('/api/outcomes')
                    .send(outcome)
                    .expect(201)
                    .end(function (err, results) {
                        results.body.should.have.property('_id');
                        results.body.should.have.property('typeName', outcome.typeName);
                        results.body.should.have.property('firstStory', outcome.firstStory);
                        results.body.should.have.property('secondStory', outcome.secondStory);
                        results.body.should.have.property('thirdStory', outcome.thirdStory);
                        results.body.should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should not allow an outcome without typeName', function (done) {
                var outcome = {
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                agent.post('/api/outcomes')
                    .send(outcome)
                    .expect(400, done);
            });

            it('should not allow an outcome without firstStory', function (done) {
                var outcome = {
                    typeName: 'Daily',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                agent.post('/api/outcomes')
                    .send(outcome)
                    .expect(400, done);
            });

            it('should not allow an outcome without secondStory', function (done) {
                var outcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    thirdStory: 'The Third Story',
                    effectiveDate: new Date()
                };

                agent.post('/api/outcomes')
                    .send(outcome)
                    .expect(400, done);
            });

            it('should not allow an outcome without thirdStory', function (done) {
                var outcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    effectiveDate: new Date()
                };

                agent.post('/api/outcomes')
                    .send(outcome)
                    .expect(400, done);
            });

            it('should not allow an outcome without effectiveDate', function (done) {
                var outcome = {
                    typeName: 'Daily',
                    firstStory: 'The First Story',
                    secondStory: 'The Second Story',
                    thirdStory: 'The Third Story'
                };

                agent.post('/api/outcomes')
                    .send(outcome)
                    .expect(400, done);
            });
        });

        describe('get', function () {
            var outcome1,
                outcome2,
                outcome3;

            beforeEach(function (done) {
                outcome1 = {
                    typeName: 'Daily',
                    firstStory: 'The First Daily Story',
                    secondStory: 'The Second Daily Story',
                    thirdStory: 'The Third Daily Story',
                    effectiveDate: new Date()
                };

                outcome2 = {
                    typeName: 'Weekly',
                    firstStory: 'The First Weekly Story',
                    secondStory: 'The Second Weekly Story',
                    thirdStory: 'The Third Weekly Story',
                    effectiveDate: new Date()
                };

                outcome3 = {
                    typeName: 'Monthly',
                    firstStory: 'The First Monthly Story',
                    secondStory: 'The Second Monthly Story',
                    thirdStory: 'The Third Monthly Story',
                    effectiveDate: new Date()
                };

                // Callback hell commencing!
                // TODO: Consider supertest-as-promised
                agent.post('/api/outcomes')
                    .send(outcome1)
                    .end(function () {
                        agent.post('/api/outcomes')
                            .send(outcome2)
                            .end(function () {
                                agent.post('/api/outcomes')
                                    .send(outcome3)
                                    .end(done);
                            });
                    });
            });

            it('should get all outcomes', function (done) {
                agent.get('/api/outcomes')
                    .expect(200)
                    .end(function (err, results) {
                        results.body.length.should.be.exactly(3);

                        results.body[0].should.have.property('_id');
                        results.body[0].should.have.property('typeName', outcome1.typeName);
                        results.body[0].should.have.property('firstStory', outcome1.firstStory);
                        results.body[0].should.have.property('secondStory', outcome1.secondStory);
                        results.body[0].should.have.property('thirdStory', outcome1.thirdStory);
                        results.body[0].should.have.property('effectiveDate');

                        results.body[1].should.have.property('_id');
                        results.body[1].should.have.property('typeName', outcome2.typeName);
                        results.body[1].should.have.property('firstStory', outcome2.firstStory);
                        results.body[1].should.have.property('secondStory', outcome2.secondStory);
                        results.body[1].should.have.property('thirdStory', outcome2.thirdStory);
                        results.body[1].should.have.property('effectiveDate');

                        results.body[2].should.have.property('_id');
                        results.body[2].should.have.property('typeName', outcome3.typeName);
                        results.body[2].should.have.property('firstStory', outcome3.firstStory);
                        results.body[2].should.have.property('secondStory', outcome3.secondStory);
                        results.body[2].should.have.property('thirdStory', outcome3.thirdStory);
                        results.body[2].should.have.property('effectiveDate');
                        done();
                    });
            });
        });
    });

    describe('/outcomes/:outcomeId', function () {
        var outcome,
            originalOutcome;

        beforeEach(function (done) {
            outcome = {
                typeName: 'Daily',
                firstStory: 'The First Daily Story',
                secondStory: 'The Second Daily Story',
                thirdStory: 'The Third Daily Story',
                effectiveDate: new Date()
            };

            agent.post('/api/outcomes')
                .send(outcome)
                .end(function (err, results) {
                    originalOutcome = results.body;
                    done();
                });
        });

        describe('get', function () {

            it('should get the outcome back', function (done) {
                agent.get('/api/outcomes/' + originalOutcome._id)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.should.have.property('_id', originalOutcome._id);
                        results.body.should.have.property('typeName', originalOutcome.typeName);
                        results.body.should.have.property('firstStory', originalOutcome.firstStory);
                        results.body.should.have.property('secondStory', originalOutcome.secondStory);
                        results.body.should.have.property('thirdStory', originalOutcome.thirdStory);
                        results.body.should.have.property('effectiveDate', originalOutcome.effectiveDate);
                        done();
                    });
            });

            it('should return 404 if id dont exist', function (done) {
                agent.get('/api/outcomes/56c9d89796ae562c201713c5')
                    .expect(404, done);
            });

        });

        describe('put', function () {

            it('should be able to put an object', function (done) {
                var newTypeName = 'Monthly';
                var newFirstStory = 'The First Monthly Story';
                var newSecondStory = 'The Second Monthly Story';
                var newThirdStory = 'The Third Monthly Story';

                outcome.typeName = newTypeName;
                outcome.firstStory = newFirstStory;
                outcome.secondStory = newSecondStory;
                outcome.thirdStory = newThirdStory;

                agent.put('/api/outcomes/' + originalOutcome._id)
                    .send(outcome)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.should.have.property('typeName', newTypeName);
                        results.body.should.have.property('firstStory', newFirstStory);
                        results.body.should.have.property('secondStory', newSecondStory);
                        results.body.should.have.property('thirdStory', newThirdStory);
                        results.body.should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should return 404 if id dont exist', function (done) {
                agent.put('/api/outcomes/56c9d89796ae562c201713c5')
                    .send(outcome)
                    .expect(404, done);
            });

            it('should return 400 if typeName is missing', function (done) {
                delete outcome.typeName;

                agent.put('/api/outcomes/' + originalOutcome._id)
                    .send(outcome)
                    .expect(400, done);
            });

            it('should return 400 if firstStory is missing', function (done) {
                delete outcome.firstStory;

                agent.put('/api/outcomes/' + originalOutcome._id)
                    .send(outcome)
                    .expect(400, done);
            });

            it('should return 400 if secondStory is missing', function (done) {
                delete outcome.secondStory;

                agent.put('/api/outcomes/' + originalOutcome._id)
                    .send(outcome)
                    .expect(400, done);
            });

            it('should return 400 if thirdStory is missing', function (done) {
                delete outcome.thirdStory;

                agent.put('/api/outcomes/' + originalOutcome._id)
                    .send(outcome)
                    .expect(400, done);
            });

            it('should return 400 if effectiveDate is missing', function (done) {
                delete outcome.effectiveDate;

                agent.put('/api/outcomes/' + originalOutcome._id)
                    .send(outcome)
                    .expect(400, done);
            });

        });

        describe('delete', function () {

            it('should be able to delete', function (done) {
                agent.delete('/api/outcomes/' + originalOutcome._id)
                    .expect(204, done);
            });

            it('should return 404 if id dont exist', function (done) {
                agent.delete('/api/outcomes/56c9d89796ae562c201713c5')
                    .expect(404, done);
            });

        });
    });
});

