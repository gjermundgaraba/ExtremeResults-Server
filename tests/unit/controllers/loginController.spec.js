describe("Login Controller", function() {
    var loginController,
        responseMock,
        requestMock;

    beforeEach(function() {
        requestMock = {
            body: {}
        };

        responseMock = {
            status: function () {
                return responseMock;
            },
            send: function () {},
            json: function () {}
        };

        loginController = require('../../../controllers/loginController')();
    });

    describe('/register', function () {
        describe('post', function () {

            it('should send back 200', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                loginController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(200);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });
    });

});
