describe("Active Entries Controller", function() {
    var activeEntriesController,
        responseMock,
        requestMock,
        OutcomeMock,
        momentMock,
        momentReturnMock;

    beforeEach(function() {
        OutcomeMock = function () {};
        OutcomeMock.prototype.save = function () {};
        OutcomeMock.prototype.remove = function () {};
        OutcomeMock.prototype.validateSync = function () {};
        OutcomeMock.find = function () {};

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

        activeEntriesController = require('../../../controllers/activeEntriesController')(OutcomeMock, momentMock);
    });

    describe('/activeEntries', function () {
        describe('get', function () {
            it('should return all results', function () {
                var results = [{test: 'test'}];
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, results);
                });
                spyOn(responseMock, 'json');

                activeEntriesController.get(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(results);
            });

            it('should return 500 if finding outcomes fails', function () {
                var error = 'error';
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                activeEntriesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });
        });
    });
});
