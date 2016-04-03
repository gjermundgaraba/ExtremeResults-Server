var should = require('should'),
    request = require('supertest'),
    server,
    mongoose = require('mongoose'),
    HotSpotBucket,
    User,
    token,
    otherUserToken,
    agent;


describe('Hot Spot Bucket ITs', function () {

    beforeEach(function (done) {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        HotSpotBucket = mongoose.model('HotSpotBucket');

        User = mongoose.model('User');
        var itUser = {
            username: 'test',
            password: 'password'
        };

        var otherItUser = {
            username: 'test2',
            password: 'password'
        };

        var user = new User();
        user.local.username = itUser.username;
        user.local.password = itUser.password;
        user.save();

        var otherUser = new User();
        otherUser.local.username = otherItUser.username;
        otherUser.local.password = otherItUser.password;
        otherUser.save();

        agent.post('/api/login')
            .send(itUser)
            .end(function (err, results) {
                token = results.body.token;

                agent.post('/api/login')
                    .send(otherItUser)
                    .end(function (err, results) {
                        otherUserToken = results.body.token;
                        done();
                    });
            });
    });

    afterEach(function (done) {
        HotSpotBucket.remove().exec()
            .then(function () {
                return User.remove().exec();
            })
            .then(function () {
                server.close(done);
            });
    });

    describe('/hotSpotBuckets', function () {

        describe('post', function () {
            it('should allow a hotSpotBucket to be posted properly', function (done) {
                var hotSpotBucket = {
                    name: 'Hot Spot Bucket Name',
                    hotSpots: ['Test']
                };

                agent.post('/api/hotSpotBuckets')
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(201)
                    .end(function (err, results) {
                        results.body.should.have.property('_id');
                        results.body.should.have.property('name', hotSpotBucket.name);
                        results.body.should.have.property('hotSpots', hotSpotBucket.hotSpots);
                        done();
                    });
            });

            it('should not allow a hotSpotBucket without name', function (done) {
                var hotSpotBucket = {
                    hotSpots: ['Test']
                };

                agent.post('/api/hotSpotBuckets')
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(400, done);
            });

            it('should allow a hotSpotBuckets even without hotSpots', function (done) {
                var hotSpotBucket = {
                    name: 'Hot Spot Bucket Name'
                };

                agent.post('/api/hotSpotBuckets')
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(201, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                var hotSpotBucket = {
                    name: 'Hot Spot Bucket Name',
                    hotSpots: ['Test']
                };

                agent.post('/api/hotSpotBuckets')
                    .send(hotSpotBucket)
                    .expect(401, done);
            });
        });

        describe('get', function () {
            var hotSpotBucket1,
                hotSpotBucket2,
                hotSpotBucket3,
                otherUsersHotSpotBucket;

            beforeEach(function (done) {
                hotSpotBucket1 = {
                    name: 'Hot Spot Bucket 1 Name',
                    hotSpots: ['Test']
                };

                hotSpotBucket2 = {
                    name: 'Hot Spot Bucket 2 Name',
                    hotSpots: ['Test', 'Test2']
                };

                hotSpotBucket3 = {
                    name: 'Hot Spot Bucket 3 Name',
                    hotSpots: ['Test', 'Test1232']
                };

                otherUsersHotSpotBucket = {
                    name: 'Hot Spot Bucket For Other User Name',
                    hotSpots: ['Test', 'Test1232']
                };

                // Callback hell commencing!
                // TODO: Consider supertest-as-promised
                agent.post('/api/hotSpotBuckets')
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket1)
                    .end(function () {
                        agent.post('/api/hotSpotBuckets')
                            .set('Authorization', 'bearer ' + token)
                            .send(hotSpotBucket2)
                            .end(function () {
                                agent.post('/api/hotSpotBuckets')
                                    .set('Authorization', 'bearer ' + token)
                                    .send(hotSpotBucket3)
                                    .end(function () {
                                        agent.post('/api/hotSpotBuckets')
                                            .set('Authorization', 'bearer ' + otherUserToken)
                                            .send(otherUsersHotSpotBucket)
                                            .end(done);
                                    });
                            });
                    });
            });

            it('should get all hotSpotBuckets', function (done) {
                agent.get('/api/hotSpotBuckets')
                    .set('Authorization', 'bearer ' + token)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.length.should.be.exactly(3);

                        results.body[0].should.have.property('_id');
                        results.body[0].should.have.property('name', hotSpotBucket1.name);
                        results.body[0].should.have.property('hotSpots', hotSpotBucket1.hotSpots);

                        results.body[1].should.have.property('_id');
                        results.body[1].should.have.property('name', hotSpotBucket2.name);
                        results.body[1].should.have.property('hotSpots', hotSpotBucket2.hotSpots);

                        results.body[2].should.have.property('_id');
                        results.body[2].should.have.property('name', hotSpotBucket3.name);
                        results.body[2].should.have.property('hotSpots', hotSpotBucket3.hotSpots);

                        done();
                    });
            });

            it('should only get hotSpotBuckets for that user', function (done) {
                agent.get('/api/hotSpotBuckets')
                    .set('Authorization', 'bearer ' + otherUserToken)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.length.should.be.exactly(1);

                        results.body[0].should.have.property('_id');
                        results.body[0].should.have.property('name', otherUsersHotSpotBucket.name);
                        results.body[0].should.have.property('hotSpots', otherUsersHotSpotBucket.hotSpots);

                        done();
                    });
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.get('/api/hotSpotBuckets')
                    .expect(401, done);
            });
        });
    });

    describe('/hotSpotBuckets/:hotSpotBucketId', function () {
        var hotSpotBucket,
            otherUsersHotSpotBucket,
            originalHotSpotBucket,
            originalOtherUsersHotSpotBucket;

        beforeEach(function (done) {
            hotSpotBucket = {
                name: 'Hot Spot Bucket Name',
                hotSpots: ['Test', 'Test1232']
            };

            otherUsersHotSpotBucket = {
                name: 'Hot Spot Bucket Ohter Users Name',
                    hotSpots: ['Test', 'Test1232']
            };

            agent.post('/api/hotSpotBuckets')
                .set('Authorization', 'bearer ' + token)
                .send(hotSpotBucket)
                .end(function (err, results) {
                    originalHotSpotBucket = results.body;

                    agent.post('/api/hotSpotBuckets')
                        .set('Authorization', 'bearer ' + otherUserToken)
                        .send(otherUsersHotSpotBucket)
                        .end(function (err, results) {
                            originalOtherUsersHotSpotBucket = results.body;

                            done();
                        });
                });
        });

        describe('put', function () {

            it('should be able to put an object', function (done) {
                var newName = 'New Name';
                var newHotSpots = ['test123', 'test1234', 'derp'];

                hotSpotBucket.name = newName;
                hotSpotBucket.hotSpots = newHotSpots;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(200)
                    .end(function (err, results) {
                        results.body.should.have.property('name', newName);
                        results.body.should.have.property('hotSpots', newHotSpots);
                        done();
                    });
            });

            it('should return 404 if id dont exist', function (done) {
                agent.put('/api/hotSpotBuckets/56c9d89796ae562c201713c5')
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(404, done);
            });

            it('should return 400 if name is missing', function (done) {
                delete hotSpotBucket.name;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(400, done);
            });

            it('should return 200 even if hotSpots is missing', function (done) {
                delete hotSpotBucket.hotSpots;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .set('Authorization', 'bearer ' + token)
                    .send(hotSpotBucket)
                    .expect(200, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                var newName = 'New Name';
                var newHotSpots = ['test123', 'test1234', 'derp'];

                hotSpotBucket.name = newName;
                hotSpotBucket.hotSpots = newHotSpots;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .send(hotSpotBucket)
                    .expect(401, done);
            });

            it('should return 403 if user dont have access', function (done) {
                var newName = 'New Name';
                var newHotSpots = ['test123', 'test1234', 'derp'];

                hotSpotBucket.name = newName;
                hotSpotBucket.hotSpots = newHotSpots;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .set('Authorization', 'bearer ' + otherUserToken)
                    .send(hotSpotBucket)
                    .expect(403, done);
            });

        });

        describe('delete', function () {

            it('should be able to delete', function (done) {
                agent.delete('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .set('Authorization', 'bearer ' + token)
                    .expect(204, done);
            });

            it('should return 404 if id dont exist', function (done) {
                agent.delete('/api/hotSpotBuckets/56c9d89796ae562c201713c5')
                    .set('Authorization', 'bearer ' + token)
                    .expect(404, done);
            });

            it('should return 401 if no token is sent in', function (done) {
                agent.delete('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .expect(401, done);
            });

            it('should return 403 if user dont have access', function (done) {
                agent.delete('/api/hotSpotBuckets/' + originalOtherUsersHotSpotBucket._id)
                    .set('Authorization', 'bearer ' + token)
                    .expect(403, done);
            });

        });
    });
});

