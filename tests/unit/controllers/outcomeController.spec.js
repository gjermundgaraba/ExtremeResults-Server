describe("Outcome Controller", function() {
    var outcomeController,
        responseMock,
        requestMock,
        OutcomeMock;

    beforeEach(function() {
        OutcomeMock = function () {};
        OutcomeMock.prototype.save = function () {};
        OutcomeMock.prototype.remove = function () {};
        OutcomeMock.prototype.validateSync = function () {};
        OutcomeMock.find = function () {};

        requestMock = {
            user: {},
            body: {}
        };

        responseMock = {
            status: function () {
                return responseMock;
            },
            send: function () {},
            json: function () {}
        };

        outcomeController = require('../../../controllers/outcomeController')(OutcomeMock);
    });

    describe('/outcomes', function () {
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
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callBack) {
                    callBack(undefined, fakeOutcomes);
                });
                spyOn(responseMock, 'json');
                outcomeController.get(requestMock, responseMock);

                expect(OutcomeMock.find).toHaveBeenCalled();
                expect(responseMock.json).toHaveBeenCalledWith(fakeOutcomes);
            });

            it('should send back status code 500 on failure', function () {
                var error = {};
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callBack) {
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

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(OutcomeMock.prototype, 'save').and.callFake(function (callBack) {
                     callBack(errorMessage);
                });

                outcomeController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 201 on save success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(OutcomeMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                outcomeController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(201);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });
    });

    describe('/outcomes/:outcomeId', function () {

        beforeEach(function () {
            requestMock.outcome = new OutcomeMock();
            requestMock.outcome.typeName = 'TypeNameTest';
            requestMock.outcome.firstStory = 'StoryTest1';
            requestMock.outcome.secondStory = 'StoryTest2';
            requestMock.outcome.thirdStory = 'StoryTest3';
            requestMock.outcome.effectiveDate = new Date();
        });

        describe('get', function () {
            it('should send the outcome back', function () {
                spyOn(responseMock, 'json');

                outcomeController.outcomeId.get(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(requestMock.outcome);
            });
        });

        describe('put', function () {
            it('should set all fields to the ones from the body', function () {
                requestMock.body.typeName = 'bodyTypeName';
                requestMock.body.firstStory = 'bodyFirstStory';
                requestMock.body.secondStory = 'bodySecondStory';
                requestMock.body.thirdStory = 'bodyThirdStory';
                requestMock.body.effectiveDate = new Date();

                outcomeController.outcomeId.put(requestMock, responseMock);

                expect(requestMock.outcome.typeName).toEqual(requestMock.body.typeName);
                expect(requestMock.outcome.firstStory).toEqual(requestMock.body.firstStory);
                expect(requestMock.outcome.secondStory).toEqual(requestMock.body.secondStory);
                expect(requestMock.outcome.thirdStory).toEqual(requestMock.body.thirdStory);
                expect(requestMock.outcome.effectiveDate).toEqual(requestMock.body.effectiveDate);
            });

            it('should do validation on outcome', function () {
                spyOn(OutcomeMock.prototype, 'validateSync');

                outcomeController.outcomeId.put(requestMock, responseMock);

                expect(OutcomeMock.prototype.validateSync).toHaveBeenCalled();
            });

            it('should send 400 back with message if validation fails', function () {
                var validationMessage = 'SomeValidationErrorMessage';
                var validationFailureObject = { toString: function () { return validationMessage} };
                spyOn(OutcomeMock.prototype, 'validateSync').and.returnValue(validationFailureObject);
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send');

                outcomeController.outcomeId.put(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalledWith(validationMessage);
            });

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(OutcomeMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                outcomeController.outcomeId.put(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back updated object on save success', function () {
                spyOn(responseMock, 'json').and.callThrough();
                spyOn(OutcomeMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                outcomeController.outcomeId.put(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(requestMock.outcome);
            });

        });

        describe('delete', function () {

            it('should send 500 and an error message back on remove error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(OutcomeMock.prototype, 'remove').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                outcomeController.outcomeId.delete(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 204 on remove success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(OutcomeMock.prototype, 'remove').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                outcomeController.outcomeId.delete(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(204);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });

    });


});
