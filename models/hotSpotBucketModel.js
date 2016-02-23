var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hotSpotBucketModel = new Schema({
    name: {
        type: String,
        required: true
    },
    hotSpots: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('HotSpotBucket', hotSpotBucketModel);