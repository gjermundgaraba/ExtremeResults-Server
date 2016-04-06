var hotSpotBucketsController = function (HotSpotBucket) {

    var post = function (req, res) {
        var hotSpotBucket = new HotSpotBucket();

        hotSpotBucket.name = req.body.name;
        hotSpotBucket.hotSpots = req.body.hotSpots;
        hotSpotBucket.user = req.user._id;

        var validation = hotSpotBucket.validateSync();
        if (validation) {
            res.status(400).send(validation.toString());
        } else {
            hotSpotBucket.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    var responseHotSpotBucket = {
                        objectId: hotSpotBucket._id,
                        name: hotSpotBucket.name,
                        hotSpots: hotSpotBucket.hotSpots
                    };
                    res.status(201).send(responseHotSpotBucket);
                }
            });
        }
    };

    var get = function (req, res) {
        var query = {
            user: req.user._id
        };

        HotSpotBucket.find(query, function (error, hotSpotBuckets) {
            if (error) {
                res.status(500).send(error);
            } else {
                var response = [];

                hotSpotBuckets.forEach(function (hotSpotBucket) {
                    response.push({
                        objectId: hotSpotBucket._id,
                        name: hotSpotBucket.name,
                        hotSpots: hotSpotBucket.hotSpots
                    });
                });

                res.json(response);
            }
        });
    };

    var putHotSpotBucketId = function (req, res) {
        req.hotSpotBucket.name = req.body.name;
        req.hotSpotBucket.hotSpots = req.body.hotSpots;

        var validation = req.hotSpotBucket.validateSync();
        if (validation) {
            res.status(400).send(validation.toString());
        } else {
            req.hotSpotBucket.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.json(req.hotSpotBucket);
                }
            });
        }
    };

    var deleteHotSpotBucketId = function (req, res) {
        req.hotSpotBucket.remove(function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(204).send();
            }
        });
    };

    return {
        post: post,
        get: get,
        hotSpotBucketId: {
            put: putHotSpotBucketId,
            delete: deleteHotSpotBucketId
        }
    }

};

module.exports = hotSpotBucketsController;