var should = require('should'),
    request = require('supertest'),
    server,
    mongoose = require('mongoose'),
    Reflection,
    agent;


describe('Reflection ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        Reflection = mongoose.model('Reflection');
    });

    afterEach(function (done) {
        Reflection.remove().exec()
            .then(function () {
                server.close(done);
            });

    });

    describe('/reflections', function () {

        describe('post', function () {
            it('should allow a reflection to be posted properly', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(201)
                    .end(function (err, results) {
                        results.body.should.have.property('_id');
                        results.body.should.have.property('typeName', reflection.typeName);
                        results.body.should.have.property('firstThingThatWentWell', reflection.firstThingThatWentWell);
                        results.body.should.have.property('secondThingThatWentWell', reflection.secondThingThatWentWell);
                        results.body.should.have.property('thirdThingThatWentWell', reflection.thirdThingThatWentWell);
                        results.body.should.have.property('firstThingToImprove', reflection.firstThingToImprove);
                        results.body.should.have.property('secondThingToImprove', reflection.secondThingToImprove);
                        results.body.should.have.property('thirdThingToImprove', reflection.thirdThingToImprove);
                        results.body.should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should not allow a reflection without typeName', function (done) {
                var reflection = {
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });

            it('should not allow a reflection without firstThingThatWentWell', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });

            it('should not allow a reflection without secondThingThatWentWell', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });
            it('should not allow a reflection without thirdThingThatWentWell', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });
            it('should not allow a reflection without firstThingToImprove', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });
            it('should not allow a reflection without secondThingToImprove', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });
            it('should not allow a reflection without thirdThingToImprove', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });

            it('should not allow a reflection without effectiveDate', function (done) {
                var reflection = {
                    typeName: 'Daily',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve'
                };

                agent.post('/api/reflections')
                    .send(reflection)
                    .expect(400, done);
            });
        });

        describe('get', function () {
            var reflection1,
                reflection2,
                reflection3;

            beforeEach(function (done) {
                reflection1 = {
                    typeName: 'Weekly',
                    firstThingThatWentWell: 'The First Weekly Thing That Went Well',
                    secondThingThatWentWell: 'The Second Weekly Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Weekly Thing That Went Well',
                    firstThingToImprove: 'The First Weekly Thing To Improve',
                    secondThingToImprove: 'The Second Weekly Thing To Improve',
                    thirdThingToImprove: 'The Third Weekly Thing To Improve',
                    effectiveDate: new Date()
                };

                reflection2 = {
                    typeName: 'Monthly',
                    firstThingThatWentWell: 'The First Monthly Thing That Went Well',
                    secondThingThatWentWell: 'The Second Monthly Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Monthly Thing That Went Well',
                    firstThingToImprove: 'The First Monthly Thing To Improve',
                    secondThingToImprove: 'The Second Monthly Thing To Improve',
                    thirdThingToImprove: 'The Third Monthly Thing To Improve',
                    effectiveDate: new Date()
                };

                reflection3 = {
                    typeName: 'Yearly',
                    firstThingThatWentWell: 'The First Yearly Thing That Went Well',
                    secondThingThatWentWell: 'The Second Yearly Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Yearly Thing That Went Well',
                    firstThingToImprove: 'The First Yearly Thing To Improve',
                    secondThingToImprove: 'The Second Yearly Thing To Improve',
                    thirdThingToImprove: 'The Third Yearly Thing To Improve',
                    effectiveDate: new Date()
                };

                // Callback hell commencing!
                // TODO: Consider supertest-as-promised
                agent.post('/api/reflections')
                    .send(reflection1)
                    .end(function () {
                        agent.post('/api/reflections')
                            .send(reflection2)
                            .end(function () {
                                agent.post('/api/reflections')
                                    .send(reflection3)
                                    .end(done);
                            });
                    });
            });

            it('should get all reflections', function (done) {
                agent.get('/api/reflections')
                    .expect(200)
                    .end(function (err, results) {
                        results.body.length.should.be.exactly(3);

                        results.body[0].should.have.property('_id');
                        results.body[0].should.have.property('typeName', reflection1.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', reflection1.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', reflection1.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', reflection1.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', reflection1.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', reflection1.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', reflection1.thirdThingToImprove);
                        results.body[0].should.have.property('effectiveDate');

                        results.body[1].should.have.property('_id');
                        results.body[1].should.have.property('typeName', reflection2.typeName);
                        results.body[1].should.have.property('firstThingThatWentWell', reflection2.firstThingThatWentWell);
                        results.body[1].should.have.property('secondThingThatWentWell', reflection2.secondThingThatWentWell);
                        results.body[1].should.have.property('thirdThingThatWentWell', reflection2.thirdThingThatWentWell);
                        results.body[1].should.have.property('firstThingToImprove', reflection2.firstThingToImprove);
                        results.body[1].should.have.property('secondThingToImprove', reflection2.secondThingToImprove);
                        results.body[1].should.have.property('thirdThingToImprove', reflection2.thirdThingToImprove);
                        results.body[1].should.have.property('effectiveDate');

                        results.body[2].should.have.property('_id');
                        results.body[2].should.have.property('typeName', reflection3.typeName);
                        results.body[2].should.have.property('firstThingThatWentWell', reflection3.firstThingThatWentWell);
                        results.body[2].should.have.property('secondThingThatWentWell', reflection3.secondThingThatWentWell);
                        results.body[2].should.have.property('thirdThingThatWentWell', reflection3.thirdThingThatWentWell);
                        results.body[2].should.have.property('firstThingToImprove', reflection3.firstThingToImprove);
                        results.body[2].should.have.property('secondThingToImprove', reflection3.secondThingToImprove);
                        results.body[2].should.have.property('thirdThingToImprove', reflection3.thirdThingToImprove);
                        results.body[2].should.have.property('effectiveDate');
                        done();
                    });
            });
        });
    });

    describe('/reflections/:reflectionId', function () {
        var reflection,
            originalReflection;

        beforeEach(function (done) {
            reflection = {
                typeName: 'Weekly',
                firstThingThatWentWell: 'The First Weekly Thing That Went Well',
                secondThingThatWentWell: 'The Second Weekly Thing That Went Well',
                thirdThingThatWentWell: 'The Third Weekly Thing That Went Well',
                firstThingToImprove: 'The First Weekly Thing To Improve',
                secondThingToImprove: 'The Second Weekly Thing To Improve',
                thirdThingToImprove: 'The Third Weekly Thing To Improve',
                effectiveDate: new Date()
            };

            agent.post('/api/reflections')
                .send(reflection)
                .end(function (err, results) {
                    originalReflection = results.body;
                    done();
                });
        });

        describe('get', function () {

            it('should get the reflection back', function (done) {
                agent.get('/api/reflections/' + originalReflection._id)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.should.have.property('_id', originalReflection._id);
                        results.body.should.have.property('typeName', originalReflection.typeName);
                        results.body.should.have.property('firstThingThatWentWell', originalReflection.firstThingThatWentWell);
                        results.body.should.have.property('secondThingThatWentWell', originalReflection.secondThingThatWentWell);
                        results.body.should.have.property('thirdThingThatWentWell', originalReflection.thirdThingThatWentWell);
                        results.body.should.have.property('firstThingToImprove', originalReflection.firstThingToImprove);
                        results.body.should.have.property('secondThingToImprove', originalReflection.secondThingToImprove);
                        results.body.should.have.property('thirdThingToImprove', originalReflection.thirdThingToImprove);
                        results.body.should.have.property('effectiveDate', originalReflection.effectiveDate);
                        done();
                    });
            });

            it('should return 404 if id dont exist', function (done) {
                agent.get('/api/reflections/56c9d89796ae562c201713c5')
                    .expect(404, done);
            });

        });

        describe('put', function () {

            it('should be able to put an object', function (done) {
                var newTypeName = 'Monthly';
                var newFirstThingThatWentWell = 'The First Monthly Thing That Went Well';
                var newSecondThingThatWentWell = 'The Second Monthly Thing That Went Well';
                var newThirdThingThatWentWell = 'The Third Monthly Thing That Went Well';
                var newFirstThingToImprove = 'The First Monthly Thing To Improve';
                var newSecondThingToImprove = 'The Second Monthly Thing To Improve';
                var newThirdThingToImprove = 'The Third Monthly Thing To Improve';

                reflection.typeName = newTypeName;
                reflection.firstThingThatWentWell = newFirstThingThatWentWell;
                reflection.secondThingThatWentWell = newSecondThingThatWentWell;
                reflection.thirdThingThatWentWell = newThirdThingThatWentWell;
                reflection.firstThingToImprove = newFirstThingToImprove;
                reflection.secondThingToImprove = newSecondThingToImprove;
                reflection.thirdThingToImprove = newThirdThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.should.have.property('typeName', newTypeName);
                        results.body.should.have.property('firstThingThatWentWell', newFirstThingThatWentWell);
                        results.body.should.have.property('secondThingThatWentWell', newSecondThingThatWentWell);
                        results.body.should.have.property('thirdThingThatWentWell', newThirdThingThatWentWell);
                        results.body.should.have.property('firstThingToImprove', newFirstThingToImprove);
                        results.body.should.have.property('secondThingToImprove', newSecondThingToImprove);
                        results.body.should.have.property('thirdThingToImprove', newThirdThingToImprove);
                        results.body.should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should return 404 if id dont exist', function (done) {
                agent.put('/api/reflections/56c9d89796ae562c201713c5')
                    .send(reflection)
                    .expect(404, done);
            });

            it('should return 400 if typeName is missing', function (done) {
                delete reflection.typeName;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if firstThingThatWentWell is missing', function (done) {
                delete reflection.firstThingThatWentWell;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if secondThingThatWentWell is missing', function (done) {
                delete reflection.secondThingThatWentWell;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if thirdThingThatWentWell is missing', function (done) {
                delete reflection.thirdThingThatWentWell;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if firstThingToImprove is missing', function (done) {
                delete reflection.firstThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if secondThingToImprove is missing', function (done) {
                delete reflection.secondThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if thirdThingToImprove is missing', function (done) {
                delete reflection.thirdThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if effectiveDate is missing', function (done) {
                delete reflection.effectiveDate;

                agent.put('/api/reflections/' + originalReflection._id)
                    .send(reflection)
                    .expect(400, done);
            });

        });

        describe('delete', function () {

            it('should be able to delete', function (done) {
                agent.delete('/api/reflections/' + originalReflection._id)
                    .expect(204, done);
            });

            it('should return 404 if id dont exist', function (done) {
                agent.delete('/api/reflections/56c9d89796ae562c201713c5')
                    .expect(404, done);
            });

        });
    });
});

