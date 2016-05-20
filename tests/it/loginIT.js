var should = require('should'),
    request = require('supertest-as-promised'),
    server,
    mongoose = require('mongoose'),
    itUser,
    User,
    agent;


describe('Register ITs', function () {

    beforeEach(function () {
        delete require.cache[require.resolve('../../app.js')];
        server = require('../../app.js');
        agent = request.agent(server);
        User = mongoose.model('User');
    });

    beforeEach(function (done) {
        itUser = {
            username: 'test',
            password: 'password'
        };

        agent.post('/api/register')
            .send(itUser)
            .then(function () {
                done();
            })
    });

    afterEach(function (done) {
        User.remove().exec()
            .then(function () {
                server.close(done);
            });
    });

    describe('/login', function () {

        describe('post', function () {
            it('should allow user to login', function (done) {
                agent.post('/api/login')
                    .send(itUser)
                    .expect(200)
                    .then(function (results) {
                        results.body.should.have.property('token');
                        done();
                    });
            });

            it('should return 401 if password is wrong', function (done) {
                itUser.password = 'wrong';

                agent.post('/api/login')
                    .send(itUser)
                    .expect(401, done);
            });

            it('should return 401 if username doesnt exist', function (done) {
                itUser.username = 'noUserNameLikeThis';

                agent.post('/api/login')
                    .send(itUser)
                    .expect(401, done);
            });
        });

    });
});

