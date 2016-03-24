describe("Register Controller", function() {
    var registerController,
        responseMock,
        requestMock,
        UserMock;

    beforeEach(function() {
        UserMock = function () {};
        UserMock.prototype.local = {};
        UserMock.prototype.save = function () {};
        UserMock.prototype.remove = function () {};
        UserMock.prototype.validateSync = function () {};
        UserMock.find = function () {};

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

        registerController = require('../../../controllers/registerController')(UserMock);
    });

    describe('/register', function () {
        describe('post', function () {

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(UserMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                requestMock.body.username = 'test';
                requestMock.body.password = 'test';
                registerController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 201 on save success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(UserMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                requestMock.body.username = 'test';
                requestMock.body.password = 'test';
                registerController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(201);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });
    });

});
