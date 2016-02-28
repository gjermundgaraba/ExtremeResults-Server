var should = require('should'),
    request = require('supertest'),
    server,
    mongoose = require('mongoose'),
    HotSpotBucket,
    agent;


describe('Hot Spot Bucket ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        HotSpotBucket = mongoose.model('HotSpotBucket');
    });

    afterEach(function (done) {
        HotSpotBucket.remove().exec()
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
                    .send(hotSpotBucket)
                    .expect(400, done);
            });

            it('should allow a hotSpotBuckets even without hotSpots', function (done) {
                var hotSpotBucket = {
                    name: 'Hot Spot Bucket Name'
                };

                agent.post('/api/hotSpotBuckets')
                    .send(hotSpotBucket)
                    .expect(201, done);
            });
        });

        describe('get', function () {
            var hotSpotBucket1,
                hotSpotBucket2,
                hotSpotBucket3;

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

                // Callback hell commencing!
                // TODO: Consider supertest-as-promised
                agent.post('/api/hotSpotBuckets')
                    .send(hotSpotBucket1)
                    .end(function () {
                        agent.post('/api/hotSpotBuckets')
                            .send(hotSpotBucket2)
                            .end(function () {
                                agent.post('/api/hotSpotBuckets')
                                    .send(hotSpotBucket3)
                                    .end(done);
                            });
                    });
            });

            it('should get all hotSpotBuckets', function (done) {
                agent.get('/api/hotSpotBuckets')
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
        });
    });

    describe('/hotSpotBuckets/:hotSpotBucketId', function () {
        var hotSpotBucket,
            originalHotSpotBucket;

        beforeEach(function (done) {
            hotSpotBucket = {
                name: 'Hot Spot Bucket 3 Name',
                hotSpots: ['Test', 'Test1232']
            };

            agent.post('/api/hotSpotBuckets')
                .send(hotSpotBucket)
                .end(function (err, results) {
                    originalHotSpotBucket = results.body;
                    done();
                });
        });

        describe('put', function () {

            it('should be able to put an object', function (done) {
                var newName = 'New Name';
                var newHotSpots = ['test123', 'test1234', 'derp'];

                hotSpotBucket.name = newName;
                hotSpotBucket.hotSpots = newHotSpots;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
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
                    .send(hotSpotBucket)
                    .expect(404, done);
            });

            it('should return 400 if name is missing', function (done) {
                delete hotSpotBucket.name;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .send(hotSpotBucket)
                    .expect(400, done);
            });

            it('should return 200 even if hotSpots is missing', function (done) {
                delete hotSpotBucket.hotSpots;

                agent.put('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .send(hotSpotBucket)
                    .expect(200, done);
            });

        });

        describe('delete', function () {

            it('should be able to delete', function (done) {
                agent.delete('/api/hotSpotBuckets/' + originalHotSpotBucket._id)
                    .expect(204, done);
            });

            it('should return 404 if id dont exist', function (done) {
                agent.delete('/api/hotSpotBuckets/56c9d89796ae562c201713c5')
                    .expect(404, done);
            });

        });
    });
});

