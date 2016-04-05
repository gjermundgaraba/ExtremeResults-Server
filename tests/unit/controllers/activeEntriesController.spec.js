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
            user: {},
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
            it('should return all results with correct values', function () {
                var results = [
                    {
                        _id: 'iddd',
                        typeName: 'typeName',
                        firstStory: 'firstStory',
                        secondStory: 'secondStory',
                        thirdStory: 'thirdStory',
                        effectiveDate: new Date()
                    },
                    {
                        _id: 'iddd2',
                        typeName: 'typeName2',
                        firstStory: 'firstStory2',
                        secondStory: 'secondStory2',
                        thirdStory: 'thirdStory2',
                        effectiveDate: new Date()
                    }
                ];
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, results);
                });
                spyOn(responseMock, 'json');

                activeEntriesController.get(requestMock, responseMock);

                var firstActiveEntry = responseMock.json.calls.mostRecent().args[0][0];
                expect(firstActiveEntry.objectId).toEqual(results[0]._id);
                expect(firstActiveEntry.typeName).toEqual(results[0].typeName);
                expect(firstActiveEntry.firstStory).toEqual(results[0].firstStory);
                expect(firstActiveEntry.secondStory).toEqual(results[0].secondStory);
                expect(firstActiveEntry.thirdStory).toEqual(results[0].thirdStory);
                expect(firstActiveEntry.effectiveDate).toEqual(results[0].effectiveDate);
                expect(firstActiveEntry.className).toEqual('Outcome');

                var secondActiveEntry = responseMock.json.calls.mostRecent().args[0][1];
                expect(secondActiveEntry.objectId).toEqual(results[1]._id);
                expect(secondActiveEntry.typeName).toEqual(results[1].typeName);
                expect(secondActiveEntry.firstStory).toEqual(results[1].firstStory);
                expect(secondActiveEntry.secondStory).toEqual(results[1].secondStory);
                expect(secondActiveEntry.thirdStory).toEqual(results[1].thirdStory);
                expect(secondActiveEntry.effectiveDate).toEqual(results[1].effectiveDate);
                expect(secondActiveEntry.className).toEqual('Outcome');
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
