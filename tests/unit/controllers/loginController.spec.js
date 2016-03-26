describe("Login Controller", function() {
    var loginController,
        responseMock,
        requestMock,
        jwtMock;

    beforeEach(function() {
        requestMock = {
            body: {}
        };

        jwtMock = {
            encode: function () {}
        };

        responseMock = {
            status: function () {
                return responseMock;
            },
            send: function () {},
            json: function () {}
        };

        loginController = require('../../../controllers/loginController')(jwtMock);
    });

    describe('/register', function () {
        describe('post', function () {

            it('should send back 200', function () {
                spyOn(responseMock, 'json').and.callThrough();

                loginController.post(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalled();
            });

            it('should send back the token created', function () {
                var token = 'tokenMock';
                spyOn(responseMock, 'json').and.callThrough();
                spyOn(jwtMock, 'encode').and.returnValue(token);

                loginController.post(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith({ token: token });
            });

        });
    });

});
