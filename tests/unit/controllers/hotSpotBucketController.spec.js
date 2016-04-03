describe("Hot Spot Bucket Controller", function() {
    var hotSpotBucketController,
        responseMock,
        requestMock,
        HotSpotBucketMock;

    beforeEach(function() {
        HotSpotBucketMock = function () {};
        HotSpotBucketMock.prototype.save = function () {};
        HotSpotBucketMock.prototype.remove = function () {};
        HotSpotBucketMock.prototype.validateSync = function () {};
        HotSpotBucketMock.find = function () {};

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

        hotSpotBucketController = require('../../../controllers/hotSpotBucketController')(HotSpotBucketMock);
    });

    describe('/hotSpotBuckets', function () {
        describe('get', function () {
            it('should get all hot spot buckets', function () {
                var fakeHotSpotBuckets = [
                    {
                        name: 'Test1',
                        hotSpots: []
                    },
                    {
                        name: 'Test2',
                        hotSpots: ['test']
                    }
                ];
                spyOn(HotSpotBucketMock, 'find').and.callFake(function (query, callBack) {
                    callBack(undefined, fakeHotSpotBuckets);
                });
                spyOn(responseMock, 'json');
                hotSpotBucketController.get(requestMock, responseMock);

                expect(HotSpotBucketMock.find).toHaveBeenCalled();
                expect(responseMock.json).toHaveBeenCalledWith(fakeHotSpotBuckets);
            });

            it('should send back status code 500 on failure', function () {
                var error = {};
                spyOn(HotSpotBucketMock, 'find').and.callFake(function (query, callBack) {
                    callBack(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                hotSpotBucketController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });
        });

        describe('post', function () {

            it('should do validation on body', function () {
                spyOn(HotSpotBucketMock.prototype, 'validateSync');

                hotSpotBucketController.post(requestMock, responseMock);

                expect(HotSpotBucketMock.prototype.validateSync).toHaveBeenCalled();
            });

            it('should send 400 back with message if validation fails', function () {
                var validationMessage = 'somesome';
                var validationFailureObject = { toString: function () { return validationMessage} };
                spyOn(HotSpotBucketMock.prototype, 'validateSync').and.returnValue(validationFailureObject);
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send');

                hotSpotBucketController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalledWith(validationMessage);
            });

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(HotSpotBucketMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                hotSpotBucketController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 201 on save success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(HotSpotBucketMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                hotSpotBucketController.post(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(201);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });
    });

    describe('/hotSpotBuckets/:hotSpotBucketId', function () {

        beforeEach(function () {
            requestMock.hotSpotBucket = new HotSpotBucketMock();
            requestMock.hotSpotBucket.name = 'Hot Spot Bucket Name';
            requestMock.hotSpotBucket.hotSpots = ['Hot Spot 1', 'Hot Spot 2'];
        });

        describe('put', function () {
            it('should set all fields to the ones from the body', function () {
                requestMock.body.name = 'bodyTypeName';
                requestMock.body.hotSPots = ['Hot Spot 1', 'Hot Spot 2', 'Hot Spot 3'];

                hotSpotBucketController.hotSpotBucketId.put(requestMock, responseMock);

                expect(requestMock.hotSpotBucket.name).toEqual(requestMock.body.name);
                expect(requestMock.hotSpotBucket.hotSpots).toEqual(requestMock.body.hotSpots);
            });

            it('should do validation on hot spot bucket', function () {
                spyOn(HotSpotBucketMock.prototype, 'validateSync');

                hotSpotBucketController.hotSpotBucketId.put(requestMock, responseMock);

                expect(HotSpotBucketMock.prototype.validateSync).toHaveBeenCalled();
            });

            it('should send 400 back with message if validation fails', function () {
                var validationMessage = 'SomeValidationErrorMessage';
                var validationFailureObject = { toString: function () { return validationMessage} };
                spyOn(HotSpotBucketMock.prototype, 'validateSync').and.returnValue(validationFailureObject);
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send');

                hotSpotBucketController.hotSpotBucketId.put(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalledWith(validationMessage);
            });

            it('should send 500 and an error message back on save error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(HotSpotBucketMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                hotSpotBucketController.hotSpotBucketId.put(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back updated object on save success', function () {
                spyOn(responseMock, 'json').and.callThrough();
                spyOn(HotSpotBucketMock.prototype, 'save').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                hotSpotBucketController.hotSpotBucketId.put(requestMock, responseMock);

                expect(responseMock.json).toHaveBeenCalledWith(requestMock.hotSpotBucket);
            });

        });

        describe('delete', function () {

            it('should send 500 and an error message back on remove error', function () {
                var errorMessage = 'SomeError';
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(HotSpotBucketMock.prototype, 'remove').and.callFake(function (callBack) {
                    callBack(errorMessage);
                });

                hotSpotBucketController.hotSpotBucketId.delete(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(errorMessage);
            });

            it('should send back 204 on remove success', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();
                spyOn(HotSpotBucketMock.prototype, 'remove').and.callFake(function (callBack) {
                    callBack(undefined);
                });

                hotSpotBucketController.hotSpotBucketId.delete(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(204);
                expect(responseMock.send).toHaveBeenCalled();
            });

        });

    });


});
