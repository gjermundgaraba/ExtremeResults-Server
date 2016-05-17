describe("Reflection Controller", function() {
    var reflectionController,
        responseMock,
        requestMock,
        ReflectionMock;

    beforeEach(function() {
        ReflectionMock = function () {};
        ReflectionMock.prototype.save = function () {};
        ReflectionMock.prototype.remove = function () {};
        ReflectionMock.prototype.validateSync = function () {};
        ReflectionMock.find = function () {};

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

        reflectionController = require('../../../controllers/reflectionController')(ReflectionMock);
    });

    describe('/reflections', function () {
        describe('get', function () {
            it('should get all reflections', function () {
                var fakeReflections = [
                    {
                        _id: '1234',
                        typeName: 'typeName1',
                        firstThingThatWentWell: 'WellTest11',
                        secondThingThatWentWell: 'WellTest12',
                        thirdThingThatWentWell: 'WellTest13',
                        firstThingToImprove: 'ImproveTest11',
                        secondThingToImprove: 'ImproveTest12',
                        thirdThingToImprove: 'ImproveTest13',
                        effectiveDate: new Date()
                    },
                    {
                        _id: '2345',
                        typeName: 'typeName2',
                        firstThingThatWentWell: 'WellTest21',
                        secondThingThatWentWell: 'WellTest22',
                        thirdThingThatWentWell: 'WellTest23',
                        firstThingToImprove: 'ImproveTest21',
                        secondThingToImprove: 'ImproveTest22',
                        thirdThingToImprove: 'ImproveTest23',
                        effectiveDate: new Date()
                    }
                ];
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callBack) {
                    callBack(undefined, fakeReflections);
                });
                spyOn(responseMock, 'json');
                reflectionController.get(requestMock, responseMock);

                expect(ReflectionMock.find).toHaveBeenCalled();

                var firstReflection = responseMock.json.calls.mostRecent().args[0][0];
                expect(firstReflection.objectId).toEqual(fakeReflections[0]._id);
                expect(firstReflection.typeName).toEqual(fakeReflections[0].typeName);
                expect(firstReflection.firstThingThatWentWell).toEqual(fakeReflections[0].firstThingThatWentWell);
                expect(firstReflection.secondThingThatWentWell).toEqual(fakeReflections[0].secondThingThatWentWell);
                expect(firstReflection.thirdThingThatWentWell).toEqual(fakeReflections[0].thirdThingThatWentWell);
                expect(firstReflection.firstThingToImprove).toEqual(fakeReflections[0].firstThingToImprove);
                expect(firstReflection.secondThingToImprove).toEqual(fakeReflections[0].secondThingToImprove);
                expect(firstReflection.thirdThingToImprove).toEqual(fakeReflections[0].thirdThingToImprove);
                expect(firstReflection.effectiveDate).toEqual(fakeReflections[0].effectiveDate);
                expect(firstReflection.className).toEqual('Reflection');

                var secondReflection = responseMock.json.calls.mostRecent().args[0][1];
                expect(secondReflection.objectId).toEqual(fakeReflections[1]._id);
                expect(secondReflection.typeName).toEqual(fakeReflections[1].typeName);
                expect(secondReflection.firstThingThatWentWell).toEqual(fakeReflections[1].firstThingThatWentWell);
                expect(secondReflection.secondThingThatWentWell).toEqual(fakeReflections[1].secondThingThatWentWell);
                expect(secondReflection.thirdThingThatWentWell).toEqual(fakeReflections[1].thirdThingThatWentWell);
                expect(secondReflection.firstThingToImprove).toEqual(fakeReflections[1].firstThingToImprove);
                expect(secondReflection.secondThingToImprove).toEqual(fakeReflections[1].secondThingToImprove);
                expect(secondReflection.thirdThingToImprove).toEqual(fakeReflections[1].thirdThingToImprove);
                expect(secondReflection.effectiveDate).toEqual(fakeReflections[1].effectiveDate);
                expect(secondReflection.className).toEqual('Reflection');
            });

            it('should send back status code 500 on failure', function () {
                var error = {};
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callBack) {
                    callBack(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                reflectionController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });
        });

        describe('post', function () {

            it('should do validation on body', function () {
                spyOn(ReflectionMock.prototype, 'validateSync');

                reflectionController.post(requestMock, responseMock);

                expect(ReflectionMock.prototype.validateSync).toHaveBeenCalled();
            });

            it('should send 400 back with message if validation fails', function () {
                var validationMessage = 'somesome';
                var validationFailureObject = { toString: function () { return validationMessage} };
                spyOn(ReflectionMock.prototype, 'validateSync').and.returnValue(validationFailureObject);
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send');

                reflectionController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalledWith(validationMessage);
            });

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(ReflectionMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                reflectionController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 201 on save success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(ReflectionMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                reflectionController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(201);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });
    });

    describe('/reflections/:reflectionId', function () {

        beforeEach(function () {
            requestMock.reflection = new ReflectionMock();
            requestMock.reflection.typeName = 'TypeNameTest';
            requestMock.reflection.firstThingThatWentWell = 'First Thing That Went Well';
            requestMock.reflection.secondThingThatWentWell = 'Second Thing That Went Well';
            requestMock.reflection.thirdThingThatWentWell = 'Third Thing That Went Well';
            requestMock.reflection.firstThingToImprove = 'First Thing To Improve';
            requestMock.reflection.secondThingToImprove = 'Second Thing To Improve';
            requestMock.reflection.thirdThingToImprove = 'Third Thing To Improve';
            requestMock.reflection.effectiveDate = new Date();
        });

        describe('get', function () {
            it('should send the reflection back', function () {
                spyOn(responseMock, 'json');

                reflectionController.reflectionId.get(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(requestMock.reflection);
            });
        });

        describe('put', function () {
            it('should set all fields to the ones from the body', function () {
                requestMock.body.typeName = 'BodyTypeName';
                requestMock.body.firstThingThatWentWell = 'BodyFirstThingThatWentWell';
                requestMock.body.secondThingThatWentWell = 'BodySecondThingThatWentWell';
                requestMock.body.thirdThingThatWentWell = 'BodyThirdThingThatWentWell';
                requestMock.body.firstThingToImprove = 'BodyFirstThingToImprove';
                requestMock.body.secondThingToImprove = 'BodySecondThingToImprove';
                requestMock.body.thirdThingToImprove = 'BodyThirdThingToImprove';
                requestMock.body.effectiveDate = new Date();

                reflectionController.reflectionId.put(requestMock, responseMock);

                expect(requestMock.reflection.typeName).toEqual(requestMock.body.typeName);
                expect(requestMock.reflection.firstStory).toEqual(requestMock.body.firstStory);
                expect(requestMock.reflection.secondStory).toEqual(requestMock.body.secondStory);
                expect(requestMock.reflection.thirdStory).toEqual(requestMock.body.thirdStory);
                expect(requestMock.reflection.effectiveDate).toEqual(requestMock.body.effectiveDate);
            });

            it('should do validation on reflection', function () {
                spyOn(ReflectionMock.prototype, 'validateSync');

                reflectionController.reflectionId.put(requestMock, responseMock);

                expect(ReflectionMock.prototype.validateSync).toHaveBeenCalled();
            });

            it('should send 400 back with message if validation fails', function () {
                var validationMessage = 'SomeValidationErrorMessage';
                var validationFailureObject = { toString: function () { return validationMessage} };
                spyOn(ReflectionMock.prototype, 'validateSync').and.returnValue(validationFailureObject);
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send');

                reflectionController.reflectionId.put(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalledWith(validationMessage);
            });

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(ReflectionMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                reflectionController.reflectionId.put(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back updated object on save success', function () {
                spyOn(responseMock, 'json').and.callThrough();
                spyOn(ReflectionMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                reflectionController.reflectionId.put(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(requestMock.reflection);
            });

        });

        describe('delete', function () {

            it('should send 500 and an error message back on remove error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(ReflectionMock.prototype, 'remove').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                reflectionController.reflectionId.delete(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 204 on remove success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(ReflectionMock.prototype, 'remove').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                reflectionController.reflectionId.delete(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(204);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });

    });


});
