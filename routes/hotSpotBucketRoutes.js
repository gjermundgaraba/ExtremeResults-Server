var express = require('express');

var routes = function (HotSpotBucket) {
    var hotSpotBucketRouter = express.Router();

    var hotspotBucketController = require('../controllers/hotSpotBucketController')(HotSpotBucket);

    hotSpotBucketRouter.route('/')
        .get(hotspotBucketController.get)
        .post(hotspotBucketController.post);

    hotSpotBucketRouter.use('/:hotSpotBucketId', function (req, res, next) {
        HotSpotBucket.findById(req.params.hotSpotBucketId, function (err, hotSpotBucket) {
            if (err) {
                res.status(500).send(err);
            } else if (hotSpotBucket) {
                req.hotSpotBucket = hotSpotBucket;
                next();
            } else {
                res.status(404).send('No hot spot bucket with that id found');
            }
        });
    });
    hotSpotBucketRouter.route('/:hotSpotBucketId')
        .put(hotspotBucketController.hotSpotBucketId.put)
        .delete(hotspotBucketController.hotSpotBucketId.delete);

    return hotSpotBucketRouter;

};

module.exports = routes;