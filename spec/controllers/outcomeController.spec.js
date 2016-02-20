describe("Outcome Controller", function() {
    var outcomeController,
        responseMock,
        requestMock,
        OutcomeMock;

    beforeEach(function() {
        OutcomeMock = function () {};
        OutcomeMock.prototype.save = function () {};
        OutcomeMock.prototype.validateSync = function () {};
        OutcomeMock.find = function () {};

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

        outcomeController = require('../../controllers/outcomeController')(OutcomeMock);
    });

    describe('get', function () {
        it('should get all outcomes', function () {
            var fakeOutcomes = [
                {
                    firstStory: 'Test1'
                },
                {
                    firstStory: 'Test123'
                }
            ];
            spyOn(OutcomeMock, 'find').and.callFake(function (callBack) {
                callBack(undefined, fakeOutcomes);
            });
            spyOn(responseMock, 'json');
            outcomeController.get(requestMock, responseMock);

            expect(OutcomeMock.find).toHaveBeenCalled();
            expect(responseMock.json).toHaveBeenCalledWith(fakeOutcomes);
        });

        it('should send back status code 500 on failure', function () {
            var error = {};
            spyOn(OutcomeMock, 'find').and.callFake(function (callBack) {
                callBack(error, undefined);
            });
            spyOn(responseMock, 'status').and.callThrough();
            spyOn(responseMock, 'send').and.callThrough();

            outcomeController.get(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(500);
            expect(responseMock.send).toHaveBeenCalledWith(error);
        });
    });

    describe('post', function () {

        it('should do validation on body', function () {
            spyOn(OutcomeMock.prototype, 'validateSync');

            outcomeController.post(requestMock, responseMock);

            expect(OutcomeMock.prototype.validateSync).toHaveBeenCalled();
        });

        it('should send 400 back with message if validation fails', function () {
            var validationMessage = 'somesome';
            var validationFailureObject = { toString: function () { return validationMessage} };
            spyOn(OutcomeMock.prototype, 'validateSync').and.returnValue(validationFailureObject);
            spyOn(responseMock, 'status').and.callThrough();
            spyOn(responseMock, 'send');

            outcomeController.post(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(400);
            expect(responseMock.send).toHaveBeenCalledWith(validationMessage);
        });

    });
});
