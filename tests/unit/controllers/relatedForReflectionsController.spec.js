describe("Related For Reflections Controller", function() {
    var relatedForOutcomesController,
        responseMock,
        requestMock,
        OutcomeMock,
        momentMock,
        momentReturnMock,
        ReflectionMock;

    beforeEach(function() {
        OutcomeMock = function () {};
        OutcomeMock.prototype.save = function () {};
        OutcomeMock.prototype.remove = function () {};
        OutcomeMock.prototype.validateSync = function () {};
        OutcomeMock.find = function () {};

        ReflectionMock = function () {};
        ReflectionMock.prototype.save = function () {};
        ReflectionMock.prototype.remove = function () {};
        ReflectionMock.prototype.validateSync = function () {};
        ReflectionMock.find = function () {};

        momentReturnMock = {
            startOf: function () { return momentReturnMock },
            endOf: function () { return momentReturnMock },
            toDate: function () { return momentReturnMock },
            subtract: function () { return momentReturnMock }
        };

        momentMock = function () {
            return momentReturnMock;
        };

        requestMock = {
            query: {}
        };

        responseMock = {
            status: function () {
                return responseMock;
            },
            send: function () {},
            json: function () {}
        };

        relatedForOutcomesController = require('../../../controllers/relatedForReflectionsController')(OutcomeMock, ReflectionMock, momentMock);
    });

    describe('/related/reflections', function () {
        describe('get', function () {
            it('should work for Weekly', function () {
                spyOn(responseMock, 'json').and.callThrough();
                var resultsForReflections = [{tests: 'test1'}];
                var resultsForOutcomes = [{testses: 'test1232'}];
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, resultsForReflections);
                });
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, resultsForOutcomes);
                });


                requestMock.query.typeName = 'Weekly';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(resultsForReflections.concat(resultsForOutcomes));
            });

            it('should send 400 if typeName is not supported', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Daily';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalled();
            });

            it('should send back 500 if Outcome search goes wrong with Weekly', function () {
                var error = 'This is an error';
                var resultsForOutcomes = [{testses: 'test1232'}];
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(error, resultsForOutcomes);
                });
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Weekly';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });

            it('should send back 500 if Reflection search goes wrong with Weekly', function () {
                var error = 'This is an error';
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Weekly';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });
        });
    });
});
