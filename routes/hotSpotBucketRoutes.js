var express = require('express');

var routes = function (HotSpotBucket, passport) {
    var hotSpotBucketRouter = express.Router();

    var hotspotBucketController = require('../controllers/hotSpotBucketController')(HotSpotBucket);

    hotSpotBucketRouter.use(passport.authenticate('bearer', { session: false }));

    hotSpotBucketRouter.route('/')
        .get(hotspotBucketController.get)
        .post(hotspotBucketController.post);

    hotSpotBucketRouter.use('/:hotSpotBucketId', function (req, res, next) {
        HotSpotBucket.findById(req.params.hotSpotBucketId, function (err, hotSpotBucket) {
            if (err) {
                res.status(500).send(err);
            } else if (hotSpotBucket) {
                if (!hotSpotBucket.user.equals(req.user._id)) {
                    res.status(403).send('You don\'t have access to this hotspot bucket');
                } else {
                    req.hotSpotBucket = hotSpotBucket;
                    next();
                }
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