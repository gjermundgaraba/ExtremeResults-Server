var should = require('should'),
    request = require('supertest'),
    server,
    mongoose = require('mongoose'),
    User,
    agent;


describe('Register ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        User = mongoose.model('User');
    });

    afterEach(function (done) {
        User.remove().exec()
            .then(function () {
                server.close(done);
            });
    });

    describe('/register', function () {

        describe('post', function () {
            it('should allow user to register', function (done) {
                var user = {
                    username: 'test',
                    password: 'ThisIsTestPassword123NotVeryGoodTho'
                };

                agent.post('/api/register')
                    .send(user)
                    .expect(201, done);
            });
        });

    });
});

