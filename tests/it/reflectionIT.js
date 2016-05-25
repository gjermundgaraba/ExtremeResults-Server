var should = require('should'),
    request = require('supertest-as-promised'),
    server,
    mongoose = require('mongoose'),
    Reflection,
    User,
    token,
    otherUserToken,
    agent;


describe('Reflection ITs', function () {

    beforeEach(function (done) {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
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

        agent.post('/api/register')
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
                done();
            });
    });

    afterEach(function (done) {
        Reflection.remove().exec()
            .then(function () {
                return User.remove().exec();
            })
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
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(201)
                    .then(function (results) {
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
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
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 401 if no token is sent in', function (done) {
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
                    .expect(401, done);
            });
        });

        describe('get', function () {
            var reflection1,
                reflection2,
                reflection3,
                otherUsersReflection;

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

                otherUsersReflection = {
                    typeName: 'Weekly',
                    firstThingThatWentWell: 'The First Other Users Weekly Thing That Went Well',
                    secondThingThatWentWell: 'The Second Other Users Weekly Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Other Users Weekly Thing That Went Well',
                    firstThingToImprove: 'The First Other Users Weekly Thing To Improve',
                    secondThingToImprove: 'The Second Other Users Weekly Thing To Improve',
                    thirdThingToImprove: 'The Third Other Users Weekly Thing To Improve',
                    effectiveDate: new Date()
                };

                agent.post('/api/reflections')
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection1)
                    .then(function () {
                        return agent.post('/api/reflections')
                            .set('Authorization', 'bearer ' + token)
                            .send(reflection2);
                    })
                    .then(function () {
                        return agent.post('/api/reflections')
                            .set('Authorization', 'bearer ' + token)
                            .send(reflection3);
                    })
                    .then(function () {
                        return agent.post('/api/reflections')
                            .set('Authorization', 'bearer ' + otherUserToken)
                            .send(otherUsersReflection);
                    })
                    .then(function () {
                        done();
                    });
            });

            it('should get all reflections', function (done) {
                agent.get('/api/reflections')
                    .set('Authorization', 'bearer ' + token)
                    .expect(200)
                    .then(function (results) {
                        results.body.length.should.be.exactly(3);

                        results.body[0].should.have.property('objectId');
                        results.body[0].should.have.property('typeName', reflection1.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', reflection1.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', reflection1.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', reflection1.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', reflection1.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', reflection1.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', reflection1.thirdThingToImprove);
                        results.body[0].should.have.property('className', 'Reflection');
                        results.body[0].should.have.property('effectiveDate');

                        results.body[1].should.have.property('objectId');
                        results.body[1].should.have.property('typeName', reflection2.typeName);
                        results.body[1].should.have.property('firstThingThatWentWell', reflection2.firstThingThatWentWell);
                        results.body[1].should.have.property('secondThingThatWentWell', reflection2.secondThingThatWentWell);
                        results.body[1].should.have.property('thirdThingThatWentWell', reflection2.thirdThingThatWentWell);
                        results.body[1].should.have.property('firstThingToImprove', reflection2.firstThingToImprove);
                        results.body[1].should.have.property('secondThingToImprove', reflection2.secondThingToImprove);
                        results.body[1].should.have.property('thirdThingToImprove', reflection2.thirdThingToImprove);
                        results.body[1].should.have.property('className', 'Reflection');
                        results.body[1].should.have.property('effectiveDate');

                        results.body[2].should.have.property('objectId');
                        results.body[2].should.have.property('typeName', reflection3.typeName);
                        results.body[2].should.have.property('firstThingThatWentWell', reflection3.firstThingThatWentWell);
                        results.body[2].should.have.property('secondThingThatWentWell', reflection3.secondThingThatWentWell);
                        results.body[2].should.have.property('thirdThingThatWentWell', reflection3.thirdThingThatWentWell);
                        results.body[2].should.have.property('firstThingToImprove', reflection3.firstThingToImprove);
                        results.body[2].should.have.property('secondThingToImprove', reflection3.secondThingToImprove);
                        results.body[2].should.have.property('thirdThingToImprove', reflection3.thirdThingToImprove);
                        results.body[2].should.have.property('className', 'Reflection');
                        results.body[2].should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should skip reflections if offset param is sent in', function (done) {
                agent.get('/api/reflections')
                    .query({ offset: '1' })
                    .set('Authorization', 'bearer ' + token)
                    .expect(200)
                    .then(function (results) {
                        results.body.length.should.be.exactly(2);

                        results.body[0].should.have.property('objectId');
                        results.body[0].should.have.property('typeName', reflection2.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', reflection2.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', reflection2.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', reflection2.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', reflection2.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', reflection2.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', reflection2.thirdThingToImprove);
                        results.body[0].should.have.property('className', 'Reflection');
                        results.body[0].should.have.property('effectiveDate');

                        results.body[1].should.have.property('objectId');
                        results.body[1].should.have.property('typeName', reflection3.typeName);
                        results.body[1].should.have.property('firstThingThatWentWell', reflection3.firstThingThatWentWell);
                        results.body[1].should.have.property('secondThingThatWentWell', reflection3.secondThingThatWentWell);
                        results.body[1].should.have.property('thirdThingThatWentWell', reflection3.thirdThingThatWentWell);
                        results.body[1].should.have.property('firstThingToImprove', reflection3.firstThingToImprove);
                        results.body[1].should.have.property('secondThingToImprove', reflection3.secondThingToImprove);
                        results.body[1].should.have.property('thirdThingToImprove', reflection3.thirdThingToImprove);
                        results.body[1].should.have.property('className', 'Reflection');
                        results.body[1].should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should limit reflections if limit param is sent in', function (done) {
                agent.get('/api/reflections')
                    .query({ limit: '2' })
                    .set('Authorization', 'bearer ' + token)
                    .expect(200)
                    .then(function (results) {
                        results.body.length.should.be.exactly(2);

                        results.body[0].should.have.property('objectId');
                        results.body[0].should.have.property('typeName', reflection1.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', reflection1.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', reflection1.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', reflection1.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', reflection1.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', reflection1.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', reflection1.thirdThingToImprove);
                        results.body[0].should.have.property('className', 'Reflection');
                        results.body[0].should.have.property('effectiveDate');

                        results.body[1].should.have.property('objectId');
                        results.body[1].should.have.property('typeName', reflection2.typeName);
                        results.body[1].should.have.property('firstThingThatWentWell', reflection2.firstThingThatWentWell);
                        results.body[1].should.have.property('secondThingThatWentWell', reflection2.secondThingThatWentWell);
                        results.body[1].should.have.property('thirdThingThatWentWell', reflection2.thirdThingThatWentWell);
                        results.body[1].should.have.property('firstThingToImprove', reflection2.firstThingToImprove);
                        results.body[1].should.have.property('secondThingToImprove', reflection2.secondThingToImprove);
                        results.body[1].should.have.property('thirdThingToImprove', reflection2.thirdThingToImprove);
                        results.body[1].should.have.property('className', 'Reflection');
                        results.body[1].should.have.property('effectiveDate');

                        done();
                    });
            });

            it('should paginate', function (done) {
                agent.get('/api/reflections')
                    .query({ limit: '2', offset: '0' })
                    .set('Authorization', 'bearer ' + token)
                    .expect(200)
                    .then(function (results) {
                        results.body.length.should.be.exactly(2);

                        results.body[0].should.have.property('objectId');
                        results.body[0].should.have.property('typeName', reflection1.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', reflection1.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', reflection1.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', reflection1.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', reflection1.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', reflection1.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', reflection1.thirdThingToImprove);
                        results.body[0].should.have.property('className', 'Reflection');
                        results.body[0].should.have.property('effectiveDate');

                        results.body[1].should.have.property('objectId');
                        results.body[1].should.have.property('typeName', reflection2.typeName);
                        results.body[1].should.have.property('firstThingThatWentWell', reflection2.firstThingThatWentWell);
                        results.body[1].should.have.property('secondThingThatWentWell', reflection2.secondThingThatWentWell);
                        results.body[1].should.have.property('thirdThingThatWentWell', reflection2.thirdThingThatWentWell);
                        results.body[1].should.have.property('firstThingToImprove', reflection2.firstThingToImprove);
                        results.body[1].should.have.property('secondThingToImprove', reflection2.secondThingToImprove);
                        results.body[1].should.have.property('thirdThingToImprove', reflection2.thirdThingToImprove);
                        results.body[1].should.have.property('className', 'Reflection');
                        results.body[1].should.have.property('effectiveDate');

                        return  agent.get('/api/reflections')
                            .query({ limit: '2', offset: '2' })
                            .set('Authorization', 'bearer ' + token)
                            .expect(200);
                    })
                    .then(function (results) {
                        results.body.length.should.be.exactly(1);

                        results.body[0].should.have.property('objectId');
                        results.body[0].should.have.property('typeName', reflection3.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', reflection3.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', reflection3.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', reflection3.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', reflection3.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', reflection3.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', reflection3.thirdThingToImprove);
                        results.body[0].should.have.property('className', 'Reflection');
                        results.body[0].should.have.property('effectiveDate');
                        done();
                    });
            });

            it('should return reflections only for the user', function (done) {
                agent.get('/api/reflections')
                    .set('Authorization', 'bearer ' + otherUserToken)
                    .expect(200)
                    .then(function (results) {
                        results.body.length.should.be.exactly(1);

                        results.body[0].should.have.property('objectId');
                        results.body[0].should.have.property('typeName', otherUsersReflection.typeName);
                        results.body[0].should.have.property('firstThingThatWentWell', otherUsersReflection.firstThingThatWentWell);
                        results.body[0].should.have.property('secondThingThatWentWell', otherUsersReflection.secondThingThatWentWell);
                        results.body[0].should.have.property('thirdThingThatWentWell', otherUsersReflection.thirdThingThatWentWell);
                        results.body[0].should.have.property('firstThingToImprove', otherUsersReflection.firstThingToImprove);
                        results.body[0].should.have.property('secondThingToImprove', otherUsersReflection.secondThingToImprove);
                        results.body[0].should.have.property('thirdThingToImprove', otherUsersReflection.thirdThingToImprove);
                        results.body[0].should.have.property('className', 'Reflection');
                        results.body[0].should.have.property('effectiveDate');

                        done();
                    });
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/reflections')
                    .expect(401, done);
            });
        });
    });

    describe('/reflections/:reflectionId', function () {
        var reflection,
            otherUsersReflection,
            originalReflection,
            originalOtherUsersReflection;

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

            otherUsersReflection = {
                typeName: 'Weekly',
                firstThingThatWentWell: 'The First Other Users Weekly Thing That Went Well',
                secondThingThatWentWell: 'The Second Other Users Weekly Thing That Went Well',
                thirdThingThatWentWell: 'The Third Other Users Weekly Thing That Went Well',
                firstThingToImprove: 'The First Other Users Weekly Thing To Improve',
                secondThingToImprove: 'The Second Other Users Weekly Thing To Improve',
                thirdThingToImprove: 'The Third Other Users Weekly Thing To Improve',
                effectiveDate: new Date()
            };

            agent.post('/api/reflections')
                .set('Authorization', 'bearer ' + token)
                .send(reflection)
                .then(function (results) {
                    originalReflection = results.body;

                    return agent.post('/api/reflections')
                        .set('Authorization', 'bearer ' + otherUserToken)
                        .send(otherUsersReflection);
                })
                .then (function (results) {
                    originalOtherUsersReflection = results.body;
                    done();
                })
        });

        describe('get', function () {

            it('should get the reflection back', function (done) {
                agent.get('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .expect(200)
                    .then(function (results) {
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
                    .set('Authorization', 'bearer ' + token)
                    .expect(404, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/reflections/' + originalReflection._id)
                    .expect(401, done);
            });

            it('should return 403 if user dont have access', function (done) {
                agent.get('/api/reflections/' + originalOtherUsersReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .expect(403, done);
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
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(200)
                    .then(function (results) {
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
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(404, done);
            });

            it('should return 400 if typeName is missing', function (done) {
                delete reflection.typeName;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if firstThingThatWentWell is missing', function (done) {
                delete reflection.firstThingThatWentWell;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if secondThingThatWentWell is missing', function (done) {
                delete reflection.secondThingThatWentWell;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if thirdThingThatWentWell is missing', function (done) {
                delete reflection.thirdThingThatWentWell;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if firstThingToImprove is missing', function (done) {
                delete reflection.firstThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if secondThingToImprove is missing', function (done) {
                delete reflection.secondThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if thirdThingToImprove is missing', function (done) {
                delete reflection.thirdThingToImprove;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 400 if effectiveDate is missing', function (done) {
                delete reflection.effectiveDate;

                agent.put('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(reflection)
                    .expect(400, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.put('/api/reflections/56c9d89796ae562c201713c5')
                    .send(reflection)
                    .expect(401, done);
            });

            it('should return 403 if user dont have access', function (done) {
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
                    .set('Authorization', 'bearer ' + otherUserToken)
                    .send(reflection)
                    .expect(403, done);
            })

        });

        describe('delete', function () {

            it('should be able to delete', function (done) {
                agent.delete('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + token)
                    .expect(204, done);
            });

            it('should return 404 if id dont exist', function (done) {
                agent.delete('/api/reflections/56c9d89796ae562c201713c5')
                    .set('Authorization', 'bearer ' + token)
                    .expect(404, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.delete('/api/reflections/' + originalReflection._id)
                    .expect(401, done);
            });

            it('should return 403 if user dont have access', function (done) {
                agent.delete('/api/reflections/' + originalReflection._id)
                    .set('Authorization', 'bearer ' + otherUserToken)
                    .expect(403, done);
            });

        });
    });
});

